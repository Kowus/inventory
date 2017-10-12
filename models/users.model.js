const mongoose = require('mongoose');
let securePassword = require('secure-password');
pwd = securePassword();
let userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    firstname: String,
    lastname: String,
    password: {type: Buffer, required: true},
    profile_photo: String,
    username:{type:String, required:true, unique:true}

});


userSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('auth.local.password') || this.isNew) {
        let userPassword = Buffer.from(user.password);
        pwd.hash(userPassword, function (err, hash) {
            if (err) return next(err);

            // Save hash somewhere
            pwd.verify(userPassword, hash, function (err, result) {
                if (err) return next(err);

                if (result === securePassword.INVALID_UNRECOGNIZED_HASH) return console.error('This hash was not made with secure-password. Attempt legacy algorithm');
                if (result === securePassword.INVALID) return console.log('Imma call the cops');
                if (result === securePassword.VALID) {
                    user.password = hash;
                    next();
                }
                if (result === securePassword.VALID_NEEDS_REHASH) {
                    console.log('Yay you made it, wait for us to improve your safety');

                    pwd.hash(userPassword, function (err, improvedHash) {
                        if (err) console.error('You are authenticated, but we could not improve your safety this time around');
                        user.password = improvedHash;
                        next();
                    });
                }
            });
        });
    } else return next();
});


userSchema.methods.validPassword = function (password) {
    return pwd.verifySync(Buffer.from(password), this.password);
};


module.exports = mongoose.model('User', userSchema);