import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  constructor(private authservice: AuthService) {}

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    // console.log(loginForm.value);
    this.authservice.loginUser(loginForm.value.email, loginForm.value.password);
    loginForm.resetForm();
  }
}
