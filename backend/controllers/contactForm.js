const ContactForm = require('../models/contactForm');

exports.getAllContactForms = (req, res) => {
  ContactForm.find()
    .then((docs) => {
      // console.log(docs);
      res.status(200).json({
        message: 'contactForms fetched successfully!',
        contactForms: docs
      })

    })
    .catch((err) => {
      console.log('Error getting contact forms from DB:' + err);
      res.status(404).json({ message: 'Getting contact forms failed!' });
    });;
}

exports.createContactForm = (req, res) => {
  const contactForm = new ContactForm({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message
  });
  console.log(contactForm);
  contactForm.save()
    .then(() => {
      console.log('Contact Form saved successfully');
      res.status(201).json({ // 201=>A new resource was created.
        message: 'ContactForm added to DB successfully.'
      });
    })
    .catch((err) => {
      console.log('Error saving form to DB:', err);
      res.status(404).json({ message: 'Saving contact form failed!' });
    });
}

exports.deleteContactForm = (req, res) => {
  // console.log(req.params.id);
  ContactForm.findOneAndDelete({ _id: req.params.id })
    .then(result => {
      if (result) {
        console.log('Form deleted: ' + result);
        return res.status(200).json({ message: 'ContactUs Form deleted successfully.' });
      }
      console.log('Contact form does not exist.');
      res.status(404).send('Deleting contact form failed!');
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('Getting correct contact form failed!');
    })
}


