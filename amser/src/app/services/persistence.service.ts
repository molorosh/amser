import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';
import { Sprint } from '../models/sprint';
import { Action } from '../models/action';

const DB_NAME = 'amser-db';
const DB_VERSION = 3;
const TASKS_STORE = 'tasks';
const SPRINTS_STORE = 'sprints';
const ACTIONS_STORE = 'actions';

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

        if (!db.objectStoreNames.contains(ACTIONS_STORE)) {
          const store = db.createObjectStore(ACTIONS_STORE, { keyPath: 'id' });
          store.createIndex('taskId', 'taskId', { unique: false });
          store.createIndex('sprintId', 'sprintId', { unique: false });
          store.createIndex('actionType', 'actionType', { unique: false });
          store.createIndex('startDateTime', 'startDateTime', { unique: false });
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
          // Ensure existing tasks have default values for newer properties
          const tasks = (request.result as Task[]).map((task) => ({
            ...task,
            taskType: task.taskType ?? 'WorkItem',
            autoAllocate: task.autoAllocate ?? false,
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

        request.onsuccess = () => {
          // Ensure existing sprints have default values for newer properties
          const sprints = (request.result as Sprint[]).map((sprint) => ({
            ...sprint,
            hoursPerDay: sprint.hoursPerDay ?? 6,
            daysPerSprint: sprint.daysPerSprint ?? 8,
          }));
          resolve(sprints);
        };
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

  // Action methods
  async saveAction(action: Action): Promise<Action> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readwrite');
        const request = store.put(action);

        request.onsuccess = () => resolve(action);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAction(id: string): Promise<Action | undefined> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readonly');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllActions(): Promise<Action[]> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readonly');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getActionsByTask(taskId: string): Promise<Action[]> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readonly');
        const index = store.index('taskId');
        const request = index.getAll(taskId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getActionsBySprint(sprintId: string): Promise<Action[]> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readonly');
        const index = store.index('sprintId');
        const request = index.getAll(sprintId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteAction(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readwrite');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateAction(action: Action): Promise<Action> {
    return this.saveAction(action);
  }

  async clearAllActions(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(ACTIONS_STORE, 'readwrite');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }
}
