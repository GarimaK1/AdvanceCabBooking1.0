import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from "@angular/material/snack-bar";

@Component({
  templateUrl: "./message.component.html"
})
export class MessageSnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<MessageSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  // Using this component to display all success messages.
}
