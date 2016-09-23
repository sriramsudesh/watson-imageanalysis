



var express = require('express');
var fs = require('fs');
var cfenv = require('cfenv');
var multer = require('multer');
var ejs = require('ejs');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('uploads'));


var appEnv = cfenv.getAppEnv();

var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
  api_key: 'fc728adf94a1fe801494095a266da8ea568353c0',
  version: 'v3',
  version_date: '2016-05-20'
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending .jpg
  }
})

var upload = multer({ storage: storage });
//var upload = multer({ dest: './uploads/' })

var myanalysis = "" ;

app.get('/', function (req, res){
    var result = "";
    myanalysis = "" ;
    res.render('index',{result : result,analyze : myanalysis});
});

var originalfilename = "";


app.post('/', upload.single('userpic') , function (req, res){

    var imageurl =  "";
    originalfilename = req.file.originalname;
    //console.log(appEnv.url);
    //console.log(appEnv.getService('url'));
       //imageurl = appEnv.url + appEnv.port + "/" + req.file.originalname;  
       //imageurl = req.file.originalname; 
       //console.log(imageurl); 
       //var params = { images_file: fs.createReadStream('./uploads/' + req.file.originalname)};
       //analyzePicture(params, function(response){
        //console.log("response" + response);
       //})
    //console.log("Write my analysis" + myanalysis);
    res.render('index',{result : originalfilename ,analyze : myanalysis});
});

app.get('/analyze', function (req, res){

       var params = { images_file: fs.createReadStream('./uploads/' + originalfilename)};
       
     
       //console.log(params);

		var promise = analyzePicture(params);
		promise.then( function(result) {
    // yay! I got the result.
					}, function(error) {
    // The promise was rejected with this error.
											}
    
    res.render("imageanalysis" ,{result:originalfilename, analyze: myanalysis});
});


function analyzePicture(params){
  visual_recognition.classify(params, function(err, res) {
                    if (err) {
                        //console.log('Hitting watson error');
                        //callback(error);
                    } 
            myanalysis = JSON.stringify(res, null, 2);
            
            //console.log("This function called called back " + myanalysis);

    });
}



// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});


