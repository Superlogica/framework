var Superlogica_Js_Relatorio = new Class({
     Extends : Superlogica_Js_Elemento,
     
     __imprimirPdf : function(){
        this.bind("click", function(){
            var relatorio = this.atributo('relatorio');            
            var parametros = this.atributo('parametros');                      
            if ( parametros )
                parametros = new Superlogica_Js_Json(parametros).decode();
            Superlogica_Js_Relatorio.imprimirPdf(relatorio, parametros);
        });
     }
     
});

Superlogica_Js_Relatorio.imprimirPdf = function(relatorio, parametros){
             
    var formulario = new Superlogica_Js_Form( document );
    if ( !parametros ){
        parametros={};
    }
    var instanciaForm = window.open( "", "_blank" );
    instanciaForm.document.writeln('<div>Gerando <img src="' + APPLICATION_CONF["APPLICATION_CLIENT_TEMA_URL"] + '/img/load.gif" /></div>');


    formulario.setDados('janelaRelatorios', instanciaForm);
    var location = new Superlogica_Js_Location();
    if ( relatorio ){
        location.setController('relatorios').setAction('index').setId( relatorio );
    }   
    
    if ( typeof parametros != 'object'){
        parametros = {};
    }

    // Caso exista o form de relatório na tela então concatena seus parametros na URL
    var formRelatorio = new Superlogica_Js_Form(".formRelatorio form");
    if ( formRelatorio.contar() ){
        var dadosForm = formRelatorio.toJson();
        parametros = Object.merge( 
            (typeof parametros == 'object' ? parametros : {}), 
            (typeof dadosForm == 'object' ? dadosForm : {})
        );
    }
        
    location.setApi(true);  
    delete parametros['render'];
    location.setParam('render', 'pdf').setParam('getId','1').viaProxy( parametros['viaProxy'] );
    //location.setParam('render','pdf').setParam('getId', '1').setApi(true).viaProxy( parametros['viaProxy'] );
    var request = new Superlogica_Js_Request( location.toString(), typeof parametros != 'undefined' ? parametros: {} );

    var idTimeOut = setTimeout(function(){

        location = new Superlogica_Js_Location();
        location.setParams({})
            .setController('impressoes')
            .viaProxy(true)
            .setAction('index');

        formulario.getDados('janelaRelatorios').document
                  .writeln("<div>A geração esta demorando um pouco, você pode esperar ou a qualquer hora abrir o <a target='_blank' href='" + location.toString() + "'>histórico de impressão</a>.</div>");
    }, 5000);

    request.enviarAssincrono(function( response ){

        clearTimeout( idTimeOut );
        var dados = response.getData();
       
        if ( ! response.isValid() ){

            window.focus();
            formulario.getDados('janelaRelatorios').close();                        
        }else if ( dados.id_impressao > 0 ){
            
            location = new Superlogica_Js_Location();
            location.setParams({})
                .setController('impressoes')
                .setAction('index')
                .setId(dados.id_impressao)
                .viaProxy(true)
                .setParam('baixar',1);

            formulario.getDados('janelaRelatorios').location.href = location.toString();                                                
        }else{

            location = new Superlogica_Js_Location();
            location.setParams({})
                .setController('impressoes')
                .viaProxy(true)
                .setAction('index');

            formulario.getDados('janelaRelatorios').location.href = location.toString();
        }
    });
};