var express = require("express"),
    app = express();
var fs = require('fs');
var cheerio = require('cheerio');
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
});
app.listen(process.env.PORT, process.env.IP);
//prototype
function Dcm2json(xmldata, image) {
    this.image = image;
    this.dcmobject = {};
    this.$ = cheerio.load(xmldata, {
        normalizeWhitespace: true,
        xmlMode: true
    });
}
Dcm2json.prototype = {
    constructor: Dcm2json,
    get jsondata() {
        this.$('element').each(function(i, elem) {
            if ($(this).text() !== "") {
                this.dcmobject[$(this).attr("name")] = [{
                    "val": $(this).text()
                }, {
                    "tag": $(this).attr("tag")
                }, {
                    "vr": $(this).attr("vr")
                }];
            }
        });
        return this.dcmobject;
    }
};


app.get('/', function(req, res) {
    res.render("home.jade");
});

app.post('/dicomin', function(req, res) {
    var dicom = {};
    // curl command :
    // curl "https://isisviewer-c9-tetraib.c9.io/dicomin" -F image=@"B2.jpg" -F data=@"B2.xml"
    fs.readFile(req.files.data.path, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var $ = cheerio.load(data, {
            normalizeWhitespace: true,
            xmlMode: true
        });
        $('element').each(function(i, elem) {
            if ($(this).text() !== "") {
                dicom[$(this).attr("name")] = [{
                    "val": $(this).text()
                }, {
                    "tag": $(this).attr("tag")
                }, {
                    "vr": $(this).attr("vr")
                }];
            }
        });
        console.log(dicom);
    });
    res.send(200);
});