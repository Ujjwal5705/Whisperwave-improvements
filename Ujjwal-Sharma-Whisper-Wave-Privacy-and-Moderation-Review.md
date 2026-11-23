# Privacy and moderation checks for Whisper Wave

The Whisper form says chats vanish when you leave. That made me check what the site says about photos, reports, and saved chats, then look at what the browser does before a guest has made any choices. I also followed the public Report abuse path to see what someone can do after leaving a conversation.

I checked 12 public routes in isolated WebKit sessions on 23 November 2026. I compared the visible policy and product pages, checked which hosts the browser contacted, and looked at cookie attributes and storage keys. I blocked write requests and live sockets. The chat and room control wording comes from the deployed frontend. Report delivery, actual deletion, staff actions, and blocking outcomes need a controlled environment.

## What the browser actually did

| Check | What I saw |
| --- | --- |
| Guest cookie | Every sampled route set a first-party `gid` cookie, including Home, Privacy, and Report abuse. It was marked Secure and HttpOnly. A fresh check showed about 30 days remaining, matching the published lifetime. |
| Google requests before any choice | On every sampled route, resource timing showed requests to Google Fonts and to the Google sign-in script. I hadn’t tapped **Show ads** or **Continue with Google**. |
| Ads, checkout, bot check, and notifications | I saw no AdSense, Razorpay, Turnstile, or push registration requests during the passive visits. Their behavior when someone opts in, starts checkout, or posts in a room still needs testing. |
| Safe-mode Memes | The browser requested two images from `api.memegen.link` while the page showed **Safe mode**. That matches the Privacy Policy’s description of the image provider. |
| Signup draft | Opening Create account created a local signup draft. I entered a dummy email and reloaded before submitting. The email field cleared and the draft did not contain that address. The stored draft had no password field or populated verification token during the test. |

## Where the privacy wording needs to change

### 1. Say what disappears and what can be kept

The Whisper entry says **“chats vanish when you leave”** and **“completely anonymous.”** The homepage metadata, app manifest, and share card make similar promises. The Privacy Policy gives several different rules.

| Data | What the published policy says |
| --- | --- |
| Ordinary anonymous chat text | It isn’t stored after the session ends. |
| Photos in anonymous one-to-one chat | They are kept without an attached name or account until an admin deletes them. |
| Report evidence | A report can keep a snapshot and surrounding context. The policy gives 90 days after resolution for ordinary reports and one year for child-safety matters. |
| Room messages and photos | Ordinary messages are temporary. The policy says room photos are removed when the room closes or the message scrolls away, with a separate rule for reported media. |
| Saved direct messages | Mutual-interest DMs persist while both accounts exist. The policy says they are removed when an account is deleted. |
| Guest identifiers | The Cookies page lists an anonymous session cookie lasting 24 hours and a guest ID lasting 30 days. I observed the 30-day guest cookie on passive visits. |

I’d use a short entry message such as “Use a nickname to chat. Ordinary chat text is temporary. Reports can save evidence, and photos have separate rules.” Link to a short explanation that says who can see the alias and what the service keeps. Put the photo retention notice beside the upload action and repeat the key points when someone reports or saves a conversation.

Spell out when the one-year period starts and how report expiry applies to photos that are otherwise kept until an admin deletes them. A cookie expiring after 30 days tells us when the browser drops the cookie. The associated records need their own retention explanation and test.

[Whisper form](whisper-wave-screenshots/chat-entry.png) · [Privacy Policy excerpt](whisper-wave-screenshots/privacy.png) · [Current share card](whisper-wave-seo-screenshots/current-share-card.png)

### 2. Be precise about what loads before an ad choice

The Cookies page says “Nothing from Google loads before you agree” in its ad section. The Privacy Policy uses similar wording. The browser requested Google Fonts and the Google sign-in script before I made any choice, including on the public Privacy and Report abuse pages. I saw no AdSense request in those same visits.

Name **AdSense** in that sentence. Explain the font and sign-in requests separately. Load sign-in code where someone can actually choose **Continue with Google**. I’d check the full ad consent flow in a controlled session, including **No thanks**, **Show ads**, the waiting screen, and what happens after reloading.

