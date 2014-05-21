var Superlogica_Js_Lista = new Class({
    
    /**
     * Action url
     *
     * @param string $url
     */
    
    Extends : Superlogica_Js_Elemento,

    _idDivAColocarLista : "",
    
    _htmlLista : "",

    initialize : function(idDivAColocarLista){
        
        if ((typeof idDivAColocarLista == 'undefined') || (idDivAColocarLista == '') || (idDivAColocarLista == null)){
            this._idDivAColocarLista = 'Superlogica_Js_Alerta';
        } else {
            this._idDivAColocarLista = idDivAColocarLista;
        }
        
        return this;
    },
    
     addLinha : function ( icone, label, texto){

        if(typeof label == 'undefined'){
            label = '';
        }
        if (typeof texto == 'undefined'){
            texto = '';
        }
        
       this._htmlLista = this._htmlLista + "<li>"+ '<span class= "icon ' + icone + ' "></span>'+ '<label><b>' + label + '</b></label>' + texto +"</li>";
                
    },
          
    inserirLista: function (){
        
        var divAlerta = new Superlogica_Js_Elemento('#'+this._idDivAColocarLista);
        
        var elementoLista = new Superlogica_Js_Elemento("#"+this._idDivAColocarLista+"lista");
        if (elementoLista.contar() > 0){
            elementoLista.remover();
        }

        divAlerta.adicionarHtmlAoFinal("<ul id='"+this._idDivAColocarLista + "lista" +"' class='list-unstyled list-info'>" + this._htmlLista + "</ul>");
        divAlerta.carregarComportamentos();
    }            
});
