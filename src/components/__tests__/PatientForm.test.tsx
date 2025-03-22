import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PatientForm } from '../PatientForm';
import { DatabaseProvider } from '../../db/DatabaseContext';
import { Patient } from '../../db/database';

const mockPatient: Patient = {
  id: 1,
  name: 'John Doe',
  dateOfBirth: '1990-01-01',
  address: '123 Main St',
  phoneNumber: '555-0123'
};

const mockDb = {
  patients: {
    add: jest.fn(),
    update: jest.fn()
  }
};

jest.mock('../../db/DatabaseContext', () => ({
  ...jest.requireActual('../../db/DatabaseContext'),
  useDatabase: () => ({ db: mockDb })
}));

describe('PatientForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add patient form correctly', () => {
    render(
      <DatabaseProvider>
        <PatientForm open={true} onClose={mockOnClose} onSave={mockOnSave} />
      </DatabaseProvider>
    );

    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('renders edit patient form correctly', () => {
    render(
      <DatabaseProvider>
        <PatientForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );

    expect(screen.getByText('Edit Patient')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue(mockPatient.name);
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue(mockPatient.dateOfBirth);
    expect(screen.getByLabelText(/address/i)).toHaveValue(mockPatient.address);
    expect(screen.getByLabelText(/phone number/i)).toHaveValue(mockPatient.phoneNumber);
  });

  it('handles form submission for new patient', async () => {
    render(
      <DatabaseProvider>
        <PatientForm open={true} onClose={mockOnClose} onSave={mockOnSave} />
      </DatabaseProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1995-01-01' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '456 Oak St' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '555-0124' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockDb.patients.add).toHaveBeenCalledWith({
        name: 'Jane Doe',
        dateOfBirth: '1995-01-01',
        address: '456 Oak St',
        phoneNumber: '555-0124'
      });
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles form submission for existing patient', async () => {
    render(
      <DatabaseProvider>
        <PatientForm 
          open={true} 
          onClose={mockOnClose} 
          patient={mockPatient} 
          onSave={mockOnSave} 
        />
      </DatabaseProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Smith' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockDb.patients.update).toHaveBeenCalledWith(mockPatient.id, {
        ...mockPatient,
        name: 'John Smith'
      });
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    render(
      <DatabaseProvider>
        <PatientForm open={true} onClose={mockOnClose} onSave={mockOnSave} />
      </DatabaseProvider>
    );

    // Clear all fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockDb.patients.add).not.toHaveBeenCalled();
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
}); 