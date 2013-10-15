describe("Location", function() {

  var location;

 /**
  * Cria a classe
  */
  beforeEach(function() {
    location = new Superlogica_Js_Location();
  });


it("toString() deveria retornar uma string igual a url da página atual", function() {
    expect(window.location.href).toEqual(location.toString());
  });

it("Deveria gravar e ler um parâmetro na url", function() {
    location.setParam('foo', 'bar');
    expect('bar').toEqual(location.getParam('foo'));
  });

it("Deveria retornar a action correta", function() {
    expect('js').toEqual(location.getAction());
  });

it("Deveria retornar a action correta mesmo existindo parametros separados por interrogação e existindo uma barra entre as variaveis GET e o inicio da URL.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    expect('index').toEqual(location.getAction());
  });

it("Deveria retornar a action correta mesmo existindo parametros separados por barra.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/flStatus/2/flCreditoDebito/2');
    expect('index').toEqual(location.getAction());
  });

it("Deveria retornar a action correta mesmo existindo parametros separados por interrogação.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    expect('index').toEqual(location.getAction());
  });


it("Deveria retornar o controller correta", function() {
    expect('teste').toEqual(location.getController());
  });
  
it("Deveria retornar a controller correta mesmo existindo parametros separados por barra.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/flStatus/2/flCreditoDebito/2');
    expect('caixa').toEqual(location.getController());
  });

it("Deveria retornar a controller correta mesmo existindo parametros separados por interrogação.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    expect(location.getController()).toEqual('caixa');
  });

it("Deveria retornar a controller correta mesmo existindo parametros separados por interrogação e existindo uma barra entre as variaveis GET e o inicio da URL.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    expect('caixa').toEqual(location.getController());
  });


it("Deveria setar corretamente uma nova url", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]);
    expect(APPLICATION_CONF["APPLICATION_CLIENT_URL"]).toEqual(location.toString());
  });

it("Deveria retornar 'index', como controller, quando não informado na URL.", function(){
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]);
    expect('index').toEqual(location.getController());
});

it("Deveria retornar 'index', como action, quando não informado na URL.", function(){
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]);
    expect('index').toEqual(location.getAction());
});

it("Deveria setar corretamente um parametro", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/flStatus/2/flCreditoDebito/2');
    location.setParam('flCreditoDebito',3);
    expect(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=3').toEqual(location.toString());
  });

it("Deveria setar corretamente um action", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/flStatus/2/flCreditoDebito/2');
    location.setAction('getmovimentacao');
    expect(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/getmovimentacao?flStatus=2&flCreditoDebito=2').toEqual(location.toString());
  });

it("Deveria setar corretamente um controller", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/flStatus/2/flCreditoDebito/2');
    location.setController('foo');
    expect(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/foo/index?flStatus=2&flCreditoDebito=2').toEqual(location.toString());
  });

it("Deveria extrair parametros separados pelo / da url.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index/flStatus/2/flCreditoDebito/2/parametroTeste/2');
    expect({'flStatus': '2', 'flCreditoDebito' : '2', 'parametroTeste' : '2'}).toEqual( location.getParams() );
  });

it("Deveria extrair parametros separados pelo ? da url.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    expect({'flStatus': '2', 'flCreditoDebito' : '2', 'parametroTeste' : '2'}).toEqual( location.getParams() );
  });

it("Deveria permitir parametros no formato array.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    location.setParam('item', {'valoritem' : 1, 'valoritem2' : 2});
    expect({'flStatus': '2', 'flCreditoDebito' : '2', 'parametroTeste' : '2', 'item' : {'valoritem' : 1, 'valoritem2' : 2}}).toEqual( location.getParams() );
  });

it("Deveria transformar corretamente na url um parametro array.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    location.setParam('item', [1, 2]);
    expect(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2&item[0]=1&item[1]=2').toEqual(location.toString());
  });

it("Deveria transformar corretamente na url um parametro array multidimensional.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    location.setParam('cobranca', [ {'teste': 123}, {'teste': 456}]);
    expect(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2&cobranca[0][teste]=123&cobranca[1][teste]=456').toEqual(location.toString());
  });

//it("Deveria transformar corretamente na url um parametro array multidimensional.", function() {
//    location.setLocation(  APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2&cobranca[0][teste]=123&cobranca[1][teste]=456'  );
//    var cobranca = location.getParam('cobranca');
//    expect( cobranca ).toEqual( location.toString() );
//  });

it("Deveria retornar null quando um parametro não existir.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    expect( null ).toEqual(location.getParam('parametroInexistente'));
  });

