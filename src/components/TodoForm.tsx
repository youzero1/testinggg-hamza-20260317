'use client';

import { useState, FormEvent } from 'react';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setExpanded(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={styles.input}
          onFocus={() => setExpanded(true)}
          disabled={submitting}
          maxLength={500}
          required
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className={styles.submitBtn}
        >
          {submitting ? '...' : '+ Add'}
        </button>
      </div>
      {expanded && (
        <div className={styles.expandedArea}>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className={styles.textarea}
            rows={3}
            disabled={submitting}
          />
          <button
            type="button"
            onClick={() => { setExpanded(false); setDescription(''); }}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
