var express = require("express"),
    app = express(),
    fs = require('fs'),
    cheerio = require('cheerio'),
    GAPI = require('node-gcs').gapitoken,
    GCS = require('node-gcs');
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
});
app.listen(process.env.PORT, process.env.IP);
//Prototype declaration
//Dicomjson, it require cheerio
function Dicomjson(data, image) {
    this.data = data;
    this.$ = cheerio.load(data, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    this.jsondata = {};
}
Dicomjson.prototype = {
    constructor: Dicomjson,
    get getjson() {
        this.jsondata.metaheader = [{
            'xfer': this.$('meta-header').attr("xfer")
        }, {
            "name": this.$('meta-header').attr("name")
        }];
        this.jsondata.dataset = [{
            'xfer': this.$('data-set').attr("xfer")
        }, {
            "name": this.$('data-set').attr("name")
        }];
        this.$('element').each((function(i, elem) {
            if (this.$(elem).text() !== "") {
                this.jsondata[this.$(elem).attr("name")] = [{
                    "val": this.$(elem).text()
                }, {
                    "tag": this.$(elem).attr("tag")
                }, {
                    "vr": this.$(elem).attr("vr")
                }];
            }
        }).bind(this));
        // /!\ .bind this to change the "this" value
        return this.jsondata;
    }
};
// /Prototype declaration
//
var mongoose = require('mongoose');
mongoose.connect("mongodb://test:test@troup.mongohq.com:10001/app21474120");
var db = mongoose.connection;
//DB open function
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function callback() {
    console.log("connected");
    //Schema strict : false to accept any formated data only use it to write to db incoming dicom
    var dicomschemaless = new mongoose.Schema({}, {
        strict: false
    });
    var dicomwrite = mongoose.model('dicom', dicomschemaless);
    //
    app.get('/', function(req, res) {
        res.render("home.jade");
    });
    //The route to receive dicom :
    app.post('/dicomin', function(req, res) {
        // curl command to post files :
        // curl "https://isisviewer-c9-tetraib.c9.io/dicomin" -F image=@"B2.jpg" -F data=@"B2.xml"
        fs.readFile(req.files.data.path, 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            }
            var dicomjson = new Dicomjson(data);
            // Store the formated json of dicom data
            var savedicomwrite = new dicomwrite(dicomjson.getjson);
            savedicomwrite.save(function(err) {
                if (err) {
                    console.log(err);
                }
                res.send(200);
            });
            var gapi = new GAPI({
                iss: '305435103473-pdkn65n1g11vaa66vobq9fidubrcp1o6@developer.gserviceaccount.com',
                scope: 'https://www.googleapis.com/auth/devstorage.read_write',
                keyFile: './key.pem'
            }, function(err) {
                if (err) {
                    console.log(err);
                }
                var headers = {
                    'Content-Type': 'Image/jpeg'
                };
                var file = fs.createReadStream(req.files.image.path);
                var gcs = new GCS(gapi);
                gcs.putStream(file, 'dicomdra', '/test.jpg', headers, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
});