const { ObjectID, ObjectId } = require('bson');

module.exports = function(app, passport, db) {

// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
            if (err) return console.log(err)
            res.render('landing.ejs', {
              user : req.user,
              questionare: questionareResult,
              goals: goalsResult,
              charities: charityResult,
              kindness: kindnessResult
            })
          })

    // PROFILE SECTION =========================
    app.get('/home', isLoggedIn, function(req, res) {
      db.collection('questionare').find().toArray((err, questionareResult) => {
        db.collection('goals').find().toArray((err, goalsResult) => {
          db.collection('charities').find().toArray((err, charityResult) => {
            db.collection('kindness').find().toArray((err, kindnessResult) => {
            if (err) return console.log(err)
            res.render('home.ejs', {
              user : req.user,
              questionare: questionareResult,
              goals: goalsResult,
              charities: charityResult,
              kindness: kindnessResult
            })
          })
        })
      })
      })    
    });

    app.get('/questionare', isLoggedIn, function(req, res) {
        db.collection('questionare').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('survey.ejs', {
            user : req.user,
            questionare: result,
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/questionare', (req, res) => {
      db.collection('questionare').insertOne({
          user: req.user.local.email, 
          charityGoal: req.body.charities,
          monetaryDonationsBudget: req.body.monetaryDonationsBudget, 
          randomActsBudget: req.body.randomActsBudget
        }, 
        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/home')
      })
    })

    app.post('/goals', (req, res) => {
      // randomize either a monetary donation (if monetary donation != 0), budgeted random act (if act budget != 0), or free random act 
      if(req.body.monetaryDonationsBudget != 0 && req.body.randomActsBudget != 0){
        // can generate either monetary donation (0), budgeted act (1), or free act (2)
        var action = Math.floor(Math.random()*3)
        action === 0 ? action = "monetary donation" : action === 1 ? action = "budgeted act" : action = "free act"
      }else if(req.body.monetaryDonationsBudget != 0){
        // can generate either monetary donation (0) or free act (1)
        var action = Math.floor(Math.random()*2)
        action === 0 ? action = "monetary donation" : action = "free act"
      }else if(req.body.randomActsBudget != 0){
        // can generate either budgeted act (0) or free act (1)
        var action = Math.floor(Math.random()*2)
        action === 0 ? action = "budgeted act" : action = "free act"
      }else{
        // can generate a free act (0)
        var action = "free act"
      }

      db.collection("kindness").find().toArray(function(err, kindnessResult) {
        db.collection("charities").find().toArray(function(err, charitiesResult) {
        if (err) {
          // Reject the Promise with an error
          return reject(err)
        }
        // Resolve (or fulfill) the promise with data
        var kindness = kindnessResult
        var charities = charitiesResult

      // generate monetary donation (rep by 0)
      if(action === "monetary donation"){
        var goal = charities[Math.floor(Math.random()*charities.length)]
        var amount = Math.floor(Math.random()*req.body.monetaryDonationsBudget)
        var monetaryDonationsBudget = req.body.monetaryDonationsBudget-amount
        var randomActsBudget = req.body.randomActsBudget
      }
      // generate budgeted random act (rep by 1)
      else if(action === "budgeted act"){
        let isFound = false
        var goal = kindness[Math.floor(Math.random()*kindness.length)]
        while(isFound === false){
        if(goal.budget != 0 && goal.budget <= req.body.randomActsBudget){
          var amount = Math.floor(Math.random()*req.body.randomActsBudget)
          var monetaryDonationsBudget = req.body.monetaryDonationsBudget
          var randomActsBudget = req.body.randomActsBudget-amount
          isFound = true
        }
        }
      }
      // generate free random act (rep by 2)
      else if(action === "free act"){
        var goal = kindness[Math.floor(Math.random()*kindness.length)]
        console.log(goal)
        var monetaryDonationsBudget = req.body.monetaryDonationsBudget
        var randomActsBudget = req.body.randomActsBudget
        var amount = null
      }
      db.collection('goals').insertOne({
          user: req.user.local.email,
          date: new Date(),
          charityGoal: req.body.charityGoal,
          monetaryDonationsBudget: Number(monetaryDonationsBudget),
          randomActsBudget: Number(req.body.randomActsBudget),
          action: action,
          goal: goal,
          amount: amount,
          status: "incomplete"
        }, 
        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/home')
      })
    })
    })
    })

    app.put('/goals', (req, res) => {
      console.log(req.body)
      let goalId = ObjectID(req.body.goalId)
        db.collection('goals')
        .findOneAndUpdate({_id: goalId}, {
          $set: {
            'status': 'complete',
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.redirect('/home')
        })
    })

    app.put('/questionare', (req, res) => {
      console.log(req.body)
      if(req.body.action === 'monetary donation'){
        db.collection('questionare')
        .findOneAndUpdate({user: req.user.local.email}, {
          $set: {
            monetaryDonationsBudget: req.body.monetaryDonationsBudget-req.body.cost, 
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.redirect('/home')
        })
      }else if(req.body.action === 'budgeted act'){
        db.collection('questionare')
        .findOneAndUpdate({user: req.user.local.email}, {
          $set: {
            randomActsBudget: req.body.randomActsBudget-req.body.cost,
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.redirect('/home')
        })
      }
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next(null, true);

    res.redirect('/');
}
