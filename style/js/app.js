const Window = require('electron').remote;

const {ipcRenderer} = require('electron');

const app = require('electron').remote.app;


const close = document.getElementById('close-button');
const maximize = document.getElementById('maximize-button');
const minimize = document.getElementById('min-btn');

let goToMute = new Audio("audio/goToMute.mp3");
let getUnmuted = new Audio("audio/unmute.mp3");


const createGroup = document.getElementById("create-group-img");
const friendSettingsImage = document.getElementById("friend-settings-img");
const muteImage = document.getElementById("unmuted mic");
const muteSoundImage = document.getElementById("unmuted-sound");



let friendSettings = document.querySelector("#friend-settings");
let mute = document.querySelector("#mute");
let muteSound = document.getElementById("mute-sound");
let username = document.getElementById("username");



/*----------------add-Friend-search-------------*/
let search = document.querySelector(".search-user");

let addFriend = document.getElementById("add-friend-img-container");
const addFriendImg = document.getElementById('add-friend-img');
let searchTextarea = document.getElementById("search");

/*---------------------------------------------*/


/*------settings--------------------*/
const settings = document.querySelector(".settings");
const close_settings = document.querySelector("#close-settings");
const acc_settings = document.querySelector("#settings");
/*---------------------------------*/

/*-----------notifications----------*/
const notification = document.querySelector(".notification");
const notification_button = document.querySelector("#notification");

/*let friend_request = document.querySelector(".friend-requests-content");
let accept_friend_request = document.querySelector("#check-notification");
let decline_friend_request = document.querySelector("#x-notification");*/
let friend_requests = document.querySelector("#friend-requests");
let messages = document.querySelector("#messages");

/*----------------------------------*/
/*-----------write-message--------------*/
let sendPhotoImage = document.getElementById("plus");
let sendMessage = document.getElementById("user-write");


/*---------------------------------------*/

let isClicked = false;
let isMuted = false;
let isSoundMuted = false;
let notHit = false;

const appWindow = Window.getCurrentWindow();
let friend_divs = [];


ipcRenderer.send("request-username","hello");


ipcRenderer.on("username",(event,arg)=>{
    username.innerHTML = arg;
});


ipcRenderer.on("friend",(event,arg)=>{

    createFriendRequest(arg);
    
});


ipcRenderer.on('accepted-friend',(event,arg)=>{
    createFriendIcon(arg.toString());
});

appWindow.on("close",()=>{
    app.quit();
});


