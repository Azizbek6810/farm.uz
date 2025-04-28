import { Component } from '@angular/core';
import { LocalizeService } from './core/services/localize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private localize: LocalizeService
  ) {
    this.localize.initializeConfig();
  }
}
