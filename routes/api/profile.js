const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const profileModel = require("../../models/Profile");
const userModel = require("../../models/User");
const profileValidation = require("../../validation/profile");
const experienceValidation = require("../../validation/experience");

// get current user profile
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userId = req.user.id;
    const errors = {};
    profileModel
      .findOne({ user: userId })
      .populate("user", ["name", "email", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.profile = "Profile not found for user";
          const json = {};
          json.success = false;
          json.message = "Profile not found for user";
          json.data = {};
          json.errors = errors;
          res.status(200).json(json);
        }
        const json = {};
        json.success = true;
        json.message = "";
        json.data = profile;
        res.json(json);
      })
      .catch(error => console.log(error));
  }
);

// create or update user profile
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = profileValidation(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    const profileFeild = {};
    profileFeild.user = req.user.id;

    if (req.body.handle) profileFeild.handle = req.body.handle;
    if (req.body.company) profileFeild.company = req.body.company;
    if (req.body.status) profileFeild.location = req.body.location;
    if (req.body.website) profileFeild.website = req.body.website;
    if (req.body.status) profileFeild.status = req.body.status;
    if (typeof req.body.skills !== undefined) {
      profileFeild.skills = req.body.skills.split(",");
    }
    profileFeild.social = {};
    if (req.body.facebook) profileFeild.social.facebook = req.body.facebook;
    if (req.body.youtube) profileFeild.social.youtube = req.body.youtube;
    if (req.body.linkedIn) profileFeild.social.linkedIn = req.body.linkedIn;
    if (req.body.twitter) profileFeild.social.twitter = req.body.twitter;

    if (req.body.bio) profileFeild.bio = req.body.bio;
    if (req.body.githubUsername)
      profileFeild.githubUsername = req.body.githubUsername;

    profileFeild.experience = [];

    if (req.body.experience) profileFeild.experience = req.body.experience;

    profileModel
      .findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          //update the profile
          profileModel
            .findOneAndUpdate(
              { user: req.user.id },
              { $set: profileFeild },
              { new: true }
            )
            .then(profile => {
              const json = {};
              json.success = true;
              json.message = "Profile updated successfully";
              json.data = profile;
              res.json(json);
            })
            .catch(error => {
              res.status(400).json(error);
            });
        } else {
          profileModel
            .findOne({ handle: profileFeild.handle })
            .then(profile => {
              if (profile) {
                res.status(400).json({ handle: "handle exist" });
              } else {
                new profileModel(profileFeild)
                  .save()
                  .then(profile => {
                    const json = {};
                    json.success = true;
                    json.message = "Profile created successfully";
                    json.data = profile;
                    res.json(json);
                  })
                  .catch(error => res.status(400).json(error));
              }
            });
        }
      })
      .catch(error => {
        res.json(error);
      });
  }
);

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  profileModel
    .findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "No profile found for this handle";
        res.status(400).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(error => res.status(400).json(error));
});

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  profileModel
    .findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "No profile found for this user id";
        res.status(400).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(error => res.status(400).json(error));
});

router.get("/all", (req, res) => {
  const errors = {};
  profileModel
    .find()
    .populate("user", ["name", "avatar"])
    .then(profile => {
      const json = {};
      if (!profile) {
        json.success = false;
        json.message = "No Profile Found";
        json.data = {};
        res.status(400).json(json);
      } else {
        json.success = true;
        json.message = "";
        json.data = profile;
        res.json(json);
      }
    })
    .catch(error => res.status(400).json({ profile: "Something went wrong" }));
});

router.post(
  "/experience/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const experienceFeild = {};
    const { errors, isValid } = experienceValidation(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    } else {
      if (req.body.title) experienceFeild.title = req.body.title;
      if (req.body.company) experienceFeild.company = req.body.company;
      if (req.body.location) experienceFeild.location = req.body.location;
      if (req.body.from) experienceFeild.from = req.body.from;
      if (req.body.to) experienceFeild.to = req.body.to;
      if (req.body.current) experienceFeild.current = req.body.current;

      profileModel
        .update(
          { user: req.user.id },
          { $push: { experience: experienceFeild } }
        )
        .then(profile => {
          if (profile.nModified) {
            const json = {};
            json.success = true;
            json.message = "";
            json.data = profile;
            res.json(json);
          } else {
            const json = {};
            json.success = false;
            json.message = "Experience could not added to profile";
            json.data = {};
            res.status(200).json(json);
          }
        })
        .catch(error => res.status(400).json(error));
    }
  }
);

router.post(
  "/experience/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profileModel
      .update(
        { user: req.user.id },
        { $pull: { experience: { _id: req.body.experienceId } } },
        { safe: true }
      )
      .then(profile => {
        if (profile.nModified) {
          res.json(profile);
        } else {
          res
            .status(400)
            .json({ experience: "Experience could not deleted from profile" });
        }
      })
      .catch(error => res.status(400).json(error));
  }
);

router.get(
  "/experience/findall",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profileModel
      .findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          res.json(profile.experience);
        } else {
          res.status(400).json({ experience: "something went wrong" });
        }
      })
      .catch(error => res.status(400).json(error));
  }
);

router.post(
  "/education/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const education = {};
    education.title = req.body.title;
    education.college = req.body.college;
    education.location = req.body.location;
    education.from = req.body.from;
    education.to = req.body.to;

    profileModel
      .update({ user: req.user.id }, { $push: { education: education } })
      .then(profile => {
        if (profile.nModified) {
          const json = {};
          json.success = true;
          (json.message = ""), (json.data = profile);
          res.json(json);
        } else {
          const json = {};
          json.success = false;
          (json.message = "Education not added to user profile"),
            (json.data = profile);
          res.json(json);
        }
      })
      .catch(error => res.status(400).json(error));
  }
);


router.post(
  "/education/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profileModel
      .update({ user: req.user.id }, { $pull: {education: {_id: req.body.id}}})
      .then(profile => {
        if (profile.nModified) {
          const json = {};
          json.success = true;
          (json.message = ""), (json.data = profile);
          res.json(json);
        } else {
          const json = {};
          json.success = false;
          (json.message = "Education not deleted from user profile"),
            (json.data = profile);
          res.json(json);
        }
      })
      .catch(error => res.status(400).json(error));
  }
);

module.exports = router;
