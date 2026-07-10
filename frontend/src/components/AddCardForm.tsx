"use client";

type AddCardFormProps = {
  onAdd: (title: string, details: string) => void;
};

export function AddCardForm({ onAdd }: AddCardFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const details = (form.elements.namedItem("details") as HTMLTextAreaElement).value.trim();
    if (!title) return;
    onAdd(title, details);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <input
        name="title"
        type="text"
        placeholder="Card title"
        aria-label="Card title"
        className="form-input w-full rounded-[10px] px-3 py-2.5 text-sm"
      />
      <textarea
        name="details"
        placeholder="Details (optional)"
        aria-label="Card details"
        rows={2}
        className="form-input w-full resize-none rounded-[10px] px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        className="add-btn-ghost w-full rounded-[10px] px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
      >
        Add card
      </button>
    </form>
  );
}
