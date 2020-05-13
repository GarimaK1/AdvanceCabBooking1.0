const mongoose = require('mongoose');

const contactFormSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  subject: { type: String, required: true },
  message: { type: String, required: true }
});

module.exports = mongoose.model('ContactForm', contactFormSchema);
