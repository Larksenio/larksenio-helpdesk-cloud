import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TicketFormComponent } from './pages/ticket-form/ticket-form.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tickets/new',
    component: TicketFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tickets/:id',
    component: TicketDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];