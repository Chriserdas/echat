var socket;

const electron = require('electron');
const path = require('path');
const url = require('url');

const ipc = electron.ipcRenderer;

let win;
let AppWindow = electron.remote.BrowserWindow;  
let currentWindow = AppWindow.getFocusedWindow();


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



ipc.on('friend-name',(event,arg)=>{
    socket.emit('friend-name',arg);
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
            signinNotification.innerHTML = "username and password dont match";
            signinNotification.style.left = "130px";
            animate(signinNotification);
            console.log(answer.message);
        }
        else if(answer.message == "Welcome"){
            
            win = new AppWindow({
                width: 1920,
                height: 1080,
                frame: false,
                webPreferences:{ 
                    enableRemoteModule: true,
                    nodeIntegration: true,
                }

            });
            
            win.loadURL(url.format({
                pathname: path.join(__dirname,"main.html"),
                protocol: 'file:',
                slashes:true
            }));
            

            sendUsername().then();
            sendSessionId().then(()=>{
                currentWindow.hide();
                signinUsername.value = "";
                signinPassword.value = "";
                
            });            
            handleApp();

            socket.on("direct-friend-request",data =>{
                win.webContents.send("friend",data);
            });

            ipc.on("accepted-friend-request",(event,arg)=>{
                socket.emit("accepted-friend-request",arg);
            });

            socket.on("accepted-friend",friendname=>{
                win.webContents.send("accepted-friend",friendname);
            });
        }
    });
    
    
}

function sendUsername(){
    return new Promise((resolve,reject)=>{
        ipc.send('get-username',signinUsername.value);
    });
}


function sendSessionId(){
    return new Promise((resolve,reject)=>{
        socket.on('socket-id',id=>{
            ipc.send('get-id',id);   
            resolve();
        });
    });
}


function handleApp() {
    socket.on("friend-request",data=>{
        win.webContents.on('did-finish-load',()=>{
            win.webContents.send("friend",data);
        });
    });

    socket.on('friend',data=>{
        win.webContents.on('did-finish-load',()=>{
            win.webContents.send("accepted-friend",data);
        });
    });

    ipc.on("message-to-user",(event,arg)=>{
        socket.emit("message-to-user",arg);
    });
    
}