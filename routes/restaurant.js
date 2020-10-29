var express = require("express");
var sha1 = require("sha1");
var multer = require("multer");
var router = express.Router();
//var fileUpload = require("express-fileupload")
var RESTAURANT = require("../database/restaurant");
var jwt = require("jsonwebtoken");
var path = require('path');
var fs = require('fs');
const empty=require('is-empty');
//const midleware = require("./midleware");
//var midleware = require("./midleware");

const storage = multer.diskStorage({
  destination: function (res, file, cb) {
      try {
          fs.statSync('./public/uploads');
      } catch (e) {
          fs.mkdirSync('./public/uploads/');
      }
      cb(null, './public/uploads/');
  },
  filename: (res, file, cb) => {
      cb(null, 'IMG-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({storage: storage });
router.patch('/subir',upload.array('image', 12),async(req,res)=>{
    var id=req.body.id;
    if(req.body.id == null){
      res.status(300).json({
        msn : "No existe el ID GAAA"
      });
      return;
    }
    let doc = await RESTAURANT.findOne({_id : id});
    if(!empty(req.files)){
      req.files.forEach(foto=>{
        doc.image.push({'url':foto['filename']});
      });
    }
    await doc.save();
    res.status(200).json(doc.image);
});

router.post('/getphoto', function(req,res) {
  let id=req.body.id;
  RESTAURANT.findOne({_id : id} ).exec(function(err,docs){
      res.json({
        image: docs.image
      });
  });
});

router.get('/photos/:file', function(req, res){
    var params = req.params.file;
    var dirname = ".";
    console.log(dirname + "/public/uploads/" + params);
    var img = fs.readFileSync(dirname + "/public/uploads/" + params);
    res.status(200).json(img);
});

/*router.use(fileUpload({
    fileSize: 50 * 1024 * 1024
}));
router.post("/sendfile", (req, res) => {
    var images = req.files.file;
    var path = __dirname.replace(/\/routes/g, "/images");
    var date = new Date();
    var sing = sha1(date.toString()).substr(1, 5);

    images.mv(path + "/" + sing + "_" + images.name.replace(/\s/g,"_"), (err) => {
        if (err) {
            return res.status(300).send({msn : "ERROR AL ESCRIBIR EL ARCHIVO EN EL DISCO DURO"});
        }
        res.status(200).json({name: images.name});
    });
    //console.log(__dirname);
    //res.status(200).json({name: req.files.name});
});
*/

router.get("/restaurant",(req, res) => {
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

    RESTAURANT.find(filter).
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

router.delete('/delete',async(req,res)=>{
  var id=req.query.id;
  if(req.query.id == null){
    res.status(300).json({
      msn : "No existe el ID GAAA"
    });
    return;
  }
  let doc = await RESTAURANT.findOne({_id : id});
  let img = doc.image;
  for(let i=0;i<img.length;i++){
    //res.status(300).json(img[0].url);
    if(img[i].url == req.query.url){
      RESTAURANT.update({_id:id}, {$pull: {image : {url : req.query.url}}}, {safe : true}, function removeC(err, docs){
        res.status(200).json(docs);
      });
      return;
    }
  }
  res.status(300).json(img.length);
});


router.post('/restaurant', upload.array('image', 12), async(req, res) => {
  try{
    var params = req.body;
    var imgSet=[];
    imgSet.push({'url' : 'IMG-1576376815246.jpg'});
      if(!empty(req.files)){
        req.files.forEach(foto=>{
          imgSet.push({'url':foto['filename']});
        });
      }
    params["fecpublicacion"] = new Date();
    params["image"] = imgSet;
    //./images/astolfo.jpg
    var restaurant =  new RESTAURANT(params);
    var result = await restaurant.save();
    res.status(200).json(result);
  }catch(err){
    res.status(300).json(err);
  }
});

/*router.post("/restaurant", (req, res) => {
    console.log(req.body);
    var restaurantRest = req.body;
    var restaurantDB = new RESTAURANT(restaurantRest);
    restaurantDB.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            res.status(500).json(errors);
            return;
        }
        res.status(200).json(docs);
    })
});*/

router.put("/restaurant", async(req, res) => {
    //console.log(req.body);
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    var allowkeylist = ["Nombre","Nit","Propietario", "Calle", "Telefono"];
    var keys = Object.keys(bodydata);
    var updateobjectdata={};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    RESTAURANT.update({_id: params.id}, {$set: updateobjectdata}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});

            return;
        }
        res.status(200).json({
            message: "ACTUALIZADO",
        });
    });
});

router.delete("/restaurant", (req, res) => {
    //console.log(req.query);
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "EL PARAMETRO ID ES NECESARIO"});
        return;
    }
    RESTAURANT.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "EXISTEN PROBLEMAS EN LA BASE DE DATOS"});
            return;
        }
        res.status(200).json({
            message: "ELIMINADO",
            docs
        });
    });

});

module.exports = router;
