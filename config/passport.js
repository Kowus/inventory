const LocalStrategy = require('passport-local').Strategy;
let User = require('../models/users.model');

module.exports = function (passport) {
    // Serialize User
    passport.serializeUser(function (req, user, done) {
        done(null, user.id);
    });
    //	Deserialize User
    passport.deserializeUser(function (req, id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // async. User.findOne() won't fire until data is sent back
            process.nextTick(function () {
                //	Check to see if there's already a record of user
                let regex = new RegExp(email, 'i');
                User.findOne({
                    $or:[
                        {'email': regex},
                        {'username':regex}
                    ]
                }, function (err, user) {
                    if (err) return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email has already been used with an account.'))
                    } else {
                        //	User doesn't already exist
                        //	Create User
                        let newUser = new User();

                        //	set User's local credentials
                        newUser.email = email.trim().toLowerCase();
                        newUser.password = req.body.password;
                        newUser.firstname = req.body.firstname;
                        newUser.lastname = req.body.lastname;
                        newUser.username = req.body.username.trim();

                        newUser.save(function (err) {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));


    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            //	If user exists
            let regex = new RegExp(email, 'i');
            User.findOne({
            $or:[
                {'email': regex},
                {'username':regex}
            ]
            }, function (err, user) {
                if (err) return done(err);
                //	If user doesn't exist
                if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));

                //	If user found but password is wrong
                if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Email or Password incorrect'));
                return done(null, user);
            });
        }
    ));
};