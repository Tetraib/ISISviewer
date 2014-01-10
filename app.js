var express = require("express"),
    app = express();
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.json());
    app.use(express.urlencoded());
});
app.listen(process.env.PORT, process.env.IP);
app.get('/', function(req, res) {
    res.render("home.jade");
});
app.get('/test', function(req, res) {
    res.render("test.jade");
});