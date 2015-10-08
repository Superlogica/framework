
var Superlogica_Js_Confirmar = new Class({
    
    /**
     * Action url
     *
     * @param string $url
     */
    
    Extends : Superlogica_Js_Elemento,

    _arButtons : [],

    initialize : function(texto,acao,apenasOk){
        
        if(typeof apenasOk == 'undefined')
            apenasOk = false;

        texto = new Superlogica_Js_Elemento('<div>'+texto+'</div>');
        if(apenasOk){
            this._arButtons.push({text : 'Ok',click: function() { acao(true); texto.dialogo( "close" ); }});        
        }else{
            this._arButtons.push({text : 'Sim',click: function() { acao(true); texto.dialogo( "close" ); }});        
            this._arButtons.push({text : 'Não',click: function() { acao(false); texto.dialogo( "close" ); }});
        }
        texto.dialogo({ 'modal' : true, 'resizable' : false, buttons:  this._arButtons  });
    }
});
