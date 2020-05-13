import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from "@angular/material/snack-bar";

@Component({
  templateUrl: "./error.component.html"
})
export class ErrorComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<ErrorComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  // Using this component to display all error messages.
}
