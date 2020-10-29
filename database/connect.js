var mongoose = require("mongoose");
mongoose.connect("mongodb://172.28.0.2:27017/MOVILdatabase", {useNewUrlParser: true});
var db = mongoose.connection;
db.on("error", () => {
    console.log("ERROR NO SE PUEDE CONECTAR AL SERVIDOR");
});
db.on("open", () => {
    console.log("CONEXION EXITOSA");
});

module.exports = mongoose;
