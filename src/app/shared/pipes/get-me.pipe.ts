import {inject, Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserInterface} from "../types/user";
import {Observable} from "rxjs";

@Pipe({
  name: 'getMe',
  standalone: true,
})
export class GetMePipe implements PipeTransform {
  private readonly httpClient = inject(HttpClient);

  transform(): Observable<UserInterface> {
    // TODO: move url to config and path to enum
    return this.httpClient.get<UserInterface>('http://localhost:8000/api/me');
  }
}
