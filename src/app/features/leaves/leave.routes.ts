import { Routes } from '@angular/router';
import { LeaveApplyComponent } from './leave-apply.component';
import { LeaveListComponent } from './leave-list.component';
import { LeaveApprovalsComponent } from './leave-approvals.component';
import { roleGuard } from '../../core/guards/auth.guard';

export const leaveRoutes: Routes = [
  { path: '', component: LeaveListComponent },
  { path: 'apply', component: LeaveApplyComponent },
  { path: 'approvals', component: LeaveApprovalsComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'HR', 'MANAGER'] } }
];
