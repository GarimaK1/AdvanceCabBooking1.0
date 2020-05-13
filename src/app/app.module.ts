import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BookOnlineComponent } from './book-online/book-online.component';
import { BookOnlineListComponent } from './book-online-list/book-online-list.component';
import { BookOnlineEditComponent } from './book-online-edit/book-online-edit.component';
import { FareInfoComponent } from './fare-info/fare-info.component';
import { AreasServedComponent } from './areas-served/areas-served.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsListComponent } from './contact-us-list/contact-us-list.component';
import { FooterComponent } from './footer/footer.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { PaymentDialogComponent } from './payment/payment.component';
import { BookingStatusComponent } from './booking-status/booking-status.component';
import { MessageSnackbarComponent } from './message/message.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BookOnlineComponent,
    BookOnlineListComponent,
    BookOnlineEditComponent,
    FareInfoComponent,
    AreasServedComponent,
    ContactUsComponent,
    ContactUsListComponent,
    FooterComponent,
    ErrorComponent,
    PaymentDialogComponent,
    BookingStatusComponent,
    MessageSnackbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvglCwYaOiZB9rZ2Mo07ormQXsDU9Ljj0',
      libraries: ['places']
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    PaymentDialogComponent,
    MessageSnackbarComponent
  ]
})
export class AppModule {}
