import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ContactFormsService } from "../contactForms.service";

@Component({
  selector: "app-contact-us",
  templateUrl: "contact-us.component.html",
  styleUrls: ["contact-us.component.css"]
})
export class ContactUsComponent {

  constructor(private contactFormService: ContactFormsService) {}

  onContactFormSubmission(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.contactFormService.submitContactForm(form.value);
    form.resetForm();
  }

  getPhoneRegex() {
    return /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
  }
}
