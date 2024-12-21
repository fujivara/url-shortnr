import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UrlService } from '../../shared/services/url.service';
import { UrlInterface } from '../../shared/types/url';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/coponents/header/header.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <app-header></app-header>
      @if (authService.loggedUser()) {
      <div class="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Manage URLs</h2>
        <form [formGroup]="urlForm" (ngSubmit)="onSubmit()" class="mb-6">
          <div class="mb-4">
            <label for="url" class="block text-sm font-medium text-gray-700">URL</label>
            <input id="url" formControlName="url" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <button type="submit" [disabled]="urlForm.invalid" class="w-full bg-indigo-600 text-slate-800 py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add URL
          </button>
        </form>
        <div *ngIf="urls">
          <h3 class="text-xl font-bold mb-4">Your URLs</h3>
          <ul>
            <li *ngFor="let url of urls" class="mb-2">
              <div class="flex justify-between items-center">
                <span class="text-slate-800">{{ url.url }}</span>
                <div>
                  <button 
                    (click)="getTimestamps(url.short)"
                    class="bg-blue-500 text-slate-800 px-2 py-1 rounded-md hover:bg-blue-600"
                  >View Timestamps</button>
                  <button
                    (click)="goToShortUrl(url.short)" 
                    class="bg-green-500 text-slate-800 px-2 py-1 rounded-md hover:bg-green-600 ml-2"
                  >Go to Short</button>
                </div>
              </div>
              <ul *ngIf="timestamps[url.short]">
                <li *ngFor="let timestamp of timestamps[url.short]" class="text-sm text-slate-800">{{ timestamp }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      } @else {
        <div class="flex items-center justify-center min-h-[70vh]">
          <h1 class="text-7xl">
            Lets keep things short ;)
          </h1>
        </div>
      }
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, ToastModule],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  readonly authService = inject(AuthService);

  private urlService = inject(UrlService);
  private formBuilder = inject(NonNullableFormBuilder);

  urlForm: FormGroup = this.formBuilder.group({
    url: this.formBuilder.control('', Validators.required)
  });

  urls: UrlInterface[] | null = null;
  timestamps: Record<string, string[]> = {};

  ngOnInit() {
    if (this.authService.loggedUser()) {
      this.loadUrls();
    }
  }

  loadUrls() {
    this.urlService.getMany()
      .pipe(
        filter(Boolean),
        tap((urls) => this.urls = urls)
      )
      .subscribe();
  }

  onSubmit() {
    if (this.urlForm.valid) {
      this.urlService
        .create(this.urlForm.value)
        .pipe(
          filter(Boolean),
          tap((url) => {
            this.urls?.push(url as any);
            this.urlForm.reset();
          }),
        )
        .subscribe();
    }
  }

  getTimestamps(short: string) {
    this.urlService.getUrlTimeStamps(short)
      .pipe(
        filter(Boolean),
        tap((timestamps) => this.timestamps[short] = timestamps)
      )
      .subscribe();
  }

  goToShortUrl(short: string) {
    window.open(`localhost:8000/${short}`);
  }
}