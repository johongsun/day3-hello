# Design System Strategy: The Intelligent Workspace

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Atelier"**
This design system moves beyond the cold, sterile nature of traditional IT platforms. It envisions an AI-driven educational environment as a sophisticated, high-end studio—a "Digital Atelier" where technical precision (the AI) meets human creativity (the student). 

To achieve this, we depart from the standard "boxed-in" web grid. We utilize **intentional asymmetry**, **exaggerated white space**, and **tonal layering** to create a sense of breath and focus. The layout follows an editorial logic: large, authoritative headlines paired with technical micro-copy, creating a rhythm that feels both premium and intellectually stimulating.

---

## 2. Colors & Surface Logic
The palette is built on a foundation of deep, intellectual blues contrasted with the kinetic energy of "Electric Blue." 

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or containers. Physical lines clutter the interface. Instead, boundaries must be defined through:
- **Tonal Shifts:** Moving from `surface` to `surface-container-low`.
- **Soft Shadows:** Utilizing ambient depth.
- **Negative Space:** Allowing the eye to perceive the edge through alignment.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the Material surface tokens to create a "nested" depth system:
1.  **Base Layer:** `surface` (#f8f9fa) — The global canvas.
2.  **Sectional Layer:** `surface-container-low` (#f3f4f5) — Used for large background blocks to break the page flow.
3.  **Component Layer:** `surface-container-lowest` (#ffffff) — Used for cards and interactive elements to make them "pop" against the gray background.
4.  **Elevation Layer:** `surface-bright` — For active states or floating elements.

### The "Glass & Gradient" Rule
To bridge the gap between "Education" (Trust) and "AI" (Innovation):
- **Glassmorphism:** Use `surface_variant` at 60% opacity with a `24px` backdrop-blur for navigation bars and floating code snippets.
- **Signature Gradients:** For primary CTAs and hero visuals, use a subtle linear gradient from `primary` (#1b4477) to `primary_container` (#365b91) at a 135-degree angle. This adds "soul" and depth that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We utilize a trio of typefaces to establish a sophisticated hierarchy.

*   **Display & Headlines (Plus Jakarta Sans):** Our "Voice." Used for high-impact statements. The wide apertures and modern curves convey approachability and high-end tech. Use `display-lg` with tight tracking (-0.02em) for a customized, premium feel.
*   **Body & Titles (Inter):** Our "Logic." The workhorse for readability. Use `body-lg` for educational content to reduce eye strain.
*   **Labels & Accents (Space Grotesk):** Our "DNA." This monospace-leaning font is used sparingly for `label-md` and `label-sm` to highlight code-related snippets, AI prompts, or technical metadata. It anchors the service in the world of programming.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural lines.

- **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f4f5) background. The subtle 2% difference in lightness creates a sophisticated, soft lift.
- **Ambient Shadows:** When a card requires a floating effect (e.g., a hovered state), use a custom shadow: 
  `box-shadow: 0 20px 40px -10px rgba(25, 28, 29, 0.06);` 
  The shadow color is derived from `on-surface` (#191c1d) to ensure it looks natural.
- **The "Ghost Border" Fallback:** If a container is placed on an identical background color, use a "Ghost Border": `outline-variant` (#c3c6d6) at 15% opacity. Never use 100% opacity for borders.

---

## 5. Components

### Buttons: The Kinetic Core
- **Primary:** Gradient fill (Primary to Primary Container), `border-radius: full`. High-end buttons should feel like tactile "pills."
- **Secondary:** Surface-container-highest background with `on-surface` text. No border.
- **Tertiary:** `spaceGrotesk` label in `primary` color with a `0.25rem` underline that expands on hover.

### Cards: Content Containers
- **Styling:** `border-radius: xl` (1.5rem). Use `surface-container-lowest` for the background.
- **Rule:** Forbid divider lines. Separate "Title," "Description," and "Footer" using vertical spacing (e.g., 24px vs 12px) and weight changes.

### Code Fragments (Unique Component)
- **Background:** `inverse_surface` (#2e3132).
- **Typography:** `label-md` (Space Grotesk).
- **Styling:** Use a `0.5rem` (DEFAULT) corner radius. Add a subtle `primary` glow (5% opacity) around the container to simulate a screen's light.

### Inputs & Fields
- **State:** Default state uses `surface-container-high`. Focused state transitions to `surface-container-lowest` with a `2px` `primary` "Ghost Border."

---

## 6. Do’s and Don’ts

### Do’s
- **Do** use asymmetrical margins. For example, a hero headline might have a 15% left offset to create a dynamic, editorial look.
- **Do** use `primary_fixed_dim` for subtle accent backgrounds behind icons to provide a "tech-glow."
- **Do** prioritize white space. If a section feels crowded, double the padding before adding a border.

### Don’ts
- **Don't** use 100% black (#000000). Always use `on-surface` (#191c1d) for text to maintain a premium, "ink-on-paper" feel.
- **Don't** use standard `0.25rem` corners for cards. It looks "Bootstrap-generic." Stick to `xl` (1.5rem) or `lg` (1rem) for a modern, friendly character.
- **Don't** use dividers. If you feel the need to separate two items, use a background color shift or increase the spacing scale.