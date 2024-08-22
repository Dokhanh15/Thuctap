import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ConfirmDialogProps } from "src/types/confirm";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  cancelText,
  confirmText,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            backgroundColor: "blue",
            color: "white",
            "&:hover": {
              backgroundColor: "darkblue",
              color: "white",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
