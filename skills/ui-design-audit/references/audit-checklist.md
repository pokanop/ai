# Audit Checklist

Dimension-by-dimension criteria for a UI design audit. Work through each section relevant to the audit scope. For each finding, record: file path, component name, description of the inconsistency, and the canonical correct approach.

---

## 1. Loading States

The most common source of inconsistency in mature codebases — each feature introduced its own loading pattern.

### Spinners and Animated Indicators
- [ ] Is there a canonical spinner/loader component? (e.g., `Spinner`, `LoadingState`, `Loader`)
- [ ] Are there bare icon imports (e.g., `Loader2` from `lucide-react`) used directly instead of the shared component?
- [ ] Are spinner sizes consistent across the app? (List all sizes found: `h-4 w-4`, `h-5 w-5`, etc.)
- [ ] Are spinner colors consistent? (Using the design token or a hardcoded color?)

### Skeleton Loaders
- [ ] Is there a canonical skeleton component or are skeletons built ad hoc?
- [ ] Are skeleton dimensions consistent with the content they represent?
- [ ] Do skeletons use the same animation (pulse/shimmer) across all components?

### Loading Text
- [ ] Are there any "Loading..." text strings used as loading indicators instead of visual components?
- [ ] Are loading messages grammatically consistent? ("Loading..." vs "Loading data..." vs "Please wait")

### Empty States
- [ ] Does every list/table/grid have an empty state component?
- [ ] Are empty states consistent in visual style (illustration, icon, message format)?
- [ ] Do empty states provide actionable guidance, not just "No data found"?

### Error States
- [ ] Does every async operation have an error state?
- [ ] Are error states visually distinct from empty states?
- [ ] Do error states offer a recovery action (retry, go back)?

---

## 2. Spacing and Sizing

### Spacing Scale
- [ ] What is the project's spacing scale? (e.g., 4px increments, Tailwind's default scale)
- [ ] Are there hardcoded pixel values that deviate from the scale?
- [ ] Are there inconsistent gaps between similar components? (e.g., form fields use `gap-4` in one place and `gap-3` in another)

### Component Sizing
- [ ] Are button heights consistent across sizes (`sm`, `md`, `lg`)?
- [ ] Are icon sizes consistent within the same usage context (nav icons, action icons, status icons)?
- [ ] Are input field heights and padding consistent across all form components?
- [ ] Are card paddings consistent across the app?

### Layout Containers
- [ ] Are page max-widths consistent?
- [ ] Are sidebar widths consistent?
- [ ] Are modal/dialog widths consistent by type (confirmation, form, full-screen)?

---

## 3. Typography

### Font Families
- [ ] Is one font family used consistently for body text?
- [ ] Is one font family used consistently for headings?
- [ ] Are there any ad hoc font-family overrides in component stylesheets?

### Font Sizes and Weights
- [ ] Is there a defined type scale (e.g., `text-sm`, `text-base`, `text-lg`, `text-xl`)?
- [ ] Are heading levels consistent (`h1`=`text-2xl`, `h2`=`text-xl`, etc.)?
- [ ] Are font weights used semantically (regular for body, semibold for labels, bold for headings)?

### Line Heights and Letter Spacing
- [ ] Is line height consistent within each type size?
- [ ] Is letter spacing applied selectively or scattered arbitrarily?

---

## 4. Color and Theming

### Color Tokens
- [ ] Is there a defined set of semantic color tokens? (e.g., `--color-primary`, `--color-error`, `--color-surface`)
- [ ] Are semantic tokens used consistently, or are raw hex/RGB values hardcoded in components?

### Semantic Color Usage
- [ ] Are error states always the designated error color?
- [ ] Are success states always the designated success color?
- [ ] Are warning states always the designated warning color?
- [ ] Is the primary brand color used consistently for primary actions?

### Dark Mode (if applicable)
- [ ] Do all components respond to dark mode correctly?
- [ ] Are there components with hardcoded light-mode colors that break in dark mode?
- [ ] Are border colors, shadow colors, and overlay colors using tokens that adapt to mode?

---

## 5. Interactive States

### Hover
- [ ] Do all interactive elements (buttons, links, list items, cards) have a visible hover state?
- [ ] Are hover transitions consistent (duration, easing)?

### Focus
- [ ] Do all interactive elements have a visible focus ring for keyboard navigation?
- [ ] Is the focus ring consistent in color, offset, and style?
- [ ] Are there any elements where `outline: none` or `focus:outline-none` removes focus without a replacement?

### Active / Pressed
- [ ] Do primary action buttons have a visible pressed state?

### Disabled
- [ ] Are disabled elements visually distinct?
- [ ] Are disabled elements consistently styled (opacity reduction, cursor: not-allowed)?
- [ ] Are disabled elements prevented from receiving click events?

---

