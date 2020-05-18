import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  resized$: Subject<any> = new Subject();

  constructor() {
  }

  onGutterClick(event) {
    this.resized$.next(event);
  }
}
