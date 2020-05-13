export interface ContactUs {
  // A format for the structure and fields in the contact-us form
  id: string;
  name: string;
  phone?: number;
  email: string;
  subject: string;
  message: string;
}
