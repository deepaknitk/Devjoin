const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput (data) {
    let errors ={};
    if(!Validator.isLength(data.name, {min:2, max: 20})) {
        errors.name = 'Name must be in range of 0 to 20 char'
    }
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password1 = !isEmpty(data.password1) ? data.password1 : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name is required'
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password is required'
    }
    
    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.equalsPassword = 'password and confirm password is not same'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

