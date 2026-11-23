# What I’d improve about Whisper Wave’s SEO and branding

I opened Whisper in Chromium and compared it with the HTML that arrived before JavaScript ran. The first response described the homepage. Once the app rendered, Whisper added its own tags and still carried the homepage tags. I repeated that comparison across the public routes and checked the sitemap and robots rules.

I also checked the header mark, favicon, and share card side by side. I’d keep the dark violet and teal and draw one simpler mark that works at all three sizes.

The public checks were run on 22 November 2026. The measurements here come from HTTP responses and browser runs. Search Console and real-user performance are separate follow-up checks.

## Technical SEO

### Give every public route its own HTML and metadata

I checked 22 HTML URLs, including the homepage, the main product and policy pages, a missing URL, and a few URL variations. They all returned the same 11,163-byte HTML response. It includes an empty application root, the homepage title and description, the homepage canonical, and a short fallback for browsers with JavaScript turned off. That fallback links to Privacy and Safety but gives no direct path to Whisper or Rooms.

JavaScript makes the screens distinct, but it leaves the original homepage tags in place. The numbers below count what is actually in the rendered HTML head.

| URL | Canonical in the first response | Canonicals after rendering |
| --- | --- | --- |
| `/` | `/` | `/` twice |
| `/home` | `/` | `/`, `/home` |
| `/whisper` | `/` | `/`, `/whisper` twice |
| `/rooms` | `/` | `/`, `/rooms` |
| `/whisper/` | `/` | `/`, `/whisper/`, `/whisper` |
| `/Whisper` | `/` | `/`, `/Whisper`, `/whisper` |

I also found more than one description, social metadata tag, and robots declaration after rendering. A few pages have a browser title that makes sense after JavaScript runs, but a client reading the original HTML still sees the homepage title. That sends conflicting signals about which URL represents each page.

