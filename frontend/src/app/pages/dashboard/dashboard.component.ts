import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { User } from '../../models/user.model';
import { TicketStats } from '../../models/ticket.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  stats: TicketStats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.ticketService.getStats().subscribe({
      next: (response) => {
        this.stats = response.stats;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las estadísticas';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}