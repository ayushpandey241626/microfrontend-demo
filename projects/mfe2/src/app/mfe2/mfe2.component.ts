import { Component } from '@angular/core';

@Component({
  selector: 'app-mfe2',
  imports: [],
  templateUrl: './mfe2.component.html',
  styleUrl: './mfe2.component.css',
})
export class Mfe2Component {
  count = 0;
  increment() {
    this.count++;
  }
}
