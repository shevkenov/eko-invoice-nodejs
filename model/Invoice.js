const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  number: {
    type: String,
    unique: true,
    validate: numberValidation,
    maxlength: 10,
    minlength: 10
  },
  station: {
    type: String,
    validate: numberValidation,
    maxlength: 4,
    minlength: 4
  },
  date: {
    type: Date,
    required: true
  },
  bulstat: {
    type: String,
    validate: numberValidation
  },
  amount: {
    type: String,
    validate: decimalValidation
  },
  base: {
    type: String,
    validate: decimalValidation
  },
  vat: {
    type: String,
    validate: decimalValidation
  },
  name: {
    type: String
  },
  vatno: {
    type: String
  },
  klen: {
    type: String,
    validate: numberValidation
  }
});

function numberValidation(value){
  const regex = /^\d+$/;
  if (!regex.test(value)) {
    throw Error(
      `It is required or invalid number at document ${this.number}`
    );
  }
}

function decimalValidation(value){
  const regex = /^\d+\.\d{2}$/;
  if (!regex.test(value)) {
    throw Error(`It is required or invalid decimal number at document ${this.number}`);
  }
}
  
module.exports = mongoose.model("invoice", invoiceSchema);