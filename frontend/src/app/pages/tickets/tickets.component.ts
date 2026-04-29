import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  user: User | null = null;

  loading = false;
  deleting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.tickets = response.tickets;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tickets';
        this.loading = false;
      },
    });
  }

  deleteTicket(id: number): void {
    const confirmDelete = confirm('¿Estás seguro de eliminar este ticket?');

    if (!confirmDelete) return;

    this.deleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.ticketService.deleteTicket(id).subscribe({
      next: () => {
        this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
        this.successMessage = 'Ticket eliminado correctamente';
        this.deleting = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar el ticket';
        this.deleting = false;
      },
    });
  }

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
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