#!/usr/bin/env python3
# plan-validate.py - deterministic lint for a tasks.md plan
#
# Parses a plans/<name>/tasks.md file and reports structural problems that the
# design-to-tasks, release-checklist, and plan-retrospective skills otherwise check
# by hand. The skill runs this and interprets the findings instead of eyeballing
# the task list.
#
# Checks (see README.md and ../references/conventions.md):
#   missing-requirements   a task with no Requirements field (risk-mitigation
#                          tasks traced via a Risk field are exempt)
#   unreferenced-requirement
#                          a requirement label declared in the Requirements
#                          Coverage matrix (or a --prd file) that no task lists
#   multiple-in-progress   more than one task marked [~] (one-WIP rule)
#   blocked-missing-note   a [!] task with no Blocked note
#   skipped-missing-note   a [-] task with no Skipped note
#   backward-dependency    a task that depends on a later-defined task
#   circular-dependency    a dependency cycle (A -> B -> ... -> A)
#   self-dependency        a task that depends on itself
#   unknown-dependency     a Depends-on reference to a task id that does not exist
#   unknown-status-marker  a checkbox marker that is not one of [ ] [~] [x] [!] [-]
#
# Findings are "error" or "warning". Exit code: 0 when clean (or only warnings),
# 1 when any error is present, 2 on a usage/I/O error. --strict makes warnings
# count toward the failing exit code too. The JSON report prints regardless of
# exit code so a skill can always read it.
#
# Dependency-light: Python 3 standard library only.
#
# Usage:
#   python3 plan-validate.py path/to/tasks.md
#   python3 plan-validate.py tasks.md --prd path/to/prd.md
#   python3 plan-validate.py tasks.md --format text
#   python3 plan-validate.py < tasks.md

from __future__ import annotations

import argparse
import json
import re
import sys

from plan_tasks import build_id_index, parse_tasks

ERROR = "error"
WARNING = "warning"

_REQ_LABEL_RE = re.compile(r"\b((?:FR|NFR|US|QG)-\d+)\b", re.IGNORECASE)


def _finding(severity, ftype, message, **extra):
    out = {"severity": severity, "type": ftype, "message": message}
    out.update(extra)
    return out


def _order_key(task_id):
    """Sort key for a task id like '2a.3' -> (2, 'a', 3); unknown ids sort last."""
    m = re.match(r"^(\d+)([a-z]?)\.(\d+)$", task_id)
    if not m:
        return (float("inf"), "", float("inf"))
    return (int(m.group(1)), m.group(2), int(m.group(3)))


def _prd_requirements(path):
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()
    labels = set()
    for m in _REQ_LABEL_RE.finditer(text):
        labels.add(m.group(1).upper())
    return labels


