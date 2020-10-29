//Nombre, precio, descripción, fechaderegistro, fotografía del producto.
var mongoose = require("./connect");
var MENUSSCHEMA = new mongoose.Schema
({
    Nombre: {
        type: String,
        required: (true, "EL NOMBRE ES NECESARIO")
    },
    Precio: {
        type: Number,
        required: (true, "EL PRECIO ES NECESARIO")
    },
    Descripcion: {
        type: String,
        required: (true, "LA DESCRIPCION DEL PEDIDO ES NECESARIO")
    },
    FechadeRegistro: {
        type: Date,
        //required: (true, "LA FECHA DE REGISTRO DEL PEDIDO ES NECESARIO")
    },
    FotografiadelProducto: {
        type: String,
        //falta codificacion y descargar imagen
    },

    restaurant_id:{
        type: String,
    }


});

var MENUS = mongoose.model("menus", MENUSSCHEMA);

module.exports = MENUS;