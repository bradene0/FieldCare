import Dexie, { Table } from 'dexie';

export interface Patient {
  id?: number;
  name: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  lastVisit?: string;
}

export interface Visit {
  id?: number;
  patientId: number;
  date: string;
  notes: string;
  vitalSigns: {
    bloodPressure?: string;
    temperature?: string;
    heartRate?: string;
    oxygenSaturation?: string;
  };
  medications?: string[];
  syncStatus: 'pending' | 'synced';
}

export class FieldCareDB extends Dexie {
  patients!: Table<Patient>;
  visits!: Table<Visit>;

  constructor() {
    super('FieldCareDB');
    this.version(1).stores({
      patients: '++id, name, dateOfBirth',
      visits: '++id, patientId, date, syncStatus'
    });
  }

  async addPatient(patient: Patient): Promise<number> {
    return await this.patients.add(patient);
  }

  async updatePatient(patient: Patient): Promise<number> {
    if (!patient.id) throw new Error('Patient ID is required for update');
    await this.patients.update(patient.id, patient);
    return patient.id;
  }

  async deletePatient(patientId: number): Promise<void> {
    await this.transaction('rw', this.patients, this.visits, async () => {
      // Delete all visits for this patient
      await this.visits.where('patientId').equals(patientId).delete();
      // Delete the patient
      await this.patients.delete(patientId);
    });
  }

  async addVisit(visit: Visit): Promise<number> {
    return await this.visits.add(visit);
  }

  async updateVisit(visit: Visit): Promise<number> {
    if (!visit.id) throw new Error('Visit ID is required for update');
    await this.visits.update(visit.id, visit);
    return visit.id;
  }

  async getVisitsForPatient(patientId: number): Promise<Visit[]> {
    return await this.visits
      .where('patientId')
      .equals(patientId)
      .reverse()
      .sortBy('date');
  }
} 