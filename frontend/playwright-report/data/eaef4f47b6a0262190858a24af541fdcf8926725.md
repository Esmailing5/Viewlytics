# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> homepage has title
- Location: tests\e2e\example.spec.ts:3:5

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- article "Looks like there’s a problem with this site" [ref=e3]:
  - img "Illustration of a fox looking at disconnected network cables." [ref=e5]
  - generic [ref=e7]:
    - heading "Looks like there’s a problem with this site" [level=1] [ref=e8]
    - paragraph [ref=e9]:
      - text: Nightly can’t connect to the server at
      - strong [ref=e10]: localhost:3000
    - generic [ref=e11]:
      - heading "What can you do about it?" [level=3] [ref=e12]
      - paragraph [ref=e13]: Try connecting on a different device. Check your modem or router. Disconnect and reconnect to Wi-Fi.
    - button "Try Again" [ref=e16]:
      - generic [ref=e18]:
        - generic: Try Again
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test('homepage has title', async ({ page }) => {
> 4 |   await page.goto('/');
    |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  5 |   await expect(page).toHaveTitle(/Viewlytics/);
  6 | });
  7 | 
```