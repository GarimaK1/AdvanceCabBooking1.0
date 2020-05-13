import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject, Observable } from "rxjs";
import { AuthData } from "./auth-data.model";
import { ErrorComponent } from '../error/error.component';
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private role: string;
  private roleValueSubject = new Subject<string>();
  private isAuthenticated = false;
  private authStatusSubject = new Subject<boolean>();
  // listener that listens to changes in auth status
  // basically if wegot token or not.
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  getAuthStatusUpdateListener(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
    // this returns an observable.
    // whenever auth status changes, whatever subscribes to this will get updated value.
  }

  getRoleValueUpdateListener(): Observable<string> {
    return this.roleValueSubject.asObservable();
  }

  getIsAuthStatus() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getUserRole() {
    return this.role;
  }

  createUser(email: string, password: string) {
    const newUser: AuthData = { email, password };
    this.http
      .post<{ message: string }>(BACKEND_URL + "signup/", newUser)
      .subscribe(
        result => {
          console.log(result);
          this.router
            .navigate(["/"])
            .catch(err =>
              console.log("error navigating away from create user" + err)
            );
        },
        error => {
          // console.log("Error creating new user" + JSON.stringify(error));
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 4000,
            data: {
              message: error.error.message
            }
          });
          this.authStatusSubject.next(false);
        }
      );
  }

  loginUser(email: string, password: string) {
    const user: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; role: string }>(
        BACKEND_URL + "login/",
        user
      )
      .subscribe(
        result => {
          // console.log(result);
          const token = result.token;
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            this.authStatusSubject.next(true); // setting auth status as true, since we got the token.
            this.role = result.role;
            this.roleValueSubject.next(this.role);
            const expiresInDuration = result.expiresIn; // in seconds
            // console.log(expiresInDuration);

            // Setting timer to logout in 1 hour (3600s or 3600*1000ms)
            this.setAuthTimer(expiresInDuration);

            // Saving token, expiration date and role in local storage
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthDataInLS(token, expirationDate, this.role);
            // console.log(expirationDate);

            // After successful authentication, navigate to home page.
            this.router.navigate(["/"]).catch(err => {
              console.log("Error in navigating away from login page: " + err);
            });
          }
        },
        error => {
          // console.log("Error logging in user: " + JSON.stringify(error));
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 4000,
            data: {
              message: error.error.message
            }
          });
          this.authStatusSubject.next(false);
        }
      );
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000); // nodeJs setTimeout() works with milliseconds.
  }

  autoAuthUser() {
    // to prevent info being lost during page reloads,
    // automatically check this info every time app.component.ts loads
    // coz it is the bootstrap component: first component to be loaded/initialized.
    // called in app.component.ts in ngOnInit()
    const authInfo = this.getAuthDataFromLS();
    // console.log('authInfo: ' + authInfo);
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime(); // in milliseconds
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatusSubject.next(true);
      this.role = authInfo.role;
      // console.log("autoAuthUser: role:  " + this.role);
      this.roleValueSubject.next(this.role);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private saveAuthDataInLS(token: string, expirationDate: Date, role: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("role", role);
  }

  private clearAuthDataInLS() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("role");
  }

  private getAuthDataFromLS() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const role = localStorage.getItem("role");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate), // to convert from ISO to local i guess
      role: role
    };
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusSubject.next(false); // setting auth status as false on logout
    this.role = null;
    this.roleValueSubject.next(this.role);
    console.log("User logged out");
    clearTimeout(this.tokenTimer);
    this.clearAuthDataInLS();
    this.router.navigate(["/"]).catch(err => {
      console.log("Error in navigating away from login page: " + err);
    });
  }
}