## 6. Animation and Motion

### Transitions
- [ ] Is there a consistent transition duration used for interactive elements? (e.g., `transition-colors duration-150`)
- [ ] Are there elements with no transition that should have one (jarring instant state changes)?
- [ ] Are there over-animated elements with transitions that feel slow or distracting?

### Page and Component Transitions
- [ ] Are route transitions consistent?
- [ ] Are modal/dialog entrance and exit animations consistent?
- [ ] Are list item additions and removals animated consistently?

### Respect for Motion Preferences
- [ ] Does the app respect `prefers-reduced-motion`? (Animations should be disabled or minimal for users who prefer reduced motion)

---

## 7. Accessibility

Accessibility (a11y) is a first-class sweep, not a side effect of the other dimensions. The bar here is **WCAG 2.1 Level AA**. This is the one dimension audited against an external standard rather than the project's own baseline: a UI that is *consistently* inaccessible is still inaccessible. A few items overlap with **Interactive States** (focus) and **Animation and Motion** (reduced motion) — audit them here through the a11y lens ("does this work for a keyboard or screen-reader user?"), not just the consistency lens.

### Color Contrast (WCAG 2.1 AA)
- [ ] Does normal/body text meet a contrast ratio of at least **4.5:1** against its background?
- [ ] Does large text (≥ 24px regular, or ≥ 18.66px bold) meet at least **3:1**?
- [ ] Do meaningful non-text elements (icons, input borders, focus indicators, chart segments) meet at least **3:1** against adjacent colors?
- [ ] Is any information conveyed by color alone (e.g., a red border with no error icon or text)? Color must not be the only channel.
- [ ] Do contrast ratios still hold in dark mode and across hover/disabled variants?

### Semantic HTML and Landmarks
- [ ] Are native elements used where they fit (`<button>`, `<a>`, `<nav>`, `<main>`, `<ul>/<li>`) instead of `<div>`/`<span>` with click handlers?
- [ ] Does each page expose landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`, or equivalent ARIA landmarks) so assistive tech can navigate by region?
- [ ] Is there exactly one `<h1>` per page, with heading levels descending without skipping (`h1 → h2 → h3`)?
- [ ] Are tables, lists, and forms marked up with native elements (`<table>` with `<th scope>`, not a grid of `<div>`s)?

### ARIA Roles, Labels, and States
- [ ] Do custom interactive widgets (dropdowns, tabs, accordions, modals, toggles) carry the correct `role` and required ARIA attributes?
- [ ] Do toggle/expandable controls expose state that updates with the UI (`aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`)?
- [ ] Do modals/dialogs use `role="dialog"` / `aria-modal`, move focus into the dialog on open, and return focus to the trigger on close?
- [ ] Are dynamic updates (toasts, async results, validation) announced via an appropriate `aria-live` region?
- [ ] Is ARIA used only to fill gaps native HTML cannot (no redundant `role="button"` on a `<button>`)? Incorrect ARIA is worse than none.

### Keyboard Navigation and Focus
- [ ] Is every interactive element reachable and operable with the keyboard alone (Tab/Shift+Tab to reach, Enter/Space to activate, Esc to dismiss)?
- [ ] Does the focus/tab order follow the visual reading order (no positive `tabindex` values creating a confusing path)?
- [ ] Does every focusable element have a **visible focus indicator**, and is `outline: none` / `focus:outline-none` never used without a visible replacement?
- [ ] Are there any keyboard traps — focus that enters a widget (menu, modal, embed) and cannot leave via the keyboard?

### Screen-Reader Labels for Non-Text Controls
- [ ] Do icon-only buttons and links have an accessible name (`aria-label`, `aria-labelledby`, or visually-hidden text)?
- [ ] Do meaningful images have descriptive `alt` text, and are decorative images marked `alt=""` (or `role="presentation"`) so they are skipped?
- [ ] Are SVGs that convey meaning given `role="img"` plus a title/`aria-label`, and purely decorative SVGs hidden with `aria-hidden="true"`?

### Forms and Error Association
- [ ] Does every form control have a programmatically associated `<label>` (via `for`/`id`, not just visual proximity)?
- [ ] Are validation errors associated with their field (`aria-describedby` pointing at the message) rather than only shown visually?
- [ ] Are invalid fields marked `aria-invalid="true"` so assistive tech announces the error state?
- [ ] Are required fields conveyed to assistive tech (`required` / `aria-required`), not only with a visual asterisk?

### Motion and Reduced Motion
- [ ] Does the app honor `prefers-reduced-motion` by disabling or substantially reducing non-essential animation? (Also audited under Dimension 6, here for a11y compliance.)
- [ ] Does any content flash more than 3 times per second (seizure risk)?
- [ ] Are auto-playing or looping animations, carousels, and videos pausable or stoppable?
