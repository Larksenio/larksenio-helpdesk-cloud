import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketStats, TicketPriority, TicketStatus } from '../models/ticket.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface TicketsResponse {
  message: string;
  total: number;
  tickets: Ticket[];
}

interface TicketResponse {
  message: string;
  ticket: Ticket;
}

interface StatsResponse {
  message: string;
  stats: TicketStats;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTickets(): Observable<TicketsResponse> {
    return this.http.get<TicketsResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders(),
    });
  }

  getTicketById(id: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createTicket(data: {
    title: string;
    description: string;
    priority: TicketPriority;
  }): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(this.apiUrl, data, {
      headers: this.getHeaders(),
    });
  }

  updateTicket(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: TicketStatus;
      priority?: TicketPriority;
    }
  ): Observable<TicketResponse> {
    return this.http.patch<TicketResponse>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteTicket(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
