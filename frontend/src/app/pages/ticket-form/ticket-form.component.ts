import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketPriority } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css',
})
export class TicketFormComponent {
  title = '';
  description = '';
  priority: TicketPriority = 'MEDIUM';

  loading = false;
  errorMessage = '';

  priorities: { value: TicketPriority; label: string }[] = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'URGENT', label: 'Urgente' },
  ];

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  createTicket(): void {
    if (!this.title.trim() || !this.description.trim()) {
      this.errorMessage = 'El título y la descripción son obligatorios';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.ticketService
      .createTicket({
        title: this.title,
        description: this.description,
        priority: this.priority,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/tickets']);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'No se pudo crear el ticket';
        },
      });
  }
}