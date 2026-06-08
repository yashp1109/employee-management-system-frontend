import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { RequestService } from "src/app/services/request.service";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AttendanceListComponent } from "../attendance-list/attendance-list.component";
import { Employee } from "../../core/models/models";
import { EmployeeNamePipe } from "../../shared/pipes/employee-name.pipe";
import { AuthService } from "../../core/auth/auth.service";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    EmployeeNamePipe,
    AttendanceListComponent,
  ],
  templateUrl: "./employee-view.component.html",
  styleUrl: "./employee-view.component.css",
})
export class EmployeeViewComponent implements OnInit {
  employee?: Employee;
  readonly canEdit = this.auth.hasRole(["ADMIN", "HR"]);

  constructor(
    private route: ActivatedRoute,
    private employees: EmployeeService,
    public auth: AuthService,
    private requests: RequestService,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    this.employees
      .get(Number(this.route.snapshot.paramMap.get("id")))
      .subscribe((e) => (this.employee = e));
  }

  requestProfileUpdate(): void {
    if (!this.employee?.id) return;
    const comment = prompt(
      "Describe the changes you want to request (comments):",
    );
    if (comment == null) return;
    this.requests
      .submitProfileUpdateRequest(this.employee.id, comment)
      .subscribe({
        next: () =>
          this.snackBar.open("Profile update request submitted", "Close", {
            duration: 3000,
          }),
        error: () =>
          this.snackBar.open("Failed to submit request", "Close", {
            duration: 3000,
          }),
      });
  }
}
