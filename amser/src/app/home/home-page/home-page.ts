import { Component } from '@angular/core';
import { MyWork } from '../my-work/my-work';

@Component({
  selector: 'app-home-page',
  imports: [MyWork],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

}
