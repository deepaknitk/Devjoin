const Validator = require("validator");
const isEmpty = require("./is-empty");

let errors = {};

module.exports = function profileValidation(data) {
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40})) {
    errors.handle = "handle must be in 2 to 40 char";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company name is required";
  }

  if (Validator.isEmpty(data.location)) {
    errors.location = "location name is required";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "status name is required";
  }
  if (Validator.isEmpty(data.bio)) {
    errors.bio = "bio is required";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "skills is required";
  }
  // if (!isEmpty(data.website)) {
  //   if (!Validator.isURL(data.website)) {
  //     errors.website = "Not a valid website URL";
  //   }
  // }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid facebook URL";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid twitter URL";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid youtube URL";
    }
  }
  if (!isEmpty(data.linkedIn)) {
    if (!Validator.isURL(data.linkedIn)) {
      errors.linkedIn = "Not a valid linkedIN URL";
    }
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
