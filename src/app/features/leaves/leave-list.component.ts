import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { LeaveBalance, LeaveRequest } from "../../core/models/models";
import { LeaveService } from "src/app/services/leave.service";

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

  constructor(private leaves: LeaveService) {}

  ngOnInit(): void {
    this.leaves.history().subscribe((page: any) => (this.rows = page.content));
    this.leaves.balance().subscribe((b: any) => (this.balances = b));
  }

  cancel(id: number): void {
    this.leaves
      .cancel(id)
      .subscribe(() =>
        this.leaves.history().subscribe((page) => (this.rows = page.content)),
      );
  }
}
