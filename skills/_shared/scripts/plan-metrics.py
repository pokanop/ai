#!/usr/bin/env python3
# plan-metrics.py - deterministic completion metrics for a tasks.md plan
#
# Parses a plans/<name>/tasks.md file and emits the status totals, the
# effective completion rate (excluding intentionally skipped tasks), and a
# per-phase breakdown. Replaces hand-counting checkbox markers in the
# plan-retrospective, release-checklist, and prd-to-tasks skills: the skill
# runs this and interprets the numbers instead of computing them by eye.
#
# Counting follows the conventions in ../references/conventions.md:
#   - only the top-level task checkbox counts (acceptance-criteria
#     sub-checkboxes are indented and are never counted)
#   - completion rate = completed / (total - skipped); skipped tasks are
#     excluded from the denominator because they were removed from scope
#
# Dependency-light: Python 3 standard library only.
#
# Usage:
#   python3 plan-metrics.py path/to/tasks.md
#   python3 plan-metrics.py < tasks.md            # read from stdin
#   python3 plan-metrics.py tasks.md --format text
#
# Output: JSON on stdout (default), or a human-readable table with --format
# text. Exit code 0 on success, 2 on a usage or I/O error.

from __future__ import annotations

import argparse
import json
import sys

from plan_tasks import STATUS_KEYS, parse_tasks


def _empty_counts():
    return {k: 0 for k in STATUS_KEYS}


def _completion(counts):
    """completed / (total - skipped); None when the denominator is zero."""
    total = sum(counts.values())
    denom = total - counts["skipped"]
    if denom <= 0:
        return None
    return counts["completed"] / denom


def _pct(rate):
    return None if rate is None else round(rate * 100, 1)


def compute_metrics(doc, source):
    totals = _empty_counts()
    unknown = 0
    # Preserve first-seen phase order for a stable, document-ordered breakdown.
    phase_order = []
    phase_counts = {}

    for task in doc.tasks:
        if task.status == "unknown":
            unknown += 1
        else:
            totals[task.status] += 1

        label = task.phase if task.phase else "(ungrouped)"
        if label not in phase_counts:
            phase_counts[label] = _empty_counts()
            phase_order.append(label)
        if task.status != "unknown":
            phase_counts[label][task.status] += 1

    totals_block = dict(totals)
    totals_block["total"] = sum(totals.values())
    totals_block["unknown"] = unknown

    rate = _completion(totals)
    phases = []
    for label in phase_order:
        counts = phase_counts[label]
        prate = _completion(counts)
        entry = {"name": label}
        entry.update(counts)
        entry["total"] = sum(counts.values())
        entry["completion_rate"] = None if prate is None else round(prate, 4)
        entry["completion_rate_pct"] = _pct(prate)
        phases.append(entry)

    return {
        "source": source,
        "totals": totals_block,
        "completion_rate": None if rate is None else round(rate, 4),
        "completion_rate_pct": _pct(rate),
        "completion_rate_excludes_skipped": True,
        "phases": phases,
    }


def _format_text(m):
    lines = []
    lines.append("Plan metrics: {}".format(m["source"]))
    t = m["totals"]
    lines.append("")
    lines.append("  Total tasks       {}".format(t["total"]))
    lines.append("  Completed [x]     {}".format(t["completed"]))
    lines.append("  In progress [~]   {}".format(t["in_progress"]))
    lines.append("  Blocked [!]       {}".format(t["blocked"]))
    lines.append("  Skipped [-]       {}".format(t["skipped"]))
    lines.append("  Not started [ ]   {}".format(t["not_started"]))
    if t["unknown"]:
        lines.append("  Unknown marker    {}".format(t["unknown"]))
    pct = m["completion_rate_pct"]
    lines.append("  Completion rate   {} (completed / (total - skipped))".format(
        "n/a" if pct is None else "{}%".format(pct)))
    if m["phases"]:
        lines.append("")
        lines.append("  Per phase:")
        for p in m["phases"]:
            ppct = p["completion_rate_pct"]
            lines.append("    {}: {}/{} done{}".format(
                p["name"], p["completed"], p["total"],
                "" if ppct is None else " ({}%)".format(ppct)))
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Compute completion metrics from a tasks.md plan.",
        epilog="Reads tasks.md from the given path, or from stdin if no path is given.",
    )
    parser.add_argument("tasks", nargs="?", default="-",
                        help="path to tasks.md (default: read stdin)")
    parser.add_argument("--format", choices=["json", "text"], default="json",
                        help="output format (default: json)")
    parser.add_argument("--compact", action="store_true",
                        help="emit compact single-line JSON instead of indented")
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
        sys.stderr.write("plan-metrics: cannot read {}: {}\n".format(args.tasks, exc))
        return 2

    doc = parse_tasks(text)
    metrics = compute_metrics(doc, source)

    if args.format == "text":
        print(_format_text(metrics))
    elif args.compact:
        print(json.dumps(metrics, ensure_ascii=False, separators=(",", ":")))
    else:
        print(json.dumps(metrics, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
