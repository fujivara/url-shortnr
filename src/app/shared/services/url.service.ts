import { inject, Injectable } from '@angular/core';
import { CreateUrlPayload, UrlInterface } from '../types/url';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private readonly http = inject(HttpClient);
  private toastService = inject(ToastService);

  getMany(): Observable<UrlInterface[] | null> {
    return this.http.get<UrlInterface[]>('http://localhost:8000/api/me/urls')
      .pipe(
        catchError(() => {
          this.toastService.show('Error', 'Something went wrong', 'error');
          return of(null);
        })
      );
  }

  create(payload: CreateUrlPayload): Observable<UrlInterface | null> {
    return this.http.post<UrlInterface>('http://localhost:8000/api/me/urls', payload)
      .pipe(
        catchError(() => {
          this.toastService.show('Error', 'Something went wrong', 'error');
          return of(null);
        })
      );
  }

  getUrlTimeStamps(short: string): Observable<string[] | null> {
    return this.http.get<string[]>(`http://localhost:8000/api/me/links/${short}/redirects`)
      .pipe(
        catchError(() => {
          this.toastService.show('Error', 'Something went wrong', 'error');
          return of(null);
        })
      );
  }
}
