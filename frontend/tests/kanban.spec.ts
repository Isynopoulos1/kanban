import { test, expect } from "@playwright/test";

test.describe("Kanban Board Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display 5 columns with initial dummy data", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("KanbanBoard");

    const columns = ["Backlog", "To Do", "In Progress", "Review", "Done"];
    for (const col of columns) {
      await expect(page.locator(`input[value="${col}"]`)).toBeVisible();
    }

    const cardCounts = page.locator("[data-testid='card-count']");
    await expect(cardCounts).toHaveCount(5);
  });

  test("should allow renaming a column", async ({ page }) => {
    const backlogInput = page.locator("[data-testid='column-title-input-col-backlog']");
    await expect(backlogInput).toHaveValue("Backlog");

    await backlogInput.focus();
    await backlogInput.fill("Refactored Backlog");
    await backlogInput.blur();

    await expect(backlogInput).toHaveValue("Refactored Backlog");
  });

  test("should support adding a new card to a specific column", async ({ page }) => {
    const addCardBtn = page.locator("[data-testid='add-card-btn-col-backlog']");
    await addCardBtn.click();

    const modal = page.locator("role=dialog");
    await expect(modal).toBeVisible();

    await page.locator("#card-title").fill("Write integration tests");
    await page.locator("#card-details").fill("Must cover dragging and dropping between columns");

    await page.locator("#btn-submit-card").click();

    await expect(modal).not.toBeVisible();

    const backlogCards = page.locator("[data-testid='column-cards-col-backlog']");
    await expect(backlogCards).toContainText("Write integration tests");
    await expect(backlogCards).toContainText("Must cover dragging and dropping between columns");
  });

  test("should allow deleting a card from a column", async ({ page }) => {
    const card = page.locator("#card-card-7");
    await expect(card).toBeVisible();

    const deleteBtn = page.locator("[data-testid='delete-card-card-7']");
    await deleteBtn.click({ force: true });

    await expect(card).not.toBeVisible();
  });

  test("should support dragging a card from one column to another", async ({ page }) => {
    const card = page.locator("#card-card-1");
    await expect(card).toBeVisible();

    const todoCards = page.locator("[data-testid='column-cards-col-todo']");
    const initialText = await todoCards.innerText();
    expect(initialText).not.toContain("Research target audience");

    await card.dragTo(todoCards);

    await expect(todoCards).toContainText("Research target audience");
  });
});
