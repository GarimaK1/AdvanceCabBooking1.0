import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit,
  OnDestroy
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { MapsAPILoader } from "@agm/core";
import { ScheduleCabService } from "../scheduleCab.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ScheduleCab } from "../book-online/scheduleCab.model";
import { ErrorComponent } from "../error/error.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: "./book-online-edit.component.html",
  styleUrls: ["./book-online-edit.component.css"],
  selector: "<app-book-online-edit>"
})
export class BookOnlineEditComponent implements OnInit, OnDestroy {
  private editScheduleCabFormId: string;
  private scheduleCabFormToEdit: ScheduleCab;
  private userIsAuthenticated = false;
  private role: string;
  private authStatusListenerSub: Subscription;
  private roleValueListenerSub: Subscription;

  @ViewChild("pickupLoc", { static: false }) pickupLoc: ElementRef;
  @ViewChild("dropLoc", { static: false }) dropLoc: ElementRef;

  minDate = moment().format();
  maxDate = moment(this.minDate)
    .add(7, "days")
    .format();

  autocomplete1: google.maps.places.Autocomplete;
  autocomplete2: google.maps.places.Autocomplete;
  place1: google.maps.places.PlaceResult;
  place2: google.maps.places.PlaceResult;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private scheduleCabService: ScheduleCabService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // why need ngZone??
    // refer book-online.component.ts_copy at root level for reference
  }

  editScheduleCabForm = new FormGroup({
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
    passengers: new FormControl(
      { value: "", disabled: true },
      {
        validators: [Validators.min(1), Validators.max(8), Validators.required]
      }
    ),
    pickup_loc: new FormControl(
      { value: "", disabled: true },
      {
        validators: [Validators.required]
      }
    ),
    drop_loc: new FormControl(
      { value: "", disabled: true },
      {
        validators: [Validators.required]
      }
    )
  });

  ngOnInit(): void {
    // get auth info
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

    // Getting info about form to edit
    this.editScheduleCabFormId = this.route.snapshot.paramMap.get("formId");
    // console.log("this.editScheduleCabFormId" + this.editScheduleCabFormId);
    this.scheduleCabService
      .getScheduleCabForm(this.editScheduleCabFormId)
      .subscribe(
        responseData => {
          // console.log(responseData);
          this.scheduleCabFormToEdit = responseData.scheduleCabForm;
          // console.log("form to edit: " + JSON.stringify(this.scheduleCabFormToEdit));
          this.editScheduleCabForm.setValue({
            name: this.scheduleCabFormToEdit.name,
            mobile: this.scheduleCabFormToEdit.phone,
            email: this.scheduleCabFormToEdit.email,
            pickup_date: this.scheduleCabFormToEdit.pickup_date,
            pickup_time: this.scheduleCabFormToEdit.pickup_time,
            passengers: this.scheduleCabFormToEdit.passengers,
            pickup_loc: this.scheduleCabFormToEdit.pickup_location,
            drop_loc: this.scheduleCabFormToEdit.drop_location
          });
          this.editScheduleCabForm.markAllAsTouched(); // for validators to detect form errors again
        },
        error => {
          console.log(
            "Error getting schedule cab form: " + JSON.stringify(error)
          );
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 4000,
            data: {
              message: "Error getting schedule cab form"
            }
          });
        }
      );

    // Loading Google Places for autopopulating addresses.
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
        this.place1 = this.autocomplete1.getPlace();
        // console.log(this.place1);
        this.setPickupLoc();
        // verify result
        if (
          this.place1.formatted_address === undefined ||
          this.place1.formatted_address === null
        ) {
          return;
        }
      });

      this.autocomplete2.addListener("place_changed", () => {
        this.place2 = this.autocomplete2.getPlace();
        // console.log(this.place2);
        this.setDropLoc();
        if (
          this.place2.formatted_address === undefined ||
          this.place2.formatted_address === null
        ) {
          return;
        }
      });
    });
  }

  setPickupLoc() {
    this.editScheduleCabForm.patchValue({
      pickup_loc: this.place1.formatted_address
    });
  }

  setDropLoc() {
    this.editScheduleCabForm.patchValue({
      drop_loc: this.place2.formatted_address
    });
  }

  onBackButton() {
    // console.log('Clicked back button');
    this.router
      .navigate(["/schedule-cab-list"])
      .catch(err =>
        console.log("error navigating away from edit schedule cab form" + err)
      );
  }

  onEditScheduleCabForm() {
    // console.log(this.editScheduleCabForm.value);
    this.scheduleCabService.editScheduleCabForm(
      this.editScheduleCabFormId,
      this.editScheduleCabForm.value
    );
    this.editScheduleCabForm.reset({
      name: "",
      mobile: "",
      email: "",
      pickup_date: "",
      pickup_time: "",
      passengers: this.scheduleCabFormToEdit.passengers,
      pickup_loc: this.scheduleCabFormToEdit.pickup_location,
      drop_loc: this.scheduleCabFormToEdit.drop_location
    });
    Object.keys(this.editScheduleCabForm.controls).forEach(key => {
      this.editScheduleCabForm.get(key).setErrors(null);
    });
    // console.log(this.editScheduleCabForm.value);
  }

  ngOnDestroy() {
    this.authStatusListenerSub.unsubscribe();
    this.roleValueListenerSub.unsubscribe();
  }
}
