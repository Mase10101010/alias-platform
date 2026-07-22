import { useEffect } from 'react';

type UseFloorKeyboardOptions = {
  selectedCount: number;
  canUndo: boolean;
  canRedo: boolean;
  disabled?: boolean;
  onUndo: () => void | Promise<void>;
  onRedo: () => void | Promise<void>;
  onDuplicate: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
};

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

export function useFloorKeyboard({
  selectedCount,
  canUndo,
  canRedo,
  disabled = false,
  onUndo,
  onRedo,
  onDuplicate,
  onDelete,
}: UseFloorKeyboardOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (disabled || isEditableElement(event.target)) {
        return;
      }

      const modifierPressed = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      if (modifierPressed && key === 'z') {
        event.preventDefault();

        if (event.shiftKey) {
          if (canRedo) {
            void onRedo();
          }
        } else if (canUndo) {
          void onUndo();
        }

        return;
      }

      if (modifierPressed && key === 'y') {
        event.preventDefault();

        if (canRedo) {
          void onRedo();
        }

        return;
      }

      if (modifierPressed && key === 'd') {
        if (selectedCount === 0) {
          return;
        }

        event.preventDefault();
        void onDuplicate();
        return;
      }

      if (
        event.key !== 'Delete' &&
        event.key !== 'Backspace'
      ) {
        return;
      }

      if (selectedCount === 0) {
        return;
      }

      event.preventDefault();
      void onDelete();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedCount,
    canUndo,
    canRedo,
    disabled,
    onUndo,
    onRedo,
    onDuplicate,
    onDelete,
  ]);
}