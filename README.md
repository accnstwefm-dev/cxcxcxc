# Captcha Gate

A server-side CAPTCHA verification gate built with Next.js for AWS Amplify.
Blocks bots, scrapers, and automated scanners from reaching your backend.

**Zero cookies. Zero external dependencies.** The CAPTCHA answer is encrypted
into a token that travels in the request body — nothing is stored in the browser.

## Setup

### 1. Configure

Open `config.js` and set your values:

```js
targetUrl: "https://your-real-backend.example.com",
secret: "your-random-secret-here",
```

Generate a secret:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Test locally

```
npm install
npm run dev
```

Open http://localhost:3000

### 3. Deploy to AWS Amplify

1. Push this project to GitHub, GitLab, Bitbucket, or CodeCommit.
2. Open the AWS Amplify console and connect your repository.
3. Amplify auto-detects the Next.js framework. Deploy.
4. Your gate is live at `https://branch.xxxxxxxxxx.amplifyapp.com`.

## How it works

1. Visitor loads the page.
2. Server generates a CAPTCHA image (SVG) and encrypts the answer into a token (AES-256-GCM).
3. Both are sent to the browser. The token is held in memory, not stored anywhere.
4. Visitor submits their answer along with the token.
5. Server decrypts the token, compares the answer, and redirects on success.

No cookies, no sessions, no database. Fully stateless.

## Configuration reference

| Key                    | Default                | Description                         |
|------------------------|------------------------|-------------------------------------|
| `targetUrl`            | —                      | Redirect destination after success  |
| `secret`               | —                      | Encryption key (32+ chars)          |
| `captcha.length`       | `6`                    | Number of characters                |
| `captcha.expiry`       | `180`                  | Seconds before token expires        |
| `captcha.caseSensitive`| `false`                | Require exact case match            |
| `branding.title`       | `"Verify you're human"`| Heading text                        |
| `branding.subtitle`    | `"Enter the…"`         | Subheading text                     |
