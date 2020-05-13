import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ScheduleCab } from "./book-online/scheduleCab.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MessageSnackbarComponent } from "./message/message.component";
import { ErrorComponent } from "./error/error.component";
import { environment } from "../environments/environment";

const BACKEND_URL = environment.apiUrl + "/scheduleCabForm/";

@Injectable({
  providedIn: "root"
})
export class ScheduleCabService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  private scheduleCabForms: ScheduleCab[] = [];
  private scheduleCabFormsUpdated = new Subject<ScheduleCab[]>();

  getScheduleCabFormsUpdateListener() {
    return this.scheduleCabFormsUpdated.asObservable();
  }

  submitScheduleCabForm(scheduleCabForm: ScheduleCab) {
    this.http.post<{ message: string }>(BACKEND_URL, scheduleCabForm).subscribe(
      responseData => {
        console.log(responseData.message);
        this.snackBar.openFromComponent(MessageSnackbarComponent, {
          duration: 4000,
          data: {
            message: "Form submitted successfully."
          }
        });
      },
      error => {
        console.log(
          "Error submitting schedule cab form: " + JSON.stringify(error)
        );
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: 4000,
          data: {
            message: "Error submitting schedule cab form."
          }
        });
      }
    );
  }

  editScheduleCabForm(
    editScheduleCabFormId: string,
    editScheduleCabForm
  ) {
    const phoneToEdit = +editScheduleCabForm.mobile;
    // console.log(editScheduleCabForm);
    this.http
      .patch<{ message: string; scheduleCabForm: any }>(
        BACKEND_URL + editScheduleCabFormId,
        {
          name: editScheduleCabForm.name,
          phone: phoneToEdit,
          email: editScheduleCabForm.email,
          pickup_date: editScheduleCabForm.pickup_date,
          pickup_time: editScheduleCabForm.pickup_time
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData.message);
          const updatedScheduleCabForms = this.scheduleCabForms;
          const oldFormIndex = updatedScheduleCabForms.findIndex(
            form => form.id === editScheduleCabFormId
          );
          updatedScheduleCabForms[oldFormIndex] = editScheduleCabForm;
          this.scheduleCabForms = updatedScheduleCabForms;
          this.scheduleCabFormsUpdated.next([...this.scheduleCabForms]);
          this.snackBar.openFromComponent(MessageSnackbarComponent, {
            duration: 4000,
            data: {
              message: "Form updated successfully."
            }
          });
        },
        error => {
          console.log(
            "Error submitting edited schedule cab form: " +
              JSON.stringify(error)
          );
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 4000,
            data: {
              message: "Error updating form."
            }
          });
        }
      );
  }

  getScheduleCabForm(formId: string) {
    return this.http.get<{ message: string; scheduleCabForm: any }>(
      BACKEND_URL + formId
    );
  }

  getScheduleCabForms() {
    // return [...this.scheduleCabForms];
    this.http
      .get<{ message: string; cabForms: any }>(BACKEND_URL)
      .pipe(
        map(responseData => {
          return responseData.cabForms.map(cabForm => {
            return {
              id: cabForm._id,
              name: cabForm.name,
              email: cabForm.email,
              phone: cabForm.phone,
              pickup_date: moment(cabForm.pickup_date).format("LL"),
              pickup_time: cabForm.pickup_time,
              passengers: cabForm.passengers,
              pickup_location: cabForm.pickup_location,
              drop_location: cabForm.drop_location,
              creator: cabForm.creator
            };
          });
        })
      )
      .subscribe(
        responseData => {
          // console.log(responseData);
          this.scheduleCabForms = responseData;
          this.scheduleCabFormsUpdated.next([...this.scheduleCabForms]);
        },
        error => {
          console.log(
            "Error getting schedule cab form: " + JSON.stringify(error)
          );
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 4000,
            data: {
              message: "Error getting schedule cab forms."
            }
          });
        }
      );
  }

  onDeleteForm(scheduleCabFormId) {
    // console.log(scheduleCabFormId);
    this.http
      .delete<{ message: string; scheduleCabForm: any }>(
        BACKEND_URL + scheduleCabFormId
      )
      .subscribe(
        responseData => {
          // console.log(responseData);
          const updatedScheduleCabForms = this.scheduleCabForms.filter(
            form => form.id !== scheduleCabFormId
          );
          this.scheduleCabForms = updatedScheduleCabForms;
          this.scheduleCabFormsUpdated.next([...this.scheduleCabForms]);
          this.snackBar.openFromComponent(MessageSnackbarComponent, {
            duration: 4000,
            data: {
              message: "Schedule Cab Form deleted successfully."
            }
          });
        },
        error => {
          console.log(
            "Error deleting schedule cab form: " + JSON.stringify(error)
          );
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 4000,
            data: {
              message: "Error deleting schedule cab form."
            }
          });
        }
      );
  }
}
