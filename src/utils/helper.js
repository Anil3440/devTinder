const sanitizeHtml = require('sanitize-html');
const validator = require('validator');

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

module.exports = {
    validateSignup,
};