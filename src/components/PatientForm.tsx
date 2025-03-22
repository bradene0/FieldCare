import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { Patient } from '../db/database';
import { useDatabase } from '../db/DatabaseContext';

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  patient?: Patient;
  onSave: () => void;
}

export function PatientForm({ open, onClose, patient, onSave }: PatientFormProps) {
  const { db } = useDatabase();
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({
        name: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: ''
      });
    }
  }, [patient, open]);

  const handleChange = (field: keyof Patient) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    // Check if all fields are empty
    const isAllEmpty = Object.values(formData).every(value => !value);
    if (isAllEmpty) {
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.dateOfBirth || !formData.address || !formData.phoneNumber) {
      return;
    }

    try {
      if (patient?.id) {
        await db.patients.update(patient.id, formData);
      } else {
        await db.patients.add(formData as Patient);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{patient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
} 