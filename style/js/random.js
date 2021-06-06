
const { request } = require("https");

const electron = require('electron');
const url = require('url');
const path = require('path');

let sessionID;

let username;
const{app ,BrowserWindow} = electron;

const ipcMain = electron.ipcMain;


let mainWindow,win;
let window;

app.on('ready', function(){
    let friendname;

    mainWindow = new BrowserWindow({ 
        titleBarStyle: 'customButtonsOnHover', 
        frame: false, 
        width: 1100 , 

        webPreferences:{ 
            enableRemoteModule: true ,
            webSecurity:false,
            nodeIntegration: true
        }, 
        resizable:false
    });
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,"..", 'index.html'),
        protocol: 'file:',
        slashes:true
    }));

    ipcMain.on('get-username',(event,arg)=>{
        username = arg;
    });

    ipcMain.on("request-username",(event,arg)=>{
        event.sender.send("username",username);
    })
   
    ipcMain.on('get-id',(event,arg)=>{
        sessionID = arg;
    });
    ipcMain.on('send-friend-name',(event,arg)=>{
        mainWindow.webContents.send('friend-name',username + "," + arg);
    });
    
});





