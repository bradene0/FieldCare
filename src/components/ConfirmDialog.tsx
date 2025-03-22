import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  requireConfirmation?: boolean;
  confirmationText?: string;
}

export function ConfirmDialog({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  requireConfirmation = false,
  confirmationText = ''
}: ConfirmDialogProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) {
      setInputText('');
      setError(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (requireConfirmation && inputText !== confirmationText) {
      setError(true);
      return;
    }
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title" sx={{ color: 'error.main' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ mb: 2 }}>
          {message}
        </DialogContentText>
        {requireConfirmation && (
          <Box sx={{ mt: 2 }}>
            <DialogContentText color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
              Please type "{confirmationText}" to confirm deletion
            </DialogContentText>
            <TextField
              fullWidth
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(false);
              }}
              error={error}
              helperText={error ? "Patient name doesn't match" : ''}
              placeholder="Type patient name here"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={requireConfirmation && inputText !== confirmationText}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 