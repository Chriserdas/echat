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


    /*rightPanel.addEventListener('mouseenter',function _func(){

        rightPanel.style.background = "#CC2936";
        welcomePanel.style.display ="none";
        firstGhostPanel.style.display = "block"
        
    });


    rightPanel.addEventListener('mouseleave',() =>{
        rightPanel.style.background = "#EDBBB4";
        welcomePanel.style.display ="block";
        firstGhostPanel.style.display = "none"
        
    });


    ghostButtonSignUp.addEventListener('mouseenter',() =>{
        ghostButtonSignUp.style.cursor = "pointer"; 
        ghostButtonSignUp.style.boxShadow = "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)";
    });


    ghostButtonSignUp.addEventListener("mouseleave", () =>{
        ghostButtonSignUp.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)";
    });*/

    forgotPass.addEventListener('mouseenter',()=>{
        forgotPass.style.color = "black";
    });

    forgotPass.addEventListener('mouseout',()=>{
        forgotPass.style.color = "dimgrey";
        console.log("sadasd");
    });

    signInButton.addEventListener("mouseenter",() =>{
        signInButton.style.backgroundColor = "#EDBBB4";
        signInButton.style.color = "white";
        signInButton.style.cursor = "pointer";

    });


    signInButton.addEventListener("mouseleave",() =>{
        signInButton.style.backgroundColor = "white";
        signInButton.style.color = "#EDBBB4";
    });
    

    goToSignupButton.addEventListener("mouseenter",() =>{
        goToSignupButton.style.textDecoration = "none";
    });


    goToSignupButton.addEventListener("mouseleave",() =>{
        goToSignupButton.style.textDecoration = "underline";
    });


    goToSignupButton.addEventListener("click",goToSignup);
    //ghostButtonSignUp.addEventListener("click",goToSignup);


    signupButton.addEventListener("mouseenter",()=>{
        signupButton.style.backgroundColor = "#CC2936";
        signupButton.style.color = "white";
        signupButton.style.cursor = "pointer";
    });

    signupButton.addEventListener("mouseleave",() =>{
        signupButton.style.backgroundColor = "white";
        signupButton.style.color = "#CC2936";
    });


    goToSigninButton.addEventListener("mouseenter",() =>{
        goToSigninButton.style.textDecoration = "none";
        goToSigninButton.style.cursor = "pointer";
    });


    goToSigninButton.addEventListener("mouseleave",() =>{
        goToSigninButton.style.textDecoration = "underline";
    });

    focusEvents();

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

/*function hoverOverPass(chooseye,chooseSlashEye){
    chooseye.style.display = "block";
    chooseSlashEye.style.display = "none";
}

/*function unHoverOverPass(chooseye,chooseSlashEye){
    chooseye.style.display = "none";
    chooseSlashEye.style.display = "block";
}*/

function focusEvents(){
    signupButton.addEventListener("focusin",()=>{
        signupButton.style.backgroundColor = "#CC2936";
        signupButton.style.color = "white";
        signupButton.style.cursor = "pointer";
    });

    signupButton.addEventListener("focusout",() =>{
        signupButton.style.backgroundColor = "white";
        signupButton.style.color = "#CC2936";
    });


    goToSigninButton.addEventListener("focusin",() =>{
        goToSigninButton.style.textDecoration = "none";
        goToSigninButton.style.cursor = "pointer";
    });


    goToSigninButton.addEventListener("focusout",() =>{
        goToSigninButton.style.textDecoration = "underline";
    });
}


window.onload = frameButtons;
