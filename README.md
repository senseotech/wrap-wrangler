# wrap-wrangler
Years ago, a website existed that let you measure a gift, plug in the dimensions, and get back the exact rectangle of wrapping paper to cut for a perfect wrap. It disappeared. No replacement was ever made.  A few months later, Wrap Wrangler was built.  Rediscovered, not invented.

## Browser tests

The [GitHub Actions workflow](https://github.com/senseotech/wrap-wrangler/blob/main/.github/workflows/tests.yml) runs on pull requests. Its **Unit and browser tests** check must pass before a pull request can merge into `main`.

```sh
npm ci
npx playwright install chromium webkit
npm run test:browser
```

The test command builds the production app and runs it in Desktop Chrome, Pixel 7 emulation (Chromium), and iPhone 15 emulation (WebKit). To run just the WebKit project, use `npm run test:browser -- --project="mobile webkit"`.

Chromium uses Playwright clipboard permissions. WebKit verifies clipboard contents by pasting into a test field because it denies the suite's calls to `navigator.clipboard.readText()`. The suite runs with one worker because it uses the system clipboard. Print tests inspect the popup and intercept the call to the system print dialog.

The WebKit project exercises viewport and touch emulation on the host. Native iOS clipboard prompts, the software keyboard, and the system print interface require testing in Safari on a physical iPhone.
