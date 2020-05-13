import { Component, OnInit, OnDestroy } from "@angular/core";
import { ScheduleCab } from "../book-online/scheduleCab.model";
import { ScheduleCabService } from "../scheduleCab.service";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-book-online-list",
  templateUrl: "book-online-list.component.html",
  styleUrls: ["book-online-list.component.css"]
})
export class BookOnlineListComponent implements OnInit, OnDestroy {

  scheduleCabForms: ScheduleCab[] = [];
  userIsAuthenticated = false;
  role: string;
  private scheduleCabFormsUpdateSub: Subscription;
  private authStatusListenerSub: Subscription;
  private roleValueListenerSub: Subscription;

  constructor(
    private scheduleCabService: ScheduleCabService,
    private authService: AuthService
  ) {}

  /*
  altenative to using
  <a  mat-stroked-button color="primary" [routerLink]="['/schedule-cab-edit/', scheduleCabForm.id]">Edit Form</a>,
  use
  <button mat-stroked-button color="primary" (click)="onEditScheduleCabForm(scheduleCabForm.id)">Edit Form</button>
  onEditScheduleCabForm(formId) {
    console.log('Edit form clicked, formId: ' + formId);
    this.router
      .navigate(["/schedule-cab-edit/", formId])
      .catch(err =>
        console.log("error navigating away from create user" + err)
      );
      // https://stackoverflow.com/questions/44864303/send-data-through-routing-paths-in-angular
  }
  */

  onRefreshClick() {
    this.scheduleCabService.getScheduleCabForms();
  }

  onDeleteScheduleCabForm(formId) {
    this.scheduleCabService.onDeleteForm(formId);
  }

  ngOnInit() {
    this.scheduleCabService.getScheduleCabForms();
    this.scheduleCabFormsUpdateSub = this.scheduleCabService
      // to listen to:
      // this.scheduleCabFormsUpdated.next([...this.scheduleCabForms]);
      // in ScheduleCabService
      .getScheduleCabFormsUpdateListener()
      .subscribe(scheduleCabForms => {
        this.scheduleCabForms = scheduleCabForms;
      });
    this.userIsAuthenticated = this.authService.getIsAuthStatus();
    this.authStatusListenerSub = this.authService
      .getAuthStatusUpdateListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.role = this.authService.getUserRole();
    this.roleValueListenerSub = this.authService
      .getRoleValueUpdateListener()
      .subscribe(role => {
        this.role = role;
      });
  }

  ngOnDestroy() {
    this.scheduleCabFormsUpdateSub.unsubscribe();
    this.authStatusListenerSub.unsubscribe();
    this.roleValueListenerSub.unsubscribe();
  }
}
