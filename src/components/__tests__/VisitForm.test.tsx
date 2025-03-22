import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VisitForm } from '../VisitForm';
import { DatabaseProvider } from '../../db/DatabaseContext';
import { Patient, Visit } from '../../db/database';

const mockPatient: Patient = {
  id: 1,
  name: 'John Doe',
  dateOfBirth: '1990-01-01',
  address: '123 Main St',
  phoneNumber: '555-0123'
};

const mockVisit: Visit = {
  id: 1,
  patientId: 1,
  date: '2024-03-20',
  notes: 'Initial visit',
  vitalSigns: {
    bloodPressure: '120/80',
    temperature: '98.6',
    heartRate: '72',
    oxygenSaturation: '98'
  },
  medications: [],
  syncStatus: 'pending'
};

const mockDb = {
  visits: {
    add: jest.fn(),
    update: jest.fn()
  }
};

jest.mock('../../db/DatabaseContext', () => ({
  ...jest.requireActual('../../db/DatabaseContext'),
  useDatabase: () => ({ db: mockDb })
}));

describe('VisitForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new visit form correctly', () => {
    render(
      <DatabaseProvider>
        <VisitForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );

    expect(screen.getByText(`New Visit for ${mockPatient.name}`)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /blood pressure/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /temperature/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /heart rate/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /oxygen saturation/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
  });

  it('renders edit visit form correctly', () => {
    render(
      <DatabaseProvider>
        <VisitForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          visit={mockVisit} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );

    expect(screen.getByLabelText(/date/i)).toHaveValue(mockVisit.date);
    expect(screen.getByRole('textbox', { name: /blood pressure/i })).toHaveValue(mockVisit.vitalSigns.bloodPressure);
    expect(screen.getByRole('textbox', { name: /temperature/i })).toHaveValue(mockVisit.vitalSigns.temperature);
    expect(screen.getByRole('textbox', { name: /heart rate/i })).toHaveValue(mockVisit.vitalSigns.heartRate);
    expect(screen.getByRole('textbox', { name: /oxygen saturation/i })).toHaveValue(mockVisit.vitalSigns.oxygenSaturation);
    expect(screen.getByRole('textbox', { name: /notes/i })).toHaveValue(mockVisit.notes);
  });

  it('handles form submission for new visit', async () => {
    const today = new Date().toISOString().split('T')[0];
    render(
      <DatabaseProvider>
        <VisitForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: today } });
    fireEvent.change(screen.getByRole('textbox', { name: /blood pressure/i }), { target: { value: '120/80' } });
    fireEvent.change(screen.getByRole('textbox', { name: /temperature/i }), { target: { value: '98.6' } });
    fireEvent.change(screen.getByRole('textbox', { name: /heart rate/i }), { target: { value: '72' } });
    fireEvent.change(screen.getByRole('textbox', { name: /oxygen saturation/i }), { target: { value: '98' } });
    fireEvent.change(screen.getByRole('textbox', { name: /notes/i }), { target: { value: 'Test visit' } });

    fireEvent.click(screen.getByText('Save Visit'));

    await waitFor(() => {
      expect(mockDb.visits.add).toHaveBeenCalledWith({
        patientId: mockPatient.id,
        date: today,
        notes: 'Test visit',
        vitalSigns: {
          bloodPressure: '120/80',
          temperature: '98.6',
          heartRate: '72',
          oxygenSaturation: '98'
        },
        medications: [],
        syncStatus: 'pending'
      });
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles form submission for existing visit', async () => {
    render(
      <DatabaseProvider>
        <VisitForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          visit={mockVisit} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /notes/i }), { target: { value: 'Updated notes' } });
    fireEvent.click(screen.getByText('Save Visit'));

    await waitFor(() => {
      expect(mockDb.visits.update).toHaveBeenCalledWith(mockVisit.id, {
        ...mockVisit,
        notes: 'Updated notes'
      });
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    render(
      <DatabaseProvider>
        <VisitForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );

    // Clear the date field
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '' } });
    fireEvent.click(screen.getByText('Save Visit'));

    await waitFor(() => {
      expect(mockDb.visits.add).not.toHaveBeenCalled();
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
}); 