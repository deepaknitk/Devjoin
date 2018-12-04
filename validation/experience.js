const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function experienceValidator (data) {
    const errors = {};

    data.title = !isEmpty(data.title) ? data.title  : '';
    data.company = !isEmpty(data.company) ? data.company  : '';
    data.location = !isEmpty(data.location) ? data.location  : '';
    data.from = !isEmpty(data.from) ? data.from  : '';
    data.to = !isEmpty(data.to) ? data.to  : '';

    if(Validator.isEmpty(data.title)) {
        errors.title = 'Title is required';
    }
    if(Validator.isEmpty(data.company)) {
        errors.company = 'Company is required';
    }
    if(Validator.isEmpty(data.location)) {
        errors.location = 'Location is required';
    }
    if(Validator.isEmpty(data.from)) {
        errors.from = 'From Date is required';
    }
    if(Validator.isEmpty(data.to)) {
        errors.to = 'toDate is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
} 