import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe( // we can listen to response using handle.
      catchError((error: HttpErrorResponse) => { // to catch error emitted in this stream.
        let errorMessage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        console.log(error);
        // alert(error.error.message);
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: 4000,
          data: { message: errorMessage}
        });
        return throwError(error); // to emit the error notification
      })
    );
  }
}
