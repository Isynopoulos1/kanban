import { test, expect, type Page } from "@playwright/test";

async function waitForBoard(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("column-title-col-backlog")).toBeVisible({
    timeout: 10000,
  });
}

test.describe("Kanban board", () => {
  test("loads with dummy data", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Project Board" })).toBeVisible();
    await expect(page.getByTestId("column-col-backlog")).toBeVisible();
    await expect(page.getByTestId("column-col-todo")).toBeVisible();
    await expect(page.getByTestId("column-col-in-progress")).toBeVisible();
    await expect(page.getByTestId("column-col-review")).toBeVisible();
    await expect(page.getByTestId("column-col-done")).toBeVisible();
    await expect(page.getByText("Design board layout")).toBeVisible();
  });

  test("renames a column", async ({ page }) => {
    await waitForBoard(page);
    await page.getByTestId("column-title-col-backlog").click();
    const input = page.getByLabel("Column title");
    await input.fill("Ideas");
    await input.press("Enter");
    await expect(page.getByTestId("column-title-col-backlog")).toHaveText(/Ideas/);
  });

  test("adds a card to a column", async ({ page }) => {
    await waitForBoard(page);
    const column = page.getByTestId("column-col-done");
    await column.getByLabel("Card title").fill("E2E Test Card");
    await column.getByLabel("Card details").fill("Created by Playwright");
    await column.getByRole("button", { name: "Add card" }).click();
    await expect(page.getByText("E2E Test Card")).toBeVisible();
    await expect(page.getByText("Created by Playwright")).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    await waitForBoard(page);
    const card = page.getByTestId("card-card-1");
    await expect(card).toBeVisible();
    await card.getByLabel("Delete Design board layout").click();
    await expect(page.getByText("Design board layout")).not.toBeVisible();
  });

  test("drags a card to another column", async ({ page }) => {
    await waitForBoard(page);
    const sourceCard = page.getByTestId("card-card-3");
    const targetColumn = page.getByTestId("column-col-done");
    await expect(sourceCard).toBeVisible();
    const dragHandle = sourceCard.getByLabel("Drag Implement drag and drop");
    const sourceBox = await dragHandle.boundingBox();
    const targetBox = await targetColumn.boundingBox();
    if (!sourceBox || !targetBox) throw new Error("Missing bounding boxes");
    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 25 },
    );
    await page.mouse.up();
    await expect(targetColumn.getByText("Implement drag and drop")).toBeVisible();
  });
});
