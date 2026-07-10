import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCardForm } from "./AddCardForm";

describe("AddCardForm", () => {
  it("does not submit with empty title", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddCardForm onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: "Add card" }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("submits title and details", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddCardForm onAdd={onAdd} />);
    await user.type(screen.getByLabelText("Card title"), "My Card");
    await user.type(screen.getByLabelText("Card details"), "Some details");
    await user.click(screen.getByRole("button", { name: "Add card" }));
    expect(onAdd).toHaveBeenCalledWith("My Card", "Some details");
  });

  it("clears form after submit", async () => {
    const user = userEvent.setup();
    render(<AddCardForm onAdd={() => {}} />);
    const titleInput = screen.getByLabelText("Card title") as HTMLInputElement;
    await user.type(titleInput, "My Card");
    await user.click(screen.getByRole("button", { name: "Add card" }));
    expect(titleInput.value).toBe("");
  });
});
