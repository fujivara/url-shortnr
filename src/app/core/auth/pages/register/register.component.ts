import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router  } from '@angular/router';
import {  AuthService  } from '../../auth.service';
import {  CommonModule  } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { catchError, filter, tap } from 'rxjs/operators';
import { ToastService } from '../../../../shared/services/toast.service';
import { of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-register',
  template: `
    <div class="flex justify-center items-center h-screen">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username" 
              formControlName="username" 
              type="text"
              pInputText
              class="w-full mt-1"
            />
          </div>
  
          <div class="mb-4">
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="full_name" 
              formControlName="full_name" 
              type="text"
              pInputText
              class="w-full mt-1"
            />
          </div>
  
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              id="password" 
              formControlName="password" 
              type="password"
              pInputText
              class="w-full mt-1"
            />
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-sm mt-1">
              Password is required
            </div>
          </div>
  
          <button
            pButton
            type="submit"
            class="w-full"
            [disabled]="registerForm.invalid"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonDirective, InputText]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly toastService = inject(ToastService);

  registerForm = this.formBuilder.group({
    username: this.formBuilder.control('', Validators.required),
    full_name: this.formBuilder.control(''),
    password: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    toObservable(this.authService.loggedUser)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        tap(() => this.router.navigate(['/']))
      )
      .subscribe();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue())
        .pipe(
          catchError(() => {
            this.toastService.show('Error', 'An error occurred', 'error');
            return of(false);
          }),
          filter(Boolean),
          tap(() => {
            this.toastService.show('Success', 'Account created', 'info');
            this.router.navigate(['/login'])
          })
        )
        .subscribe();
    }
  }
}