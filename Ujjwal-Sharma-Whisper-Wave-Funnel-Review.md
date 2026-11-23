# Where I’d improve the Whisper Wave funnel

I followed both ways into Whisper, from the landing page and from Home. Each got me to the form. From there I wanted to know whether the site could tell a stranger opening the form apart from two people actually having a conversation.

I checked the public site and its deployed frontend on 23 November 2026. I used separate Chromium sessions at 360 × 640 and 390 × 844 and followed the landing and Home entry points to the Whisper form. The browser blocked write requests and live connections. I also compared the results with the earlier public journey tests. Visitor counts, conversion rates, and the biggest measured drop-off still need data from the site owner.

## The tracking problem I found

The deployed frontend imports an analytics function from the Home, Whisper, room directory, and saved-chat code. The function immediately returns without recording or sending the event. The calls cover several useful steps. I’d start by making sure events from those steps reach a destination the team can query. [Deployed analytics module](https://whisperwave.space/assets/analytics-6cWqZs8l.js)

The same browser sessions reported that the site’s script policy blocked the Cloudflare analytics beacon. I saw the first-party analytics module load and saw no analytics event requests on the tested entry clicks. Backend reporting could still exist. Its coverage and delivery need to be confirmed with whoever operates the site.

| Existing event call | What it would tell me if recorded |
| --- | --- |
| `hub_view`, `hub_card_click`, `nav_click` | What someone opened or clicked around the app. These are useful acquisition signals. |
| `whisper_join` | The join action was attempted. The call happens before the join operation, so it can’t tell us whether the queue accepted it. |
| `whisper_matched` | The client handled a match event. I’d use the matching service’s assignment as the source of truth and compare it with whether the user actually saw the chat. |
| `whisper_message_sent` | A send was attempted. For text the call happens before the send operation, so it can’t tell us whether the other participant received a message. |
| `whisper_like_sent`, `whisper_mutual`, `whisper_connect_auth_redirect`, `whisper_dm_opened` | The steps around keeping in touch. The open call happens as the app initiates navigation to the DM. I’d check independently that the conversation loads and someone returns to it. |
| `whisper_session_end` | An end reason, duration, and a combined message count. That count alone can’t show that both people participated. |

In a controlled run, follow one attempt from a form view to queue acceptance, a match, a message from each side, and a final outcome. Verify that the destination records each step. Check that a retry, page reload, or reconnect leaves the same attempt counted once. A page-view beacon answers a narrower question than the product funnel.

## From the homepage to the first message

`Landing or Home → Whisper form → Queue accepts the request → Match → Both people send a message`

A person can also open `/whisper` directly, so I’d include direct entries in the product funnel and measure the homepage handoff as its own step. Someone choosing to browse rooms is taking another valid path. [Google’s guide to open and closed funnels](https://support.google.com/analytics/answer/9327974)

### 1. Getting to Whisper

I tested both entry links at both mobile sizes. They opened the same Whisper form. Their first screens tell different stories.

| Viewport | Landing headline starts | Landing hero button starts | Home headline starts | Home primary button starts |
| --- | --- | --- | --- | --- |
| 360 × 640 | 462 px | 569 px | 124 px | 252 px |
| 390 × 844 | 574 px | 773 px | 128 px | 256 px |

The landing header’s action was visible near the top in both tests. It said **Find someone** at 360 px and **Find a stranger** at 390 px. The hero button said **Meet a stranger** in both. On Home, **Find someone** sits next to **Browse rooms**, just below a clear explanation of one-to-one matching. The homepage also still shows the fixed “2,417 strangers online now,” while Home displayed “Pretty quiet right now” in this run.

Explain the product next to the first button, use the same label on both entry points, and add **Browse rooms** beside it. Remove the fixed activity count. I’d measure how often landing visits reach the form and whether that carries through to a first conversation.

[Landing at 360 × 640](whisper-wave-funnel-screenshots/landing-360.jpg) · [Home at 360 × 640](whisper-wave-funnel-screenshots/app-home-360.jpg)

### 2. Starting a search

The earlier browser tests confirmed that a valid alias and the 18+ confirmation enabled the join button with gender and vibes blank. On both routes in this check, the form appeared and the join action started disabled. Optional choices take up much of the screen, and the button says **Enter the void**.

Keep the alias, age check, and main action together. Offer a starter alias people can edit, with optional preferences below. Name the action **Start searching** and say why it’s disabled. Track visits to the form and validation reasons separately from attempts the queue accepts. That lets the team tell a confusing form apart from a failed request.

[Whisper entry form](whisper-wave-screenshots/chat-entry.png)

### 3. Waiting and matching

The shipped UI has searching, quiet-queue, and reconnecting states. I stopped at the public form. The actual wait, match rate, and cancellation behavior need controlled testing and real queue data.

While someone is waiting, show whether the search is still running and give them a way to cancel. Offer Rooms if the wait goes on. Record one outcome for each accepted attempt, such as matched, canceled, timed out, or connection error. Group results by broad queue availability and local time so a quiet queue doesn’t get mistaken for a form problem. Include unmatched and canceled attempts when looking at wait and abandonment. A wait chart based only on matched users misses the people who left.

### 4. Getting a conversation going

A match can be followed by silence, a send failure, or a conversation. I’d record when the first user message is accepted from each side. That gives me **neither sent**, **one sent**, and **both sent** without keeping message contents. I’d look at time from match to first send and from match to a two-way exchange. If most people get matched but few send anything, I’d check whether the composer is easy to find and whether connection or delivery feedback is clear before adding more onboarding.

### 5. Keeping in touch

The public frontend shows a mutual-interest step, a sign-in requirement, and a timer for opening a persistent DM. I’d treat this as a separate funnel that starts when both people opt in. Measure mutual opt-in, completed sign-in, a usable DM, and a return to that DM on a later visit. Verify what happens after a slow sign-in or expiry. The first-chat result should include people who came to talk and chose to leave afterwards.

## Two other handoffs worth measuring

- **Rooms.** Follow directory view → room lobby → join accepted → first message accepted. Capture whether a room is open, occupied, or waiting for a moderator as separate signals. The earlier tests showed a guest could reach Venting’s lobby while the directory said “Waiting for a moderator.” A click to open the lobby tells us very little about whether a guest can actually participate. [Venting lobby](whisper-wave-journey-screenshots/venting-guest-lobby.jpg)
- **Spark Pass.** Follow plan selection → sign-in handoff → sign-in completed → verified payment → pass activated. The earlier test selected the ₹49 weekly plan, opened Sign in, and returned to find the ₹99 monthly plan selected. Keep the plan ID through the handoff and verify that the plan users see matches the one the server confirms. [Selected weekly plan](whisper-wave-journey-screenshots/pricing-week-selected.jpg) · [After returning from Sign in](whisper-wave-journey-screenshots/pricing-after-return.jpg)

## What I’d measure

| Question | Measurement |
| --- | --- |
| Do people understand the homepage action? | Sessions that reach the form from the landing page divided by landing sessions. Compare by entry source and device. Keep direct Whisper entries in their own group. |
| Does the form help people start? | Sessions with a first accepted queue attempt divided by sessions that saw the form. Check validation and connection failures alongside the rate. |
| Can people find someone? | Accepted attempts that find a match divided by accepted attempts with a completed observation window. Show median and p90 time to match with the share that cancel, time out, or lose their connection. |
| Do matches turn into conversations? | Matched conversations with a message accepted from each side divided by matched conversations. Count each conversation once for this metric. |
| Does the whole journey improve? | Share of Whisper entry sessions that reach a two-way conversation in the same visit. Use the first attempt to compare specific UI changes and a separate count for repeat attempts. |
| Does keeping a chat work? | Mutual opt-ins that reach a usable DM divided by mutual opt-ins. Track expiry and incomplete sign-in separately. |

Show the count beside each rate and use the same observation window when comparing results. Use a random attempt key or another short-lived identifier for joining funnel steps. Useful properties include entry route, CTA placement, device class, queue outcome, and coarse duration. Keep aliases, emails, sign-in tokens, and message contents out of the event data.

Once events are arriving, I’d test the clearer homepage and shorter form under similar queue conditions. The result I’d look for is more two-way conversations. Wait time, failed sends, blocks, and report completion would show whether anything else changed along the way.

Ujjwal Sharma
