export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    cancelText: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
  }
  