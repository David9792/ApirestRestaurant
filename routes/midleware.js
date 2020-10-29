//const { modelNames } = require("mongoose");
var JWT = require ("jsonwebtoken");
var CLIENTES = require("../database/clientes");

var midleware = async(req, res,next) => {
    //RECUPERANDO DEL HEADER EL TOKEN
    var token = req.headers["authorization"];
    //console.log(token);
    if (token == null) {
        res.status(403).json({error: "NO TIENES ACCESO A ESTE LUGAR, TOKEN NULL"});
        return;
    }
    //VERIFICANDO EL TOKEN, SI ES VALIDO O NO ES VALIDO
    try {
        var decoded = JWT.verify(token, 'seminariokeysecret');
    if (decoded == null) {
        res.status(403).json({error: "NO TIENES ACCESO A ESTE LUGAR, TOKEN FALSO"});
        return;
    }
    //VERIFICACION DEL TIEMPO DE SESION
    if (Date.now() / 1000 > decoded.exp) {
        res.status(403).json({error: "EL TIEMPO DEL TOKEN YA EXPIRO"});
        return;
    }

    //VERIFICANDO SI ESE ID EXISTE EN LA BASE DE DATOS
    console.log(decoded);
    var idclientes = decoded.data;

    //console.log(idclientes);
    var docs = await CLIENTES.findOne({_id: idclientes});
    if (docs == null) {
        res.status(403).json({error: "NO TIENES ACCESO A ESTE LUGAR, EL USUARIO NO EXISTE EN LA BD"});
        return;
    }
    var roles = docs.roles.map(item => {
        return item;
    });
    //console.log(roles);
    var services = req.originalUrl.substr(1, 100);
    if (services.lastIndexOf("?") > -1) {
        services = services.substring(0, services.lastIndexOf("?"));
    }
    //console.log(Object.keys(req));
    //console.log(roles);
    var METHOD = req.method;
    var URL = services;
    //console.log(req.method);
    //console.log("PASANDO POR EL MIDDLEWARE " + services);
    for (var i=0; i < roles.length; i++) {
        if (/*METHOD == roles[i].method &&*/ URL == roles[i].service) {
            next();
            return;
        }
    }
    res.status(403).json({error: "USTED NO TIENE ACCESO A ESTE SERVICIO"});
    return;

    }catch(tokenExpiredError ) {
        res.status(403).json({error: "EL TIEMPO DEL TOKEN YA EXPIRO"});
        return;
    }
}
module.exports = midleware;