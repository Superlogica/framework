describe("JSON", function() {

    it("Deveria retornar o mesmo JSON informado.", function() {
        var json = new Superlogica_Js_Json({'json':"teste"});
        expect({'json':"teste"}).toEqual( json.extrair() );
    });

    it("Deveria realizar a requisição e retornar um objeto.", function() {
        var json = new Superlogica_Js_Json(APPLICATION_CONF["APPLICATION_API_URL"]+'/index');
        expect( true ).toEqual( typeof json.extrair() == 'object' );
    });

    it("Deveria retornar s string JSON decodificada.", function() {
        var json = new Superlogica_Js_Json('{"json":"teste"}');
        expect( { "json" : "teste" } ).toEqual( json.decode() );
    });

    it("Deveria retornar false quando JSON informado for inválido.", function() {
        var json = new Superlogica_Js_Json('{"json":"teste"');
        expect( false ).toEqual( json.decode() );
    });

    it("Deveria retornar a string JSON do objeto informado.", function() {
        var json = new Superlogica_Js_Json({"json":"teste"});
        expect( '{"json":"teste"}' ).toEqual( json.encode() );
    });
    
});