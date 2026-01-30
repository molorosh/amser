import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Sprint } from '../../models/sprint';
import { PersistenceService } from '../../services/persistence.service';
import { CurrentSprint } from './current-sprint/current-sprint';

@Component({
  selector: 'app-my-work',
  imports: [CurrentSprint],
  templateUrl: './my-work.html',
  styleUrl: './my-work.scss',
})
export class MyWork implements OnInit {
  private persistence = inject(PersistenceService);

  sprints = signal<Sprint[]>([]);

  currentSprints = computed(() => 
    this.sprints().filter(sprint => sprint.isCurrent)
  );

  async ngOnInit() {
    await this.persistence.whenReady();
    const allSprints = await this.persistence.getAllSprints();
    this.sprints.set(allSprints);
  }
}
