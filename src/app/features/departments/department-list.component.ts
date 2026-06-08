import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { Department } from "../../core/models/models";
import { DepartmentService } from "../../services/department.service";

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: "./department-list.component.html",
  styleUrl: "./department-list.component.css",
})
export class DepartmentListComponent implements OnInit {
  columns = ["name", "description"];
  rows: Department[] = [];
  constructor(private departments: DepartmentService) {}
  ngOnInit(): void {
    this.departments.list().subscribe((rows) => (this.rows = rows));
  }
}
