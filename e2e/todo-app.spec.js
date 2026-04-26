import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing todos by deleting them
    await page.goto('/');
    const deleteButtons = page.locator('[data-testid="delete-button"]');
    const count = await deleteButtons.count();
    for (let i = 0; i < count; i++) {
      await deleteButtons.first().click();
      await page.waitForTimeout(100); // Small wait for UI update
    }
  });

  test('Load app and show empty state', async ({ page }) => {
    await page.goto('/');

    // Check that the app loads
    await expect(page.locator('h1')).toHaveText('Todo App');

    // Check empty state message
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  });

  test('Create a todo and verify it appears', async ({ page }) => {
    await page.goto('/');

    // Add a new todo
    await page.fill('[data-testid="todo-input"]', 'Test todo item');
    await page.press('[data-testid="todo-input"]', 'Enter');

    // Wait for the todo to appear
    await page.waitForSelector('[data-testid="todo-description"]');

    // Verify it appears using scoped locator
    const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Test todo item' });
    await expect(todoItem).toBeVisible();

    // Verify checkbox and delete button are present
    await expect(todoItem.locator('[data-testid="todo-checkbox"]')).toBeVisible();
    await expect(todoItem.locator('[data-testid="delete-button"]')).toBeVisible();
  });

  test('Mark todo as complete and verify visual state', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.fill('[data-testid="todo-input"]', 'Complete me');
    await page.press('[data-testid="todo-input"]', 'Enter');
    await page.waitForSelector('[data-testid="todo-description"]');

    // Get the todo item using scoped locator
    const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Complete me' });

    // Mark as complete
    await todoItem.locator('[data-testid="todo-checkbox"]').click();

    // Wait for state update
    await page.waitForTimeout(200);

    // Verify visual changes (completed class on item)
    const completedItem = todoItem.filter({ hasClass: 'completed' });
    await expect(completedItem).toBeVisible();
    await expect(completedItem.locator('[data-testid="todo-description"]')).toHaveText('Complete me');
  });

  test('Delete todo and verify removal', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.fill('[data-testid="todo-input"]', 'Delete me');
    await page.press('[data-testid="todo-input"]', 'Enter');
    await page.waitForSelector('[data-testid="todo-description"]');

    // Verify it exists using scoped locator
    const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Delete me' });
    await expect(todoItem).toBeVisible();

    // Delete it
    await todoItem.locator('[data-testid="delete-button"]').click();

    // Wait for removal
    await page.waitForTimeout(200);

    // Verify it's gone
    await expect(todoItem).not.toBeVisible();

    // Should show empty state again
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  });

  test('Refresh page and verify todo persists', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.fill('[data-testid="todo-input"]', 'Persistent todo');
    await page.press('[data-testid="todo-input"]', 'Enter');
    await page.waitForSelector('[data-testid="todo-description"]');

    // Mark as complete
    await page.click('[data-testid="todo-checkbox"]');
    await page.waitForTimeout(200);

    // Verify it's completed before refresh
    const completedItem = page.locator('[data-testid="todo-item"]').filter({ hasClass: 'completed' });
    await expect(completedItem).toBeVisible();

    // Refresh the page
    await page.reload();

    // Wait for load
    await page.waitForSelector('[data-testid="todo-description"]');

    // Verify todo still exists using scoped locator
    const persistentTodoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: 'Persistent todo' });
    await expect(persistentTodoItem).toBeVisible();

    // Verify it's still completed
    const persistedCompletedItem = persistentTodoItem.filter({ hasClass: 'completed' });
    await expect(persistedCompletedItem).toBeVisible();
  });
});
