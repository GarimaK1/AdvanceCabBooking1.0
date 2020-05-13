import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.css']
})
export class BookingStatusComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  bookingStatus;

  ngOnInit() {
    this.bookingStatus = this.route.snapshot.paramMap.get("stat");
    console.log('this.booking Status: ' + this.bookingStatus);
  }

}
