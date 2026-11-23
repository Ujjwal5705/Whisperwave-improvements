# Accessibility and performance checks for Whisper Wave

I’d fix keyboard focus, the Sign in form, and the moving pricing screen first. Someone who uses Tab can lose track of where they are on the landing page or reach the registration form while Sign in is on screen. In two desktop WebKit captures, registration text also appeared mirrored over Sign in. On mobile-sized Pricing, a single layout shift moved the next section down about 449 px.

## What the evidence covers

| Check | Where and when |
| --- | --- |
| Desktop keyboard and rendered-page checks | Successful Chromium runs on this Mac at 1440 × 900 on 22 November 2026. |
| Fresh desktop rendering | A standalone WebKit view on the MacBook Air at 1440 × 900 on 23 November. |
| Narrow layout and mobile-sized interactions | Chromium emulation at 390 × 844 and a 320 px homepage check. These reproduce width and input conditions in Chrome. |
| Slower mobile page loads | Archived Lighthouse 12.2.1 mobile simulations from 21 November. The preset used 150 ms round-trip latency and 4× CPU slowdown. |
| Response times from the Mac | Fresh HTTP transfers on 23 November from a MacBook Air running macOS 15.0.1. |
| Physical mobile coverage | iPhone Safari, Android Chrome, and their on-device screen readers still need a hardware run. |

I checked the live homepage on 23 November and confirmed it still serves the same named JavaScript and CSS entry assets as the earlier captures. Fresh Chrome automation stalled before rendering, and Safari WebDriver reported that remote automation was disabled. I used the Mac’s built-in WebKit to get fresh desktop rendering results. The public PageSpeed request was rate-limited, so real-user p75 and INP figures are still unknown.

## Accessibility findings

### 1. Keyboard focus can disappear on the landing page

The first desktop links received focus without an outline or a clear focus ring. A later call to action, **Get it off your chest**, received focus while its parent still had zero opacity. The landing page had no skip link to the main content.

