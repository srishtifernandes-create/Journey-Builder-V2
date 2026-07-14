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
      if (msg.text().includes('Maximum update depth exceeded')) {
        hasErrors = true;
      }
    }
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  try {
    console.log('1. Adding a Consent Screen node...');
    const addBtn = page.locator('button[title="Add Consent Screen"]');
    await addBtn.click();
    await page.waitForTimeout(500);

    console.log('2. Testing Selection and Placeholder Inspector...');
    // Select the newly added node on canvas
    await page.locator('.react-flow__node').first().click();
    await page.waitForTimeout(500);
    
    // Verify the inspector placeholder text
    const asideContent = await page.locator('aside').textContent();
    console.log('Inspector content:', asideContent);
    if (!asideContent.includes('Configuration for this node will be implemented in Phase 2.')) {
      throw new Error('Placeholder inspector message not found.');
    }
    
    console.log('3. Testing Node Count...');
    const nodeCount = await page.locator('.react-flow__node').count();
    console.log(`Rendered nodes: ${nodeCount}`);
    if (nodeCount < 1) {
      throw new Error('Consent Screen node was not created successfully.');
    }

    console.log('4. Testing Reload (Persistence)...');
    await page.reload();
    await page.waitForTimeout(1000);
    
    const reloadedNodeCount = await page.locator('.react-flow__node').count();
    console.log(`Rendered nodes after reload: ${reloadedNodeCount}`);
    if (reloadedNodeCount < 1) {
      throw new Error('Nodes were not persisted across reload.');
    }
    
    console.log('5. Testing Delete...');
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
      console.log('SUCCESS: All Phase 1 Authoring steps completed without errors.');
    }

  } catch (e) {
    console.error('Error during test:', e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
