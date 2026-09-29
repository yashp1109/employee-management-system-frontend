import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { LeaveBalance, LeaveRequest } from "../../core/models/models";
import { LeaveService } from "src/app/services/leave.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: "./leave-list.component.html",
  styleUrl: "./leave-list.component.css",
})
export class LeaveListComponent implements OnInit {
  columns = ["type", "dates", "days", "status", "actions"];
  rows: LeaveRequest[] = [];
  balances: LeaveBalance[] = [];

  constructor(
    private leaves: LeaveService,
    private snackBar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.leaves.history().subscribe({
      next: (res: any) => {
        if (res) {
          this.rows = res.content;
        }
      },
      error: (err: any) => {
        console.error(err?.error?.message || "Failed to load leave history");
      },
    });
    this.leaves.balance().subscribe({
      next: (res: any) => {
        if (res) {
          this.balances = res;
          console.debug("leave balance: ", res);
        }
      },
      error: (err: any) => {
        console.error(err?.error?.message || "Failed to load leave balance");
      },
    });
  }

  cancel(id: number): void {
    this.leaves.cancel(id).subscribe({
      next: (res: any) => {
        if (res) {
          this.snackBar.successSnackBar(
            res?.message || "Leave cancelled successfully",
          );
          this.leaves.history().subscribe({
            next: (page: any) => {
              if (page) {
                this.rows = page.content;
              }
            },
            error: (err: any) => {
              console.error(
                err?.error?.message || "Failed to refresh leave history",
              );
              this.snackBar.errorSnackBar(
                err?.error?.message || "Failed to refresh leave history",
              );
            },
          });
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to cancel leave",
        );
      },
    });
  }
}
