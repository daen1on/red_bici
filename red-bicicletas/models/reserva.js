const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

var reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId, ref: 'Bicicleta'},
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
});

reservaSchema.methods.diasDeReserva = function () {
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1; //arbitrario el 1, lo elige el profe pq son dos dias 
}

module.exports = mongoose.model('Reserva', reservaSchema);