[Cookies page](https://whisperwave.space/cookies) · [Privacy Policy](https://whisperwave.space/privacy)

### 3. Explain signup and identity based on the path a person takes

The Privacy Policy describes account details as being created only after mutual interest. The public site also offers **Create account** from a signed-out visit, without first matching. Its first step asks for email and a password. I reached the form and stopped before sending a code.

The Cookies page lists several reasons for browser storage but doesn’t mention the signup draft. The deployed code has a draft for progressing through signup. Its shape can include email, username, and a verification token during the flow. I only verified its pre-submission state.

Explain how people reach registration and which data each path collects. Describe the signup draft, what clears it, and when it expires. Near the room join button, explain that signed-in members may show their account name and photo while a guest uses an alias. Use **anonymous** to say something concrete about what the other person sees.

[Public registration form](whisper-wave-journey-screenshots/rooms-account-registration.jpg)

## How reporting and moderation read from the public site

### 4. Give someone a way to report after leaving

The live Report abuse page had no form and two email links. It says someone can report anonymously and asks them to include the alias and approximate time if possible. An ordinary email shares the sender’s address with the recipient. The public path gives someone no in-site way to submit a guest report once they’ve left the conversation.

I’d add a guest report form with optional reply details. Explain what the moderator will receive and what the reported person can see. A confirmation or reference number would help a person know their report reached the team. Keep email as another way to contact the team, and preserve the contrast and focus fixes from the accessibility review.

[Public Report abuse page](https://whisperwave.space/report) · [Email fallback with address masked](whisper-wave-screenshots/report-email.png) · [Reporting design guidance](https://www.esafety.gov.au/industry/safety-by-design/foundations/empowering-users-to-stay-safe-online)

### 5. Explain Leave, Block, and Report at the point of use

The public pages describe immediate blocking and a safe exit. The deployed Whisper report dialog offers a reason, optional details, and **Report & leave**. It says reports are anonymous and the two people won’t be matched for 30 days. The Safety page says moderators may see an alias, message text, and time. “Anonymous” needs to tell the reporter whose view it refers to.

Keep **Leave now** available if reporting fails. Give **Block** and **Report & leave** distinct labels and explain what happens after each one. Before a report is sent, explain what evidence is included, whether the reported person gets a notification, and how long the block or rematch restriction lasts. The 30-day statement in the dialog describes reporting. Verify the duration separately for a normal block.

[Safety page](https://whisperwave.space/safety) · [Report abuse](https://whisperwave.space/report)

### 6. Make room rules and response commitments consistent

- **Moderator availability.** The Venting card showed **Waiting for a moderator** with **Join** in the earlier journey test. The lobby says **Always open**, offers **Join room**, and lists the 18+ rule in its house rules. Before a guest joins, show whether they can enter or post and whether that depends on a moderator being present.
- **Private rooms.** The Terms describe live rooms as public. The Community Guidelines also describe private invite-only rooms with the same rules and reporting. I’d state from the start which rules apply to public rooms and which identities, posts, and moderators are visible in private rooms.
- **Response wording.** Safety says removal is targeted within two hours for certain serious categories. Report abuse says action is taken within two hours for those categories. Both describe a 24-hour acknowledgement and a seven-day resolution period for other complaints, with Report applying the acknowledgement language to every complaint. I’d use one description of what each promise means, when the clock starts, and what acknowledgement or action the reporter sees.
- **Safe mode.** The default feed in this check again included a joke about homelessness and drugs. That makes the name **Safe** hard to interpret. Define what the label covers and apply the same rule to the Home preview. Make **Report** and **Hide** easy to distinguish so users can act on content that falls short.

[Venting lobby](whisper-wave-journey-screenshots/venting-guest-lobby.jpg) · [Community Guidelines](https://whisperwave.space/guidelines) · [Terms](https://whisperwave.space/terms)

## What I’d verify with the team

| Claim | Controlled test |
| --- | --- |
| Leaving ends a session | Use two test participants. Leave and reconnect, and verify what each participant can still see. Check ordinary text and uploaded test images against the retention rules. |
| A report preserves only the expected evidence | Report fixture content in a private test session. Confirm the acknowledgement, what the moderation queue receives, which staff roles can access it, and how the evidence expires. Use a seeded clock to exercise the published retention windows. |
| Block and report prevent further contact | Try each action independently. Verify send behavior, reconnect, repeat matching, and what happens at expiry. Check ordinary Leave and report failure too. |
| Room moderation changes what guests can do | Verify a room that allows guest posting, one waiting for a moderator, and an invite-only room. Test the first-post bot check, report visibility, and mute, kick, and ban effects using fixture participants. |
| Signup and deletion follow the policy | Use a test inbox to complete signup and confirm draft cleanup. With test accounts, verify what happens to persistent DMs, profile data, and any legitimately retained moderation evidence when an account is deleted. |
| Optional services load at the intended point | Compare browser requests before and after ad consent, notification opt-in, and a payment sandbox flow. Confirm the wording and indicators match the behavior. |

My first changes would be explaining retention beside the action that creates it and giving guests a way to report after they’ve left a chat.

Ujjwal Sharma
