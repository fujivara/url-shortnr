import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-emerald-300 flex justify-between items-center p-2">
      <div class="flex gap-5">
        <p-button routerLink="login">Login</p-button>
        <p-button routerLink="Register">Register</p-button>
      </div>
      
      <h1 class="text-emerald-900 text-3xl font-bold">Shrtnr</h1>
    </header>
  `,
  standalone: true,
  imports: [
    Button,
    RouterLink
  ]
})
export class HeaderComponent {

}
