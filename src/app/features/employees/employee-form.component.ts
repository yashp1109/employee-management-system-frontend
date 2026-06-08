import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { DepartmentService } from "../../services/department.service";
import { Department, Designation } from "src/app/core/models/models";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: "./employee-form.component.html",
  styleUrl: "./employee-form.component.css",
})
export class EmployeeFormComponent implements OnInit {
  id?: number;
  departmentList: Department[] = [];
  designationList: Designation[] = [];

  textFields = [
    { name: "employeeCode", label: "Employee Code", type: "text" },
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "mobileNumber", label: "Mobile Number", type: "text" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "dateOfJoining", label: "Date of Joining", type: "date" },
    { name: "salary", label: "Salary", type: "number" },
    { name: "managerId", label: "Manager ID", type: "number" },
    { name: "password", label: "Password", type: "password" },
  ];

  form = this.fb.group({
    employeeCode: ["", Validators.required],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    mobileNumber: [""],
    gender: ["OTHER", Validators.required],
    dateOfBirth: [""],
    dateOfJoining: ["", Validators.required],
    departmentId: [null as number | null, Validators.required],
    designationId: [null as number | null, Validators.required],
    salary: [null as number | null, Validators.required],
    managerId: [null as number | null],
    status: ["ACTIVE", Validators.required],
    role: ["EMPLOYEE", Validators.required],
    password: [""],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employees: EmployeeService,
    private departments: DepartmentService,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id")) || undefined;
    this.departments.list().subscribe((list) => {
      this.departmentList = list;
      if (this.id) {
        this.employees.get(this.id).subscribe((emp) => {
          this.form.patchValue(emp as any);
          this.loadDesignations(emp.departmentId);
        });
      }
    });

    // reload designations whenever departmentId changes
    this.form.get("departmentId")!.valueChanges.subscribe((depId) => {
      if (depId) {
        this.form.patchValue({ designationId: null });
        this.loadDesignations(depId);
      }
    });
  }

  loadDesignations(departmentId: number): void {
    this.departments
      .designations(departmentId)
      .subscribe((list) => (this.designationList = list));
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as any;
    const request = this.id
      ? this.employees.update(this.id, payload)
      : this.employees.create(payload);
    request.subscribe(() => this.router.navigateByUrl("/employees"));
  }
}
