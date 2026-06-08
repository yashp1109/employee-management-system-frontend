import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrl: "./admin-dashboard.component.css",
})
export class AdminDashboardComponent implements OnInit {
  data: any;
  constructor(private dashboard: DashboardService) {}
  ngOnInit(): void {
    this.dashboard.admin().subscribe((data) => (this.data = data));
  }
}
