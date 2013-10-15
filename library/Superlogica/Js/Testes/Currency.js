describe("Currency", function() {
    //Url para rodar os testes
    //localhost:3059/clients/financeiro/teste/js
    it("Deveria formatar o valor de 1.02 para 1,02.", function() {        
        expect( '1,02').toEqual( new Superlogica_Js_Currency().toString(1.02) );
    });
    
    it("Deveria formatar o valor de 1.02 para 1,02 mesmo informando as casas decimais.", function() {        
        expect( '1,02').toEqual( new Superlogica_Js_Currency().toString(1.02, 3) );
    });
    
    it("Deveria formatar o valor de 1.02 para 1,020 com o parametro de adicionar os zeros.", function() {        
        expect( '1,020').toEqual( new Superlogica_Js_Currency().toString(1.02, 3, 3) );
    });
    
    it("Deveria formatar o valor de 1.02 para 1,02000000 com o parametro de adicionar os zeros e número alto nas casas decimais.", function() {        
        expect( '1,02000000').toEqual( new Superlogica_Js_Currency().toString(1.02, 8, 8) );
    });  
    
    it("Deveria formatar o valor de 1.02589 para 1,025900 com o parametro de adicionar os zeros e número alto nas casas decimais.", function() {        
        expect( '1,025900').toEqual( new Superlogica_Js_Currency().toString(1.02589, 4, 6) );
    });  
    
    it("Deveria formatar o valor de 1.0234 para 1,0234 mesmo com número alto nas casas decimais.", function() {        
        expect( '1,0234').toEqual( new Superlogica_Js_Currency().toString(1.0234, 8) );
    });
    
    it("Deveria formatar o valor de 1 para 1,00.", function() {        
        expect( '1,00').toEqual( new Superlogica_Js_Currency().toString(1) );
    });
    
    it("Deveria formatar o valor de 1 para 1,00 pois as duas casas são fixas.", function() {        
        expect( '1,00').toEqual( new Superlogica_Js_Currency().toString(1, 6) );
    });    
    
    it("Deveria formatar o valor de 1.129 para 1,13 com duas casas decimais.", function() {        
        expect( '1,13').toEqual( new Superlogica_Js_Currency().toString(1.129, 2) );
    });  
    
});