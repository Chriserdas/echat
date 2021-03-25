let socket;

let signUpUsername = document.querySelector("#signupUsername");
let signupPassword = document.querySelector("#signup-pass");
let rewritePass = document.querySelector("#rewritepass");
let email = document.querySelector("#email");

let signupButton = document.querySelector(".sign-up-button");
let signinButton = document.querySelector(".sign-in-button");


let field = document.querySelector("#noFilled");
let passDontMatch = document.querySelector("#passwords-dont-match");
let invalidEmail = document.querySelector("#invalid-email");
let insufficientLength = document.querySelector("#smallPass");


let firstWordInSignup = document.querySelector(".createAcc");
let secondWordInSignup = document.querySelector(".moreonCreateAcc");


let signinUsername = document.querySelector("#username");
let signinPassword = document.querySelector("#pass");

let signinNotification = document.querySelector("#signinProblem");

let proceedToApp = false;

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
    signinNotification.innerHTML = "Fill this field first";
    signinNotification.style.left = "185px";
    signinNotification.style.display = "none";

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
    else if(passText.value.length <=3){
        signinNotification.style.display = "block";
        signinNotification.innerHTML = "Password too small";
        username.style.borderBottom = "1.2px solid black";
        passText.style.borderBottom = "1.2px solid red";
        animate(signinNotification);
    }
    else{
        socket = io.connect('http://localhost:3000');
        emitSigninData();
        serverOpinion();
    }
    
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

function serverOpinion(){
    socket.on("signin-answer",answer=>{
        if(answer.message != "Welcome"){
            signinNotification.style.display = "block";
            signinNotification.innerHTML = answer.message;
            signinNotification.style.left = "130px";
            animate(signinNotification);
        }
        else{
            proceedToApp = true;
        }
    });
    
}


