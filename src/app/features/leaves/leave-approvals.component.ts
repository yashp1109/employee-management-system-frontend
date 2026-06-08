import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { LeaveRequest } from "../../core/models/models";
import { LeaveService } from "src/app/services/leave.service";

@Component({
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: "./leave-approvals.component.html",
  styleUrl: "./leave-approvals.component.css",
})
export class LeaveApprovalsComponent implements OnInit {
  columns = ["employee", "type", "dates", "days", "reason", "actions"];
  rows: LeaveRequest[] = [];

  constructor(private leaves: LeaveService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.leaves.pending().subscribe((p: any) => (this.rows = p.content));
  }

  approve(id: number): void {
    this.leaves.approve(id).subscribe(() => this.load());
  }

  reject(id: number): void {
    this.leaves.reject(id).subscribe(() => this.load());
  }
}
