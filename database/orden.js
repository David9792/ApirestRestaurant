//id_menu[], id_restaurant[], cantidad[], id_cliente, lugardeenvio(lat, long), pagototal
var mongoose = require("./connect");
var ORDENSCHEMA = new mongoose.Schema
({
    id_Menu: {
        type: Number,
        //required: (true, "EL IDENTIFICADOR DEL MENU ES NECESARIO")
    },
    id_Restaurant: {
        type: Number,
        //required: (true, "EL IDENTIFICAR DEL RESTAURANT ES NECESARIO")
    },
    Cantidad: {
        type: String,
        required: (true, "LA CANTIDAD ES NECESARIO")
    },
    id_Cliente: {
        type: Date,
        //required: (true, "EL IDENTIFICADOR DEL CLIENTE ES NECESARIO")
    },
    LugardeEnvio: {
        type: String,
        required: (true, "EL LUGAR DE ENVIO ES NECESARIO")
    },
    PagoTotal: {
        type: Number,
        //required: (true, "EL PAGO TOTAL ES NECESARIO")
    }

});

var ORDEN = mongoose.model("orden", ORDENSCHEMA);

module.exports = ORDEN;