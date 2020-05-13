import { Injectable } from "@angular/core";
import { ScheduleCab } from './book-online/scheduleCab.model';

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  public isPaid = false;
  scheduleCabForm: ScheduleCab;
  distance: number;
  fare: number;

  setScheduleCabForm(form) {
    this.scheduleCabForm = form;
  }

  getScheduleCabForm() {
    return this.scheduleCabForm;
  }

  setDistance(distance) {
    this.distance = distance;
  }

  getDistance() {
    return this.distance;
  }

  setFare(fare) {
    this.fare = fare;
  }

  getFare() {
    return this.fare;
  }
}
