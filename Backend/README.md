# Backend Setup

## Environment

Copy `.env.example` to `.env` and fill in the values.

For password reset emails, set these SMTP values:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`

If you are using SendGrid, use `apikey` as the SMTP username and your SendGrid API key as the password.

### SendGrid example

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
MAIL_FROM=PrepDost <verified-sender@your-domain.com>
FRONTEND_URL=http://localhost:5174
```

If you only want to test locally, leave `SMTP_*` empty and the backend will print the reset verification code in the terminal.

## Reset Password Flow

- `POST /api/auth/forgot-password` sends a 6-digit verification code.
- `POST /api/auth/reset-password` verifies email + code and updates the password.

If `SMTP_*` is not configured, the backend logs the verification code instead of sending mail.