const express = require('express');
const path = require('path');
const http = require('http')
const socketio = require('socket.io');


var isAlreadyUsed = false;
var counter = 0;
var sql = require('mysql');
let configure = require("./config.js");
const { stat } = require('fs');

let count = "SELECT COUNT(*) AS total FROM ids_passwords";


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname,'style')));


server.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);

    
});

//Connect with sql db

var connection = sql.createConnection(configure);


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to sql database!");
});

connection.query(count,(err,result)=>{
    counter = result[0].total;
});

//Run when client connects

let emitedMessagesMap = new Map();

emitedMessagesMap.set("Username", "INSERT INTO ids_usernames VALUES(?,?)");
emitedMessagesMap.set("password","INSERT INTO ids_passwords VALUES(?,?)");
emitedMessagesMap.set("email", "INSERT INTO ids_emails VALUES(?,?)");

emitedMessagesMap.set("signinUsername", "");
emitedMessagesMap.set("signinPassword", "");


io.on('connection',socket=>{
    console.log("New connection");

    //Complete Signup!

    for(let [key,value] of emitedMessagesMap.entries()){

        socket.on(key, data=>{
                
            if(key == "Username"){
                
                validateUsername(data).then(answer =>{
                    if(answer){
                        socket.emit("username-used",{ message: 
                            "Username is already used"
                        });
                    
                    }
                    else{
                        socket.emit("username-used",{ message: 
                            ""
                        });
                        ++counter;
                        insertIntoTable(value,data);

                    }
                })
                .catch(error=>{
                    throw error;
                });
                
            }
            else if(key == 'password' || key == "email"){

                if(!isAlreadyUsed){
                    insertIntoTable(value,data);
                }
            }
            else{
                
                handleSignin(key,data,socket);
            }
            
        });
    }
    
});




function insertIntoTable(statement, element){
    connection.query(statement,[counter,element],(err,results,fields) =>{
        if(err)
            return console.error(err.message);
    });
}

function validateUsername(name){
    let statement = "SELECT username FROM ids_usernames WHERE username = ?";
    
    return new Promise((resolve,reject)=>{
        connection.query(statement,name,(err,result,fields) =>{
    
            if(result.length > 0){
                isAlreadyUsed = true;
    
            }
            else{
                isAlreadyUsed = false;
            }
            resolve(isAlreadyUsed);
            
        });

    });
        
}

function handleSignin(key,name,socket){
    
    if(key == "signinUsername"){
        if(!getId(name)){
            socket.emit("username-doesnt-exist",{ message: 
                "Username doesnt exist"
            });
        }
    }
    else{
        if(!getId(name)){
            if(validateUser(getId(name),name)){

            }
        }
    }
}

function getId(name){
    let statement = "SELECT id FROM ids_usernames WHERE username = ?";

    connection.query(statement,name,(err,result,fields) =>{
        
        if(result.length > 0)
            return result;
        
        else 
            return false;
        
    });
}

function validateUser(userId,password){
    let statement = "SELECT password FROM ids_passwords WHERE id = ?"

    connection.query(statement, userId, (err,result,fields) =>{

        if(result == password.value)
            return true;

        else
            return false;

    });

}





