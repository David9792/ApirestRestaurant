var express = require("express");
var sha1 = require("sha1");
var router = express.Router();
var CLIENTES = require("../database/clientes");
var JWT = require("jsonwebtoken");
//LISTA DE USUARIOS
//CRUD
var midleware = require("./midleware");

router.get("/clientes", midleware, (req, res) => {
    var filter = {};
    var params = req.query;
    var select = "";
    var order = {};
    if (params.Nombre != null) {
        var expresion = new RegExp(params.Nombre);
        filter["Nombre"] = expresion;
    }
    if (params.filters != null) {
        select = params.filters.replace(/,/g, " ");
    }
    if (params.order != null) {
        var data = params.order.split(",");
        var number = parseInt(data[1]);
        order[data[0]] = number;
    }

    CLIENTES.find(filter).
    select(select).
    sort(order).
    exec((err, docs) => {
        if (err) {
            res.status(500).json({msn: "ERROR EN EL SERVIDOR"});
            return;
        }
        res.status(200).json(docs);
        return;
    });
});
router.post("/clientes", (req, res) => {
    var clientesRest = req.body;
    //creamos validacion para el password
    if (clientesRest.Password == null) {
        res.status(300).json({msn: "EL PASSWORD ES NECESARIO PARA CONTINUAR CON EL REGISTRO"});
        return;
    }
    /*if (clientesRest.Password.length < 6) {
        res.status(300).json({msn: "EL PASSWORD ES DEMASIADO CORTO"});
        return;
    }

    if (!/[A-Z]+/.test(clientesRest.Password)) {
        res.status(300).json({msn: "EL PASSWORD NECESITA UNA LETRA MAYUSCULA"});
        return ;
    }
    if (!/[\$\^\@\&\(\)\{\}\#]+/.test(clientesRest.Password)) {
        res.status(300).json({msn: "EL PASSWORD NECESITA UN CARACTER ESPECIAL"});
        return ;
    }*/
    clientesRest.Password = sha1(clientesRest.Password);
    clientesRest
    var clientesDB = new CLIENTES(clientesRest);

    clientesDB.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            res.status(500).json(errors);
            return;
        }
        res.status(200).json(docs);
    })
});

router.put("/clientes",midleware, async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    var allowkeylist = ["Nombre", "Telefono", "Direccion"];
    var keys = Object.keys(bodydata);
    var updateobjectdata={};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    CLIENTES.update({_id: params.id}, {$set: updateobjectdata}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json(docs);
    });
});

router.delete("/clientes", midleware, (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    CLIENTES.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json(docs);
    });
    
});
router.post("/login", async(req, res) => {
    var body = req.body;
    if (body.Nombre == null) {
        res.status(300).json({msn: "EL NOMBRE ES NECESARIO"});
            return;
    }
    if (body.Password == null) {
        res.status(300).json({msn: "EL PASSWORD ES NECESARIO"});
            return;
    }
    var results =  await CLIENTES.find({Nombre: body.Nombre, Password: sha1(body.Password)});
   //console.log(results[0].id);
    if (results.length == 1) {
        var token = JWT.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 2),
            data: results[0].id,
        }, 'seminariokeysecret')
        res.status(200).json({msn: "AA" + response.getString("msn") + body.Nombre, token : token });
            return;
    }
    //validacion email
    var results =  await CLIENTES.find({Email: body.Nombre, Password: sha1(body.Password)});
    if(results.length == 1){
        var token = JWT.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: results[0].id,
        }, 'seminariokeysecret')
        res.status(200).json({msn: results[0].Rol   , token : token });
            return;
    }
    res.status(200).json({msn: "CREDENCIALES INCORRECTAS"});
            return;
});

module.exports = router;