I’d pre-render the public pages at build time or render them on the server. Each page should have one title, one description, one self-canonical, one clear robots policy, its own share metadata, and meaningful HTML content in the first response. Keep the live queue, room activity, and account features interactive after load. A small route configuration can be the source for each page’s metadata, sitemap eligibility, and status code. On client navigation, update the existing head tags in place. [Google’s JavaScript SEO guide](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) · [Canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

[See the current `/whisper` response with JavaScript disabled](whisper-wave-seo-screenshots/whisper-without-javascript.png)

### Clean up status codes and URL variants

- **Missing URLs return HTTP 200.** The URL I made up showed the site’s 404 screen and added `noindex` only after the app rendered. Keep the links back to the product and return HTTP 404. Check the response status for a missing path and a deleted room.
- **Slash and case variants are served as separate URLs.** `/whisper/` and `/Whisper` returned 200 and loaded the same form as `/whisper`. Give known variants a permanent redirect to the preferred lowercase URL. For tracking URLs such as `/?utm_source=pwa`, keep the tracking parameter available to analytics and use the clean URL as the sole canonical.
- **The main domain’s HTTP redirect works.** HTTP redirects to HTTPS with a 308. The `www` hostname did not resolve in my check. The current canonical host is the bare domain. If people commonly type the `www` version or old links use it, configure that hostname to redirect to the bare domain. [Google’s redirects guide](https://developers.google.com/search/docs/crawling-indexing/301-redirects)

### Decide what should show up in search

| Route | What I’d do |
| --- | --- |
| `/` | Make it the main result for Whisper Wave and anonymous text chat. Explain the product clearly and link to the two main entry points. |
| `/whisper` | Give it an indexable page focused on starting a one-to-one chat. Put a short explanation of the queue, the age check, and what a guest needs above or beside the form. |
| `/rooms` | Index the room directory with useful information about guest access, moderation, and the kinds of conversations available. Serve the stable information in HTML so the page is useful while the live list loads. |
| `/home` | Treat it as the app launcher. It currently overlaps with the homepage and Whisper in purpose. I’d leave it accessible in the app and take it out of the sitemap if the team chooses to keep it out of search. |
| `/rooms/gaming` and scheduled rooms | The tested room pages set `noindex` after rendering. Keep thin, temporary, private, and invite-only room views out of search. A permanent public room page can earn a place in search if it has an original description, rules, and reliable access information. |
| `/pricing`, `/safety`, `/report`, `/privacy`, `/guidelines` | Keep these easy to find for product and trust queries. Give each a specific title and a useful opening paragraph. Terms and Cookies should remain easy to find from the site footer. |
| `/games` and `/memes` | Keep Games indexable if it has original information about games people can play together. Review whether the rotating Memes feed is a useful search destination before listing it. |
| Sign in, private chats, profile, and admin | Give private content access controls and keep account or private app pages out of the sitemap. Return a real access response or an index-excluded shell as appropriate. |

The public robots file disallows `/auth`, `/chats`, and `/apps`, while these pages start with the homepage’s `index, follow` declaration and add `noindex` in the browser. A crawler blocked at the robots stage can’t see that later directive. I’d decide which pages should be crawlable and deliver any required `noindex` in the first response or an HTTP header. Keep private data behind sign-in. The file also blocks `/api/`, which makes it important to put public information in the HTML instead of relying on crawler access to the live data endpoints. [Google’s noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing) · [How Google reads robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

### Fix the sitemap and simplify crawl rules

- The XML sitemap loads and is announced in `robots.txt`. It currently lists 14 URLs, including the app launcher and the `llms.txt` reference file. Generate the sitemap from the canonical, indexable pages the team wants in search. Keep the reference file accessible at its URL.
- The current sitemap uses `priority` and `changefreq`. Google ignores these fields. Add `lastmod` when it reflects a real change to the page, and leave it out when there is no reliable source date.
- The robots file includes edge-managed rules and site rules. Some named crawler groups repeat with different allow and disallow rules. Clean up the duplicate groups and check how the rules apply to public pages, assets, and ordinary search crawlers. A normal browser-profile request loaded the pages and a test link-preview client could fetch the share image. A plain Python client received 403. That difference is worth checking in edge logs and in Search Console’s live test. [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [Current sitemap](https://whisperwave.space/sitemap.xml) · [Current robots.txt](https://whisperwave.space/robots.txt)

### Make the site easier to discover and share

- **Use real links in the initial page HTML.** Link to **Start a one-to-one chat**, **Browse live chat rooms**, **Safety**, and **Privacy** from relevant pages. The first HTML response currently has three fallback links and omits both main product destinations. Keep links in headings and explanatory text where users naturally look for them. [Google’s crawlable links guide](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- **Publish one consistent set of brand markup.** The initial HTML already includes `WebSite`, `Organization`, and `WebApplication`. The rendered homepage duplicates these entities. Use the exact brand name **Whisper Wave**, the same canonical homepage URL, stable entity IDs, and the updated logo. Keep FAQ and breadcrumb markup wherever it accurately reflects what somebody can see on the page. [Site names in Google Search](https://developers.google.com/search/docs/appearance/site-names) · [Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization)
- **Give important links the right preview.** The current `og-default.png` loads at 1200 × 630. The homepage, Whisper, Rooms, and Pricing all use it. The first response also gives those pages the homepage’s share title, description, and URL. Put route-specific Open Graph and X card data in the first response. The homepage can have the brand card, Rooms can show the room experience, and Pricing can use a Spark Pass card. Keep the correct canonical URL, image dimensions, and image alt text. [Open Graph specification](https://ogp.me/)
- **Keep language declarations simple.** The site uses `lang="en"`, Indian English in the sharing and app metadata, and `en` and `x-default` alternates that both point to the homepage. If there is one English site, I’d keep one coherent English configuration and remove redundant alternate tags. If distinct translated pages are added, give each its own URL, content, and reciprocal language alternates. [Localized page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions)
- **Put search terms in the page itself.** The homepage ships a meta keywords list with terms such as “chatting website” and “omegle alternative.” Google ignores that tag. I’d remove it and use the phrases that genuinely describe each page in the title, heading, and copy. [Google’s metadata guidance](https://developers.google.com/search/docs/crawling-indexing/special-tags)

## Content people can find and trust

The current homepage title already names anonymous chat, but its visible headline says “Let’s open up. No one to judge.” The app launcher explains the product better. I’d make the visible heading, title, snippet, and main action describe the same thing. Titles below are starting points. Search Console can show which terms actually lead people to each page. [Google’s title guidance](https://developers.google.com/search/docs/appearance/title-link) · [Google’s snippet guidance](https://developers.google.com/search/docs/appearance/snippet)

| Page | Suggested search title | What the page should answer |
| --- | --- | --- |
| Homepage | Anonymous Text Chat With Strangers \| Whisper Wave | What is Whisper Wave? How does a one-to-one chat start? Do I need an account? |
| Whisper | Start a One-to-One Stranger Chat \| Whisper Wave | What do I enter? What happens in the queue? Can I leave at any point? |
| Rooms | Live Topic Chat Rooms \| Whisper Wave | Which rooms can I join? Can guests post? How do moderators work? |
| Pricing | Spark Pass Pricing \| Whisper Wave | What stays free? What does the pass do? When does it expire? |
| Safety | Chat Safety, Blocking and Reporting \| Whisper Wave | How do I leave, block, and report? What information is saved when I report? |

For the homepage I’d use **Anonymous text chat, one stranger at a time** as the H1. A description could read *Meet one person for a live text chat. Pick a nickname, join the queue, and leave whenever you want. No account needed to start. Ages 18+.*

- The current title and snippet can promise “no account needed to start.” The broader claim “chats aren’t stored” needs the same qualifications as the privacy policy. The current share image says “Chats vanish when you leave.” Update copy in the page, snippets, share cards, structured data, and app manifest together. Keep it clear that reporting, photos, and persistent DMs are handled separately.
- Use **Anonymous text chat**, **Live topic rooms**, and **Spark Pass pricing** as page topics. Write a short, original explanation before the interactive screen. For the two main features, that means explaining the queue and the room rules in everyday language.
- Use the homepage FAQ to answer real questions. Good examples include what happens if nobody is waiting, how a nickname is shown, and what changes when two people decide to keep in touch. Replace repeated search phrases and vague promises with examples and links to Safety or Privacy.
- For content beyond the product pages, I’d start with only material the team can maintain. A useful guide to playing games with someone you just met is more relevant than a long list of generic joke or keyword pages. Permanent room topics can support useful pages when the features and content are there.
- I’d measure demand through actual queries, impressions, clicks, and landing pages. A limited public domain search returned no results for the domain-only query. That alone can’t establish which pages Google has indexed. The owner’s Search Console property is the place to check that. [Search Console setup](https://developers.google.com/search/docs/monitor-debug/search-console-start)

## Logo and favicon

The logo issue is clearer when you compare the places it appears. The header uses the dark glass wave mark where the W in **Whisper Wave** should be. At about 28 px on the mobile landing page, it reads like “hisper Wave.” The 48 px favicon uses a different image with a hat and masked figure. The share card goes back to the wave mark. Each asset works at a different scale, so the product is harder to recognize across tabs, search results, and shares. The declared 48, 96, and 192 px icons all loaded. Update the artwork in those sizes and add a larger app icon with a maskable variant.

[See the current mobile header](whisper-wave-screenshots/homepage.png) · [Current 48 px favicon](whisper-wave-seo-screenshots/current-favicon.png) · [Current share card](whisper-wave-seo-screenshots/current-share-card.png)

1. **Make the whole name readable.** Use **Whisper Wave** as real text in the header. Put the symbol beside it, with enough space to read both words. Give the home link the accessible name “Whisper Wave home” and make the adjacent mark decorative for screen readers.
2. **Draw one flat mark.** Start with a simple W-shaped wave inside a rounded speech bubble, with thick strokes and a clean silhouette. Use dark plum on a lavender tile for small icons. Save the detailed glass treatment and the masked artwork for places where they have room to be seen.
3. **Make the same mark work everywhere.** Use an SVG in the header. Export a square favicon family with a recognizable 16 px version for tabs and stable 48 and 96 px PNGs for search and other surfaces. Use a 180 px touch icon and 192 and 512 px exports for the installed app, including a maskable version. Check light and dark tabs, browser cropping, and small social previews.
4. **Fix the logo address used by search markup.** The existing Organization logo points to the 551 × 452 glass PNG. Use a clean square version, for example 512 × 512, at a stable public URL and check its appearance on white. Google’s Organization guidance calls for at least 112 × 112 and a crawlable image URL. The favicon is a separate asset picked up from the homepage head.
5. **Unify the share art.** Keep the current 1200 × 630 size, make the complete wordmark and page topic the largest text, and use the same mark as the browser icon. For the homepage card, I’d use “Anonymous text chat” and “No account needed to start.” Check that the important words survive small previews and crops. [Google favicon guidelines](https://developers.google.com/search/docs/appearance/favicon-in-search) · [Organization logo requirements](https://developers.google.com/search/docs/appearance/structured-data/organization)

## Colors I’d use

The design can keep its dark palette. The pressing problem is that colors change meaning across the site. The homepage uses a violet gradient for its primary action, Home uses green, and active tabs and success cues also use green. I’d give each color one job across the marketing and app pages.

I measured footer examples as low as 1.88:1, with small section labels at about 2.81:1. The current buttons also need a contrast check across their gradients. White against the lighter violet gradient stop is 3.72:1, and the footer CTA’s light text against its lighter green stop is 2.67:1. Those are sampled color pairs. Actual button contrast depends on which part of the gradient sits behind the label. I’d use solid fills where people need to read or act. [WCAG 2.2 contrast requirements](https://www.w3.org/TR/WCAG22/#contrast-minimum)

[See the current footer and the change from purple to green](whisper-wave-screenshots/landing-footer.png)

| Role | Proposed hex | Where I’d use it |
| --- | --- | --- |
| Page background | `#1A1520` | Public pages, app background, footer, and browser theme color |
| Surface | `#292135` | Cards, fields, chat panels, and navigation |
| Raised surface | `#342B42` | Menus, sheets, and dialogs |
| Main text | `#F4EFFB` | Headlines, body copy, and labels |
| Secondary text | `#C7BBD3` | Subheads, helper text, and policy copy |
| Muted text | `#B3A5C1` | Timestamps and less prominent labels |
| Primary action | `#B6A0FF` with `#1A1520` text | Find a stranger, Start searching, and the primary action in a form |
| Button hover and press | `#C9B8FF` and `#A588F5` | Keep the same dark text in both states |
| Links | `#C6B5FF` | Underlined links, including links inside policy copy |
| Active tab | `#392C55` with `#E0D3FF` text | Add a visible shape or indicator and mark the current route |
| Functional borders | `#8B799B` | Field and control edges people need to see |
| Focus and small accents | `#79E8D8` | Focus ring on dark surfaces and occasional illustration accents |
| Connected or success | `#65E6A1` | A labeled “Connected” or “Saved” state |
| Waiting or caution | `#F7CC7B` | A labeled “Waiting for a moderator” or “Reconnecting” state |
| Error or destructive action | `#FF9EAF` | Error text and labels for destructive controls |

Here are some pairings I checked using the WCAG contrast calculation.

| Foreground and background | Ratio |
| --- | --- |
| Main text on the page background | 15.86:1 |
| Secondary text on the raised surface | 7.31:1 |
| Muted text on the raised surface | 5.78:1 |
| Dark text on the lavender primary button | 8.07:1 |
| Dark text on the pressed button | 6.35:1 |
| Active tab label on its selected surface | 8.97:1 |
| Functional border against the selected surface | 3.19:1 |

Put the colors in shared CSS variables. Use a plain, readable surface behind forms and body text. Keep glow and gradients in the illustrations. Pair every status with a label and, where helpful, an icon. For the lavender button, the mint ring alone has only 1.52:1 against the fill, so give it a dark offset or use a two-color focus ring. Check the actual rendered button, menu, and field states, including hover, focus, pressed, and errors. [WCAG non-text contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast)

## How I’d check the work

- **HTML checks.** The first response for `/`, `/whisper`, and `/rooms` contains one correct canonical, descriptive text, one matching description, and the correct share tags. The browser shows the same values after JavaScript loads. A missing route returns 404 and known aliases redirect to their preferred URLs.
- **Search checks.** Submit the cleaned sitemap and inspect the homepage, Whisper, and Rooms in Search Console. Compare the declared canonical with Google’s selected canonical. Review live rendering, indexing reports, and queries by page and device. Use the inspection results to check whether Google is seeing the intended page after the fix.
- **Load checks.** The current HTML declares 51 JavaScript module preloads. Split the marketing and public discovery pages from admin, auth, and chat code where practical. Size the logo and illustrations for their display and reserve space for late-loading content. Earlier mobile lab runs measured LCP of 3.67 s on the landing page and 4.69 s on Whisper. Compare fresh lab runs under identical settings. For field data, track mobile and desktop separately and aim for p75 LCP at or below 2.5 s, INP at or below 200 ms, and CLS at or below 0.10. [Core Web Vitals](https://web.dev/articles/vitals)
- **Brand checks.** The full name reads at a glance in the smallest header. A 16 px tab icon and a search-sized favicon still resemble the share card. Test all assets on light and dark backgrounds and test the actual button and link contrasts in the browser.
- **Product checks.** Track whether people coming from search reach the queue and make it into a chat where both people send a message. Use landing page, device, queue availability, and coarse event outcomes to make sense of the funnel.

My first change would be to have each route serve the right HTML, canonical, and status code. The same templates can carry the clearer copy, updated mark, and shared colors. I’d check the result in the first response, in a link preview, and in Search Console when the property is available.

Ujjwal Sharma
