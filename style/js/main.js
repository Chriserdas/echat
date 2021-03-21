var socket;

var signUpUsername = document.querySelector("#signupUsername");
var signupPassword = document.querySelector("#signup-pass");
var rewritePass = document.querySelector("#rewritepass");
var email = document.querySelector("#email");

var signupButton = document.querySelector(".sign-up-button");
var signinButton = document.querySelector(".sign-in-button");


var field = document.querySelector("#noFilled");
var passDontMatch = document.querySelector("#passwords-dont-match");
var invalidEmail = document.querySelector("#invalid-email");
var insufficientLength = document.querySelector("#smallPass");


var firstWordInSignup = document.querySelector(".createAcc");
var secondWordInSignup = document.querySelector(".moreonCreateAcc");


var signinUsername = document.querySelector("#username");
var signinPassword = document.querySelector("#pass");

let signinNotification = document.querySelector("#signinProblem");

signupButton.addEventListener('click', e=>{
    e.preventDefault();

    if(signUpUsername.value === ""){
        email.style.borderBottom = "0px";
        signupPassword.style.borderBottom = "0px";
        rewritePass.style.borderBottom = "0px"
        passDontMatch.style.display = "none";
        field.innerHTML = "Fill this field first";

        signUpUsername.style.borderBottom = "2px solid red";
        animate(field);
    }
    else if(email.value ===""){
        signUpUsername.style.borderBottom = "0px";
        signupPassword.style.borderBottom = "0px";
        rewritePass.style.borderBottom = "0px";
        passDontMatch.style.display = "none";
        field.innerHTML = "Fill this field first";

        email.style.borderBottom = "2px solid red";
        animate(field);

    }
    else if(signupPassword.value === ""){
        signUpUsername.style.borderBottom = "0px";
        email.style.borderBottom = "0px";
        rewritePass.style.borderBottom = "0px";
        passDontMatch.style.display = "none";
        field.innerHTML = "Fill this field first";

        signupPassword.style.borderBottom = "2px solid red";
        animate(field);
    }
    else if(rewritePass.value === ""){
        signUpUsername.style.borderBottom = "0px";
        email.style.borderBottom = "0px";
        signupPassword.style.borderBottom = "0px";
        passDontMatch.style.display = "none";
        field.innerHTML = "Fill this field first";

        rewritePass.style.borderBottom = "2px solid red";
        animate(field);
    }
    else{
        signUpUsername.style.borderBottom = "0px";
        email.style.borderBottom = "0px";
        signupPassword.style.borderBottom = "0px";
        rewritePass.style.borderBottom = "0px"
        field.style.display = "none";

        if(signupPassword.value === rewritePass.value){

            passDontMatch.style.display = "none";
            validatePassword(signupPassword);
        }
        else{
            rewritePass.style.borderBottom = "2px solid red";
            rewritePass.value = "";
            animate(passDontMatch);
        }

        
    }
    
    
});

signinButton.addEventListener('click',e=>{
    e.preventDefault();
    socket = io.connect('http://localhost:3000');

    if(username.value == ""){
        signinNotification.style.display = "block";
        username.focus();
        username.style.borderBottom = "1.2px solid red";
        passText.style.borderBottom = "1.2px solid black";
        animate(signinNotification);

    }
    else if(passText.value == ""){
        signinNotification.style.display = "block";
        passText.focus();
        username.style.borderBottom = "1.2px solid black";
        passText.style.borderBottom = "1.2px solid red";
        animate(signinNotification);

    }
    emitSigninData();
});





function validateEmail(emailValue){

    const emailRegex =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(emailValue.value.match(emailRegex)){
        invalidEmail.style.display = "none";
        email.style.borderRight = "0px";
        
        socket = io.connect('http://localhost:3000');
        emitData();
    }
    else{
        animate(invalidEmail);
        email.style.borderRight = "2px solid red";
    }

}

function validatePassword(password){
    if(password.value.length <= 3){
        insufficientLength.style.display = "block";
        password.style.borderRight = "2px solid red";
        animate(insufficientLength);
    }
    else{
        validateEmail(email);
        password.style.borderRight = "0px";

        validateUsername();

    }
}

function animate(element){
    element.style.display ="block";
    
    element.classList.remove("popup");
    void element.offsetWidth;

    element.classList.add("popup");
}

function validateUsername(){
    socket.on("username-used", data=>{
        if(data.message == "Username is already used"){
            email.style.borderBottom = "0px";
            signupPassword.style.borderBottom = "0px";
            rewritePass.style.borderBottom = "0px"
            passDontMatch.style.display = "none";

            field.innerHTML = data.message;
            animate(field);

        }
        else{
            leftPanel.style.background = "#43B929";
            firstWordInSignup.innerHTML = "Thank you for creating an account to echat";
            secondWordInSignup.innerHTML = "Sit tight while we redirect you to Sign in";

            setTimeout(goToSignin, 3000);
        }

    });
}

function emitData(){
    socket.emit("Username",signUpUsername.value);
    socket.emit("password",signupPassword.value);
    socket.emit("email",email.value);   
}

function emitSigninData(){
    socket.emit("signinUsername", signinUsername.value);
    socket.emit("signinPassword", signinPassword.value);
}

