import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  show(summary: string, detail: string, severity: 'info' | 'error', life = 5000) {
    this.messageService.add({
      severity,
      life,
      summary,
      detail,
    });
  }
}
