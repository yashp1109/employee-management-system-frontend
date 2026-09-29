import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  selector: "forgotpassword",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: "./forgotpassword.component.html",
  styleUrl: "./forgotpassword.component.css",
})
export class ForgotpasswordComponent {
  submitted = false;
  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private snackBar: SnackbarService,
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

    const email = this.form.value.email;
    this.submitted = true;
    this.snackBar.successSnackBar(
      `If ${email} is registered, a reset link has been sent.`,
    );
  }
}
