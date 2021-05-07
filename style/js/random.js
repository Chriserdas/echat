
const { request } = require("https");

const electron = require('electron');
const url = require('url');
const path = require('path');

let username;
const{app ,BrowserWindow} = electron;
let AppWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;


let mainWindow;


app.on('ready', function(){

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

});



