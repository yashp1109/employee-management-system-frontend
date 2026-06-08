import { Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list.component';
import { DepartmentAddComponent } from './department-add.component';

export const departmentRoutes: Routes = [
  { path: '', component: DepartmentListComponent },
  { path: 'add', component: DepartmentAddComponent }
];
