var mongoose = require("./connect");
var CLIENTESSCHEMA = new  mongoose.Schema({
    
    Nombre: {
        type: String,
        required: [true, "EL NOMBRE ES NECESARIO"],
    },
    Telefono: {
        type: String,
        required: [true, "El TELEFONO ES NECESARIO"],
    },
    Direccion: {
        type: String,
        required: [true, "LA DIRECCION ES NECESARIA"],
    },
    Email: {
        type: String,
        required: [true, "EL EMAIL ES NECESARIO"],
        /*validate: {
            validator: (value) => {
                return /^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(value);
            }
        },*/
        message: props => "${props.value} NO ES VALIDO"
    },
    Password: {
        type: String,
        required:[true, "EL PASSWORD ES NECESARIO"],
    },
    Rol: {
        type: String, //C-> clientes , R-> root(admin)
    }
});
var CLIENTES = mongoose.model("clientes", CLIENTESSCHEMA);
module.exports = CLIENTES;