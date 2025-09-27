import React, { useRef } from 'react';
import Modal from './Modal';
import { Button } from './Button';

/**
 * ConfirmDialog
 * Props:
 *  open: boolean
 *  title: string
 *  description?: string
 *  confirmLabel?: string (default 'Confirmar')
 *  cancelLabel?: string (default 'Cancelar')
 *  variant?: primary | danger
 *  loading?: boolean
 *  onConfirm: () => void | Promise<void>
 *  onCancel: () => void
 */
export default function ConfirmDialog({
  open,
  title = 'Confirmar acción',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  disableAutoClose = false,
}) {
  const confirmButtonRef = useRef(null);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    const result = onConfirm();
    if (result && typeof result.then === 'function') {
      try { await result; } catch { /* swallow */ }
    }
    if (!disableAutoClose) {
      onCancel?.();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      initialFocusRef={confirmButtonRef}
      actions={null}
    >
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
        <Button
          ref={confirmButtonRef}
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
