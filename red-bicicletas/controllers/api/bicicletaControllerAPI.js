var Bicicleta = require('../../models/bicicleta');


exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis(function(err, result){
        res.status(200).json({
            bicicletas: result
        });
    });
}

//"para la actualizacion hay que agregar una busqueda al principio"

exports.bicicleta_create = function(req, res){
  
    const bici = new Bicicleta();
    bici.code = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];
  
    Bicicleta.add(bici);
  
    res.status(200).json({bicicleta: bici});
  }

exports.bicicleta_delete = function (req, res) {
   
    Bicicleta.removeByCode(req.body.id, function () {
        res.status(204).send();
        
    });
}    
exports.bicicleta_update = function (req, res) {
    Bicicleta.findByCode(req.body.code, function (err, targetBici) {
        console.log("color:  s "+req.body.color);
        targetBici.color = req.body.color;
        targetBici.modelo = req.body.modelo;
        targetBici.ubicacion = [req.body.lat, req.body.lng];
        targetBici.save();
    
        res.status(200).json({
            bicicleta: targetBici
        });
    });
    
};






