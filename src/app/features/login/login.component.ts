import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  error = "";
  hidePassword = true;
  form = this.fb.group({
    email: ["admin@ems.local", [Validators.required, Validators.email]],
    password: ["Admin@123", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

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
    return "Please correct this field.";
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: (res: any) => {
        if (res) {
          this.error = "";
          this.router.navigateByUrl("/dashboard");
        }
      },
      error: (err: any) => {
        this.error = err?.error?.message || "Invalid email or password";
      },
    });
  }

  private isApiSuccess(response: any): boolean {
    return response?.status == 200 || response?.status === undefined;
  }

  private apiMessage(response: any, fallback: string): string {
    return response?.message || fallback;
  }
}