it("Deveria retornar null quando um parametro foi apagado anteriormente.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    location.setParam( "flStatus", null );
    expect( null ).toEqual(location.getParam('flStatus'));
  });

it("setParams() deveria apagar e atualizar valores de acordo com o objeto passado a ele.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?flStatus=2&flCreditoDebito=2&parametroTeste=2');
    location.setParams( {"flStatus" : null, "flCreditoDebito" : 2} );
    expect( {"flStatus": null, "flCreditoDebito" : 2} ).toEqual( {"flStatus": null, "flCreditoDebito" : location.getParam("flCreditoDebito")} );
  });

it("Deveria retornar um array quando extraida um parametro com notação de array da URL.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?item[]=1');
    expect( ['1'] ).toEqual( location.getParam('item') );
  });

it("Deveria retornar a URL sem o link ancora.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?item=1#teste');
    location.setParam('teste', '2');
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/caixa/index?item=1&teste=2' ).toEqual( location.toString('item') );
  });

it("Deveria retornar o parametro com acentuação corretamente.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/index/?pesquisa=mem%F3ria&btPesquisa=Ir');
    expect( 'memória' ).toEqual( location.getParam('pesquisa') );
  });

it("Deveria fazer a requisição para o ID  indicado como parametro ao invés do action indicado na URL.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/put/');
    location.setId( 44 );
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/id/44' ).toEqual( location.toString() );
  });

it("Deveria apagar o id já setado na URL e realizar a requisição para o ID  indicado como parametro.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/put/id/33444');
    location.setId( 44 );
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/id/44' ).toEqual( location.toString() );
  });

it("Deveria apagar o id já setado na URL, como parametro GET, e realizar a requisição para o ID indicado como parametro.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/put?id=33444');
    location.setId( 44 );
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/id/44' ).toEqual( location.toString() );
  });

it("Deveria apagar o id já setado na URL, mas manter os outros parametros da URL, e realizar a requisição para o ID  indicado como parametro.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/put/id/33444?teste=123');
    location.setId( 44 );
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/id/44?teste=123' ).toEqual( location.toString() );
  });

it("Não deveria fazer a requisiçao para ID pois ele foi passado como parametro e nao com setId.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/put/id/222');
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/put?id=222' ).toEqual( location.toString() );
  });

it("Deveria deixar alterar o action mesmo a URL sendo para ID.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/id/222');
    location.setAction('index');
    location.setParam('id', 3040 );
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index?id=3040' ).toEqual( location.toString() );
  });


it("Deveria pegar o ID da URL.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/id/44');
    expect( '44' ).toEqual( location.getId() );
  });

it("Deveria pegar o ID da URL, mesmo já sendo passado um no parametro GET.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/produtos/id/44?id=333');
    expect( '44' ).toEqual( location.getId() );
  });

//it("Deveria retornar a mesma URL mesmo quando o action id exisitir como um parametro também.", function() {
//    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/id/123/idcursos/21');
//    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/id/123?idcursos=21' ).toEqual( location.toString() );
//  });

it("Deveria retornar a mesma URL mesmo quando um dos parametros for o mesmo nome do action ou controller.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index/cursos/3/teste/123/index/222');
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index?cursos=3&teste=123&index=222' ).toEqual( location.toString() );
  });

it("Deveria apagar os parametros já setados e substituir todos pelos informados no setParams().", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index/cursos/3/teste/123/index/222');
    location.setParams({'varteste': 12});
    expect( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index?varteste=12' ).toEqual( location.toString() );
  });

it("Deveria retornar o modulo da URL.", function() {
    location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index/cursos/3/teste/123/index/222');
    expect( 'default' ).toEqual( location.getModuleName() );
  });
  
it("Deveria retornar o modulo da URL mesmo sendo diferente do modulo atual.", function() {
    
    if( APPLICATION_CONF["APPLICATION_MODULES"] ){
        location.setLocation( APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/index/cursos/3/teste/123/index/222');
        expect( 'default' ).toEqual( location.getModuleName() );
    }
    
  });

    it("Deveria retornar o id String.", function() {
        location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/id/145A');
        expect( '145A' ).toEqual( location.getId() );
    });
    
    it("Deveria retornar o id String mesmo com parametros na URL.", function() {
        location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/id/145A?teste=1');
        expect( '145A' ).toEqual( location.getId() );
    });

    it("Deveria retornar o id String mesmo com parametros na URL separados por /.", function() {
        location.setLocation(APPLICATION_CONF["APPLICATION_CLIENT_URL"]+'/cursos/id/145A/teste/1');
        expect( '145A' ).toEqual( location.getId() );
    });

    
});