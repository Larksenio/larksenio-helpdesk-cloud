import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css',
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  selectedStatus: TicketStatus = 'OPEN';
  selectedPriority: TicketPriority = 'MEDIUM';

  statuses: { value: TicketStatus; label: string }[] = [
    { value: 'OPEN', label: 'Abierto' },
    { value: 'IN_PROGRESS', label: 'En proceso' },
    { value: 'RESOLVED', label: 'Resuelto' },
    { value: 'CLOSED', label: 'Cerrado' },
  ];

  priorities: { value: TicketPriority; label: string }[] = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'URGENT', label: 'Urgente' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadTicket();
  }

  loadTicket(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'ID de ticket inválido';
      return;
    }

    this.loading = true;

    this.ticketService.getTicketById(id).subscribe({
      next: (response) => {
        this.ticket = response.ticket;
        this.selectedStatus = response.ticket.status;
        this.selectedPriority = response.ticket.priority;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el ticket';
        this.loading = false;
      },
    });
  }

  updateTicket(): void {
    if (!this.ticket) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.ticketService
      .updateTicket(this.ticket.id, {
        status: this.selectedStatus,
        priority: this.selectedPriority,
      })
      .subscribe({
        next: (response) => {
          this.ticket = response.ticket;
          this.successMessage = 'Ticket actualizado correctamente';
          this.saving = false;
        },
        error: () => {
          this.errorMessage = 'No se pudo actualizar el ticket';
          this.saving = false;
        },
      });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      OPEN: 'Abierto',
      IN_PROGRESS: 'En proceso',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado',
    };

    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      URGENT: 'Urgente',
    };

    return labels[priority] || priority;
  }
}