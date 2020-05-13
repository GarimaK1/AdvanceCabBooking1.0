import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { MapsAPILoader } from "@agm/core";
import { ScheduleCabService } from "../scheduleCab.service";
import { PaymentDialogComponent } from "../payment/payment.component";
import { MatDialog } from "@angular/material/dialog";
import { PaymentService } from "../payment.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorComponent } from "../error/error.component";

@Component({
  selector: "app-book-online",
  templateUrl: "./book-online.component.html",
  styleUrls: ["./book-online.component.css"]
})
export class BookOnlineComponent implements OnInit {
  minDate = moment().format();
  maxDate = moment(this.minDate)
    .add(7, "days")
    .format();

  @ViewChild("pickupLoc", { static: false }) pickupLoc: ElementRef;
  @ViewChild("dropLoc", { static: false }) dropLoc: ElementRef;

  autocomplete1: google.maps.places.Autocomplete;
  autocomplete2: google.maps.places.Autocomplete;
  place1: google.maps.places.PlaceResult; // pickup location
  place2: google.maps.places.PlaceResult; // drop location
  distance: string;
  distanceIntermediate: string;
  distanceNumerical: number;
  fare: number;
  distService: google.maps.DistanceMatrixService; // accessing the Google Distance Matrix service

  scheduleCabForm = new FormGroup({
    name: new FormControl("", {
      validators: [Validators.required, Validators.minLength(4)]
    }),
    mobile: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^[2-9]\d{2}[2-9]\d{2}\d{4}$/)
      ]
    }),
    email: new FormControl("", {
      validators: [Validators.required, Validators.email]
    }),
    pickup_date: new FormControl(this.minDate, {
      validators: [Validators.required] // custom validator not required for date
    }),
    pickup_time: new FormControl("", {
      validators: [Validators.required]
    }),
    passengers: new FormControl(1, {
      validators: [Validators.min(1), Validators.max(8), Validators.required]
    }),
    pickup_loc: new FormControl("", {
      validators: [Validators.required]
    }),
    drop_loc: new FormControl("", {
      validators: [Validators.required]
    })
  });

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private scheduleCabService: ScheduleCabService,
    private paymentService: PaymentService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // why need ngZone??
    // refer book-online.component.ts_copy at root level for reference
  }

  ngOnInit() {
    // Loading Google Places for auto-populating addresses.
    // www.freakyjolly.com/angular-7-6-add-google-maps-in-angular-2-plus-applications-using-angular-google-maps-module-agm-core-easily/
    this.mapsAPILoader.load().then(() => {
      this.autocomplete1 = new google.maps.places.Autocomplete(
        this.pickupLoc.nativeElement,
        {
          componentRestrictions: { country: "US" },
          types: ["address"]
        }
      );
      this.autocomplete2 = new google.maps.places.Autocomplete(
        this.dropLoc.nativeElement,
        {
          componentRestrictions: { country: "US" },
          types: ["address"]
        }
      );
      this.autocomplete1.addListener("place_changed", () => {
        this.place1 = this.autocomplete1.getPlace(); // pickup location
        console.log(this.place1);
        // verify result
        if (
          this.place1.formatted_address === undefined ||
          this.place1.formatted_address === null
        ) {
          return;
        }
        this.setPickupLoc();
      });

      this.autocomplete2.addListener("place_changed", () => {
        this.place2 = this.autocomplete2.getPlace(); // drop location
        console.log(this.place2);
        if (
          this.place2.formatted_address === undefined ||
          this.place2.formatted_address === null
        ) {
          return;
        }
        this.setDropLoc();
      });
    });
  }

  setPickupLoc() {
    this.scheduleCabForm.patchValue({
      pickup_loc: this.place1.formatted_address
    });
  }

  setDropLoc() {
    this.scheduleCabForm.patchValue({
      drop_loc: this.place2.formatted_address
    });
  }

  async onSubmitScheduleCabForm() {
    // console.log(this.scheduleCabForm.value);
    this.paymentService.setScheduleCabForm(this.scheduleCabForm.value);
    try {
      this.distance = await this.getDistance();
      console.log(
        "Obtained distance before opening dialog box, distance = " +
          this.distance
      );
      this.distanceIntermediate = this.distance.split(" ")[0];
      this.distanceNumerical = Number(
        this.distanceIntermediate.replace(/[^0-9.]+/g, "")
      );
      this.paymentService.setDistance(this.distanceNumerical);
      this.fare = +(this.distanceNumerical * 2.6).toFixed(2);
      this.paymentService.setFare(this.fare);
      this.dialog.open(PaymentDialogComponent);
      if (this.paymentService.isPaid) {
        console.log("why is this running");
        this.scheduleCabService.submitScheduleCabForm(
          this.scheduleCabForm.value
        );
        this.scheduleCabForm.reset();
        Object.keys(this.scheduleCabForm.controls).forEach(key => {
          this.scheduleCabForm.get(key).setErrors(null);
        });
        // console.log(this.scheduleCabForm.value);
      }
    } catch (err) {
      console.log("Error in obtaining distance, Error: " + err);
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: 4000,
        data: {
          message: "Error in obtaining distance. Cannot proceed further."
        }
      });
    }
  }

  getDistance(): Promise<string> {
    // Don't use async getDistance() because it already returns a Promise.
    // https://developers.google.com/maps/documentation/javascript/distancematrix#DrivingOptions
    this.distService = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
      this.distService.getDistanceMatrix(
        {
          origins: [this.place1.formatted_address],
          destinations: [this.place2.formatted_address],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false
        },
        (
          response: google.maps.DistanceMatrixResponse,
          status: google.maps.DistanceMatrixStatus
        ) => {
          if (status === google.maps.DistanceMatrixStatus.OK) {
            const origins = response.originAddresses;
            const destinations = response.destinationAddresses;
            for (let i = 0; i < origins.length; i++) {
              const results = response.rows[i].elements;
              for (let j = 0; j < results.length; j++) {
                const element = results[j];
                const distance = element.distance.text; // distance obtained here.
                // console.log('dist = ' + distance);
                if (distance) {
                  resolve(distance);
                } else {
                  reject(
                    new Error("Could not get distance in getDistanceMatrix()")
                  );
                }
              }
            }
          } else {
            console.log(
              "Error getting distance from google.maps.DistanceMatrix"
            );
          }
        }
      );
    });
  }
}
