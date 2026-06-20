# Moonline Media — Deep-Sea Theme Multi-Page Agency Website

A bold, multi-page corporate website for **Moonline Media**, built with pure
**HTML5, CSS3, and vanilla JavaScript** — no build tools, no frameworks, no `npm install`.

## 🆕 What's New In This Update

The homepage hero (the very first thing visitors see) got a full upgrade to feel more premium:

- **Animated mesh background** — soft floating gradient orbs + a faint dot/grid texture behind the
  headline, instead of a flat color background.
- **Kinetic headline reveal** — "MOONLINE" and "MEDIA" animate in as separate lines, with "MEDIA"
  getting an animated underline highlight after it lands.
- **Floating glassmorphic stat cards** — "160+ Campaigns shipped" and "97% Client retention" float
  beside the video panel with a gentle bob animation, giving instant credibility.
- **Trust line with avatar stack** — three small profile photos + "9 years building brands that
  compound" sits right under the call-to-action buttons.
- **Subtle 3D parallax tilt** — on desktop, the video panel and floating cards tilt slightly toward
  your cursor as you move the mouse (automatically disabled on touch devices and for users with
  reduced-motion preferences).
- **Scroll cue indicator** at the bottom of the hero, animating downward to invite scrolling.
- **Graceful video fallback** — if the hero video can't load for any reason (slow connection,
  network restrictions, an ad-blocker), the panel automatically swaps to a rich gradient + grid
  texture instead of showing a broken black box. See the "About the Hero Video" section below for
  how to swap in your own guaranteed-to-work video file.
- **Mobile layout fix** — the floating stat cards now sit at the top corners of the video panel on
  phones, so they never overlap the chatbot button in the corner.

## 🎥 About the Hero Video

The hero currently points at a stock video URL (`coverr.co`) for the "Inside Moonline" panel.
**Stock video sites like Coverr and Mixkit are built for downloading, not direct hotlinking** — so
depending on your browser/network, the video may or may not actually play. Either way, the panel
looks intentional thanks to the gradient fallback described above.

