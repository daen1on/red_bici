//hay que cargar spec/support así: 
//jasmine spec/support/models/bicicleta_test.spec.js
//20/12/20

var Bicicleta = require('../../../models/bicicleta');

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