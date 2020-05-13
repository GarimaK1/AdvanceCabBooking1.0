import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  userIsAuthenticated = false;
  role: string;
  private authStatusListenerSub: Subscription;
  private roleValueListenerSub: Subscription;

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthStatus();
    this.role = this.authService.getUserRole();
    this.authStatusListenerSub = this.authService
      .getAuthStatusUpdateListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.roleValueListenerSub = this.authService
      .getRoleValueUpdateListener()
      .subscribe(role => {
        this.role = role;
        // console.log("inside header init, inside roleValueListenerSub. Role: " + this.role);
      });
  }

  ngOnDestroy() {
    this.authStatusListenerSub.unsubscribe();
    this.roleValueListenerSub.unsubscribe();
  }
}
