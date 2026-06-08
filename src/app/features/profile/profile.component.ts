import { Component, OnInit } from "@angular/core";
import { Employee, LeaveRequest } from "../../core/models/models";

import { AuthService } from "../../core/auth/auth.service";

import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { EmployeeService } from "src/app/services/employee.service";
import { LeaveService } from "src/app/services/leave.service";

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  profile?: Employee;
  readonly canEdit = this.auth.hasRole(["ADMIN", "HR"]);

  leaveStats = { total: 0, approved: 0, pending: 0, rejected: 0, cancelled: 0 };

  constructor(
    private employees: EmployeeService,
    private auth: AuthService,
    private leaveService: LeaveService,
  ) {}

  ngOnInit(): void {
    this.employees.me().subscribe((e) => (this.profile = e));
    this.leaveService.history().subscribe((page) => {
      const leaves = page.content;
      this.leaveStats = {
        total: leaves.length,
        approved: leaves.filter((l: any) => l.status === "APPROVED").length,
        pending: leaves.filter((l: any) => l.status === "PENDING").length,
        rejected: leaves.filter((l: any) => l.status === "REJECTED").length,
        cancelled: leaves.filter((l: any) => l.status === "CANCELLED").length,
      };
    });
  }
}
