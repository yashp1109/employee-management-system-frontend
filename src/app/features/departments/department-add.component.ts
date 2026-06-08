import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DepartmentService } from "../../services/department.service";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./department-add.component.html",
  styleUrl: "./department-add.component.css",
})
export class DepartmentAddComponent {
  form = this.fb.group({ name: ["", Validators.required], description: [""] });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private departments: DepartmentService,
  ) {}
  save(): void {
    this.departments
      .create(this.form.getRawValue() as any)
      .subscribe(() => this.router.navigateByUrl("/departments"));
  }
}
