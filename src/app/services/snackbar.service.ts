import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  successSnackBar(message: string) {
    this.snackBar.open(message, "Close", {
      duration: 3000,
      panelClass: ["snackbar-success"],
      verticalPosition: "top",
    });
  }

  errorSnackBar(message: string) {
    this.snackBar.open(message, "Close", {
      duration: 3000,
      panelClass: ["snackbar-error"],
      verticalPosition: "top",
    });
  }

  wanrningSnackBar(message: string) {
    this.snackBar.open(message, "Close", {
      duration: 3000,
      panelClass: ["snackbar-warning"],
      verticalPosition: "top",
    });
  }
}
