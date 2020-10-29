var express = require("express");
var router = express.Router();
var MENUS = require("../database/menus");

router.get("/menus", (req, res) => {
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

    MENUS.find({restaurant_id: params.restaurant_id}).
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
router.post("/menus", (req, res) => {
    var menusRest = req.body;
    var menusDB = new MENUS(menusRest);
    menusDB.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            res.status(500).json(errors);
            return;
        }
        res.status(200).json(docs);
    })
});

router.put("/menus", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    //Nombre, precio, descripción, fechaderegistro, fotografía del producto
    var allowkeylist = ["Nombre", "Precio", "Descripcion", "FotografiadelProducto"];
    var keys = Object.keys(bodydata);
    var updateobjectdata={};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
            //arreglar...problemas con las resticciones de actualizar
        }
    }
    MENUS.update({_id: params.id}, {$set: bodydata}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json(docs);
    });
});

router.delete("/menus", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    MENUS.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json(docs);
    });
    
});

module.exports = router;