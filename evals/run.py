#!/usr/bin/env python3
"""Grade skill-eval scenarios against their machine-checkable expectations.

Stdlib-only. The agent-in-the-loop half (producing each scenario's output/)
happens before this runs — see evals/README.md.

Each scenario is graded against its live, gitignored `output/` directory when
one exists; otherwise it falls back to the committed `sample_output/`
reference artifact, so a fresh checkout still grades every scenario.

Usage:
    python3 evals/run.py                     # grade every scenario
    python3 evals/run.py <skill>/<scenario>  # grade specific scenario(s)
"""

import json
import re
import subprocess
import sys
from pathlib import Path

EVALS_DIR = Path(__file__).resolve().parent
REPO_ROOT = EVALS_DIR.parent
SCENARIOS_DIR = EVALS_DIR / "scenarios"
PLAN_VALIDATE = REPO_ROOT / "skills" / "_shared" / "scripts" / "plan-validate.py"


def discover(args):
    if args:
        dirs = []
        for name in args:
            d = SCENARIOS_DIR / name
            if not (d / "scenario.json").is_file():
                sys.exit(f"error: no scenario at {d}")
            dirs.append(d)
        return dirs
    return sorted(p.parent for p in SCENARIOS_DIR.glob("*/*/scenario.json"))


def resolve(scenario_dir, rel, output_dir):
    """Map a check's `output/...` path onto the directory being graded."""
    if output_dir != "output" and rel.startswith("output/"):
        rel = output_dir + rel[len("output"):]
    return scenario_dir / rel


def read_text(scenario_dir, rel, output_dir):
    path = resolve(scenario_dir, rel, output_dir)
    if not path.is_file():
        return None
    return path.read_text(encoding="utf-8")


def run_check(scenario_dir, check, output_dir):
    ctype = check["type"]

    if ctype == "file_exists":
        rel = check["path"]
        ok = resolve(scenario_dir, rel, output_dir).is_file()
        return ok, f"file_exists: {rel}" + ("" if ok else " — missing")

    if ctype == "plan_validate":
        tasks = resolve(scenario_dir, check["tasks"], output_dir)
        if not tasks.is_file():
            return False, f"plan_validate: {check['tasks']} — missing"
        cmd = [sys.executable, str(PLAN_VALIDATE), str(tasks), "--strict"]
        if "prd" in check:
            cmd += ["--prd", str(scenario_dir / check["prd"])]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        detail = f"plan_validate: {check['tasks']} (--strict)"
        if proc.returncode != 0:
            output = (proc.stdout + proc.stderr).strip()
            detail += f" — findings:\n{output}"
        return proc.returncode == 0, detail

    if ctype in ("regex", "regex_absent", "min_count"):
        text = read_text(scenario_dir, check["path"], output_dir)
        if text is None:
            return False, f"{ctype}: {check['path']} — missing"
        matches = re.findall(check["pattern"], text, re.MULTILINE)
        if ctype == "regex":
            ok = bool(matches)
            return ok, f"regex: /{check['pattern']}/ in {check['path']}"
        if ctype == "regex_absent":
            ok = not matches
            return ok, f"regex_absent: /{check['pattern']}/ in {check['path']}"
        count = check["count"]
        ok = len(matches) >= count
        return ok, (
            f"min_count: /{check['pattern']}/ in {check['path']} — "
            f"{len(matches)}/{count}"
        )

    return False, f"unknown check type: {ctype!r}"


def main(argv):
    scenario_dirs = discover(argv[1:])
    failed = graded = skipped = 0

    for scenario_dir in scenario_dirs:
        name = scenario_dir.relative_to(SCENARIOS_DIR).as_posix()
        spec = json.loads((scenario_dir / "scenario.json").read_text())

        if (scenario_dir / "output").is_dir():
            output_dir, label = "output", ""
        elif (scenario_dir / "sample_output").is_dir():
            output_dir, label = "sample_output", " (sample_output)"
        else:
            print(f"SKIP  {name} — no output/ or sample_output/ to grade")
            skipped += 1
            continue

        graded += 1
        results = [run_check(scenario_dir, c, output_dir) for c in spec["checks"]]
        ok = all(passed for passed, _ in results)
        print(f"{'PASS' if ok else 'FAIL'}  {name}{label}")
        for passed, detail in results:
            print(f"  {'✓' if passed else '✗'} {detail}")
        if not ok:
            failed += 1

    print(f"\n{graded} graded, {failed} failed, {skipped} skipped")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
