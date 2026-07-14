import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let hasErrors = false;
  page.on('pageerror', (err) => {
    console.error('PAGE ERROR:', err.message);
    hasErrors = true;
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE ERROR:', msg.text());
      // React warnings or errors
      if (msg.text().includes('Maximum update depth exceeded')) {
        hasErrors = true;
      }
    }
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  try {
    console.log('1. Adding nodes from Screen Flow...');
    // We are on Screen Flow by default. Let's click the Add button twice.
    const addBtn = page.locator('button[title="Add Screen"]');
    await addBtn.click();
    await page.waitForTimeout(500);
    await addBtn.click();
    await page.waitForTimeout(500);

    console.log('2. Testing Selection and Inspector (Rename)...');
    // Select Welcome screen (first node on canvas)
    await page.locator('.react-flow__node').first().click();
    await page.waitForTimeout(500);
    
    // Type in config
    const titleInput = page.locator('aside input').first();
    await titleInput.fill('Welcome Onboarding');
    await page.waitForTimeout(500);
    
    console.log('3. Testing Reconnect (Edges)...');
    // We cannot easily test drag-and-drop edges with Playwright without exact coordinates on handles,
    // but we can verify that the nodes are rendered and the app hasn't crashed.
    const nodeCount = await page.locator('.react-flow__node').count();
    console.log(`Rendered nodes: ${nodeCount}`);
    if (nodeCount < 2) {
      throw new Error('Nodes were not created successfully.');
    }

    console.log('4. Testing Reload (Persistence)...');
    await page.reload();
    await page.waitForTimeout(1000);
    
    const reloadedNodeCount = await page.locator('.react-flow__node').count();
    console.log(`Rendered nodes after reload: ${reloadedNodeCount}`);
    if (reloadedNodeCount < 2) {
      throw new Error('Nodes were not persisted across reload.');
    }
    
    console.log('5. Testing Delete...');
    // Click node and press backspace
    await page.locator('.react-flow__node').first().click();
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(500);
    
    const nodeCountAfterDelete = await page.locator('.react-flow__node').count();
    console.log(`Rendered nodes after delete: ${nodeCountAfterDelete}`);
    if (nodeCountAfterDelete >= reloadedNodeCount) {
      throw new Error('Node was not deleted.');
    }

    if (hasErrors) {
      console.error('FAILED: Page or Console errors were detected.');
      process.exit(1);
    } else {
      console.log('SUCCESS: All M1 Authoring steps completed without errors.');
    }

  } catch (e) {
    console.error('Error during test:', e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
