
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
            nodeIntegration: true,
            contextIsolation: false
        }, 
        resizable:false
    });
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,"..", 'index.html'),
        protocol: 'file:',
        slashes:true
    }));

    ipcMain.on('get-username',(_event,arg)=>{
        username = arg;
    });

    ipcMain.on("request-username",(event,_arg)=>{
        event.sender.send("username",username);
    })
   
    ipcMain.on('get-id',(_event,arg)=>{
        sessionID = arg;
    });
    ipcMain.on('send-friend-name',(_event,arg)=>{
        mainWindow.webContents.send('friend-name',username + "," + arg);
    });

    ipcMain.on("accepted-friend-request",(_event,arg)=>{
        mainWindow.webContents.send('accepted-friend-request',username + "," + arg);
    });

    ipcMain.on("message-to-user",(_event,arg)=>{
        mainWindow.webContents.send("message-to-user",username + "," + arg);
    });
    
    ipcMain.on("chatOpened",(_event,arg)=>{
        mainWindow.webContents.send('chatOpened',username + "," + arg);
    });

    ipcMain.on("call",(_event,arg)=>{
        mainWindow.webContents.send('call',username + "," + arg);
    });
});





