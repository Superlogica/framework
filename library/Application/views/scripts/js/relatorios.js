Superlogica_Js_Elemento.implement({
    
    __mostrarOcultos: function(){
        this.bind('click', function(){
            var conteudo = this.conteudo();
                var grupo = this.atributo('grupo');
                new Superlogica_Js_Elemento("."+grupo).mostrar();
                this.esconder();
        });        
    },

    __imprimirPdf: function(){                
        this.bind('click', function(){                                    
            Superlogica_Js_Relatorio.imprimirPdf();
        });        
    },
    
    __imprimir : function(){
        this.bind('click', function(){
            var location = new Superlogica_Js_Location().setApi(true).viaProxy(true);
            var params = location.getParams();
            location.setParams({});
            var formRelatorio = new Superlogica_Js_Form(".formRelatorio form");
            if ( formRelatorio.contar() ){
                var dadosForm = formRelatorio.toJson();
                params = Object.merge( params, typeof dadosForm == 'object' ? dadosForm : {} );
            }
            params['impressora'] = this.atributo('id_impressora_impr');            
            params['render'] = 'pdf';
            params['download'] = '';
            var request = new Superlogica_Js_Request( location.toString(), params );
            request.enviarAssincrono(function( response ){
                if ( response.isValid() ){

                }
            });
        }); 
    },

    __carregarGridHistorico : function(){
        var grid = new Application_Grids_UltimasImpressoes('#Application_Grids_UltimasImpressoes0');
        if ( grid.contar() ){
            grid.recarregar();
        }
    },    

    __previsualizarRelatorio : function(){
        this.bind('click', function(){
            var filtros = this.getDados('form').toJson();
            Superlogica_Js_Relatorio.imprimirPdf( this.getDados('idRelatorio'), filtros );
        });
    }

});

function aposImprimirRelatorio(){
    if ( typeof Application_Grids_UltimasImpressoes != 'undefined' ){
        var gridFilaImpressao = new Application_Grids_UltimasImpressoes("#Application_Grids_UltimasImpressoes0");
        if ( gridFilaImpressao.contar() )
            gridFilaImpressao.recarregar();
    }
}

function aoExportar( format ){
    var locationExportar = new Superlogica_Js_Location();
    locationExportar.setParam('format', format );

    var formRelatorio = new Superlogica_Js_Form(".formRelatorio form");
    if ( formRelatorio.contar() ){
        var params = locationExportar.getParams();
        var dadosForm = formRelatorio.toJson();
        params = Object.merge( params, typeof dadosForm == 'object' ? dadosForm : {} );        
        locationExportar.setParams(params);
    }
    
    params = locationExportar.getParams();
    delete params['render'];
    return params;

}



