import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeViewComponent } from './employee-view.component';
import { roleGuard } from '../../core/guards/auth.guard';

export const employeeRoutes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add', component: EmployeeFormComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'HR'] } },
  { path: ':id/edit', component: EmployeeFormComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'HR'] } },
  { path: ':id', component: EmployeeViewComponent }
];
