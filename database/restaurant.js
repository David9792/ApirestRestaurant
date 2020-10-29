//Nombre, Nit, Propietario, Calle, Telefono, Log, Lat, Logo, fechaderegistro, fotolugar
var mongoose = require("./connect");
var RESTAURANTSCHEMA = {
    Nombre            : String,
    Nit               : String,
    Propietario       : String,
    Calle             : String,
    Telefono          : String,
    Log               : String,
    Lat               : String,
    Fechaderegistro   :Date,
    image         :[{
          url : String
    }]
}
/*var RESTAURANTSCHEMA = new mongoose.Schema
({
    Nombre: {
        type: String,
        required: (true, "EL NOMBRE ES NECESARIO")
    },
    Nit: {
        type: String,
        required: (true, "EL NIT ES NECESARIO")
        //falta realizar restricciones
    },
    Propietario: {
        type: String,
        required: (true, "EL NOMBRE DEL PROPIETARIO ES NECESARIO")
    },
    Calle: {
        type: String,
        required: (true, "LA DIRECCION ES NECESARIA")
    },
    Telefono: {
        type: String,
        validate: {
        validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => '${props.value} NO ES UN NUMERO VALIDO!'
    },
    required: [true, 'EL TELEFONO ES NECESARIO']

    },
    Log: {
        type: Number,
        //falta realizar restricciones
    },
    Lat: {
        type: Number,
        //falta realizar restricciones
    },
    Logo: {
        type: String,
        //falta codificacion y descargar imagen
    },
    FechadeRegistro: {
        type: Date,
    },
    FotoLugar: {
        type: String,
        //falta codificacion y descargar imagen
    },
    Menu: [
        {
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
            }

        }
    ]
});*/

var RESTAURANT = mongoose.model("restaurant", RESTAURANTSCHEMA);
module.exports = RESTAURANT;
