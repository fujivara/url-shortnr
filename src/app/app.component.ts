import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./core/coponents/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header/>
    <router-outlet/>
  `,
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
