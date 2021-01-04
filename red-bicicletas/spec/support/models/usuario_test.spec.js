const mongoose = require('mongoose');
const Bicicleta = require('../../../models/bicicleta');
const Usuario = require('../../../models/usuario');
const Reserva = require('../../../models/reserva');
//var server = require('../../bin/www'); //Para Mongoose

describe('Testing Usuarios', function() {
    var originalTimeout;
    beforeAll(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });
    beforeEach(function (done) {
        mongoose.disconnect();
        const mongoDB = 'mongodb://localhost/test';
        mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
        
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error'));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });
    it("takes a long time", function (done) {
        setTimeout(function () {
            done();
        }, 9000);
    });

    afterEach(function(done) {
        //aca se podrían usar promesas
        Reserva.deleteMany({}, function(err, success){
            if (err) console.log(err);
            Usuario.deleteMany({}, function(err, success){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success){
                    if (err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('Cuando un Usuario reserva una bici',() => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Martín'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate()+1); //tambien podemos hacer add day con Moment
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    });

});