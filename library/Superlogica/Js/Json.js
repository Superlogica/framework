var Superlogica_Js_Json = new Class({

    /**
     * String ou objeto informado na construtor
     * 
     * @var string|object
     */
    _json : null,
	/**
	* Elemento que disparou a ação
	* Implementado para passar para o Superlogica_Js_Request
	*/
    _handler : null,
    

    /**
     * Construtor
     * Inicializa a classe informando o JSON
     *
     * @param string|object json
     */
    initialize : function( json ){
        if ( json )
            this._json = json;
    },

    /**
     * Extrai um JSON do parametro informado
     *
     * @param string dados Caso seja
     * @return object
     */
    extrair : function(indice){
        if ( this._isUrl() ){
            var response = this._getJsonDaUrl( this._json );
            this._json = response.getData(indice);
        }
        if ( typeof this._json  == 'object'){
            return this._json;
        }
        return this.decode();
    },
	/**
	* Seta o elemento que disparou a ação
	* @param object|Superlogica_Js_Elemento elemento
	*/
    setHandler : function( elemento ){
        this._handler = elemento;
        return this;
    },

    /**
     * Realiza a requisição para a URL informada e retorna o json
     *
     * @param string url
     * @return object
     */
    _getJsonDaUrl : function( url ){
        var request  = new Superlogica_Js_Request( url );
            request.setHandler( this._handler );
        return request.getResponse();
    },

    /**
     * Decodifica a string em JSON
     *
     * @param string string
     * @return object
     */
    decode : function(){
        try{
            var json = JSON.decode( this._json );
            if ( json )
                return json;
        }catch( e ){}

        return false;
    },

    /**
     * Codifica o objeto em JSON
     *
     * @param object objeto
     * @return string
     */
    encode : function(){
        try{
            return JSON.encode( this._json );
        }catch( e ){
            return false;
        }
    },

    _isUrl : function(){
        return /^http/.test( this._json );
    }

});