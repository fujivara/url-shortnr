import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { first, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastService } from '../../../../shared/services/toast.service';

@UntilDestroy()
@Component({
  selector: 'app-login',
  template: `
    <div class="flex justify-center items-center h-screen">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center">Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="username" 
              type="text"
              pInputText
              class="w-full mt-1"
              [formControl]="loginForm.controls.username" 
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              id="password" 
              type="password"
              pInputText 
              class="w-full mt-1"
              [formControl]="loginForm.controls.password" 
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              pButton
              label="Login"
              class="w-full"
              [disabled]="loginForm.invalid"
              (click)="onLogin()"
            ></button>
          </div>
        </form>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ]
})
export class LoginComponent {
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly loginForm = this.formBuilder.group({
    username: this.formBuilder.control('', [Validators.required]),
    password: this.formBuilder.control('', [Validators.required]),
  });

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  constructor() {
    toObservable(this.authService.loggedUser)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        tap(() => this.router.navigate(['/']))
      )
      .subscribe();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials)
        .pipe(
          first(),
          catchError(() => {
            this.toastService.show('Error', 'An error occurred', 'error');
            return of(false);
          }),
          filter(Boolean),
          tap(() => {
            this.toastService.show('Success', 'Logged in :)', 'info');
            this.router.navigate(['/'])
          })
        )
        .subscribe()
    }
  }
}