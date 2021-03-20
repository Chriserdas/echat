const { request } = require("https");

const electron = require('electron');
const url = require('url');
const path = require('path');


const{app ,BrowserWindow} = electron;

let mainWindow;

app.on('ready', function(){

    mainWindow = new BrowserWindow({ titleBarStyle: 'customButtonsOnHover', frame: false, width: 1100 , webPreferences:{ enableRemoteModule: true , nodeIntegration: true}, resizable:false});
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,"..", 'index.html'),
        protocol: 'file:',
        slashes:true
    }));
   
      

});



