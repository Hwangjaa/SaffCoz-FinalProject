# SaffCoz — Fragrance Boutique Website

A five-page fragrance boutique website built as the **final project for the Human Computer
Interaction (HCI) course**. The site is a static front-end (HTML, CSS, vanilla JavaScript)
designed around **Shneiderman's 8 Golden Rules of Interface Design** — every rule is applied
concretely, not just mentioned as a theory.

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Running the Project](#running-the-project)
3. [Pages & Features](#pages--features)
4. [Project Structure](#project-structure)
5. [Design System](#design-system)
6. [The 8 Golden Rules in This Project](#the-8-golden-rules-in-this-project)
7. [Responsive Behaviour](#responsive-behaviour)
8. [Accessibility](#accessibility)
9. [State & Data](#state--data)
10. [Known Limitations](#known-limitations)
11. [Assets & Credits](#assets--credits)
12. [Team](#team)

---

## About the Project

**Course:** Human Computer Interaction — Final Project
**Product concept:** SaffCoz, a premium fragrance boutique that sells signature scents and
collaborations with other perfume houses.

The goal of the assignment was not just a pretty interface, but a website where **every
visible control actually does something**. There are no dead buttons, no fake loading
spinners and no "coming soon" placeholders. Where a real backend would be required
(payment processing, order database), the interface routes the user to a real channel
(WhatsApp / email) instead of pretending a fake checkout succeeded.

**Tech stack**

| Item | Detail |
| --- | --- |
| Markup | HTML5, semantic elements (`header`, `nav`, `main`, `section`, `footer`, `figure`) |
| Styling | Plain CSS — custom properties (design tokens), flexbox, CSS grid |
| Behaviour | Vanilla JavaScript (ES5-safe syntax), no framework |
| Storage | `localStorage` for cart and wishlist |
| Build step | None — open the HTML and it runs |
| Dependencies | None. Only Google Fonts is loaded over CDN |
| Total code | ~1,880 lines CSS, ~1,130 lines JS |

---

## Running the Project

The site has no build step, but it should be **served over HTTP** rather than opened with
`file://`, so that relative asset paths and `localStorage` behave normally:

```bash
# from the project folder
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000/homepage.html>.

You can also just double-click `homepage.html`. All links and assets use **relative paths**
(`css/base.css`, `asset/...`), so the pages also work directly from the filesystem.

---

## Pages & Features

| Page | File | What it does |
| --- | --- | --- |
| Home | `homepage.html` | Editorial hero, new arrivals, best-seller and sale features, full product grid, brand quote |
| Product | `productpage.html` | Full catalogue with **live search, filter and sort**, product detail modal, add to cart |
| Store | `storelocation.html` | Three boutiques, click a store to switch the map and the Google Maps link |
| About Us | `aboutus.html` | Brand story, signature scents, house values, vision & mission, **wishlist section**, collaborations |
| Contact Us | `contactus.html` | Contact form with inline validation, direct contact details |

**Interactions that work end to end**

- **Product detail modal** — opens from any card (mouse or keyboard), shows description,
  fragrance notes and selectable sizes, then adds the chosen variant to the cart.
- **Cart drawer** — slide-in panel with quantity +/−, remove, **undo**, subtotal, and an
  order button that opens WhatsApp with the order summary pre-written.
- **Wishlist** — heart on every card, persisted per device, shown as a section on the
  About page and as a counter in the navbar.
- **Search / filter / sort** — filters by name, brand, gender and "on sale"; sorts by price
  or name; shows the live result count and a clear empty state with a reset action.
- **Store selector** — switching stores updates the map image, the active state and the
  external Google Maps link.
- **Contact form** — validates on submit, re-validates live, focuses the first problem
  field, then opens the user's email app with the message prepared.

---

## Project Structure

```
SaffCoz-FinalProject/
├── homepage.html            # 5 pages, one per file
├── productpage.html
├── storelocation.html
├── aboutus.html
├── contactus.html
├── css/
│   ├── base.css             # design system: tokens, navbar, footer, buttons,
│   │                        # cards, forms, modal, cart drawer, toast
│   ├── homepage.css         # per-page layout only
│   ├── productpage.css
│   ├── storelocation.css
│   ├── aboutus.css
│   └── contactus.css
├── javascript/
│   ├── main.js              # shared: navbar, cart, wishlist, toast, modal, drawer
│   ├── products.js          # product catalogue (single source of truth)
│   ├── homepage.js          # renders homepage grids
│   ├── productpage.js       # search / filter / sort / render
│   ├── aboutus.js           # signature scents + wishlist section
│   ├── storelocation.js     # map switcher
│   └── contactus.js         # form validation & submission
├── asset/                   # images (≈3 MB, optimised)
├── tools/
│   └── optimize_images.py   # one-off image resize / re-encode script
├── DESIGN-BRIEF.md          # the design brief this implementation follows
└── references.txt           # image sources
```

**Architecture note.** Every page loads `css/base.css` and `javascript/main.js` first, so
the navbar, footer, buttons, cards, forms, modal, cart drawer and toast have exactly one
definition across the whole site. Page-specific CSS and JS stay small and only describe
what is unique to that page — this is what keeps the interface consistent instead of five
slightly different versions of the same component.

---

## Design System

**Colour tokens** (defined once in `css/base.css`, used everywhere)

| Token | Value | Purpose |
| --- | --- | --- |
| `--paper` | `#faf7f1` | Warm ivory page background |
| `--cream` | `#f1ebe0` | Alternate section background |
| `--charcoal` | `#26221d` | Navbar, footer, hero |
| `--ink` | `#23201c` | Primary text |
| `--ink-soft` | `#5c564d` | Secondary text |
| `--ink-faint` | `#6f6858` | Metadata (still passes AA contrast) |
| `--brass` / `--brass-deep` | `#a8873d` / `#7d6228` | Accent — decorative vs. text-safe |
| `--wine` | `#7c2d3a` | Sale prices and error states |

**Typography** — two families only: **Cormorant Garamond** (editorial serif) for headings
and prices, **Jost** (geometric sans) for navigation, body copy, buttons and labels. Small
uppercase labels with wide letter-spacing create the eyebrow/metadata hierarchy.

**Other tokens** — 2 px and 4 px radii, a single easing curve
(`cubic-bezier(.22,.61,.36,1)`), two shadow levels, a 1240 px container and a 72 px navbar
height.

**Components defined once:** buttons (primary / outline / light / ghost), product card,
tag/badge, field + error message, modal, cart drawer + quantity stepper, toast, sticky
navbar, footer.

---

## The 8 Golden Rules in This Project

Ben Shneiderman's eight rules are the design constraint for the whole site. Below is what
each rule means and exactly how it is implemented here.

### 1. Strive for Consistency

*Consistent terminology, layout and behaviour: the same action must work the same way
everywhere.*

- One shared stylesheet (`css/base.css`) and one shared script (`javascript/main.js`) define
  the navbar, footer, buttons, cards, form fields, modal, cart drawer and toast for all five
  pages — no page re-invents a component.
- The navbar markup and footer are identical on every page, and the current page is marked
  with `aria-current="page"` plus a brass underline.
- "Add to cart" behaves identically whether it is triggered from the homepage, the product
  page or the About page, because it calls the same function.
- The same feedback mechanism (a toast notification) confirms every comparable action: add
  to cart, remove from cart, wishlist toggle.
- Colour, type and spacing come from design tokens, so a change propagates everywhere.

### 2. Cater to Universal Usability

*Design for a wide range of users, devices and abilities.*

- Layouts are rebuilt, not just scaled, at breakpoints from 320 px up to large desktops
  (tested at 320, 375, 430, 768, 1280 px).
- Navigation collapses into a hamburger menu below 900 px, with `aria-expanded` state.
- Touch targets meet the 44 px guideline: on touch devices (`@media (pointer: coarse)`) the
  quantity stepper, close buttons, wishlist hearts and navbar controls expand to
  44 × 44 px, and size/variant choices and radio pills get a 44 px minimum height. On
  desktop, controls keep their smaller refined size.
- Product cards are operable by mouse **and** keyboard (`role="button"`, `tabindex="0"`,
  Enter/Space handlers) — a hover-only reveal was deliberately replaced by a click/tap modal
  because hover does not exist on touch screens.
- `prefers-reduced-motion` is respected: all animation is disabled for users who ask for it.
- Plain-language labels accompany icons (the cart and wishlist icons are labelled via
  `aria-label`; nothing depends on recognising an icon alone).

### 3. Offer Informative Feedback

*Every meaningful action must tell the user what happened.*

- **Add to cart** → toast confirmation naming the product, cart badge count updates
  immediately, and the drawer contents are re-rendered.
- **Remove from cart** → toast with an **Undo** action, badge updates instantly.
- **Wishlist** → the heart fills, a toast confirms, and the navbar counter changes.
- **Search / filter / sort** → the result count ("6 fragrances") updates live, and an empty
  result shows a dedicated empty state instead of a blank area.
- **Store selection** → the active store is highlighted, the map fades and swaps, and the
  external map link updates.
- **Form submission** → the button acts, invalid fields are marked with an explanation, and
  a completion panel replaces the form when it succeeds.

### 4. Design Dialogs to Yield Closure

*Every task should have a clear beginning, middle and end.*

- The cart has a defined sequence: **empty state → items → subtotal → order action**. The
  empty state explains what to do next instead of showing an empty box.
- Checkout ends with a single, unambiguous completion: the order summary is written into a
  pre-filled WhatsApp message, so the user can see exactly what will be sent.
- The contact form ends with a completion panel ("Thank you, *name*") that states what
  happened and offers a clear next action ("Write another message").
- Filters are only "done" when the UI shows both the active state and the resulting count,
  so the user is never left wondering whether the filter applied.

### 5. Offer Simple Error Handling / Prevent Errors

*Prevent errors where possible; when they happen, explain what, why, and what to do next.*

- Inputs use appropriate HTML types (`type="email"`, `type="tel"`) plus custom validation:
  a real email pattern, a phone number restricted to 10–13 digits, and required first name,
  last name, gender and message.
- Errors are shown **inline, next to the field** with a human explanation ("Please enter a
  valid phone number (10–13 digits)") — never a browser `alert()` and never a technical
  message. The first invalid field is focused automatically.
- Once a field has been flagged, it re-validates as the user types, so the error disappears
  the moment it is fixed.
- Impossible states are prevented rather than reported: the quantity stepper never reaches
  zero (decreasing at 1 removes the line and offers Undo), and the order button only exists
  when the cart actually contains something.

### 6. Permit Easy Reversal of Actions

*Let users explore safely, and make destructive actions recoverable.*

- Removing a cart item is instantly **undoable** from the toast.
- Quantities can be increased and decreased freely; the cart is non-destructive to edit.
- Search, filter and sort can all be reset at once with **Clear all filters**, and the empty
  state offers the same reset.
- The modal and the cart drawer can be closed three ways: the × button, clicking the
  backdrop, or pressing **Esc**.
- Feedback like the wishlist is reversible with the same control that created it.

### 7. Support Internal Locus of Control

*The user, not the interface, decides what happens.*

- Nothing happens automatically: no auto-redirects, no pop-ups, no autoplaying media, no
  carousels that move on their own.
- Modals open only on user action and never steal the flow; adding to cart does **not**
  force the drawer open — the toast offers "View cart" instead.
- Every choice belongs to the user: which store to preview, which size variant, which sort
  order, which filter.
- Motion is short and state-driven (roughly 0.2–0.6 s) and always communicates a change
  rather than decorating the page.
- Images reserve their space (`aspect-ratio`, `loading="lazy"`), so content does not jump
  around while loading.

### 8. Reduce Short-Term Memory Load

*Do not ask users to remember information from earlier screens.*

- The navbar is sticky and always marks the current page, so orientation is never lost.
- The cart badge shows the item count at all times, and the drawer repeats each item's name,
  chosen size, quantity and line price.
- The product modal shows brand, name, price, description, notes and size options in one
  place, so nothing has to be recalled from the grid.
- The wishlist is a visible page section (not a hidden list) with its own heading.
- Active filters, the sort choice and the result count stay on screen after being applied.
- The order summary is generated into the WhatsApp message, so the user never retypes what
  they added.

---

## Responsive Behaviour

The layout adapts rather than simply shrinking:

| Width | Behaviour |
| --- | --- |
| ≥ 1000 px | 3-column product grid, 4-column vision/mission band, sidebar-style store layout |
| 900 px | Navigation collapses into the hamburger menu |
| 980 / 860 px | Product grid drops to 2 columns; split sections stack |
| 760 px | Product toolbar becomes a single column |
| 640 px | Collaborations keep a compact 3-up row; vision/mission stacks |
| 520 px | Hero statistics stay on one line as a 3-column grid |
| 320 px | Verified: no horizontal overflow anywhere on any page |

---

## Accessibility

- **Semantic structure:** `header`, `nav`, `main`, `section`, `footer`, `figure`/`figcaption`,
  one `h1` per page, ordered heading levels.
- **Keyboard support:** visible focus rings (`:focus-visible`), keyboard-operable cards,
  Esc-closable modal and drawer, a "Skip to content" link on every page.
- **Contrast:** every text/background pair was measured against WCAG AA. Metadata colours
  were darkened until they cleared 4.5:1 on the ivory, cream and white surfaces; the "New"
  badge and the cart counter use the darker brass so white text passes.
- **Text over photos:** the hero uses a gradient scrim, verified against the brightest parts
  of the photograph, so contrast never depends on which part of the image sits behind the
  text.
- **Labels and states:** `aria-label` on icon-only buttons, `aria-pressed` on toggles,
  `aria-current` on navigation, `aria-invalid` on failed inputs, `aria-live` on the toast
  region and the result counter.
- **Images:** meaningful `alt` text for content, empty `alt` for decorative images.
- **Motion:** `prefers-reduced-motion` disables transitions and smooth scrolling.

---

## State & Data

The site has no database. All state lives in the browser:

| Key | Contents |
| --- | --- |
| `saffcoz_cart_v1` | Array of `{ id, variant, name, price, img, qty }` |
| `saffcoz_wishlist_v1` | Array of product ids |

**Product data** is defined once in `javascript/products.js` (six catalogue items) and in
`javascript/aboutus.js` (three signature scents). The grids, the search index, the modal and
the cart all read from those definitions, so the displayed price and the cart price can
never disagree.

---

## Known Limitations

These are deliberate and stated honestly rather than hidden behind fake UI:

- **No payment or order backend.** Orders are handed off to WhatsApp with the summary
  pre-filled; the user sends the message themselves.
- **No accounts or authentication.** Cart and wishlist are per-device, stored in
  `localStorage`.
- **The contact form does not send mail from a server.** It validates, then opens the user's
  email client with the message prepared.
- **Search and filters operate client-side** over the nine products defined in the code, not
  over a server catalogue.
- **Brand names are parodies** (Dion, Bullgarry, Davidon, Motorolina Hisrera, YXL,
  Atkindaughter, and so on) created for the assignment; they are intentionally not the real
  trademarks.
- Contact numbers and store hours are placeholders for the assignment.

---

## Assets & Credits

- Product and lifestyle photography sources are listed in `references.txt`.
- `tools/optimize_images.py` was used once to resize and re-encode oversized assets
  (several were above 1 MB, and one was 4500 × 4500). The image folder is now ≈3 MB in
  total; a map image shipped as PNG was converted to JPEG.
- Fonts are served by Google Fonts (Cormorant Garamond, Jost).
- Icons are inline SVG, so no icon library is loaded.

---

## Team

| Name | Student ID | Role |
| --- | --- | --- |
| _&lt;member 1&gt;_ | _&lt;NIM&gt;_ | _&lt;role&gt;_ |
| _&lt;member 2&gt;_ | _&lt;NIM&gt;_ | _&lt;role&gt;_ |
| _&lt;member 3&gt;_ | _&lt;NIM&gt;_ | _&lt;role&gt;_ |

**Course:** Human Computer Interaction — Final Project
**Institution:** BINUS University
