import React, { useState, useEffect, useRef } from "react";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, details: string) => void;
  columnTitle: string;
}

export default function CardModal({ isOpen, onClose, onSubmit, columnTitle }: CardModalProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDetails("");
      // Small timeout to allow render animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, details);
    onClose();
  };

  // Close on Escape key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      id="card-modal-overlay"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add Card to <span>{columnTitle}</span></h2>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} id="add-card-form">
          <div className="form-group">
            <label htmlFor="card-title">Title</label>
            <input
              type="text"
              id="card-title"
              ref={inputRef}
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Write integration tests"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="card-details">Details</label>
            <textarea
              id="card-details"
              className="form-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context and requirements..."
            />
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={onClose}
              id="btn-cancel-card"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-submit"
              id="btn-submit-card"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
