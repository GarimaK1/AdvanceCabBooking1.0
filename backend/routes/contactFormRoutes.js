const express = require('express');
const router = express.Router();
const ContactFormController = require('../controllers/contactForm');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
// use checkAuth middleware to verify token.
// this is used to restrict access to paths to authorized users only.
// Anyone can post contact-us form. But only admin can view and delete it.
// So use check-admin middleware too.

router.get('', checkAuth, checkAdmin, ContactFormController.getAllContactForms);

router.post('', ContactFormController.createContactForm);

router.delete('/:id', checkAuth, checkAdmin, ContactFormController.deleteContactForm);

module.exports = router;
