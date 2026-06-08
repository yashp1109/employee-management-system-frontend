import { Routes } from "@angular/router";
import { authGuard, roleGuard } from "./core/guards/auth.guard";
import { AppShellComponent } from "./layout/app-shell.component";
import { LoginComponent } from "./features/login/login.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./features/dashboard/dashboard.routes").then(
            (m) => m.dashboardRoutes,
          ),
      },
      {
        path: "employees",
        loadChildren: () =>
          import("./features/employees/employee.routes").then(
            (m) => m.employeeRoutes,
          ),
        canActivate: [roleGuard],
        data: { roles: ["ADMIN", "HR"] },
      },
      {
        path: "departments",
        loadChildren: () =>
          import("./features/departments/department.routes").then(
            (m) => m.departmentRoutes,
          ),
        canActivate: [roleGuard],
        data: { roles: ["ADMIN", "HR"] },
      },
      {
        path: "leaves",
        loadChildren: () =>
          import("./features/leaves/leave.routes").then((m) => m.leaveRoutes),
      },
      {
        path: "attendance",
        loadChildren: () =>
          import("./features/attendance-list/attendance.routes").then(
            (m) => m.attendanceRoutes,
          ),
      },
      {
        path: "profile",
        loadComponent: () =>
          import("./features/profile/profile.component").then(
            (m) => m.ProfileComponent,
          ),
      },
    ],
  },
  { path: "**", redirectTo: "" },
];
