import { FieldCareDB } from '../db/database';

const db = new FieldCareDB();

export class SyncService {
  private static instance: SyncService;
  private syncInProgress: boolean = false;

  private constructor() {
    // Register for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private async handleOnline() {
    if (!this.syncInProgress) {
      await this.syncData();
    }
  }

  private handleOffline() {
    console.log('App is offline. Changes will be synced when connection is restored.');
  }

  private async syncData() {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      // Get all pending changes
      const pendingVisits = await db.visits
        .where('syncStatus')
        .equals('pending')
        .toArray();

      // TODO: Implement actual API calls to sync with backend
      // For now, we'll just mark them as synced
      for (const visit of pendingVisits) {
        if (visit.id) {
          await db.visits.update(visit.id, { syncStatus: 'synced' });
        }
      }

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  public async markForSync(visitId: number) {
    try {
      await db.visits.update(visitId, { syncStatus: 'pending' });
      if (navigator.onLine) {
        await this.syncData();
      }
    } catch (error) {
      console.error('Error marking visit for sync:', error);
    }
  }
} 