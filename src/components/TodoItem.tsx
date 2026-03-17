'use client';

import { useState } from 'react';
import styles from './TodoItem.module.css';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onEdit: (id: number, title: string, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id, todo.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this todo?')) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      await onEdit(todo.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      {isEditing ? (
        <div className={styles.editMode}>
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className={styles.editInput}
            maxLength={500}
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className={styles.editTextarea}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className={styles.editActions}>
            <button
              onClick={handleEditSave}
              disabled={loading || !editTitle.trim()}
              className={styles.saveBtn}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleEditCancel}
              disabled={loading}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.viewMode}>
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`${styles.checkbox} ${todo.completed ? styles.checkboxChecked : ''}`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed && <span className={styles.checkmark}>✓</span>}
          </button>
          <div className={styles.content}>
            <p className={styles.todoTitle}>{todo.title}</p>
            {todo.description && (
              <p className={styles.todoDescription}>{todo.description}</p>
            )}
            <span className={styles.date}>{formattedDate}</span>
          </div>
          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className={styles.editBtn}
              aria-label="Edit todo"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={styles.deleteBtn}
              aria-label="Delete todo"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
