const ScheduleCabForm = require('../models/scheduleCabForm');
// In this file, form = ScheduleCabForm

exports.getAllForms = (req, res) => {
  // console.log('req.body: ' + JSON.stringify(req.userData));

  if (req.userData.role !== 'admin') {
    ScheduleCabForm
      .find({ creator: req.userData.userId })
      .then((cabForms) => {
        if (cabForms) {
          return res.status(200).json({ message: 'Schedule cab forms found', cabForms: cabForms });
        }
        res.status(404).json({ message: 'Fetching schedule cab forms failed.' });
      })
      .catch((err) => {
        console.log('Error getting schedule cab forms by given creator: ' + err);
        res.status(404).json({ message: 'Fetching schedule cab forms failed!' });
      });
  } else {
    ScheduleCabForm
      .find()
      .then((cabForms) => {
        res.status(200).json({ message: 'Schedule cab forms found', cabForms: cabForms });
      })
      .catch((err) => {
        console.log('Error getting schedule cab forms by admin: ' + err);
        res.status(404).json({ message: 'Fetching schedule cab forms failed!' });
      });
  }
}

exports.createForm = (req, res) => {
  // console.log('UserID: ' + req.userData.userId);
  const scheduleCabForm = new ScheduleCabForm({
    name: req.body.name,
    phone: req.body.mobile,
    email: req.body.email,
    pickup_date: req.body.pickup_date,
    pickup_time: req.body.pickup_time,
    passengers: req.body.passengers,
    pickup_location: req.body.pickup_loc,
    drop_location: req.body.drop_loc,
    creator: req.userData.userId // not required. If not present, will be saved as null in DB.
  });
  // console.log(scheduleCabForm);
  scheduleCabForm.save()
    .then(() => {
      console.log('Schedule Cab Form saved successfully');
      res.status(201).json({ // 201=>A new resource was created.
        message: 'Schedule Cab Form added to DB successfully.'
      });
    })
    .catch((err) => {
      console.log('Error saving schedule cab form to DB: ', err);
      res.status(404).json({
        message: 'Saving schedule form failed!'
      });
    });
}

exports.deleteForm = (req, res) => {
  ScheduleCabForm.findByIdAndDelete({ _id: req.params.id })
    .then((scheduleCabForm) => {
      if (scheduleCabForm) {
        console.log('Form deleted from DB: ' + scheduleCabForm);
        return res.status(200).json({ message: 'form deleted successfully from DB', scheduleCabForm: scheduleCabForm });
      }
      res.status(404).send('Error deleting form from DB.');
    })
    .catch((err) => {
      console.log('Error deleting form from DB.' + err);
      res.status(404).json({ message: 'Deleting schedule cab form failed!' });
    })
}

exports.updateForm = (req, res) => {
  ScheduleCabForm.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      pickup_date: req.body.pickup_date,
      pickup_time: req.body.pickup_time
    },
    { new: true } // will return updated document
  )
    .then((scheduleCabForm) => {
      if (scheduleCabForm) {
        console.log('scheduleCabForm updated in DB, new form: ' + scheduleCabForm);
        return res.status(200).json({ message: 'scheduleCabForm updated successfully in DB', scheduleCabForm: scheduleCabForm });
      }
      res.status(404).send('The scheduleCabForm with given ID does not exist.');
    })
    .catch((err) => {
      console.log('Error updating scheduleCabForm: ' + err);
      res.status(404).json({ message: 'Updating schedule cab form failed!' });
    })
}

exports.getFormById = (req, res) => {
  // get the form to be updated.
  ScheduleCabForm.findById(req.params.id)
    .then((scheduleCabForm) => {
      if (scheduleCabForm) {
        console.log('Form fetched from DB: ' + scheduleCabForm);
        return res.status(200).json({ message: 'form fetched successfully from DB', scheduleCabForm: scheduleCabForm });
      }
      res.status(404).send('Error fetching form from DB.');
    })
    .catch((err) => {
      console.log('Error fetching form from DB.' + err);
      res.status(404).json({ message: 'Fetching schedule cab form failed!' });
    });
}
