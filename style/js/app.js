const Window = require('electron').remote;

const {ipcRenderer} = require('electron');


const close = document.getElementById('close-button');
const maximize = document.getElementById('maximize-button');
const minimize = document.getElementById('min-btn');

let goToMute = new Audio("audio/goToMute.mp3");
let getUnmuted = new Audio("audio/unmute.mp3");

const createGroup = document.getElementById("create-group-img");
const friendSettingsImage = document.getElementById("friend-settings-img");
const muteImage = document.getElementById("unmuted mic");
const muteSoundImage = document.getElementById("unmuted-sound");
let sendPhotoImage = document.getElementById("plus");


let friendSettings = document.querySelector("#friend-settings");
let mute = document.querySelector("#mute");
let muteSound = document.getElementById("mute-sound");
let username = document.getElementById("username");

let addFriend = document.getElementById("add-friend-img-container");
const addFriendImg = document.getElementById('add-friend-img');


let isClicked = false;
let isMuted = false;
let isSoundMuted = false;


const appWindow = Window.getCurrentWindow();
ipcRenderer.send("request-username","hello");

ipcRenderer.on("username",(event,arg)=>{
    username.innerHTML = arg;
});

close.addEventListener('click', ()=>{
    appWindow.close();
});

maximize.addEventListener('click', ()=>{

    if(appWindow.isMaximized()){
        appWindow.unmaximize();
    }
    else 
        appWindow.maximize();
});

minimize.addEventListener('click', ()=>{
    appWindow.minimize();
});


friendSettings.addEventListener('click',()=>{
    isClicked = !isClicked;

    if(isClicked === true){
        friendSettingsImage.src = "img/friend-settings-clicked.svg";
    }
    else{
        friendSettingsImage.src = "img/friend-settings.svg";
    }
});

mute.addEventListener('click',()=>{
    isMuted = !isMuted;
    if(isMuted){
        playAudio(goToMute).then(()=>{
            muteImage.src = "img/mute.svg";
        });    
    }
    else{
        playAudio(getUnmuted).then(()=>{
            muteImage.src = "img/unmute.svg";
        });
    }
});


muteSound.addEventListener('click', ()=>{
    isSoundMuted = !isSoundMuted;

    if(isSoundMuted){
        playAudio(goToMute).then(()=>{
            muteSoundImage.src = "img/no-sound.svg";
        });
    }
    else{
        playAudio(getUnmuted).then(()=>{
            muteSoundImage.src = "img/sound.svg";
        });
        
    }
});

changeIconOnHover(sendPhotoImage, "mouseenter","img/plus-hovered.svg");
changeIconOnHover(sendPhotoImage, "mouseleave","img/plus.svg");

changeIconOnHover(createGroup,"mouseenter", "img/createGroupHovered.svg");
changeIconOnHover(createGroup,"mouseleave", "img/createGroup.svg");

addFriendImg.addEventListener('mouseenter',()=>{
    addFriendImg.src = "img/add-friend-hovered.svg";
    addFriend.style.borderColor = "#EDBBB4";
    
});

addFriendImg.addEventListener('mouseleave',()=>{
    addFriendImg.src = "img/add-friend.svg";
    addFriend.style.borderColor = "white";
    
});


sendPhotoImage.addEventListener("click",()=>{

    Window.dialog.showOpenDialog();
});



function changeIconOnHover(element,action,svg) {
    element.addEventListener(action,()=>{
        element.src = svg;
    });
}


function playAudio(audioTrack){

    return new Promise((resolve,reject) =>{
        audioTrack.play();
        resolve();       
    });
}



    


