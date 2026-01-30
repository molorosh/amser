import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';
import { Sprint } from '../models/sprint';

const DB_NAME = 'amser-db';
const DB_VERSION = 2;
const TASKS_STORE = 'tasks';
const SPRINTS_STORE = 'sprints';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private db: IDBDatabase | null = null;
  private readonly _isReady = signal(false);
  private dbReadyPromise: Promise<void>;

  readonly isReady = this._isReady.asReadonly();

  constructor() {
    this.dbReadyPromise = this.initDatabase();
  }

  async whenReady(): Promise<void> {
    return this.dbReadyPromise;
  }

  private initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this._isReady.set(true);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const store = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains(SPRINTS_STORE)) {
          const store = db.createObjectStore(SPRINTS_STORE, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('startDate', 'startDate', { unique: false });
          store.createIndex('endDate', 'endDate', { unique: false });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Task methods
  async saveTask(task: Task): Promise<Task> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(TASKS_STORE, 'readwrite');
        const request = store.put(task);

        request.onsuccess = () => resolve(task);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getTask(id: string): Promise<Task | undefined> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(TASKS_STORE, 'readonly');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(TASKS_STORE, 'readonly');
        const request = store.getAll();

        request.onsuccess = () => {
          // Ensure existing tasks have taskType set to WorkItem
          const tasks = (request.result as Task[]).map((task) => ({
            ...task,
            taskType: task.taskType ?? 'WorkItem',
          }));
          resolve(tasks);
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteTask(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(TASKS_STORE, 'readwrite');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateTask(task: Task): Promise<Task> {
    return this.saveTask(task);
  }

  async clearAllTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(TASKS_STORE, 'readwrite');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Sprint methods
  async saveSprint(sprint: Sprint): Promise<Sprint> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(SPRINTS_STORE, 'readwrite');
        const request = store.put(sprint);

        request.onsuccess = () => resolve(sprint);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getSprint(id: string): Promise<Sprint | undefined> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(SPRINTS_STORE, 'readonly');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllSprints(): Promise<Sprint[]> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(SPRINTS_STORE, 'readonly');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteSprint(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(SPRINTS_STORE, 'readwrite');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateSprint(sprint: Sprint): Promise<Sprint> {
    return this.saveSprint(sprint);
  }

  async clearAllSprints(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(SPRINTS_STORE, 'readwrite');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }
}
