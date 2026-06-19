# plan_tasks.py - shared tasks.md parser for the plan helper scripts
#
# Used by plan-metrics.py and plan-validate.py so both tools agree on exactly
# what a "task" is. The parsing contract is documented in README.md; the
# canonical status markers, priority tags, effort sizes, and requirement labels
# it recognises are defined once in ../references/conventions.md.
#
# Dependency-light: Python 3 standard library only, no third-party packages.
#
# What it extracts from a plans/<name>/tasks.md document:
#   - top-level tasks (a checkbox at the left margin) and their status marker
#   - the phase (nearest preceding `## ` heading) each task belongs to
#   - each task's metadata sub-fields (Requirements, Depends on, Blocked, ...)
#   - a stable task id (an explicit `Task N.M` in the title if present, else the
#     phase-and-position `N.M` the task schema prescribes)
#   - the requirement labels listed in the Requirements Coverage matrix, if any
#
# Acceptance-criteria sub-checkboxes are indented under their task, so the
# "left margin" rule excludes them from the task counts — exactly as the
# conventions require ("only the top-level task checkbox counts").

from __future__ import annotations

import re

# Canonical task status markers (conventions.md#task-status-markers).
# Maps the single character inside the checkbox to a status bucket name.
MARKER_TO_STATUS = {
    " ": "not_started",
    "x": "completed",
    "~": "in_progress",
    "!": "blocked",
    "-": "skipped",
}

# The five buckets, in the order metrics-guide.md reports them.
STATUS_KEYS = ["completed", "in_progress", "blocked", "skipped", "not_started"]

# A left-margin task checkbox: "- [ ] ...", "* [x] ...", "+ [~] ...".
# Leading whitespace is captured so callers can tell a top-level task (no
# indent) from an indented acceptance-criterion checkbox.
_CHECKBOX_RE = re.compile(r"^([ \t]*)([-*+])\s+\[(.)\]\s?(.*)$")

# A metadata sub-field line: "  - **Requirements**: FR-1, US-2".
_FIELD_RE = re.compile(r"^\s*[-*+]\s+\*\*\s*([^*]+?)\s*\*\*\s*:?\s*(.*)$")

# An h2 heading ("## ...") — phase boundaries. "###" task-group headings and the
# "#" document title do not match (## must be followed by whitespace).
_H2_RE = re.compile(r"^##[ \t]+(.+?)\s*$")

# A phase number inside a phase heading: "Phase 1", "Phase 2a".
_PHASE_NUM_RE = re.compile(r"\bPhase\s+(\d+[a-z]?)\b", re.IGNORECASE)

# Trailing progress annotation on a phase heading: "(8/10 tasks complete)".
_PHASE_PROGRESS_RE = re.compile(r"\s*\(\s*\d+\s*/\s*\d+[^)]*\)\s*$")

# A task id token, e.g. "1.2" or "2a.3".
_TASK_ID_RE = re.compile(r"\b(\d+[a-z]?\.\d+)\b")

# A requirement label, e.g. "FR-1", "NFR-2", "US-3", "QG-4", "RISK-1".
_REQ_LABEL_RE = re.compile(r"\b((?:FR|NFR|US|QG|RISK)-\d+)\b", re.IGNORECASE)

_PRIORITY_RE = re.compile(r"\[(P[0-2])\]")
_EFFORT_RE = re.compile(r"\[(S|M|L|XL)\]")

# Field names we normalise to a canonical key.
_FIELD_ALIASES = {
    "requirements": "requirements",
    "requirement": "requirements",
    "depends on": "depends_on",
    "dependencies": "depends_on",
    "blocked": "blocked",
    "skipped": "skipped",
    "risk": "risk",
    "notes": "notes",
    "note": "notes",
    "acceptance criteria": "acceptance",
}


class Task:
    """One top-level task parsed from tasks.md."""

    def __init__(self, line):
        self.line = line              # 1-based line number of the checkbox
        self.raw_title = ""           # everything after "[x] "
        self.marker = ""              # the raw character inside the checkbox
        self.status = "unknown"       # bucket name, or "unknown" for a bad marker
        self.phase = None             # cleaned phase label, or None if before any phase
        self.phase_num = None         # "1", "2a", ... parsed from the phase heading
        self.explicit_id = None       # id parsed from the title, if any
        self.positional_id = None     # phase-and-position id, if a phase number is known
        self.priority = None          # "P0".."P2"
        self.effort = None            # "S".."XL"
        self.fields = {}              # canonical field key -> value string
        self.depends_on = []          # task id strings from the Depends on field
        self.requirements = []        # requirement labels from the Requirements field
        self.has_depends_field = False

    @property
    def id(self):
        """Best stable identifier: explicit title id, else positional, else line."""
        return self.explicit_id or self.positional_id or "L{}".format(self.line)

    @property
    def short_title(self):
        """Title with surrounding bold markers and tags stripped, for display."""
        t = self.raw_title
        t = _PRIORITY_RE.sub("", t)
        t = _EFFORT_RE.sub("", t)
        t = re.sub(r"`+", "", t)
        t = t.replace("**", "").strip()
        # Drop a leading "Task N.M:" / "N.M:" prefix for a cleaner label.
        t = re.sub(r"^(?:Task\s+)?\d+[a-z]?\.\d+\s*[:.\-]?\s*", "", t, flags=re.IGNORECASE)
        return t.strip()


