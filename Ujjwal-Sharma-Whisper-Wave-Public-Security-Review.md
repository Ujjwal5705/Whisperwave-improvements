# Public security checks for Whisper Wave

I checked the public site’s transport, browser protections, guest cookie, signed-out profile response, and security contact route on 23 November 2026. The site has a useful baseline. HTTPS and the main browser protections were present across the sampled pages. I’d fix the public security contact, review why the guest cookie is marked for cross-site use, and simplify the browser policy.

This was a read-only review of public responses and deployed frontend code. I used ordinary HTTPS requests and standard TLS handshakes. Verifying account isolation, authenticated sessions, file access, and payments requires an authorized test environment.

## Checks that passed

| Check | Observed result |
| --- | --- |
| HTTP redirect | The bare domain returned HTTP 308 and redirected to its HTTPS homepage. |
| TLS and certificate | TLS 1.2 and TLS 1.3 both negotiated successfully. Hostname and certificate-chain verification passed. The sampled certificate was valid through 13 February 2027 UTC. |
| HSTS | The sampled HTTPS responses set a one-year lifetime and included subdomains. |
| Cross-site framing restrictions | Public HTML sent `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN`. |
| Content type and form restrictions | Responses included `X-Content-Type-Options: nosniff`. The HTML policy restricts form actions and base URLs to the same origin, disables object embedding, and disallows inline script event handlers. |
| Signed-out profile access | The profile request used by the app returned HTTP 401 without credentials. |
| Guest cookie | The same response issued a host-only guest identifier with `Secure` and `HttpOnly`, scoped to `/` with a 30-day lifetime. Cookie values were excluded from the report. |

I checked eight public page routes along with the profile response, the documented disclosure URL, and two entry assets. The profile check is evidence for that signed-out request. Cross-account access still needs its own tests. [OWASP HTTP header guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) · [OWASP session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

## What I’d change

### 1. Fix the advertised security contact route

The public `/.well-known/security.txt` URL returned HTTP 200 and `text/html`. Its response body matched the homepage app shell. A person or tool looking for the disclosure file won’t get contact instructions from that response.

I’d serve a real UTF-8 plain-text file at that URL, with a security contact and expiry. Add a short disclosure policy so people know where to report a concern privately. Check the deployed content type and file contents to make sure the app’s fallback routing leaves this path alone. [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)

### 2. Narrow the guest cookie when the product can

The anonymous `gid` cookie has `SameSite=None`, which permits cross-site sending where the browser allows it. The secure flags and host-only scope are useful. I’d confirm whether a third-party integration actually needs this guest identifier across sites. If it doesn’t, test `SameSite=Lax` in staging and verify that guest continuity and sign-in still work.

Treat the guest identifier as a way to recognize a browser. Keep server-side authorization and protections for state changes in place regardless of cookie flags. The test observed the guest cookie only. Signed-in access and refresh cookies need separate review. [OWASP session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### 3. Make the resource policy easier to maintain

The script policy names specific providers. Image, font, and style directives also allow the entire HTTPS scheme, and the style policy permits inline styles. I’d inventory what the public entry pages, chat, sign-in, and checkout actually load. Replace broad allowances where a smaller list works, and test the new policy in report-only mode before enforcing it.

The browser also blocked a Cloudflare beacon injected into the page. I’d remove that script if it’s unused, or make an explicit decision about allowing it and what it should measure. Keep the script policy deliberate as providers change. [OWASP Content Security Policy guidance](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) · [Funnel review](Ujjwal-Sharma-Whisper-Wave-Funnel-Review.md)

### 4. Use one referrer policy and set browser permissions deliberately

The homepage response sent `Referrer-Policy: no-referrer`. Its HTML also contains a referrer meta tag with `strict-origin-when-cross-origin`. I’d use one policy that matches the product’s privacy intent and check the effective behavior for outbound links and integrations.

The sampled pages had no `Permissions-Policy` header. I’d check which browser features are needed and explicitly restrict the ones the product doesn’t use. Test supported file attachments and any integrations before enforcing it. [W3C Referrer Policy](https://www.w3.org/TR/referrer-policy/) · [W3C Permissions Policy](https://www.w3.org/TR/permissions-policy/)

### 5. Review where the signup verification state lives

The deployed signup code saves a draft in browser local storage. Its schema allows a temporary signup verification token, and the client clears stale token state when reading the draft after 30 minutes. The earlier public form check reached signup before sending a code and saw an empty token field in the draft.

I’d reduce the sensitive state stored in script-readable storage. Review whether signup can use short-lived server-bound state and make sure expiry and single use are enforced by the server. Test expiry, completion, and cleanup with a test inbox. [OWASP session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) · [Privacy review](Ujjwal-Sharma-Whisper-Wave-Privacy-and-Moderation-Review.md)

## What an end-to-end review still needs

| Area | What I’d verify with the team |
| --- | --- |
| Account access | With two fixture accounts, each account only sees its permitted chats, saved items, and private rooms. Staff pages and actions require the appropriate role. |
| Session lifecycle | Signup and reset codes expire as designed. Login, refresh, logout, and account deletion change access as expected. Check cache directives on authenticated responses containing personal data. |
| Chat, rooms, and media | Only the intended participants can read messages and attachments. Leaving, blocking, joining private rooms, and moderation change access consistently across the browser and server. |
| Payment and passes | In the payment sandbox, the checkout amount and pass duration agree, and the pass is granted only after the payment provider confirms it. |
| Operational controls | Review rate limits, dependency advisories, secret handling, monitoring, and evidence retention with the people who operate the service. |

Ujjwal Sharma
