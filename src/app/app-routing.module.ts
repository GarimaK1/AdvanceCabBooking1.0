import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FareInfoComponent } from './fare-info/fare-info.component';
import { AreasServedComponent } from './areas-served/areas-served.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsListComponent } from './contact-us-list/contact-us-list.component';
import { BookOnlineComponent } from './book-online/book-online.component';
import { BookOnlineListComponent } from './book-online-list/book-online-list.component';
import { BookOnlineEditComponent } from './book-online-edit/book-online-edit.component';
import { AuthGuard } from './auth/auth.guard';
import { BookingStatusComponent } from './booking-status/booking-status.component';

const routes: Routes = [
  { path: "", component: BookOnlineComponent },
  { path: "book-online", component: BookOnlineComponent },
  { path: "fare", component: FareInfoComponent },
  { path: "areas-served", component: AreasServedComponent },
  { path: "contact-us", component: ContactUsComponent },
  {
    path: "contact-us-list",
    component: ContactUsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "schedule-cab-list",
    component: BookOnlineListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "schedule-cab-edit/:formId",
    component: BookOnlineEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "payment-status/:stat",
    component: BookingStatusComponent
  },
  // Login and Signup components are part of Lazy Loading.
  // Find their routes in './auth/auth-routing.module.ts' file,
  // which is used in './auth/auth.module.ts' file
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
})
export class AppRoutingModule {}
