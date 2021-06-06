const express = require('express');
const path = require('path');
const http = require('http')
const socketio = require('socket.io');


var sql = require('mysql');
let configure = require("./config.js");





const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;


server.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
});


var connection = sql.createConnection(configure);

var username = "";

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to sql database!");
});



//Run when client connects

io.on('connection',socket=>{
    console.log("New connection");
    
    //Sign Up
    getSignupData(socket).then(values=>{
        insertIntoTable("INSERT INTO usernames_passwords_emails VALUES (?,?,?)",values);
        socket.emit("username-used",{ message: 
            ""
        });
    }).catch(()=>{
        socket.emit("username-used",{ message: 
            "Username is already used"
        });
    });
    
    //Sign In
    handleSignin(socket).then(username => {
        getColumn("pending_friends","sender","receiver",username).then(senders=>{
            
            for(const sender of senders){
                socket.emit("friend-request",sender.sender);
            }
        });
    });

    //Friend request
    socket.on('friend-name',data=>{
        let friendship = friend_request_parser(data);
        
        insertIntoTable("INSERT INTO pending_friends VALUES (?,?)",friendship);

        foundInTable("online_users","username",friendship[1]).then(response=>{
            
            if(response){
                getColumn("online_users","session_id","username",friendship[1]).then(id =>{
                    console.log(id[0].session_id);
                    io.sockets.emit("direct-friend-request","hello");

                });

            }
        });
    });

    socket.on('disconnect',()=>{
        deleteFromTable("online_users","session_id",socket.id);
    });

    
});



function getSignupData(socket){
    let signupName, signupPass,signupEmail;
    
    return new Promise((resolve,reject) =>{
    
        getData(socket,'Username').then(username =>{
            foundInTable("usernames_passwords_emails", "username", username).then(response=>{
                if(response){
                    reject();
                }
                else{
                    signupName = username;
                    getData(socket,'password').then(password=>{
                        signupPass = password;
                    });
            
                    getData(socket,'email').then(email=>{
                        signupEmail = email;
                        let values = [signupName,signupPass,signupEmail]
                        resolve(values); 
                    });
                }
            });
        });
    });
}


function getData(socket,message){
    
    return new Promise((resolve,reject) =>{
        socket.on(message,data=>{
            resolve(data);
        });
    });
}


function insertIntoTable(statement,array){
    connection.query(statement,array,(err,results,fields) =>{
        if(err)
            return console.error(err.message);
    });
}

function foundInTable(table_name,selectable,name){
    let statement = "SELECT " + selectable +" FROM " + table_name + " WHERE " + selectable + " = ?";
    let isAlreadyUsed = false;
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

function deleteFromTable(table_name,fieldToSearch,itemToDelete){

    statement = "DELETE FROM " + table_name + " WHERE " + fieldToSearch + " = ?";
    connection.query(statement,itemToDelete,(err,result,fields) =>{
        if(err)
            return console.error(err.message);
    });
    
}

function handleSignin(socket){
    
    return new Promise((resolve,reject) =>{
        getData(socket,'signinUsername').then(username=>{
            
            getData(socket,'signinPassword').then(pass=>{
                validateUser(username.value,pass).then(()=>{
                    socket.emit("signin-answer",{message:
                        "Welcome"
                    });
                    socket.emit('socket-id',socket.id);
                    insertIntoTable("INSERT INTO online_users VALUES (?,?)",[username,socket.id]);
                    resolve(username);
                }).catch(error =>{
                    socket.emit("signin-answer",{message:
                        "username and password dont match"
                    });
                    reject();
                })
            }).catch(noSuchUser=>{
                socket.emit("signin-answer",{ message: 
                    "Username doesnt exist"
                });
                reject();
            });
        });
    });
}


function getColumn(table_name,selectable1,selectable2,name) {
    
    let statement = "SELECT " + selectable1 + " FROM " + table_name + " WHERE " + selectable2 + " = ?";

    return new Promise((resolve,reject) =>{
        connection.query(statement,name,(err,result,fields) =>{
            resolve(result);
        });
    });
}

function validateUser(name,password){
    let statement = "SELECT password FROM usernames_passwords_emails WHERE username = ?"
    
    return new Promise((resolve,reject) =>{
        connection.query(statement, name, (err,result,fields) =>{

            if(result == password.value){
                resolve();
            }
            else{
                reject();
            }
        });
    });
}


function friend_request_parser(str){
    return str.split(',');
}


