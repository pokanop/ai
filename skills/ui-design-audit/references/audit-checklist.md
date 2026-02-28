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