def _find_cycles(adjacency):
    """Return a list of cycles (each a list of task ids) in the dependency graph."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in adjacency}
    cycles = []
    seen_signatures = set()

    def visit(node, stack):
        color[node] = GRAY
        stack.append(node)
        for nxt in adjacency.get(node, []):
            if nxt not in color:
                continue  # unknown dependency target; reported separately
            if color[nxt] == GRAY:
                # Found a back edge: extract the cycle from the stack.
                i = stack.index(nxt)
                cycle = stack[i:]
                signature = frozenset(cycle)
                if signature not in seen_signatures:
                    seen_signatures.add(signature)
                    cycles.append(cycle[:])
            elif color[nxt] == WHITE:
                visit(nxt, stack)
        stack.pop()
        color[node] = BLACK

    for node in adjacency:
        if color[node] == WHITE:
            visit(node, [])
    return cycles


def validate(doc, source, prd_path=None):
    findings = []
    tasks = doc.tasks
    index = build_id_index(tasks)

    # --- per-task checks -----------------------------------------------------
    in_progress = []
    for task in tasks:
        label = task.short_title or task.raw_title

        if task.status == "unknown":
            findings.append(_finding(
                WARNING, "unknown-status-marker",
                "Task uses an unrecognised status marker '[{}]' (expected one of "
                "[ ] [~] [x] [!] [-])".format(task.marker),
                task=task.id, title=label, line=task.line))

        if task.status == "in_progress":
            in_progress.append(task)

        # missing Requirements field (risk tasks are traced via a Risk field)
        if "requirements" not in task.fields and "risk" not in task.fields:
            findings.append(_finding(
                WARNING, "missing-requirements",
                "Task has no Requirements field (traceability to the PRD is missing)",
                task=task.id, title=label, line=task.line))

        # blocked / skipped tasks must carry a note
        if task.status == "blocked" and not task.fields.get("blocked"):
            findings.append(_finding(
                ERROR, "blocked-missing-note",
                "Blocked task [!] has no Blocked note explaining the blocker",
                task=task.id, title=label, line=task.line))
        if task.status == "skipped" and not task.fields.get("skipped"):
            findings.append(_finding(
                ERROR, "skipped-missing-note",
                "Skipped task [-] has no Skipped note explaining the reason",
                task=task.id, title=label, line=task.line))

    # one-WIP rule
    if len(in_progress) > 1:
        findings.append(_finding(
            WARNING, "multiple-in-progress",
            "{} tasks are marked [~] in progress; the one-in-progress rule allows "
            "only one at a time".format(len(in_progress)),
            tasks=[t.id for t in in_progress]))

    # --- dependency checks ---------------------------------------------------
    adjacency = {}
    for task in tasks:
        adjacency.setdefault(task.id, [])
        for dep in task.depends_on:
            target = index.get(dep)
            if target is None:
                findings.append(_finding(
                    ERROR, "unknown-dependency",
                    "Task {} depends on '{}', which is not a task in this plan".format(
                        task.id, dep),
                    task=task.id, line=task.line, depends_on=dep))
                continue
            if target.id == task.id:
                findings.append(_finding(
                    ERROR, "self-dependency",
                    "Task {} depends on itself".format(task.id),
                    task=task.id, line=task.line))
                continue
            adjacency[task.id].append(target.id)
            # backward = depends on a task that comes later in the plan order
            if _order_key(target.id) > _order_key(task.id):
                findings.append(_finding(
                    WARNING, "backward-dependency",
                    "Task {} depends on later-defined task {} (dependencies should "
                    "point at earlier tasks)".format(task.id, target.id),
                    task=task.id, depends_on=target.id, line=task.line))

    for cycle in _find_cycles(adjacency):
        findings.append(_finding(
            ERROR, "circular-dependency",
            "Circular dependency: {}".format(" -> ".join(cycle + [cycle[0]])),
            tasks=cycle))

    # --- coverage check ------------------------------------------------------
    declared = None
    coverage_source = None
    if prd_path:
        declared = _prd_requirements(prd_path)
        coverage_source = prd_path
    elif doc.coverage_requirements is not None:
        declared = doc.coverage_requirements
        coverage_source = "Requirements Coverage matrix"

    if declared:
        referenced = set()
        for task in tasks:
            for label in task.requirements:
                if not label.startswith("RISK-"):
                    referenced.add(label)
        for label in sorted(declared - referenced, key=lambda x: (_REQ_LABEL_RE.match(x) is None, x)):
            findings.append(_finding(
                WARNING, "unreferenced-requirement",
                "Requirement {} is declared ({}) but no task lists it in its "
                "Requirements field".format(label, coverage_source),
                requirement=label))

    errors = sum(1 for f in findings if f["severity"] == ERROR)
    warnings = len(findings) - errors
    return {
        "source": source,
        "ok": errors == 0,
        "summary": {
            "tasks": len(tasks),
            "findings": len(findings),
            "errors": errors,
            "warnings": warnings,
            "coverage_checked": declared is not None,
        },
        "findings": findings,
    }


def _format_text(report):
    lines = []
    s = report["summary"]
    lines.append("Plan validation: {}".format(report["source"]))
    lines.append("  {} task(s), {} error(s), {} warning(s)".format(
        s["tasks"], s["errors"], s["warnings"]))
    if not report["findings"]:
        lines.append("  OK - no problems found.")
        return "\n".join(lines)
    lines.append("")
    for f in report["findings"]:
        loc = ""
        if "task" in f:
            loc = " [task {}]".format(f["task"])
        elif "tasks" in f:
            loc = " [tasks {}]".format(", ".join(f["tasks"]))
        elif "requirement" in f:
            loc = " [{}]".format(f["requirement"])
        mark = "x" if f["severity"] == ERROR else "!"
        lines.append("  {} {}{}: {}".format(mark, f["type"], loc, f["message"]))
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Lint a tasks.md plan for structural problems.",
        epilog="Reads tasks.md from the given path, or from stdin if no path is given.",
    )
    parser.add_argument("tasks", nargs="?", default="-",
                        help="path to tasks.md (default: read stdin)")
    parser.add_argument("--prd", default=None,
                        help="optional path to prd.md; its requirement labels become "
                             "the inventory for the unreferenced-requirement check")
    parser.add_argument("--format", choices=["json", "text"], default="json",
                        help="output format (default: json)")
    parser.add_argument("--compact", action="store_true",
                        help="emit compact single-line JSON instead of indented")
    parser.add_argument("--strict", action="store_true",
                        help="exit non-zero if there are any findings, warnings included")
    args = parser.parse_args(argv)

    try:
        if args.tasks == "-":
            text = sys.stdin.read()
            source = "<stdin>"
        else:
            with open(args.tasks, "r", encoding="utf-8") as fh:
                text = fh.read()
            source = args.tasks
    except OSError as exc:
        sys.stderr.write("plan-validate: cannot read {}: {}\n".format(args.tasks, exc))
        return 2

    try:
        doc = parse_tasks(text)
        report = validate(doc, source, prd_path=args.prd)
    except OSError as exc:
        sys.stderr.write("plan-validate: cannot read PRD {}: {}\n".format(args.prd, exc))
        return 2

    if args.format == "text":
        print(_format_text(report))
    elif args.compact:
        print(json.dumps(report, ensure_ascii=False, separators=(",", ":")))
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))

    if report["summary"]["errors"] > 0:
        return 1
    if args.strict and report["summary"]["warnings"] > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
