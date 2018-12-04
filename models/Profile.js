const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        // required: true,
        // max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location : {
        type: String
    },
    status: {
       type: String
    },
    skills: {
       type: [String],
       required: true
    },
    bio: {
        type:String
    },
    githubUsername: {
        type: String
    },
   experience: [
       {
           title: {
            type: String
           },
           company: {
            type: String,
            required: true
           },
           location: {
            type: String,
            required: true
           },
           from : {
            type: Date,
            required: true
           },
           to : {
            type: Date,
            required: true
           },
           current : {
            type: Boolean,
            default: false
           }
       }
   ],
   education: [
    {
        title: {
         type: String
        },
        college: {
            type: String,
            require: true
        },
        location: {
         type: String,
         required: true
        },
        from : {
            type: Date,
            required: true
        },
        to : {
            type: Date,
            required: true
        },
        current : {
            type: Boolean,
            default: false
        }
    }
],
social:{
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    youtube: {
        type: String
    },
    linkedIn: {
        type: String
    }
},
date: {
    type: Date,
    default: Date.now()
}
})

module.exports = profile = mongoose.model('profile', profileSchema);