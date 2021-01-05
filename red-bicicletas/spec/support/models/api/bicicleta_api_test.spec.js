var request = require('request');
var mongoose = require('mongoose');
var Bicicleta = require('../../../../models/bicicleta');
var request = require('request');
var server = require('../../../../bin/www');

var base_url = "http://localhost:5000/api/bicicletas";

describe ('Bicicleta API', () => {
    
    /*beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });*/

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success){
            if (err) console.log(err);
            done();
        });
    });


    describe ('GET BICICLETAS /', () => {
        it('Status 200 vacia', (done) => {
            request.get(base_url, function(error, response, body){
                expect(response.statusCode).toBe(200);
                Bicicleta.allBicis(function(err, doc) {
                    expect(doc.length).toBe(0);
                    done();
                });
            });
        });
        it('Status 200 con uno', (done) => {
            var a = new Bicicleta({code: 10, color: 'rojo', modelo: 'urbana', ubicacion: [-34, -54]});
            Bicicleta.add (a, function(doc) {
                request.get(base_url, function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    Bicicleta.allBicis(function(err, doc) {
                        expect(doc.length).toBe(1);
                        done();
                    });
                });
            });
        });
    });

   
    describe ('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = { "code": 10, "color": "rojo", "modelo": "urbana", "lat":-34, "lng": -54};
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: JSON.stringify(aBici)
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe(aBici.color);
                expect(bici.modelo).toBe(aBici.modelo);
                expect(bici.ubicacion[0]).toBe(aBici.lat);
                expect(bici.ubicacion[1]).toBe(aBici.lng);
                done();
            });
        });
    });
    describe('DELETE bicicletas/remove', () => {

        it('Deberia remover una bicicleta', (done) => {

            const headers = { 'content-type': 'application/json'};
            const bici = `{"id":1, "color":"verde", "modelo":"nueva", "lat":6.230833, "lng":75.590553}`;
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: bici
            }, function(err, res, body ) {

                expect(res.statusCode).toBe(200);
                const bici = JSON.parse(body).bicicleta;
                expect(bici.color).toBe('verde');
                expect(bici.ubicacion[0]).toBe(6.230833);
                expect(bici.ubicacion[1]).toBe(75.590553);
                request.delete({
                    headers: headers,
                    url: base_url + '/delete',
                    body: `{"id":1}`
                }, function(err, res){

                    expect(res.statusCode).toBe(204);
                
                    request.get( base_url, function(err, res, body ){
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
            const bici = `{"code":10, "color":"verde", "modelo":"nueva", "lat":6.230833, "lng":75.590553}`;
            var a = new Bicicleta({code: 10, color: 'rojo', modelo: 'urbana', ubicacion: [-34, -54]});
            Bicicleta.add (a, function(err, newBici) {
                request.put({
                    headers: headers,
                    url: base_url +'/update',
                    body: bici
                }, function(err, resp, body) {
                    expect(resp.statusCode).toBe(200);
                    
                    Bicicleta.findByCode(a.code, function (err, targetBici) {
                        console.log(targetBici);

                        expect(targetBici.color).toBe('verde');
                        expect(targetBici.modelo).toBe('nueva');
                        expect(targetBici.ubicacion[0]).toBe(6.230833);
                        expect(targetBici.ubicacion[1]).toBe(75.590553);
                        
                        done();
                    });
                }); 
            });
        });
    });
    
});
