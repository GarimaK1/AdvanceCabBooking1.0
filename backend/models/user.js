const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
  // unique and uniqueCaseInsensitive is used here to support validation via 'mongoose-unique-validator'
  password: { type: String, required: true },
  role: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);
// added plugin to mongoose.
// will check uniqueness before saving to DB. Will throw appropriate error.

module.exports = mongoose.model('User', userSchema);
