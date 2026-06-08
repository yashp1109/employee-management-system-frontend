import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { FormsModule } from "@angular/forms";
import { Employee } from "../../core/models/models";
import { EmployeeService } from "src/app/services/employee.service";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.css",
})
export class EmployeeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  columns = ["code", "name", "email", "department", "status", "actions"];
  rows: Employee[] = [];
  total = 0;
  q = "";
  pageIndex = 0;

  constructor(
    private employees: EmployeeService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.employees.list(this.q, this.pageIndex).subscribe((page: any) => {
      this.rows = page.content;
      this.total = page.totalElements;
    });
  }
  page(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.load();
  }
}
