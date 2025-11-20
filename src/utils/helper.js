const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
const {User} = require('../models/user');

//simple function to clean strings of XSS
const clean = (dirtyString)=>{
    return sanitizeHtml(dirtyString || '',{allowedTags: []}).trim();
}
const validateSignup = (req)=>{
    //sanitize data

    req.body.firstName = clean(req.body.firstName);
    req.body.lastName = clean(req.body.lastName);
    req.body.about = clean(req.body.about);

    //normalize emailId(handles trim,lowercase,gmail dots,etc)
    req.body.emailId = validator.normalizeEmail(req.body.emailId || '');

    //normalize gender
    if(req.body.gender){
        req.body.gender = (req.body.gender || '').trim().toLowerCase();
    }

    //Trim url(dont sanitize for XSS,it could break url)
    if(req.body.photoUrl){
        req.body.photoUrl = (req.body.photoUrl || '').trim();
    }

    const {firstName,lastName,emailId,password,photoUrl} = req.body;
    if(!firstName || !lastName){
        throw new Error("first and last name are required");
    }else if(!validator.isEmail(emailId)){
        throw new Error("enter a valid emailId");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("enter a strong password");
    }else if(photoUrl && !validator.isURL(photoUrl)){
        throw new Error("enter a valid photo url");
    }
};

const validateEditProfileData = (req)=>{

    const data = req.body;

    const allowedUpdates = ['gender','photoUrl','about','skills'];
    if(data?.skills?.length>10){
        throw new Error("cannot save more than 10 skills.")
    }
    const isUpdateAllowed = Object.keys(data).every(k=>allowedUpdates.includes(k));
    return isUpdateAllowed;

};

const validateEditPasswordData = (req)=>{
    const allowedUpdates = ['password'];
    const isUpdateAllowed = Object.keys(req.body).every(k=>allowedUpdates.includes(k));
    return isUpdateAllowed;
}

module.exports = {
    validateSignup,
    validateEditProfileData,
    validateEditPasswordData
};