import { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, ExpandMore as ExpandMoreIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Patient, Visit } from '../db/database';
import { useDatabase } from '../db/DatabaseContext';
import { PatientForm } from './PatientForm';
import { VisitForm } from './VisitForm';
import { ConfirmDialog } from './ConfirmDialog';

export function PatientList() {
  const { db } = useDatabase();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [selectedVisit, setSelectedVisit] = useState<Visit | undefined>();
  const [expandedPatient, setExpandedPatient] = useState<number | false>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const loadData = async () => {
    try {
      const allPatients = await db.patients.toArray();
      const allVisits = await db.visits.toArray();
      setPatients(allPatients);
      setVisits(allVisits);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPatient = () => {
    setSelectedPatient(undefined);
    setIsPatientFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientFormOpen(true);
  };

  const handleAddVisit = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedVisit(undefined);
    setIsVisitFormOpen(true);
  };

  const handleEditVisit = (visit: Visit) => {
    const patient = patients.find(p => p.id === visit.patientId);
    if (patient) {
      setSelectedPatient(patient);
      setSelectedVisit(visit);
      setIsVisitFormOpen(true);
    }
  };

  const getPatientVisits = (patientId: number) => {
    return visits.filter(visit => visit.patientId === patientId);
  };

  const handleAccordionChange = (patientId: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPatient(isExpanded ? patientId : false);
  };

  const handleDeleteClick = (patient: Patient, event: React.MouseEvent) => {
    event.stopPropagation();
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete?.id) {
      try {
        await db.deletePatient(patientToDelete.id);
        await loadData();
        setDeleteDialogOpen(false);
        setPatientToDelete(null);
        setExpandedPatient(false);
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        width: '100%'
      }}>
        <Typography variant="h6" color="text.secondary">Loading patients...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3,
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '8px',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 500,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              lineHeight: 1.235,
              color: 'rgba(0, 0, 0, 0.87)',
            }}
          >
            Patients
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPatient}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px',
              px: 3,
            }}
          >
            Add Patient
          </Button>
        </Box>
      </Paper>

      {patients.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No patients yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Click the "Add Patient" button to get started
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddPatient}
            sx={{ textTransform: 'none' }}
          >
            Add Your First Patient
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {patients.map((patient) => (
            <Grid 
              item 
              xs={12} 
              md={6} 
              lg={4} 
              key={patient.id}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  height: '100%',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Accordion
                  expanded={expandedPatient === patient.id}
                  onChange={handleAccordionChange(patient.id!)}
                  elevation={0}
                  disableGutters
                  sx={{ 
                    height: '100%',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: expandedPatient === patient.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                      px: 3,
                      py: 2,
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      pr: 2,
                    }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {patient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {patient.dateOfBirth}
                        </Typography>
                      </Box>
                      <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleAddVisit(patient)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditPatient(patient)}
                          sx={{ 
                            color: 'action.active',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteClick(patient, e)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Phone:</strong> {patient.phoneNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Address:</strong> {patient.address}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                      Visit History
                    </Typography>
                    <List sx={{ pt: 0 }}>
                      {getPatientVisits(patient.id!).map((visit) => (
                        <ListItem 
                          key={visit.id}
                          sx={{ 
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            py: 2,
                            px: 0,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': {
                              borderBottom: 'none',
                            }
                          }}
                        >
                          <Box sx={{ 
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start' 
                          }}>
                            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
                              {new Date(visit.date).toLocaleDateString()}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleEditVisit(visit)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ mt: 2, width: '100%' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Vital Signs:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                              • BP: {visit.vitalSigns.bloodPressure}
                              <br />
                              • Temp: {visit.vitalSigns.temperature}
                              <br />
                              • HR: {visit.vitalSigns.heartRate}
                              <br />
                              • O2: {visit.vitalSigns.oxygenSaturation}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              Notes: {visit.notes}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <PatientForm
        open={isPatientFormOpen}
        onClose={() => setIsPatientFormOpen(false)}
        patient={selectedPatient}
        onSave={loadData}
      />

      {selectedPatient && (
        <VisitForm
          open={isVisitFormOpen}
          onClose={() => setIsVisitFormOpen(false)}
          patient={selectedPatient}
          visit={selectedVisit}
          onSave={loadData}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patientToDelete?.name}? This will permanently delete all their visits and records.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        requireConfirmation={true}
        confirmationText={patientToDelete?.name || ''}
      />
    </Box>
  );
} 