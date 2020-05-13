import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent {

  constructor(private authService: AuthService) {}

  onSignup(signupForm: NgForm) {
    // console.log(signupForm.value);
    if ( signupForm.invalid) {
      return;
    }
    this.authService.createUser(signupForm.value.email, signupForm.value.password);
    signupForm.resetForm();
  }
}
