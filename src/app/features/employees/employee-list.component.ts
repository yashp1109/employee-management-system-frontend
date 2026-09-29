import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Employee, ManagerOption, Role } from "../../core/models/models";
import { Department } from "../../core/models/models";
import { EmployeeService } from "src/app/services/employee.service";
import { DepartmentService } from "src/app/services/department.service";
import { AuthService } from "../../core/auth/auth.service";
import { SnackbarService } from "src/app/services/snackbar.service";

const PAGE_SIZE = 5;

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.css",
})
export class EmployeeListComponent implements OnInit {
  rows: Employee[] = [];
  total = 0;
  totalPages = 1;
  pageIndex = 0;
  sortAsc: any;
  sortDirection: "asc" | "desc" = "asc";
  sortField: string = "firstName";
  departmentList: Department[] = [];
  managerList: ManagerOption[] = [];

  // filters
  filters = this.fb.group({
    q: [""],
    departmentId: [null as number | null],
    managerId: [null as number | null],
    joiningFrom: [""],
    joiningTo: [""],
  });

  // slide-over panel
  panelOpen = false;
  editingId: number | null = null;
  saving = false;
  private editingSource: Employee | null = null;

  form = this.fb.group({
    fullName: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],

    employeeCode: [
      "",
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z0-9]+$/),
      ],
    ],

    departmentId: [null as number | null, Validators.required],

    managerId: [null as number | null],

    dateOfJoining: ["", Validators.required],

    email: ["", [Validators.required, Validators.email]],

    mobileNumber: ["", [Validators.pattern(/^[6-9]\d{9}$/)]],

    role: ["", Validators.required],
  });

  // delete confirmation
  deleteTarget: Employee | null = null;
  deleting = false;

  constructor(
    private fb: FormBuilder,
    private employees: EmployeeService,
    private departments: DepartmentService,
    private snackbar: SnackbarService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadManagers();
    this.load();

    // Search field with debounce
    this.filters.controls.q.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.load();
      });

    // Other filters load immediately
    this.filters.controls.departmentId.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });

    this.filters.controls.managerId.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });

    this.filters.controls.joiningFrom.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });

    this.filters.controls.joiningTo.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  private loadManagers(): void {
    this.employees.managers().subscribe((list) => (this.managerList = list));
  }

  private loadDepartments(): void {
    this.departments.list().subscribe({
      next: (departments) => {
        this.departmentList = departments;
      },
    });
  }

  load(): void {
    const f = this.filters.getRawValue();
    this.employees
      .list({
        q: f.q ?? "",
        departmentId: f.departmentId,
        managerId: f.managerId,
        joiningFrom: f.joiningFrom || null,
        joiningTo: f.joiningTo || null,
        page: this.pageIndex,
        size: PAGE_SIZE,
        sort: `${this.sortField},${this.sortDirection}`,
      })
      .subscribe((page) => {
        this.rows = page.content;
        this.total = page.page.totalElements;
        this.totalPages = page.page.totalPages || 1;
      });
  }

  clearFilters(): void {
    this.filters.reset({
      q: "",
      departmentId: null,
      managerId: null,
      joiningFrom: "",
      joiningTo: "",
    });
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.load();
    }
  }

  nextPage(): void {
    if (this.pageIndex + 1 < this.totalPages) {
      this.pageIndex++;
      this.load();
    }
  }

  // ── slide-over ──
  openAdd(): void {
    this.editingId = null;
    this.editingSource = null;
    this.form.reset({
      fullName: "",
      employeeCode: "",
      departmentId: null,
      managerId: null,
      dateOfJoining: "",
      email: "",
      mobileNumber: "",
      role: "",
    });
    this.panelOpen = true;
  }

  openEdit(emp: Employee): void {
    this.editingId = emp.id ?? null;
    this.editingSource = emp;
    this.form.get("employeeCode")?.disable();
    this.form.get("dateOfJoining")?.disable();

    this.form.reset({
      fullName: `${emp.firstName} ${emp.lastName}`.trim(),
      employeeCode: emp.employeeCode,
      departmentId: emp.departmentId,
      managerId: emp.managerId ?? null,
      dateOfJoining: emp.dateOfJoining ?? "",
      email: emp.email,
      mobileNumber: emp.mobileNumber ?? "",
      role: emp.role ?? "",
    });
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const fullName = (v.fullName ?? "").trim().replace(/\s+/g, " ");
    const parts = fullName.split(" ");
    const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const firstName =
      parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];

    const src = this.editingSource;
    const payload: Employee = {
      employeeCode: v.employeeCode!,
      firstName,
      lastName,
      email: v.email!,
      mobileNumber: v.mobileNumber || undefined,
      gender: src?.gender ?? "OTHER",
      dateOfBirth: src?.dateOfBirth,
      dateOfJoining: v.dateOfJoining!,
      departmentId: v.departmentId!,
      designationId: src?.designationId ?? null,
      salary: src?.salary ?? 0,
      managerId: v.managerId ?? undefined,
      status: src?.status ?? "ACTIVE",
      role: (v.role as Role) ?? "EMPLOYEE",
    };

    this.saving = true;
    const request = this.editingId
      ? this.employees.update(this.editingId, payload)
      : this.employees.create(payload);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.snackbar.successSnackBar(
          this.editingId ? "Employee updated" : "Employee added",
        );
        this.panelOpen = false;
        this.loadManagers();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.snackbar.errorSnackBar(
          err?.error?.message || "Failed to save employee",
        );
      },
    });
  }

  // ── delete ──
  askDelete(emp: Employee): void {
    this.deleteTarget = emp;
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }

  confirmDelete(): void {
    if (!this.deleteTarget?.id) return;
    this.deleting = true;
    this.employees.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleting = false;
        this.snackbar.successSnackBar("Employee deleted");
        this.deleteTarget = null;
        if (this.rows.length === 1 && this.pageIndex > 0) this.pageIndex--;
        this.loadManagers();
        this.load();
      },
      error: (err) => {
        this.deleting = false;
        this.snackbar.errorSnackBar(
          err?.error?.message || "Failed to delete employee",
        );
      },
    });
  }

  sortByName(): void {
    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    this.sortField = "firstName";
    this.load();
  }
}
