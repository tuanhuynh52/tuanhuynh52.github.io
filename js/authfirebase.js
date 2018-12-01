
/* global firebase, url, handler */

// Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBrc2AqSAQNuaOZQeq3DtaUIXDRTPQ7N4w",
    authDomain: "skycastweather-fad3c.firebaseapp.com",
    databaseURL: "https://skycastweather-fad3c.firebaseio.com",
    projectId: "skycastweather-fad3c",
    storageBucket: "",
    messagingSenderId: "628464814491"
};

firebase.initializeApp(config);

var invocation = new XMLHttpRequest();
    function callOtherDomain() {
        if (invocation) {
            invocation.open('GET', url, true);
            invocation.onreadystatechange = handler;
            invocation.send();
        }
    }
//get elements
var txtemail = document.getElementById('email');
var txtpsw = document.getElementById('password');
var signupbtn = document.getElementById('signupbtn');
var signinbtn = document.getElementById('signinbtn');

//reset password field
var txtEmailToLookup = document.getElementById('lookup_email');
var retrievePwdBtn = document.getElementById('retrievePasswordBtn');

// add login event 
//trigger enter key to login
$(txtpsw).keypress(function(e) {
    if (e.which == 13) {
        $(signinbtn).click();   
    }
});

signinbtn.addEventListener("click", function () {
    var email = txtemail.value;
    var password = txtpsw.value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        document.location.href = "html/main.html";
        return;
    }).catch(function (e) {
        if (e !== null) {
            // console.log(e.message);
            alert(e.message);
            return;
        }
    });
});
//register
signupbtn.addEventListener("click", function () {
    var email = txtemail.value;
    var password = txtpsw.value;
    var form = document.getElementById('loginForm');

    if (password.length < 6) {
        alert("password must be at least 6 characters!!!");
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            alert("User created, Please sign in!");
            form.reset();
        }).catch(function (e) {
            if (e !== null) {
                // console.log(e.message);
                alert(e.message);
                return;
            }
        });
    }

});

//reset password
retrievePasswordBtn.addEventListener("click", function () {
    var email_to_lookup = txtEmailToLookup.value;
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(email_to_lookup).then(function() {
        alert("A verification has been sent to " + email_to_lookup);
    }).catch(function(error) {
        alert("Please enter your correct email address!");
    })
});