I’d give links and buttons a visible focus treatment, add **Skip to main content**, and keep interactive content visible when it receives focus. I’d Tab from the top without touching the mouse, then reverse with Shift+Tab. Watch for focus behind sticky elements and on items the page scrolls into view. [WCAG 2.2 focus visible](https://www.w3.org/TR/WCAG22/#focus-visible)

[Desktop landing capture](whisper-wave-screenshots/desktop-homepage.jpg)

### 2. Sign in has two forms in its keyboard order

In the public journey check, I tabbed through Sign in. After **Create an account**, focus went into the registration email and password fields and eventually to **Send code**, even though I hadn’t switched modes. This was a keyboard check in the 390 px Chrome layout.

I’d remove the inactive face from the tab order and accessibility tree. When someone switches modes, put focus in the active form. This needs a keyboard and screen-reader check in both directions.

[Sign in form](whisper-wave-journey-screenshots/rooms-account-sign-in.jpg) · [Registration form](whisper-wave-journey-screenshots/rooms-account-registration.jpg)

Two fresh snapshots taken in a standalone desktop WebKit view also showed mirrored registration labels and fields over the Sign in card. I’d render the active form on its own and verify the result in Safari’s visible browser window. The screenshots are evidence of the standalone WebKit result.

[Fresh desktop WebKit Sign in screenshot](whisper-wave-device-screenshots/desktop-webkit-sign-in.jpg)

### 3. The Whisper alias error is visible and needs an accessible association

The alias field had a visible focus treatment. An invalid alias showed “Username must be at least 3 characters” next to a field labeled **Your alias**. The input received `aria-invalid="true"` and the inspected markup had no `aria-describedby` pointing at the message.

I’d use “Alias” in the error, associate the visible message with its field, and check when the screen reader announces it. The age gate and the rest of the form should stay available while the user corrects the value. [WCAG error identification](https://www.w3.org/TR/WCAG22/#error-identification)

[The invalid alias state](whisper-wave-journey-screenshots/chat-alias-error.jpg)

### 4. Small footer text and policy links need more contrast

The landing scan flagged five low-contrast footer elements. Examples ranged from 1.88:1 to 4.34:1. The Safety and Report scans also flagged inline links that were hard to distinguish from their surrounding text. The shared footer carries those contrast issues across public routes.

I’d bring normal text to at least 4.5:1, underline body-copy links, and test each rendered foreground and background pair. Check focused and selected states as well as the default colors. The [SEO and color review](Ujjwal-Sharma-Whisper-Wave-SEO-and-Brand-Review.md) has tested replacement color pairs. [WCAG contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)

[Landing footer](whisper-wave-screenshots/landing-footer.png)

### 5. Some controls need clearer names, states, and ways to reach them

- The FAQ’s accessible names included “Someone” before question text. I’d hide the decorative prefix from assistive technology and keep the question itself as the button name.
- The mobile landing carousel flagged a scrollable region without enough keyboard access. The little dot controls are difficult to discover. I’d stack the cards, or provide visible, labeled Previous and Next controls with a clear selected state.
- The Apps page scan flagged a link in a tab list that didn’t have the expected tab semantics. I’d give actions that change a panel proper tab semantics and use ordinary links for navigation to another page.
- Some Memes loading placeholders had `aria-label` on generic elements. I’d hide purely decorative placeholders and provide a meaningful status when the feed actually needs to announce one.
- The Pricing duration picker showed a visible selected pill, but its selected state wasn’t exposed in the inspected controls. I’d use a labeled radio group or the appropriate selected state for the chosen pattern.
- Some touch controls in mobile emulation are small. The Whisper gender options were 32 px high, a vibe chip was 25 px high, and the Report icon in Memes was about 27 px wide. I’d enlarge common controls and add separation around adjacent actions. WCAG 2.2 AA uses a 24 × 24 CSS px target minimum or applicable exceptions. For important actions I’d aim closer to 44 px. [WCAG minimum target size](https://www.w3.org/TR/WCAG22/#target-size-minimum)

The 320 px homepage check found no page-level horizontal overflow. The carousel and tab strips still need testing with touch and keyboard. The automated results point to specific issues and don’t establish WCAG conformance.

### Fresh desktop scan in WebKit

I also scanned five public pages in the Mac’s built-in WebKit with axe-core 4.10.2. The contrast and link findings reproduced on desktop.

| Page | Low-contrast elements | Inline links hard to distinguish |
| --- | --- | --- |
| Homepage | 5 | 0 |
| Whisper | 0 | 0 |
| Sign in | 0 | 0 |
| Pricing | 5 | 1 |
| Report abuse | 6 | 1 |

The Sign in scan returned no automated violations in that view. The keyboard test still found the hidden registration controls in the tab sequence. That’s why I’d keep both checks.

## Performance findings

### Fresh desktop runs on the Mac

Three loads per route in separate WebKit processes with a nonpersistent data store, on the Mac’s normal connection. The timings below show when the first content painted in that desktop view.

| Page | Median first contentful paint | Range |
| --- | --- | --- |
| Homepage | 0.667 s | 0.643–0.710 s |
| Whisper | 1.118 s | 0.810–1.468 s |
| Pricing | 0.905 s | 0.807–0.910 s |

Whisper took longest to show its first content in these runs. These desktop measurements use a different engine and network setup from the mobile simulations below.

### Mobile lab baseline

| Route | Lighthouse performance | First contentful paint | Largest contentful paint | Total blocking time |
| --- | --- | --- | --- | --- |
| Homepage | 79 | 3.67 s | 3.67 s | 26 ms |
| Whisper | 71 | 3.79 s | 4.69 s | 82 ms |

These are two individual mobile simulations. Whisper’s largest element painted about 0.90 s after its first visible content in the simulation. I’d check the waterfall for the assets that delay the form, and measure discovery, download, and render delay separately.

The live homepage declares **51 JavaScript module preloads**. The list includes admin, chat, forwarding, and notification code. I’d separate the public entry routes from those dependencies, size the logo and illustrations for how they are displayed, and compare fresh runs with the same settings. A healthy HTML response only covers the first part of what a user waits for. [Largest Contentful Paint](https://web.dev/articles/lcp)

### Pricing moves during the first load

In the 390 × 844 Chrome capture, the page’s non-input layout-shift sum was about 0.322. A follow-up trace recorded a single shift of about 0.321. The **Match Line** section moved from roughly 326 px to 775 px down the screen as the offer area loaded. The desktop capture showed a smaller sum of about 0.104. The mobile Safety capture also accumulated about 0.167 in shifts. These are diagnostic browser samples. Google evaluates CLS over layout-shift session windows and reports field experience separately.

I’d put a correctly sized placeholder in the initial Pricing layout, at each breakpoint, so the plan selector and content beneath it stay put. I’d retest across several cold loads and check that the same control is under the keyboard or touch focus after the content settles. [Layout-shift measurement](https://web.dev/articles/cls)

[Settled mobile pricing screen](whisper-wave-screenshots/pricing.jpg)

### Direct transfers from the Mac

I made three requests for each resource on the Mac’s normal connection. Every response was HTTP 200. Time to first byte includes the network connection. These measurements stop at the transfer and can’t show when the page is visually usable.

| Resource | Median time to first byte | Range | Body downloaded |
| --- | --- | --- | --- |
| Homepage | 567 ms | 410–603 ms | 2.8 KiB |
| Whisper | 940 ms | 506–1182 ms | 2.8 KiB |
| Pricing | 389 ms | 389–557 ms | 2.8 KiB |
| Main JavaScript entry | 388 ms | 365–395 ms | 35.0 KiB |
| Logo PNG | 385 ms | 384–752 ms | 185.0 KiB |

The logo transferred about 66 times as much data as the compressed HTML response. I’d use a small vector mark in the shared header and give it an appropriate load priority. The HTML and transfers describe only part of the load.

## What I’d check on actual phones

I’d open the landing page and Whisper on iPhone Safari with VoiceOver and Android Chrome with TalkBack. Follow the primary action, enter an invalid alias, correct it, and verify that the age check and search button can still be reached with the software keyboard open. Check scrolling with the bottom tab bar, and repeat with large text and reduced motion. On desktop, repeat Sign in and the pricing handoff using Safari and VoiceOver.

For performance, use several comparable cold loads on the actual phones, and use site-owner field data when available. Track mobile and desktop separately. Google’s good p75 targets are LCP at or below 2.5 s, INP at or below 200 ms, and CLS at or below 0.10. The public load captures are useful for locating work to fix. [Core Web Vitals](https://web.dev/articles/vitals)

Ujjwal Sharma
