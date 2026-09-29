import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { LeaveRequest } from "../../core/models/models";
import { LeaveService } from "src/app/services/leave.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: "./leave-approvals.component.html",
  styleUrl: "./leave-approvals.component.css",
})
export class LeaveApprovalsComponent implements OnInit {
  columns = ["employee", "type", "dates", "days", "reason", "actions"];
  rows: LeaveRequest[] = [];

  constructor(
    private leaves: LeaveService,
    private snackBar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.leaves.pending().subscribe({
      next: (res: any) => {
        if (res) {
          this.rows = res.content;
        }
      },
      error: (err: any) => {
        console.error(err?.error?.message || "Failed to load leave approvals");
      },
    });
  }

  approve(id: number): void {
    this.leaves.approve(id).subscribe({
      next: (res: any) => {
        if (res) {
          this.snackBar.successSnackBar(
            res?.message || "Leave approved successfully",
          );
          this.load();
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to approve leave",
        );
      },
    });
  }

  reject(id: number): void {
    this.leaves.reject(id).subscribe({
      next: (res: any) => {
        if (res) {
          this.snackBar.successSnackBar(
            res?.message || "Leave rejected successfully",
          );
          this.load();
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to reject leave",
        );
      },
    });
  }
}
