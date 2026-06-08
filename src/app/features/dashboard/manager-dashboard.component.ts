import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: "./manager-dashboard.component.html",
  styleUrl: "./manager-dashboard.component.css",
})
export class ManagerDashboardComponent implements OnInit {
  data: any;
  constructor(private dashboard: DashboardService) {}
  ngOnInit(): void {
    this.dashboard.manager().subscribe((data) => (this.data = data));
  }
}
