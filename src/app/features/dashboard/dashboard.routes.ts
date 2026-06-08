import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { DashboardRedirectComponent } from './dashboard-redirect.component';

export const dashboardRoutes: Routes = [
  { path: '', component: DashboardRedirectComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'manager', component: ManagerDashboardComponent },
  { path: 'employee', component: EmployeeDashboardComponent }
];
