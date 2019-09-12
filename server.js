const firebase = require('firebase');
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const firebaseConfig = {
    apiKey: "AIzaSyDSysyBTvWnfugAovLLeoVMd32AvCu0gs0",
    authDomain: "mayur-mogre.firebaseapp.com",
    databaseURL: "https://mayur-mogre.firebaseio.com",
    projectId: "mayur-mogre",
    storageBucket: "mayur-mogre.appspot.com",
    messagingSenderId: "586553524758",
    appId: "1:586553524758:web:d130350e1061212a"
};

app.use(bodyParser());
app.use("/nodejs",express.static(__dirname+"/assets"));
firebase.initializeApp(firebaseConfig);

app.get("/",(request, response)=>{
    response.send("Welcome");
});

app.get('/login',function (request, response){
    response.sendFile(__dirname+"/files/login.html");    
});

app.post('/home',function (request, response){
    var email = request.body.email;
    var password = request.body.password;

    console.log("Email: "+email);
    console.log("Password: "+password);

    /*if(!email || !password){
        return console.log("email and password is required");
    }

    firebase.auth().signInWithEmailAndPassword(email,password).then(function(){
        response.sendFile(__dirname+"/home.html");
    }).catch(function(error){

            if(error){
                var errorCode = error.errorCode;
                var errorMessage = error.errorMessage;
                console.log("sign in error: ",error);
                response.send("Sign in error, try again");    
            }   
    });*/

    var userReference = firebase.database().ref("admin");
	userReference.once("value", 
			  function(snapshot) {
                   var user = snapshot.val();
                    if(user.email==email && user.password==password){
                        response.sendFile(__dirname+"/files/home.html");
                    }else{
                        response.send("Sign in error")
                    }
					
					//userReference.off("value");
			    }, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					response.send("The read failed: " + errorObject.code);
			    });
});

app.post('/submit',function (request, response){
    var link = request.body.link;
    var category = request.body.category;
    var caption = request.body.caption;

    firebase.database().ref('/data').child("youtube").push({
        link: link,
        category: category,
        caption: caption
    });

    response.send("Data submitted successfully");
});



app.get('/videolist',function (request, response){
    
    var userReference = firebase.database().ref("data/youtube");
	userReference.once("value", 
			  function(snapshot) {
                   var videoItem = snapshot.val();
                    
			    }, 
			    function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					response.send("The read failed: " + errorObject.code);
			    });
    

    response.send("Data submitted successfully");
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
 });


