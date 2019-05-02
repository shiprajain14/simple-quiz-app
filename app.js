require('dotenv').config();
var cloudant = require('cloudant');
var express = require('express');
var bodyParser = require('body-parser');
var stringSimilarity = require('string-similarity');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  res.sendFile("views/index.html", {"root": __dirname});
});
var cloudant = cloudant({account:process.env.cloudantusername, password:process.env.cloudantpassword});

var responsequiz1;
var responsequiz2;
var responsequiz3;
var responsequiz4;
var responsequiz5;
var time;
var url;
var counter=0;

quizdb = cloudant.db.use(process.env.dbname);


app.post('/quizsubmission', function(req,res){
    if(stringSimilarity.compareTwoStrings(req.body.quiz_1, 'b')){
       counter++;
       }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_2,'d')){
        counter++;
    }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_3,'c')){
       counter++;
       }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_4,'c')){
        counter++;
    }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_5,'b')){
       counter++;
       }
    var quizscore = counter;
    var doc={
        _id:req.body.cloudemail,
        score:quizscore,
        responsequiz1: req.body.quiz_1,
        responsequiz2: req.body.quiz_2,
        responsequiz3: req.body.quiz_3,
        responsequiz4: req.body.quiz_4,
        responsequiz5: req.body.quiz_5,
        time: new Date().toISOString(),
        url: req.headers.host + req.url
        };
    
quizdb.insert(doc,function(err,body,header){
    if(err){
        console.log('Error:'+err.message);
        return;
    }
});
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if(quizscore==5){
    res.write('<br/><center><h2>Awesome! You are a champ, you have scored 5/5!</h2></center>');
    }
    if(quizscore==4){
    res.write('<center><h2>Wow! You have scored 4/5!</h2><center>');
    }
    if(quizscore<=3){
    res.write('<center><h2>Thank you for taking the quiz!</h2><center>');   
    res.write('<center><h3>You have scored '+quizscore+' /5!</h3><center>');   
    }
    res.end();
    //return res.sendFile(__dirname+"/views/success.html");
});

const port = 3001;
app.listen(port, function () {
    console.log("Server running on port: %d", port);
});
module.exports = app;