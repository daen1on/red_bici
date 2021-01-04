//hay que cargar spec/support así: 
//jasmine spec/support/models/bicicleta_test.spec.js
//20/12/20

const mongoose = require('mongoose');
const Bicicleta = require('../../../models/bicicleta');


describe('Testing bicicletas', function () {
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

    afterEach(function(done){
        Bicicleta.deleteMany({},function(err, success){
            if (err) console.log(err);
           // jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            done();
        });
    });

    describe('Bicicleta.createInstace', () => {
        it('crea una instancia de Bicicleta', (done) =>{
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-14.5, -54.1]);

            expect(bici.code).toBe(1);
            
            expect(bici.color).toBe("verde");
            
            expect(bici.modelo).toBe("urbana");
            
            expect(bici.ubicacion[0]).toEqual(-14.5);
            
            expect(bici.ubicacion[1]).toEqual(-54.1);
            done();
        })
    });

    describe('Bicicleta.allBicis', () => {
        it('should start empty', function (done) {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', function () {
        it('should add just one bike', function (done) {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function (err, newBici) {
                if (err) console.log(err);
                Bicicleta.allBicis(function (err, bicis) {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });

            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver bici con  code 1', function (done) {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0); //pa asegurar

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function (err, newBici) {
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "amarillo", modelo: "urbana"});
                    Bicicleta.add(aBici2, function (err, newBici) {
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function (error, targetBici) {
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        });
                    });
                });
            });
        });
    });


    describe('Bicicleta.removeByCode', () => {
        it('debe remover bici con  code 1', function (done) {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function (err, success) {
                    if (err) console.log(err);
                    var aBici2 = new Bicicleta({code: 2, color: "amarillo", modelo: "urbana"});
                    Bicicleta.add(aBici2, function (err, success) {
                        if (err) console.log(err);
                        Bicicleta.allBicis(function (err, resultado) {
                            expect(resultado.length).toBe(2);
                            Bicicleta.removeByCode(2, function (error, result) {
                                Bicicleta.allBicis(function (err, result) {
                                    expect(result.length).toBe(1);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
/*
beforeEach(()=>{Bicicleta.allBicis = []; });
describe('Bicicleta.allBicis',() =>{
    it('comienza vacia',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});
describe('Bicicleta.add',()=>{
    it('agregamos una',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        
        var a = new Bicicleta(1, 'rojo','urbana',[-34.6012424,-58.9238494]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findbyid',()=>{
    it('debe devolver la bici con id 1',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(1, 'verde', 'urbana');
        var aBici2 = new Bicicleta(2, 'rojo', 'urbana');
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);

    });
});

describe('Bicicleta.removeById',()=>{
    it('debe eliminar el primer elemento, al buscar ese elemento lanzar error y allBicis quedar de tamaño 1',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(1, 'verde', 'urbana');
        var aBici2 = new Bicicleta(2, 'rojo', 'urbana');
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);
        Bicicleta.removeById(1);

        
        expect(()=>Bicicleta.findById(aBici.id)).toThrow(); //debe lanzar el error de que no existe bici 1
        expect(Bicicleta.allBicis.length).toBe(1);
    });
});
*/