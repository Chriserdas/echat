const BrowserWindow = require('electron').remote;

var rightPanel = document.querySelector(".split-right");
var leftPanel = document.querySelector(".split-left");

var firstGhostPanel = document.querySelector(".ghost-Signup");
var welcomePanel = document.querySelector(".shown-signIn");

var signinCont = document.querySelector(".SignInContainer");
var ghostForSignup = document.querySelector(".ghost-for-signup");

var signupEye = document.querySelector(".signupHide");
var rewriteEye = document.querySelector(".rewriteHide");
const watchPassButton = document.querySelector("#watchPass");

var eyeIcon = document.getElementById("eye");
var eyeSlashIcon = document.getElementById("eye-slash");

var eyeIcon2 = document.querySelector(".signup-eye");
var eyeSlashIcon2 = document.querySelector(".signup-eye-slash");

var eyeIcon3 = document.querySelector(".rewrite-eye");
var eyeSlashIcon3 = document.querySelector(".rewrite-eye-slash");

var username = document.querySelector("#username");
var passText = document.querySelector("#pass");
var signupPassText = document.querySelector("#signup-pass");
var rewritePassText = document.querySelector("#rewritepass");

var ghostButtonSignUp = document.querySelector(".ghost-Button");

var signInButton = document.querySelector(".sign-in-button");
var goToSignupButton = document.querySelector(".go-toSignUp");

var signupButton = document.querySelector(".sign-up-button");
var goToSigninButton = document.querySelector(".go-toSignIn");

var signupPanel = document.querySelector(".signupPanel");

var signUpUsername = document.querySelector("#signupUsername");
var email = document.querySelector("#email");

var forgotPass = document.querySelector(".forgotPass");

function frameButtons(){

    var eyeButtonsMap = new Map();
    eyeButtonsMap.set(watchPassButton,[passText,eyeIcon,eyeSlashIcon]);
    eyeButtonsMap.set(signupEye,[signupPassText,eyeIcon2,eyeSlashIcon2]);
    eyeButtonsMap.set(rewriteEye,[rewritePassText,eyeIcon3,eyeSlashIcon3]);

    console.log(eyeIcon)
    const closeButton = document.getElementById("close-btn");
    const maximizeButton = document.getElementById("max-btn");
    const minButton = document.getElementById("min-btn");


    const currentWindow = BrowserWindow.getCurrentWindow();

    closeButton.addEventListener('click', () =>{
        currentWindow.close();
    });
         
    minButton.addEventListener('click', () =>{
        currentWindow.minimize();
    });


    for(const [key,value] of eyeButtonsMap.entries()){
        key.addEventListener('mousedown',() =>{
            unhidePassword(value[0],value[1],value[2]);
        });

        key.addEventListener('mouseup',() =>{
            hidePassword(value[0],value[1],value[2]);
        });

    }


    passText.addEventListener('input',() =>{
        eyeSlashIcon.style.display = "block";

        if(passText.value.length == 0){
            eyeSlashIcon.style.display = "none";
        }
    });


    signupPassText.addEventListener('input',() =>{
        eyeSlashIcon2.style.display = "block";

        if(signupPassText.value.length == 0){
            eyeSlashIcon2.style.display = "none";
        }
    });


    rewritePassText.addEventListener('input',() =>{
        eyeSlashIcon3.style.display = "block";

        if(rewritePassText.value.length == 0){
            eyeSlashIcon3.style.display = "none";
        }
    });

    signin("mouseenter","mouseleave");
    signin("focusin","focusout");
    goToSignupButton.addEventListener("click",goToSignup);
    

    signup("mouseenter","mouseleave");
    signup("focusin","focusout");

    goToSigninButton.addEventListener('click',goToSignin);

    
}


function goToSignup(){
    rightPanel.style.width = "45%";
    leftPanel.style.width = "55%";
    leftPanel.style.backgroundColor =" #CC2936";
    signinCont.style.display ="none";
    ghostForSignup.style.display = "block";
    rightPanel.style.display ="none";
    signupPanel.style.display ="block"

    username.value = "";
    passText.value = "";

    firstWordInSignup.innerHTML = "Create an account <br> and";
    secondWordInSignup.innerHTML = "join the e-chat community";
}

function goToSignin(){
    rightPanel.style.width = "55%";
    leftPanel.style.width = "45%";
    leftPanel.style.backgroundColor = "white";
    signinCont.style.display ="block";
    ghostForSignup.style.display = "none";
    rightPanel.style.display ="block";
    signupPanel.style.display ="none"

    signUpUsername.value = "";
    email.value = "";
    signupPassText.value = "";
    rewritePassText.value ="";
}

function unhidePassword(parameter,chooseye,chooseSlashEye){
    const type = parameter.getAttribute('type') === 'password' ? 'text' : 'password';
    parameter.setAttribute('type', type);
    chooseye.style.display = "block";
    chooseSlashEye.style.display = "none";
}

function hidePassword(par,chooseye,chooseSlashEye){
    par.setAttribute('type','password');
    chooseye.style.display = "none";
    chooseSlashEye.style.display = "block";
}


function signup(access,out){
    signupButton.addEventListener(access,()=>{
        signupButton.style.backgroundColor = "#CC2936";
        signupButton.style.color = "white";
        signupButton.style.cursor = "pointer";
    });

    signupButton.addEventListener(out,() =>{
        signupButton.style.backgroundColor = "white";
        signupButton.style.color = "#CC2936";
    });


    goToSigninButton.addEventListener(access,() =>{
        goToSigninButton.style.textDecoration = "none";
        goToSigninButton.style.cursor = "pointer";
    });


    goToSigninButton.addEventListener(out,() =>{
        goToSigninButton.style.textDecoration = "underline";
    });
}

function signin(access,out){
    forgotPass.addEventListener(access,()=>{
        forgotPass.style.color = "black";
    });

    forgotPass.addEventListener(out,()=>{
        forgotPass.style.color = "dimgrey";
        console.log("sadasd");
    });

    signInButton.addEventListener(access,() =>{
        signInButton.style.backgroundColor = "#EDBBB4";
        signInButton.style.color = "white";
        signInButton.style.cursor = "pointer";

    });


    signInButton.addEventListener(out,() =>{
        signInButton.style.backgroundColor = "white";
        signInButton.style.color = "#EDBBB4";
    });
    

    goToSignupButton.addEventListener(access,() =>{
        goToSignupButton.style.textDecoration = "none";
    });


    goToSignupButton.addEventListener(out,() =>{
        goToSignupButton.style.textDecoration = "underline";
    });
}


window.onload = frameButtons;
