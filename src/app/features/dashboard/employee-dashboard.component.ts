import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: "./employee-dashboard.component.html",
  styleUrl: "./employee-dashboard.component.css",
})
export class EmployeeDashboardComponent implements OnInit {
  data: any;
  constructor(private dashboard: DashboardService) {}
  ngOnInit(): void {
    this.dashboard.employee().subscribe((data) => (this.data = data));
  }
}
