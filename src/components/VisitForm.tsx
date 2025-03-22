import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { Visit, Patient, FieldCareDB } from '../db/database';
import { SyncService } from '../services/syncService';

const db = new FieldCareDB();
const syncService = SyncService.getInstance();

interface VisitFormProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  visit?: Visit;
  onSave: () => void;
}

export function VisitForm({ open, onClose, patient, visit, onSave }: VisitFormProps) {
  const [formData, setFormData] = useState<Partial<Visit>>({
    patientId: patient.id,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    vitalSigns: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      oxygenSaturation: ''
    },
    medications: [],
    syncStatus: 'pending'
  });

  useEffect(() => {
    if (visit) {
      setFormData(visit);
    }
  }, [visit]);

  const handleChange = (field: keyof Visit) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleVitalSignChange = (field: keyof Visit['vitalSigns']) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      vitalSigns: {
        ...formData.vitalSigns,
        [field]: event.target.value
      }
    });
  };

  const handleSubmit = async () => {
    try {
      let visitId: number;
      if (visit?.id) {
        await db.visits.update(visit.id, formData);
        visitId = visit.id;
      } else {
        visitId = await db.visits.add(formData as Visit);
      }
      
      await syncService.markForSync(visitId);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving visit:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New Visit for {patient.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Vital Signs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Blood Pressure"
                  value={formData.vitalSigns?.bloodPressure}
                  onChange={handleVitalSignChange('bloodPressure')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temperature"
                  value={formData.vitalSigns?.temperature}
                  onChange={handleVitalSignChange('temperature')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Heart Rate"
                  value={formData.vitalSigns?.heartRate}
                  onChange={handleVitalSignChange('heartRate')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Oxygen Saturation"
                  value={formData.vitalSigns?.oxygenSaturation}
                  onChange={handleVitalSignChange('oxygenSaturation')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange('notes')}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Visit
        </Button>
      </DialogActions>
    </Dialog>
  );
} 