close.addEventListener('click', ()=>{
    app.quit();
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

addFriendImg.addEventListener('click',()=>{
    showSearch(search);
    animate(search,'search-user');
    searchTextarea.focus();
    searchTextarea.style.border = "1px solid #EDBBB4";
});

searchTextarea.addEventListener('focusout',()=>{
    hideSearch(search);
    
});

sendPhotoImage.addEventListener("click",()=>{

    Window.dialog.showOpenDialog();
});

searchTextarea.addEventListener('keypress',e=>{

    if(e.key.charCodeAt() == 69){
        e.preventDefault();
        ipcRenderer.send('send-friend-name',searchTextarea.value);
        searchTextarea.value = "";
        searchTextarea.style.borderColor = "#43B929"
        setTimeout(() => {
            searchTextarea.style.borderColor = "#EDBBB4"
        }, 1000);

    }
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


function animate(element,classname){
    element.style.display ="block";
    
    element.classList.remove(classname);
    void element.offsetWidth;

    element.classList.add(classname);
}
    

function showSearch(element) {
    element.style.animation = "goDown 0.8s";
    element.style.top = "45px";
    
    element.style.display = "block";
}

function hideSearch(element) {
    element.style.animation = "goUp 0.8s";
    element.style.top = "-50px";
    searchTextarea.value = "";
}

acc_settings.addEventListener('click', ()=>{
    settings.style.display = "block";
});

close_settings.addEventListener('click', ()=>{
    settings.style.display = "none";
});


notification_button.addEventListener('click', ()=>{

    notHit = !notHit;
    if(notHit == true){
        notification.style.display = "block";
        
    }
    else{
        notification.style.display = "none";
    }

});


messages.addEventListener('click', ()=>{

    for(let friend of friend_divs){
        friend.style.display = "none";
    }

});

friend_requests.addEventListener('click', ()=>{

    for(let friend of friend_divs){
        friend.style.display = "block";
    }
});


document.addEventListener('mouseup', function(e) {

    if (!notification.contains(e.target)) {
        if(notHit){
            notification.style.display = 'none';
            notHit = !notHit;  
        }    
              
    }
});


sendMessage.addEventListener('keypress',e=>{

    if(e.key.charCodeAt() == 69){
        e.preventDefault();
        if(checkEmptyString(sendMessage.value) != "" ){
            let userToSend = document.querySelector("#friend-nickname").innerHTML;
            
            ipcRenderer.send("message-to-user",userToSend + "," + sendMessage.value);

            createMessage(sendMessage.value);
        }
        
        sendMessage.value = "";
    }
   
});


function createFriendRequest(name){

    let friend = document.createElement("div");
    let linebreak = document.createElement('br');

    friend.className = "friend-requests-content";                      
    let friendname = document.createTextNode(name.toString());
    let message = document.createTextNode("\nsent you a friend request");

    friendname.id = "nickname";
    friend.appendChild(friendname);
    friend.appendChild(linebreak);
    friend.appendChild(message);

    let checkImg = document.createElement("img");
    let x_img = document.createElement("img");

    checkImg.src = "img/check.svg";
    checkImg.id = "check-notification";

    x_img.src = "img/x.svg";
    x_img.id = "x-notification";

    friend.appendChild(checkImg);
    friend.appendChild(x_img);

    friend_divs.push(friend);

    notification.appendChild(friend);

    //handle events
    friend.addEventListener("mouseenter",()=>{
        friend.childNodes.item(3).style.display ="block";
        friend.childNodes.item(4).style.display ="block";
        
        

        friend.childNodes.item(4).addEventListener('click', ()=>{
            ipcRenderer.send("declined-friend-request",friend.childNodes.item(0).data);
            friend.style.animation = "decline-friend-request-animation 1s"
            
            setTimeout(() => {
                friend.remove();
            }, 1000);
        });
    });

    friend.childNodes.item(3).addEventListener('click', ()=>{
            
        ipcRenderer.send("accepted-friend-request",friend.childNodes.item(0).data);
        friend.style.animation = "accept-friend-request-animation 1s"
        
        setTimeout(() => {
            friend.remove();
            createFriendIcon(friend.childNodes.item(0).data.toString());
        }, 1000);
        
        
    });

    friend.addEventListener("mouseleave",()=>{
        friend.childNodes.item(3).style.display ="none";
        friend.childNodes.item(4).style.display ="none";
    });
}


function getFirstChar(str) {
    return str.charAt(0).toUpperCase();
}


function removeFromArray(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}


function createFriendIcon(friendname){
    let friendIcon = document.createElement("div");
    friendIcon.className = "friend-icon"
    let name = document.createTextNode(getFirstChar(friendname));

    friendIcon.appendChild(name);
    document.querySelector(".friends").appendChild(friendIcon);

    let friendlabel = document.createElement("div");
    let friendnametext = document.createTextNode(friendname);
    friendlabel.className = "friendlabel";
    friendlabel.appendChild(friendnametext);
    document.querySelector(".friends").appendChild(friendlabel);
    
    friendIcon.addEventListener('click', ()=>{
        document.querySelector("#friend-nickname").innerHTML = friendname;
        document.querySelector(".no-conversation").style.display = "none";
        sendMessage.value = "";
    });

    friendIcon.addEventListener('mouseenter',()=>{
        friendlabel.style.display = "block";
    });

    friendIcon.addEventListener('mouseleave',()=>{
        friendlabel.style.display = "none";
    });


}


function checkEmptyString(str){
    
    if(str.charAt(0) == " "){
        str = str.substring(1);
        return checkEmptyString(str);
    }
    else{
        return str;
    }
}

function createMessage(element) {
    let send_container = document.createElement("div");
    send_container.className = "send-container";
    document.querySelector(".display-chat-area").append(send_container);

    
    let message = document.createElement("div");
    let textmessage = document.createTextNode(element);
    message.className = "message"

    message.appendChild(textmessage);
    send_container.append(message);
}