**For guaranteed playback, host your own video file:**
1. Download or record a short clip (10–20 seconds, looped office/team/work footage works great).
2. Compress it (e.g. with [HandBrake](https://handbrake.fr/), free) to keep file size under ~5MB.
3. Drop the file into a new `assets/video/` folder in this project, e.g. `assets/video/hero.mp4`.
4. In `index.html`, find this line near the top of the hero section:
   ```html
   <source src="https://cdn.coverr.co/videos/coverr-keyboard-typing-on-laptop-8728/1080p.mp4" type="video/mp4">
   ```
   and change it to:
   ```html
   <source src="assets/video/hero.mp4" type="video/mp4">
   ```
That's it — the video will now load instantly and reliably for every visitor, with no dependency on
an external CDN.

## 📁 What's Inside

```
moonline-media/
├── index.html        → Home page (video hero, image service tiles, why-us, work, testimonials, stats, CTA)
├── services.html      → Full Services page (8 zig-zag image/content rows + strategist team strip)
├── about.html         → About page (story, stats, industries, milestones, team, process)
├── contact.html       → Contact page (form that emails the owner + FAQ)
├── css/
│   ├── reset.css       → Browser reset / normalize
│   ├── style.css       → Deep-sea (navy + light grey-blue) design system + layout for all 4 pages
│   ├── animations.css  → Fade/scale reveal utilities
│   └── chatbot.css     → Chatbot widget styling (bottom-right)
├── js/
│   ├── main.js          → Navbar, scroll reveal, counters, FAQ, contact form, back-to-top
│   └── chatbot.js       → Moonline Assistant chatbot logic
└── README.md
```

## 🚀 How to Open in VS Code

1. **Unzip** this folder anywhere on your computer.
2. Open **VS Code** → `File → Open Folder…` → select the `moonline-media` folder.
3. Install the free **"Live Server"** extension (by Ritwick Dey) if you don't have it.
4. Right-click `index.html` → **"Open with Live Server"**.
5. Click through **Home → Services → About → Contact** in the navbar — each is a real page load.

> You can also just double-click `index.html` to open it directly in a browser — everything works
> without a local server.

## 🎨 What Changed In This Redesign

- **New color theme** — deep navy ink (`#0e1b2e`) and a confident slate-blue accent (`#3d7bc4`) on a
  light grey-blue background (`#eef2f7`), replacing the previous warm-paper / signal-orange palette.
- **Home page hero** now has a looping muted background video next to the headline (autoplay, no
  sound, paused-friendly) instead of plain text, plus a "Live Studio Feed" badge.
- **"How We Can Help" tiles** on the homepage now each carry a representative photo, with a dark
  hover state and the tag/title/description below it.
- **New homepage sections** to give the page real length and substance: "Why Brands Choose Us"
  (image + 3 differentiators), "Featured Work" (3 image case-study cards), and a 3-card
  "Testimonials" section — all before the existing stats/CTA bands.
- **Services page** rebuilt as alternating **zig-zag rows** — image on one side, copy on the other,
  flipping every row — with a numbered badge and icon chip on each photo.
- **"Talk to a Strategist" team strip** added to the Services page with three circular avatar
  cards: **Shrija Joshi** (Marketing Team), **Shrish Joshi** (Developer), and **Diksha** (Strategy
  Creator).
- **About page** expanded with a supporting photo in the story section, a stats strip, a new
  "Industries We Serve" grid, and a 5-point "Milestones" timeline — on top of the existing values,
  team, and process sections.
- **Contact form** no longer asks for **Company** or **Estimated Budget**. It now asks for
  **Gender** and **Designation** (Student / Teacher / Manager / Worker / Founder / Freelancer /
  Other) instead.
- **Contact form now sends real email** — see "Contact Form Delivery" below.

## 📬 Contact Form Delivery (Important — One-Time Setup)

The form on `contact.html` posts to **[FormSubmit](https://formsubmit.co)**, a free service that
forwards form submissions straight to an inbox with no backend or server required. It's already
wired to:

```
shrishjoshi2002@gmail.com
```

**Before the form will deliver mail, it needs a one-time activation:**

1. Publish the site (FormSubmit needs a live URL — it won't fire from a `file://` path).
2. Open the live Contact page and submit the form once with any test details.
3. FormSubmit will send an **activation email** to `shrishjoshi2002@gmail.com` with an
   "Activate Form" link/button.
4. Click it once. Every submission after that lands directly in the inbox automatically —
   you won't see that activation step again.

If you'd rather send to a different inbox, change the address in **one place**:
`contact.html` → the form's `action="https://formsubmit.co/ajax/..."` attribute.
`js/main.js` reads the address from `form.action` automatically, so nothing else needs editing.

## ✨ Features Still Included

- Sticky navbar that solidifies on scroll, animated mobile drawer menu
- Scroll-reveal animations on every page
- Animated stat counters on the homepage and About page
- FAQ accordion (on the Contact page)
- Fully validated contact form with inline error states and real delivery to the owner's inbox
- **Moonline Assistant** chatbot — bottom-right, quick-reply buttons (Our Services / Get a Quote /
  Book a Meeting / Pricing / Contact Us), typing indicator, timestamps, auto-scroll, unread badge,
  and a polite lead-capture fallback when it can't answer
- Fully responsive (mobile-first breakpoints down to ~360px)
- Accessibility: skip-link, visible focus states, `aria-*` attributes, semantic HTML,
  `prefers-reduced-motion` support
- Lazy-loaded images and SEO meta tags on every page

## 🛠 Customizing

- **Colors / fonts / spacing**: CSS variables at the top of `css/style.css` under `:root`.
- **Contact details**: search for the email/phone in each `.html` file and in `js/chatbot.js`
  (`COMPANY` object) to update them in one place.
- **Chatbot answers**: edit the `KB` array in `js/chatbot.js`.
- **Hero video**: swap the `<source src="...">` URL inside the `.hero-video-panel` in `index.html`
  for any other royalty-free MP4 (keep it muted/looping for autoplay to work in all browsers).
- **Team photos / avatars**: the Services-page strategist cards use colored initial avatars (no
  external photos) — edit the `--avatar-bg` inline style and initials in `services.html` to change
  them, or swap in real `<img>` tags inside `.strategist-avatar` if you'd prefer photos.

## 📞 Contact Info Used in This Build

- Email: shrishjoshi2002@gmail.com
- Phone: +91 88083 87895

---

Built for **Moonline Media** — Creative & Digital Growth Agency.
