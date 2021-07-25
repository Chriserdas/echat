const express = require('express');
const path = require('path');
const http = require('http')
const socketio = require('socket.io');


var sql = require('mysql');
let configure = require("./config.js");

let chatOpened = new Map();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;


server.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
});


var connection = sql.createConnection(configure);

var username = "";

let online_users = [];

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
        });getColumn("friends","friend","user",username).then(friends=>{
            
            for(const friend of friends){
                socket.emit("friend",friend.friend);
            }
        });
    });

    //Friend request
    socket.on('friend-name',data=>{
        let friendship = friend_request_parser(data);
        let isfriendrequested = true;
        let isfriendrequestedBackwards = true;
        let isfriend = true;
        getColumn('pending_friends',"sender","receiver",friendship[1]).then(senders=>{
            
    
            if(senders.length == 0){
                isfriendrequested = false;
            }
            else{

                for(let sender of senders){
                
                    if(sender.sender == friendship[0]){
                        isfriendrequested = true;
                        //should read from client side and send it to message notification.
                        socket.emit("already-requested","You have already sent a friend request to this user");
                    }
                    else{
                        console.log('entered else');
                        isfriendrequested = false;
                    }
                }
            }
            
        });
        getColumn('pending_friends',"sender","receiver",friendship[0]).then(senders=>{
            
    
            if(senders.length == 0){
                isfriendrequestedBackwards = false;
            }
            else{

                for(let sender of senders){
                
                    if(sender.sender == friendship[1]){
                        isfriendrequestedBackwards = true;
                        //should read from client side and send it to message notification.
                        socket.emit("already-requested","You have already sent a friend request to this user");
                    }
                    else{
                        console.log('entered else');
                        isfriendrequestedBackwards = false;
                    }
                }
            }
            
        });
        getColumn("friends","user","friend",friendship[1]).then(users=>{
            
            if(users.length == 0){
                isfriend = false;
            }
            else{
                for(let user of users){
                    if(user.user == friendship[0]){
                        isfriend = true;
                        //should read from client side and send it to message notification.
                        socket.emit("already-requested","You are already friend with this user");
                    }
                    else
                        isfriend = false;
                }
            }

            if(!isfriend && !isfriendrequested && !isfriendrequestedBackwards){
    
                insertIntoTable("INSERT INTO pending_friends VALUES (?,?)",friendship);        
                checkValue(friendship[1],friendship[0],"direct-friend-request");
    
            }
            
        });


    });


    //message handling

    socket.on("message-to-user",data=>{
        let messageInfo =  friend_request_parser(data);
        messageInfo.push(Date.now());
        insertIntoTable("INSERT INTO messages VALUES (?,?,?,?)",messageInfo);

        if(chatOpened.has(messageInfo[1]) && chatOpened.get(messageInfo[1]) === messageInfo[0]){
            checkValue(messageInfo[1],{message:messageInfo[2],date:Date.now()},"direct-message");
        }
        
    });

    socket.on("chatOpened",data =>{
        let userInfo = friend_request_parser(data);
        
        chatOpened.set(userInfo[0],userInfo[1]);
        
        let statement = "SELECT * from messages Where (sender = ? AND receiver = ? ) OR sender = ? AND receiver = ?";
        connection.query(statement,[userInfo[0],userInfo[1],userInfo[1],userInfo[0]], (err, result, fields) => {
            
            for(let i of result){
                if(i.receiver == userInfo[0].toString()){
                    i.message = " " + i.message;       
                }
                socket.emit("message",{message:i.message, date:i.datetime});
            }
        });

    });



    socket.on('disconnect',()=>{
        //deleteFromTable("online_users","session_id",socket.id);
        for(let user of online_users){
            if(user.id == socket.id){
                online_users = removeFromArray(online_users,user);
                chatOpened.delete(user.username);
            }
        }
        
    });

    
    socket.on("accepted-friend-request",data =>{
        let friends = friend_request_parser(data);
        
        let friends_inverted =[friends[1],friends[0]]; 

        insertIntoTable("INSERT INTO friends VALUES (?,?)",friends);
        insertIntoTable("INSERT INTO friends VALUES (?,?)",friends_inverted);

        checkValue(friends[1],friends[0],"accepted-friend");

        deleteFromTable("pending_friends","receiver",friends[0]);
        
    });
});

function checkValue(value,secondvalue,message){
    return new Promise((resolve,reject) =>{

        for(let user of online_users){
            if(user.username == value){
                io.to(user.id).emit(message,secondvalue);
                resolve();
            }
        }
    })
}


function removeFromArray(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}



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
                    //insertIntoTable("INSERT INTO online_users VALUES (?,?)",[username,socket.id]);
                    let user = {
                        username,
                        id: socket.id
                    }
                    online_users.push(user);
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


