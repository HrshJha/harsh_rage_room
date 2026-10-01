# Security and privacy

Bot token, chat ID, HMAC secret, hCaptcha secret and Redis URL belong only in Render environment variables. `.env` is ignored; example files contain no credentials. Rotate a bot token if it was ever shared or committed.

The API validates JSON bodies and enforces a 4 KB cap, verifies signed sessions, sanitises name/reason/text, HTML-escapes Telegram values, and uses explicit CORS origins. hCaptcha failure rejects issuance. An actual provider outage allows at most two sessions per ten-minute hashed-IP window. Failed verification never blocks local gameplay.

Short-lived operational state contains keyed IP hashes, random session/event IDs, counters and send locks. No IP, precise location, user-agent, raw visitor messages or bot credentials are written to logs. Display names and optional complaints go only to the configured Telegram chat. No analytics database or cookies.

The frontend uses inline style attributes for GSAP and variable meter widths; CSP permits inline styles but not inline scripts. API origins are scoped to Render by the shipped CSP; use an exact custom domain when deploying one.

Live readiness checks requiring owner access: confirm the chat is correct, verify hCaptcha hostnames, inspect deployment headers, check real Telegram delivery, and exercise the notification kill switch. These are not represented as completed by local tests.