class ParsedDoc:
    """Result of parsing a tasks.md document."""

    def __init__(self):
        self.tasks = []                  # list[Task] in document order
        self.coverage_requirements = None  # set[str] of labels in the coverage matrix, or None


def _clean_phase_label(heading):
    return _PHASE_PROGRESS_RE.sub("", heading).strip()


def parse_tasks(text):
    """Parse tasks.md source text into a ParsedDoc.

    Recognises top-level task checkboxes at the left margin, attributes each to
    the nearest preceding `## ` phase heading, parses its metadata sub-fields,
    and assigns a stable id. Content inside fenced code blocks is ignored so
    example checkboxes in a tasks.md narrative are never miscounted.
    """
    doc = ParsedDoc()
    # Normalise CRLF / CR line endings so Windows-authored task lists parse too.
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")

    in_fence = False
    current_phase = None
    current_phase_num = None
    phase_seq = {}            # phase_num -> running task counter
    ungrouped_seq = 0         # counter for tasks before any phase heading
    current_task = None

    # For the Requirements Coverage matrix.
    in_coverage = False
    coverage_labels = set()
    coverage_seen = False

    for idx, raw_line in enumerate(lines):
        line = raw_line.rstrip("\n")

        # Toggle fenced code blocks; never parse their contents.
        if re.match(r"^\s*(```|~~~)", line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        h2 = _H2_RE.match(line)
        if h2:
            current_task = None
            heading = h2.group(1)
            current_phase = _clean_phase_label(heading)
            pm = _PHASE_NUM_RE.search(heading)
            current_phase_num = pm.group(1) if pm else None
            # Track whether we are inside the Requirements Coverage section.
            in_coverage = bool(re.search(r"requirements?\s+coverage", heading, re.IGNORECASE))
            if in_coverage:
                coverage_seen = True
            continue

        if in_coverage:
            for m in _REQ_LABEL_RE.finditer(line):
                label = m.group(1).upper()
                if not label.startswith("RISK-"):
                    coverage_labels.add(label)
            # fall through is unnecessary; coverage rows are not tasks
            continue

        cb = _CHECKBOX_RE.match(line)
        if cb:
            indent = cb.group(1).expandtabs(4)
            if len(indent) == 0:
                # A new top-level task.
                current_task = Task(idx + 1)
                marker = cb.group(3)
                current_task.marker = marker
                current_task.status = MARKER_TO_STATUS.get(marker.lower(), "unknown")
                current_task.raw_title = cb.group(4).strip()
                current_task.phase = current_phase
                current_task.phase_num = current_phase_num

                pr = _PRIORITY_RE.search(current_task.raw_title)
                current_task.priority = pr.group(1) if pr else None
                ef = _EFFORT_RE.search(current_task.raw_title)
                current_task.effort = ef.group(1) if ef else None
                current_task.explicit_id = _explicit_id(current_task.raw_title)

                if current_phase_num is not None:
                    phase_seq[current_phase_num] = phase_seq.get(current_phase_num, 0) + 1
                    current_task.positional_id = "{}.{}".format(
                        current_phase_num, phase_seq[current_phase_num]
                    )
                else:
                    ungrouped_seq += 1

                doc.tasks.append(current_task)
            # Indented checkbox = acceptance criterion (or nested item): ignored
            # for task counting, and not a metadata field, so nothing to do.
            continue

        # A metadata sub-field belonging to the current task.
        if current_task is not None:
            fm = _FIELD_RE.match(line)
            if fm:
                name = fm.group(1).strip().lower()
                key = _FIELD_ALIASES.get(name)
                value = fm.group(2).strip()
                if key:
                    current_task.fields[key] = value
                    if key == "depends_on":
                        current_task.has_depends_field = True
                        current_task.depends_on = _extract_dep_ids(value)
                    elif key == "requirements":
                        current_task.requirements = _extract_req_labels(value)

    doc.coverage_requirements = coverage_labels if coverage_seen else None
    return doc


def _explicit_id(title):
    """Pull an explicit task id out of a title, e.g. '**Task 1.2: ...**'."""
    m = re.search(r"\bTask\s+(\d+[a-z]?\.\d+)\b", title, re.IGNORECASE)
    if m:
        return m.group(1).lower()
    # A bold title that opens with the bare id: "**1.2 Do the thing**".
    m = re.match(r"\*\*\s*(\d+[a-z]?\.\d+)\b", title)
    if m:
        return m.group(1).lower()
    return None


def _extract_dep_ids(value):
    if re.search(r"\bnone\b", value, re.IGNORECASE) and not _TASK_ID_RE.search(value):
        return []
    seen = []
    for m in _TASK_ID_RE.finditer(value):
        tid = m.group(1).lower()
        if tid not in seen:
            seen.append(tid)
    return seen


def _extract_req_labels(value):
    seen = []
    for m in _REQ_LABEL_RE.finditer(value):
        label = m.group(1).upper()
        if label not in seen:
            seen.append(label)
    return seen


def build_id_index(tasks):
    """Map every known id alias (explicit and positional) to its Task.

    Lets a 'Depends on: Task 1.3' reference resolve whether the plan carries
    explicit ids in titles or relies on phase-and-position numbering.
    """
    index = {}
    for task in tasks:
        for alias in (task.explicit_id, task.positional_id):
            if alias and alias not in index:
                index[alias] = task
    return index
