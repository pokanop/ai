# Refactoring Catalog

A working set of **named, behavior-preserving transformations** and the discipline for applying them. Each transformation is a small, well-understood move with a known-safe mechanic — the opposite of "rewrite it and hope."

This is not an exhaustive academic catalog; it is the set that covers the large majority of real refactors, plus the rules that keep any of them safe.

---

## The One-Step Discipline (applies to every transformation)

1. **One transformation at a time.** Apply a single named move, then stop.
2. **Run the full test suite after each move.** It must stay green.
3. **Green → continue. Red → revert that one step immediately.** Do not debug forward. A red suite mid-refactor means the last mechanic was applied wrong — undo it and redo it smaller. Never "fix" a refactor-induced failure by editing a test.
4. **Each step is independently shippable** — tests green, behavior intact, the kind of change you could commit on its own.

Large refactors are *sequences* of these small moves, each verified. There is no such thing as a safe big-bang refactor.

---

## Composition / Duplication

### Extract Function / Method
Pull a coherent fragment of code into its own named unit.
- **When:** a block is duplicated, too long, or needs a comment to explain it (the name replaces the comment).
- **Mechanic:** copy the fragment into a new function; pass everything it reads as parameters; return what it produces; replace the original fragment with a call; run tests.

### Inline Function / Variable
The inverse — replace a call or variable with its body/value.
- **When:** the indirection no longer earns its keep; the name says no more than the expression.
- **Mechanic:** substitute the body/value at each use site; remove the original; run tests.

### Extract Variable
Name a sub-expression with a well-named local.
- **When:** an expression is hard to read or is repeated within a scope.
- **Mechanic:** assign the sub-expression to a local with an explaining name; replace occurrences; run tests.

### Consolidate Duplicate Code
Unify two or more near-identical fragments into one.
- **When:** the same logic exists in multiple places (a frequent Future Opportunity).
- **Mechanic:** make the fragments *identical* first (small edits, tests green after each), then Extract Function and call it from all sites.

---

## Naming and Shape

### Rename (symbol / file)
Change a name to reveal intent.
- **When:** a name is misleading, vague, or inconsistent with project conventions.
- **Mechanic:** prefer a tool-assisted/IDE rename so every reference updates atomically; otherwise update the declaration and every reference in one pass; run tests. A name change is observable if it is part of the public API — that is not a pure refactor (see "Watch the public surface").

### Change Function Declaration (internal only)
Adjust parameters/order/name of a **non-public** function.
- **When:** the signature is awkward or inconsistent internally.
- **Mechanic:** update the declaration and all internal callers together; run tests. If the function is exported/public, stop — changing its signature changes the contract.

### Introduce Parameter Object
Group a clump of arguments that always travel together into one object.
- **When:** the same parameter group recurs across functions.
- **Mechanic:** create the grouping type; pass it; unpack inside; migrate callers; run tests.

---

## Moving Things

### Move Function / Field
Relocate a unit to the module/class where it belongs.
- **When:** a function references another module's data more than its own; a helper lives in the wrong layer.
- **Mechanic:** copy to the destination; redirect callers; remove the original; run tests. Keep public re-exports stable if anything external imports the old path.

### Split Module / Extract Module
Break an oversized file into cohesive pieces.
- **When:** one file mixes unrelated responsibilities.
- **Mechanic:** extract one cohesive group at a time into a new module; re-export from the original if needed to keep import paths stable; run tests after each group.

---

## Conditionals and Control Flow

### Decompose Conditional
Extract the condition and branches into named functions.
- **When:** a complex `if/else` obscures intent.
- **Mechanic:** Extract Function for the test and for each branch body; run tests.

### Replace Nested Conditional with Guard Clauses
Flatten nesting by returning early on edge cases.
- **When:** deep nesting hides the main path.
- **Mechanic:** convert each precondition into an early return; the main logic de-indents; run tests. Preserve the exact same outcomes for every input class — verify with the safety net.

### Replace Conditional with Polymorphism
Move type-switching logic into types.
- **When:** the same `switch`/`if`-on-type recurs across functions.
- **Mechanic:** introduce the polymorphic structure incrementally; move one branch at a time; run tests after each.

---

## Watch the Public Surface

Every transformation above is safe **only while it stays internal**. The moment a move changes something other code or users depend on, behavior is no longer preserved:

| Observable surface | A change here is NOT a pure refactor |
|--------------------|--------------------------------------|
| Exported function/type signatures | Renaming or re-ordering params breaks callers |
| HTTP routes / request / response shapes | Clients depend on these |
| CLI flags, output format, exit codes | Scripts depend on these |
| Emitted events, log contracts other systems parse | Consumers depend on these |
| Thrown error types / messages asserted elsewhere | Callers branch on these |
| Serialized / persisted formats | Stored data and other readers depend on these |

If the goal requires changing one of these, route the contract change through `idea-to-prd` (it needs an acceptance criterion and a migration story). The *internal* cleanup behind a stable surface is still a fine refactor.

When you must change an internal path that something external imports, keep the old path working with a re-export (a thin shim) so the surface stays stable — that keeps the move behavior-preserving.

---

## Choosing a Transformation

Map the structural goal to the move:

| Goal | Transformation(s) |
|------|-------------------|
| Remove duplication | Consolidate Duplicate Code → Extract Function |
| Shorten a long function | Extract Function, Decompose Conditional |
| Clarify intent | Rename, Extract Variable, Replace Magic Literal |
| Reduce nesting | Guard Clauses, Decompose Conditional |
| Untangle a module | Move Function/Field, Split Module |
| Tame type-switching | Replace Conditional with Polymorphism |
| Simplify a long parameter list | Introduce Parameter Object |

Pick the smallest move that advances the goal, apply it, run the tests, and repeat.
