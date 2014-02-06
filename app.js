var express = require("express"),
    app = express();
var xml2js = require('xml2js');
var parser = new xml2js.Parser({
    mergeAttrs: true,
    explicitArray: false
});
var fs = require('fs');
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
});
app.listen(process.env.PORT, process.env.IP);
app.get('/', function(req, res) {
    res.render("home.jade");
});

app.post('/test', function(req, res) {
    var convertedobj = {};
    // curl command :
    // curl "https://isisviewer-c9-tetraib.c9.io/test" -F image=@"B2.jpg" -F data=@"B2.xml"
    fs.readFile(req.files.data.path, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        parser.parseString(data, function(err, result) {
            for (var i in result.test.element) {
                convertedobj[result.test.element[i].tag] = [{
                    "value": result.test.element[i]._
                }, {
                    "name": result.test.element[i].name
                }];

            }
            console.log(convertedobj);
        });
    });
    res.send(200);
});