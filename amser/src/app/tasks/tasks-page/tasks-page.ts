import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Task, createTask } from '../../models/task';
import { PersistenceService } from '../../services/persistence.service';

@Component({
  selector: 'app-tasks-page',
  imports: [FormsModule, TableModule, Button, Dialog, InputText, Textarea, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage implements OnInit {
  private persistence = inject(PersistenceService);
  private confirmationService = inject(ConfirmationService);

  tasks = signal<Task[]>([]);
  dialogVisible = signal(false);
  isEditing = signal(false);

  // Form fields
  currentTask = signal<Task | null>(null);
  taskName = signal('');
  taskDescription = signal('');
  taskUrl = signal('');

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.persistence.getAllTasks();
    this.tasks.set(tasks);
  }

  openNewTaskDialog() {
    this.isEditing.set(false);
    this.currentTask.set(null);
    this.taskName.set('');
    this.taskDescription.set('');
    this.taskUrl.set('');
    this.dialogVisible.set(true);
  }

  openEditTaskDialog(task: Task) {
    this.isEditing.set(true);
    this.currentTask.set(task);
    this.taskName.set(task.name);
    this.taskDescription.set(task.description);
    this.taskUrl.set(task.url);
    this.dialogVisible.set(true);
  }

  async saveTask() {
    if (!this.taskName().trim()) {
      return;
    }

    if (this.isEditing() && this.currentTask()) {
      const updatedTask: Task = {
        ...this.currentTask()!,
        name: this.taskName(),
        description: this.taskDescription(),
        url: this.taskUrl(),
      };
      await this.persistence.updateTask(updatedTask);
    } else {
      const newTask = createTask(
        this.taskName(),
        this.taskDescription(),
        this.taskUrl()
      );
      await this.persistence.saveTask(newTask);
    }

    this.dialogVisible.set(false);
    await this.loadTasks();
  }

  confirmDelete(task: Task) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${task.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.persistence.deleteTask(task.id);
        await this.loadTasks();
      },
    });
  }

  cancelDialog() {
    this.dialogVisible.set(false);
  }
}
