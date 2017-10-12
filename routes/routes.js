module.exports = function (app, passport) {
    app.use('/dashboard', isLoggedIn, require('./item'));
    app.get('/login', isNotLoggedIn, (req, res, next) => {
        res.render('login', {title: 'Login', message: req.flash('loginMessage')});
    });
    app.get('/', isLoggedIn, (req, res, next)=>{
        res.redirect('/dashboard')
    });

    app.get('/signup', isLoggedIn, function (req, res, next) {
        res.render('signup', {title: 'Signup', message:req.flash('signupMessage')});
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.post('/signup', isLoggedIn,passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/dashboard');
    else
        return next();
}