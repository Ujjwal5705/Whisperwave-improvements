# Testing the public journeys on Whisper Wave

On Pricing, I picked the weekly pass, opened Sign in, and pressed Back. The monthly pass was selected when the page returned. I went through the other public handoffs the same way, following the links from the homepage, Rooms, and Chats and checking where they actually took me.

I ran these checks on 22 November 2026 in fresh Chromium sessions, mainly at 390 × 844, with a desktop sign-in check at 1440 × 900. The browser blocked write requests and live socket traffic. The results cover actual public screens and navigation up to the point of matching, joining, signing in, or paying.

## What worked

| Journey | What I saw |
| --- | --- |
| Homepage → Find a stranger | The button opened `/whisper` and showed the guest form. |
| Alias and age checks | The button stayed disabled with a blank form, an alias without the age confirmation, and an invalid alias with age confirmed. A valid alias and the 18+ checkbox enabled it with gender and vibes blank. |
| Selecting vibes | I selected three vibes. The fourth was disabled. Removing one brought the counter back to two. |
| Room search | Searching for “venting” showed just Venting. An unmatched query showed “Nothing matches” and a way to clear the search and filters. Clearing them restored the room list. |
| Rooms → Opening later → Late Night | The filter showed Late Night. Its lobby said the room was closed and gave its next opening time. **Browse rooms** returned me to the directory. |
| Rooms → Venting → All rooms | The room card opened the guest lobby with an alias field, color choices, and house rules. **All rooms** took me back to the directory. |
| Chats → Sign in | The signed-out Chats screen linked to `/auth`. The sign-in form showed username and password fields. |
| Sign in → Forgot password | The recovery screen opened. Clicking **Send reset link** with an empty field showed “Email is required” without a write request. A malformed address was invalid in the browser. |
| Account setup | The registration screen at `/auth?mode=register` showed step 1 of 3 and a **Send code** action. |
| Pricing → Sign in to buy | The plan selector changed from one month to one week, and **Sign in to buy** opened the sign-in screen. The selection changed when I went back, as described below. |
| Desktop homepage → Log in | The labeled link opened the sign-in form. |

[Room search with a clear-filters action](whisper-wave-journey-screenshots/rooms-search-empty.jpg)

## Findings

### 1. Pricing loses the selected pass on Back

I selected the one-week Spark Pass at ₹49, opened **Sign in to buy**, and then used the browser’s Back button. Pricing came back with the one-month ₹99 plan selected. The sign-in link was `/auth` and the navigation state I inspected carried no plan selection. The duration buttons also exposed no `aria-pressed` or `aria-selected` state on the checked page.

Keep the selected plan through Sign in and through browser Back. At confirmation, show the same duration and total. Native radio controls would make the chosen duration available to screen readers. Another accessible control with a programmatic selected state could work too. The price change here was observed on browser Back before signing in. The return after successful authentication and payment still need a test.

[One-week plan before Sign in](whisper-wave-journey-screenshots/pricing-week-selected.jpg) · [One-month plan after Back](whisper-wave-journey-screenshots/pricing-after-return.jpg)

### 2. The room directory sends new users to the wrong account screen

The Rooms card says “Make an account” and takes you to `/auth`, where the visible screen says **Sign in** and asks for a username and password. I had to choose **Create an account** on that screen to reach `/auth?mode=register`.

Link **Make an account** directly to registration. After account creation, check that the visitor can return to the room they came from.

[What opens from Make an account](whisper-wave-journey-screenshots/rooms-account-sign-in.jpg) · [Registration after the extra step](whisper-wave-journey-screenshots/rooms-account-registration.jpg)

### 3. Tab reaches registration fields while Sign in is on screen

I opened Sign in and pressed Tab through the form. After **Create an account**, focus moved to the registration email field, the new password fields, and **Send code**. The page was still in Sign in mode. I hadn’t activated **Create an account**.

Keep only the active form in the keyboard order and accessibility tree. When the user switches modes, move focus to the active form heading or first field. Check forward and backward tab order in both modes.

### 4. A room can be open and waiting for a moderator at the same time

The Venting card showed **Waiting for a moderator** next to **Join**. The lobby said **Always open** and also offered **Join room**. The rule about age appeared in the lobby’s house rules. A guest can get to the lobby, but the screens leave it unclear whether they can enter or post before a moderator arrives.

Give opening hours, moderator availability, and guest posting separate labels on the room card and lobby. If guest posting is held until a moderator arrives, explain that before the join action.

[Venting lobby](whisper-wave-journey-screenshots/venting-guest-lobby.jpg) · [Directory card from the UI review](whisper-wave-screenshots/rooms.jpg)

### 5. The alias error needs to stay connected to the field

Entering a one-character alias showed “Username must be at least 3 characters.” The label says **Your alias**. The field got `aria-invalid="true"` and had no `aria-describedby` association with the visible error.

Use “Alias” in the label and in the error. Associate the error with the field and verify that it’s announced when the user tabs away or tries again.

[Invalid alias in the guest form](whisper-wave-journey-screenshots/chat-alias-error.jpg)

### 6. A missing room has a useful recovery screen and the wrong HTTP status

I opened a room URL with a nonexistent name. The browser showed **Room not found** and offered **Browse rooms**. The document response was HTTP 200. I’d keep the recovery link and return 404 for a missing room.

## Test coverage that needs a controlled environment

| Journey | What still needs to be exercised |
| --- | --- |
| Live Whisper | Two isolated users enter the queue, match, send messages in both directions, reconnect, cancel a search, and leave. Verify what each person sees when the other leaves. |
| Keep and sign in | Both users opt in, complete sign-in, and find the saved DM. Check timing, cancellation, account recovery, and whether earlier messages carry over. |
| Room participation | A guest joins and posts in a private test room. Check age and moderation rules and what changes when a moderator arrives. |
| Block and report | Verify what each participant sees, whether communication stops, and whether a test report reaches a moderation queue with the expected evidence. |
| Password recovery and registration | Use test inboxes to verify code and reset-link delivery, expiry, retries, and successful continuation. |
| Checkout | Use a payment sandbox to test plan return after sign-in, the confirmation amount, success, cancellation, failure, and whether the pass is applied exactly once. |

To finish the account and live tests, I’d use two controlled participants, test inboxes, and a payment sandbox.

Ujjwal Sharma
