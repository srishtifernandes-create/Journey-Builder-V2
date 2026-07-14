import { test, expect, chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  
  // wait for the app to load
  await page.waitForTimeout(2000);
  
  // start tracking errors
  page.on('pageerror', (err) => {
    console.log('PAGE ERROR:', err.message);
  });
  
  console.log('App loaded. Finding node palette...');
  
  try {
    // Dismiss FTUE if present
    const btn = await page.$('button:has-text("Get Started")');
    if (btn) await btn.click();
    
    // Drag and drop OTP node
    const src = await page.$('div:has-text("OTP Verification")');
    const dst = await page.$('.react-flow__pane');
    
    if (src && dst) {
      console.log('Found source and destination. Dragging...');
      const srcBox = await src.boundingBox();
      const dstBox = await dst.boundingBox();
      
      await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(dstBox.x + dstBox.width / 2, dstBox.y + dstBox.height / 2, { steps: 5 });
      await page.mouse.up();
      
      await page.waitForTimeout(2000);
      console.log('Drag and drop complete.');
    } else {
      console.log('Could not find source or destination.');
    }
  } catch (e) {
    console.log('Error during script:', e);
  }
  
  await browser.close();
})();
