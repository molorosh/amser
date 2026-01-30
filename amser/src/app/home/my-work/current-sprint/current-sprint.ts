import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Sprint } from '../../../models/sprint';

@Component({
  selector: 'app-current-sprint',
  imports: [DatePipe],
  templateUrl: './current-sprint.html',
  styleUrl: './current-sprint.scss',
})
export class CurrentSprint {
  sprint = input.required<Sprint>();
}
