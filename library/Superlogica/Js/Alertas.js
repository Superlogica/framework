var Superlogica_Js_Alertas = new Class({
    
    /**
     * Action url
     *
     * @param string $url
     */
    
    Extends : Superlogica_Js_Elemento,

    _arAlertas : [],

    initialize : function(){
        return this;
    },
    
    /**
     * 
     * @param type $text
     * @param type $destaque
     * @param type $link
     * @param type $openDivId
     * @param type $openDialogForm
     * @param type $imagem
     * @param type $comportamentos
     * @param type $atributos
     * @return \Superlogica_Button
     */
     add : function ( texto, tipo, idDiv, grupo){

        if(typeof tipo == 'undefined'){
            tipo = '';
        }
        if ((typeof idDiv == 'undefined') || (idDiv == '') || (idDiv == null)){
            idDiv = 'Superlogica_Js_Alerta';
        }
        
        if ((typeof grupo == 'undefined') || (grupo == '') || (grupo == null)){
            grupo = '';
        }        
        
        var _class;
        switch (tipo) {
        case "info":
            _class = "alert-info";
            break;
        case "success":
            _class = "alert-success";
            break;
        case "warning":
            _class = "alert-warning";
            break;
        case "danger":
            _class = "alert-danger";
            break;
        default:
            _class = "alert-danger";
        }
        
        var divAlerta = new Superlogica_Js_Elemento('#'+idDiv);
        divAlerta.adicionarHtmlAoFinal('<div class="alert ng-isolate-scope '+_class+' '+grupo+'"><span>'+texto+'</span></div>');
        
        divAlerta.carregarComportamentos();
        return divAlerta;
    },
          
    remove: function (grupo){
        var divAlerta = new Superlogica_Js_Elemento('.'+grupo);
        divAlerta.remover();
        return this;
    }            
});
