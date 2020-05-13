import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-book-online',
  templateUrl: './book-online.component.html',
  styleUrls: ['./book-online.component.css']
})
export class BookOnlineComponent implements OnInit {
  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}
  @ViewChild('pickupLoc', { static: false }) pickupLoc: ElementRef;
  @ViewChild('dropLoc', { static: false }) dropLoc: ElementRef;

  minDate = moment().format();
  maxDate = moment(this.minDate)
    .add(7, 'days')
    .format();

  autocomplete1: google.maps.places.Autocomplete;
  autocomplete2: google.maps.places.Autocomplete;
  place1: google.maps.places.PlaceResult;
  place2: google.maps.places.PlaceResult;

  scheduleCabForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)]
    }),
    mobile: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[2-9]\d{2}[2-9]\d{2}\d{4}$/)
      ]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    pickup_date: new FormControl(this.minDate),
    pickup_time: new FormControl('14:00'),
    passengers: new FormControl(1),
    pickup_loc: new FormControl('', {
      validators: [Validators.required]
    }),
    drop_loc: new FormControl('', {
      validators: [Validators.required]
    })
  });

  ngOnInit() {
    // www.freakyjolly.com/angular-7-6-add-google-maps-in-angular-2-plus-applications-using-angular-google-maps-module-agm-core-easily/
    this.mapsAPILoader.load().then(() => {
      this.autocomplete1 = new google.maps.places.Autocomplete(
        this.pickupLoc.nativeElement,
        {
          componentRestrictions: { country: 'US' },
          types: ['address']
        }
      );
      this.autocomplete2 = new google.maps.places.Autocomplete(
        this.dropLoc.nativeElement,
        {
          componentRestrictions: { country: 'US' },
          types: ['address']
        }
      );
      this.autocomplete1.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.place1 = this.autocomplete1.getPlace();
          console.log(this.place1);
          // verify result
          if (
            this.place1.geometry === undefined ||
            this.place1.geometry === null
          ) {
            return;
          }
        });
      });

      this.autocomplete2.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.place2 = this.autocomplete2.getPlace();
          console.log(this.place2);
          if (
            this.place2.geometry === undefined ||
            this.place2.geometry === null
          ) {
            return;
          }
        });
      });
    });
  }

  setPickupLoc() {
    this.scheduleCabForm.setValue({
      pickup_loc: this.place1.formatted_address
    });
  }

  setDropLoc() {
    this.scheduleCabForm.setValue({
      drop_loc: this.place2.formatted_address
    });
  }

  onSubmit() {
    console.log('was submitted!');
  }

  onBlur() {
    console.log(this.scheduleCabForm.get('email'));
  }
}
