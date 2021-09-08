const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clientSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  },
  providers: {
    type: Array
  }
}, {
  collection: 'clients'
})

module.exports = mongoose.model('Client', clientSchema)