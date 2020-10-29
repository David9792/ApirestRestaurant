var express = require("express");
var router = express.Router();
var ORDEN = require("../database/orden");

router.get("/orden", (req, res) => {
    var filter = {};
    var params = req.query;
    var select = "";
    var order = {};
    if (params.id_Menu != null) {
        var expresion = new RegExp(params.id_Menu);
        filter["id_Menu"] = expresion;
    }
    if (params.filters != null) {
        select = params.filters.replace(/,/g, " ");
    }
    if (params.order != null) {
        var data = params.order.split(",");
        var number = parseInt(data[1]);
        order[data[0]] = number;
    }

    ORDEN.find(filter).
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
router.post("/orden", (req, res) => {
    var ordenRest = req.body;
    var ordenDB = new ORDEN(ordenRest);
    ordenDB.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            res.status(500).json(errors);
            return;
        }
        res.status(200).json(docs);
    })
});

router.put("/orden", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    ORDEN.update({_id: params.id}, {$set: bodydata}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json(docs);
    });
});

router.delete("/orden", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    ORDEN.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json(docs);
    });
    
});

module.exports = router;