var Bicicleta = require('../../../../models/bicicleta');
var request = require('request');
var server = require('../../../../bin/www');
var mongoose = require('mongoose');

var apiUrl = "htpp://localhost:5000/api/bicicletas";

describe ('Bicicleta API', () => {
    
    var originalTimeout;
    beforeAll(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });
    beforeEach(function (done) {
        mongoose.disconnect();
        const mongoDB = 'mongodb://localhost/testdb';
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
      
    describe('GET bicicletas /', () => {
        it('status 200', (done) => {
            request.get( apiUrl, function(err, res, body ){
                const result = JSON.parse(body);
                expect(res.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST bicicletas/create', () => {
        it('Deberia agregar una bicicleta', (done) => {
            const headers = { 'content-type': 'application/json'};
            const bici = `{"code":1, "color":"verde", "modelo":"nueva", "lat":6.230833, "lng":75.590553}`;
            request.post({
                headers: headers,
                url: apiUrl + '/create',
                body: bici
            }, function(err, res, body ) {

                expect(res.statusCode).toBe(201);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe('verde');
                expect(bici.ubicacion[0]).toBe(6.230833);
                expect(bici.ubicacion[1]).toBe(75.590553);
                done();
            });
        });
    });



    describe('DELETE bicicletas/remove', () => {
        it('Deberia remover una bicicleta', (done) => {
            const headers = { 'content-type': 'application/json'};
            const bici = `{"code":1, "color":"verde", "modelo":"nueva", "lat":6.230833, "lng":75.590553}`;
            request.post({
                headers: headers,
                url: apiUrl + '/create',
                body: bici
            }, function(err, res, body ) {
                expect(res.statusCode).toBe(201);
                const bici = JSON.parse(body).bicicleta;
                expect(bici.color).toBe('verde');
                expect(bici.ubicacion[0]).toBe(6.230833);
                expect(bici.ubicacion[1]).toBe(75.590553);

                request.delete({
                    headers: headers,
                    url: apiUrl + '/remove',
                    body: `{"code":1}`
                }, function(err, res){
                    expect(res.statusCode).toBe(204);
                 
                    request.get( apiUrl, function(err, res, body ){
                        const result = JSON.parse(body);
                        expect(res.statusCode).toBe(200);
                        expect(result.bicicletas.length).toBe(0);
                        done();
                    });
                })
            });
        });
    });

    describe('PUT bicicletas/update', () => {
        it('Deberia actualizar una bicicleta', (done) => {
            const headers = { 'content-type': 'application/json'};
            const bici = `{"code":1, "color":"verde", "modelo":"nueva", "lat":6.230833, "lng":75.590553}`;
            const biciUpdated =  `{"code":1, "color":"rojo", "modelo":"especial", "lat":6.230833, "lng":75.590553}`;
            request.post({
                headers: headers,
                url: apiUrl + '/create',
                body: bici
            }, function(err, res, body ) {
                expect(res.statusCode).toBe(201);
                const bici = JSON.parse(body).bicicleta;
                expect(bici.color).toBe('verde');
                expect(bici.ubicacion[0]).toBe(6.230833);
                expect(bici.ubicacion[1]).toBe(75.590553);

                request.put({
                    headers: headers,
                    url: apiUrl + '/update',
                    body: biciUpdated
                }, function(err, res){
                    expect(res.statusCode).toBe(200);

                    request.get( apiUrl, function(err, res, body ){
                        const result = JSON.parse(body).bicicletas;
                        expect(res.statusCode).toBe(200);
                        expect(result[0].color).toBe('rojo');
                        expect(result[0].modelo).toBe('especial');
                        done();
                    });
                })
            });
        });
    });
});


/*describe('Bicicleta API',()=>{
    
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/testdb';
    });

    describe('GET BICICLETAS /',()=>{
        it('return Status 200',()=>{
            expect(Bicicleta.allBicis.length).toBe(0);
        
            var a = new Bicicleta(1,'verde', 'urbana',[-34.6013832,-58.3861497]);
            Bicicleta.add(a);

            request.get('http://localhost:5000/api/bicicletas',function(error, response, body){
               expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /Create',()=>{
        it('return Status 200',(done)=>{
            var headers = {'content-type': 'application/json'};
            var aBici = '{"id":10, "color": "rojo", "modelo": "urbana", "lat": "-34", "lng":"-54"}';
            request.post({
                headers: headers,
                url:     'http://localhost:5000/api/bicicletas/create',
                body:    aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                done();
            });
        });
    });
    
    describe('POST BICICLETAS /update', () => {
        it('Status 200', (done)=>{
    
            var a = new Bicicleta(10, 'azul', 'sport', [-38.01986035440169, -57.54397278410175]);
            Bicicleta.add(a);
    
            var headers = {'content-type' : 'application/json'};
            var abici = '{"id": 10, "color": "rojo", "modelo": "urbano", "lat": -34, "lng": -54}';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/bicicletas/10/update',
                body: abici
            }, function(error, response, body){
                expect(response.statusCode).toBe(302);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                console.log(abici);
                done();
            });
        });
    });

    describe('POST BICICLETAS /delete', () => {
        it('Status 200', (done)=>{
    
            var a = new Bicicleta(1, 'morada', 'deportiva', [-38.01986035440169, -57.54397278410175]);
            var b = new Bicicleta(2, 'rojo', 'urbano', [-38.01986035440169, -57.54397278410175]);
            var c = new Bicicleta(3, 'verde', 'montaña', [-38.01986035440169, -57.54397278410175]);
            Bicicleta.add(a);
            Bicicleta.add(b);
            Bicicleta.add(c);
    
            expect(Bicicleta.allBicis.length).toBe(3);
    
            var headers = {'content-type' : 'application/json'};
            var abici = '{"id": 2}';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/bicicletas/2/delete',
                body: abici
            }, function(error, response, body){
                expect(response.statusCode).toBe(302);
                expect(Bicicleta.allBicis.length).toBe(2);
                done();
            });
        });
    });


});
*/
