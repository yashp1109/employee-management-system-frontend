import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { DepartmentService } from "../../services/department.service";
import { Department, Designation } from "src/app/core/models/models";
import { EmployeeService } from "src/app/services/employee.service";
import { SnackbarService } from "src/app/services/snackbar.service";

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
    mobileNumber: [
      "",
      [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
    ],
    gender: ["OTHER", Validators.required],
    dateOfBirth: [""],
    dateOfJoining: ["", Validators.required],
    departmentId: [null as number | null, Validators.required],
    designationId: [null as number | null, Validators.required],
    salary: [null as number | null, [Validators.required, Validators.min(0)]],
    managerId: [null as number | null],
    status: ["ACTIVE", Validators.required],
    role: ["", Validators.required],
    password: [""],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employees: EmployeeService,
    private departments: DepartmentService,
    private snackBar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id")) || undefined;
    this.departments.list().subscribe({
      next: (res: any) => {
        if (res) {
          this.departmentList = res;
          if (this.id) {
            this.employees.get(this.id).subscribe({
              next: (emp: any) => {
                if (emp) {
                  this.form.patchValue(emp as any);
                  this.loadDesignations(emp.departmentId);
                }
              },
              error: (err: any) => {
                this.snackBar.errorSnackBar(
                  err?.error?.message || "Failed to load employee details",
                );
              },
            });
          }
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to load departments",
        );
      },
    });

    // reload designations whenever departmentId changes
    this.form.get("departmentId")!.valueChanges.subscribe((depId) => {
      if (depId) {
        this.form.patchValue({ designationId: null });
        this.loadDesignations(depId);
      }
    });
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  isInvalid(name: string): boolean {
    const control = this.getControl(name);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(name: string): string {
    const control = this.getControl(name);
    if (!control || !control.errors) return "";
    if (control.hasError("required")) {
      return "This field is required.";
    }
    if (control.hasError("email")) {
      return "Please enter a valid email address.";
    }
    if (control.hasError("min")) {
      return "Value must be zero or greater.";
    }
    if (control.hasError("pattern")) {
      return "Please enter a valid value.";
    }
    return "Please correct this field.";
  }

  loadDesignations(departmentId: number): void {
    this.departments.designations(departmentId).subscribe({
      next: (res: any) => {
        if (res) {
          this.designationList = res;
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to load designations",
        );
      },
    });
  }

  updateEmployyee(id: any, payload: any): void {
    if (this.form.invalid || !this.id) return;
    this.employees.update(id, payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.snackBar.successSnackBar(
            res?.message || "Employee updated successfully",
          );
          this.router.navigateByUrl("/employees");
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to update employee",
        );
      },
    });
  }

  createEmployee(payload: any): void {
    this.employees.create(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.snackBar.successSnackBar(
            res?.message || "Employee created successfully",
          );
          this.router.navigateByUrl("/employees");
        }
      },
      error: (err: any) => {
        this.snackBar.errorSnackBar(
          err?.error?.message || "Failed to create employee",
        );
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as any;
    if (this.id) {
      this.updateEmployyee(this.id, payload);
    } else {
      this.createEmployee(payload);
    }
  }
}
