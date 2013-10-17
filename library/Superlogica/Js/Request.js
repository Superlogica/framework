var Superlogica_Js_Request = new Class({
    
    /**
     * URLs para requisição
     * @var string
     */
    _urls : {},

    /**
     * Metodo de envio das requisições
     * @var string
     */
    _method : 'POST',

    /**
     * Armazena todas respostas
     * @var object
     */
    _responses : {"data" : [], "msg":"", "status" : 206},

    /**
     * Opções para a classe de Resposta
     * @var object
     */
    _responseOptions : {},
	
	/**
	* Elemento que disparou a requisição
	* @var object|Superlogica_Js_Elemento
	*/
    _handler : null,

    /**
     * Objeto com parametros padrões para as requisições AJAX
     * Pode ser alterado pela função addAjaxParams
     * @var object
     */
    _ajaxParams : {
        "cache" : true,
        "timeout" : 40000,
        "async" : false
    },

    /**
     * Quando adicionado vários parametros a mesma URL ele separa em multiplas
     * requisições de acordo com este parametro
     * @var integer
     */
    _limiteParamsPorRequisicao : 30,

    /**
     * Construtor da classe
     * Seta url e parametors caso informada como parametro
     */
    initialize : function( url, params ){
        if ( url ){
            this.enviar( url, params );
        }
    },
	
	/**
	* Seta o elemento que disparou a requisição
	* @param object|Superlogica_Js_Elemento
	*/
    setHandler : function( elemento ){
        this._handler = elemento;
    },
    
    /**
     * Adiciona uma URL para requisições
     * @param string url
     * @param object params
     */
    enviar : function( url, params ){
        if ( !this._urls[ url ] ){
            this._urls[ url ] = new Array();
        }
        this._urls[ url ].push( typeof params == 'object' ? params : {} );
    },

    /**
     * Opções para instancia da resposta
     */
    setResponseOptions : function( options ){
        if ( typeof options == 'object')
            this._responseOptions = options;
    },

    setLimiteParamsPorRequisicao : function( itensPorPagina ){

        if (parseInt(itensPorPagina) > 0)
            this._limiteParamsPorRequisicao = itensPorPagina;

        return this;
    },


    /**
     * Seta o método de envio da requisição
     * @param string method
     * @return Superlogica_Js_Request Fluent
     */
    setMethod : function(method){
        this._method = method;
        return this;
    },
    
    /**
     * Retorna o método utilizado para enviar os dados
     * @return string
     */
    getMethod : function(){
        return this._method;
    },
    
    /**
     * Retorna o objeto com as configurações do envio por AJAX
     * @return object
     */
    getDefaultAjaxParams : function(){
        return this._ajaxParams;
    },
    
    setTimeOut : function( timeout ){
        
        if ( !isNaN( timeout ))
            this._ajaxParams['timeout'] = timeout;        
    },
    
    /**
     * Transforma uma array de requisições em apenas uma multipla requisição
     */
    _parseMultipleRequest : function( params, url ){
        var requests = {};
            params = this._splitRequets( params );
            
        var limitePorRequisicao = this._limiteParamsPorRequisicao;
        
        Object.each( params , function( item ){
            var totalParams = Object.getLength( item );
        
            var paramsRequest = [];

            for( var x=0; x <= totalParams; x++ ){
                
                paramsRequest.push( item[x] );

                if ( ( x == limitePorRequisicao-1 ) || ( x == totalParams-1 ) ){
                    var json = {
                        'json' : new Superlogica_Js_Json({
                            'params': this._encodeRecursive(paramsRequest),  //deveria ser utf8_encode, por conta disto, foi necessario alterar o decode no server veja Superlogica_Controller_Request_Http::_parseJson
                            'url' :  url
                        }).encode()
                    };
                    requests[ Object.getLength(requests) ] = json;
                    paramsRequest = [];
                    limitePorRequisicao = parseInt( limitePorRequisicao ) + parseInt( this._limiteParamsPorRequisicao );                    
                }
            }
            
        }, this);
        
        return requests;
    },
    
    
    /**
     * Chama encodeURI recursivamente para o objeto informado
     */
    _encodeRecursive : function( toEncode  ){

        if ( typeof toEncode == 'string' ){
            return encodeURI(decodeURI(toEncode));
        }

        Object.each ( typeof toEncode == 'object' ? toEncode : {}, function( valor, chave ){
            
            toEncode[chave]= this._encodeRecursive( valor );
            
        }, this );
    
        return toEncode;
        
    },

    /**
     * Quebra o array dos parametros para dividir as requisições
     * @param array param
     */
    _splitRequets : function( params ){
        var count = 0;
        var key = 0;
        var splitedParams = {};
        Object.each( params, function(item, chave){
            if ( !splitedParams[key] )
                splitedParams[key] = new Array();
            splitedParams[key].push( item );
            if( count == 20 ){
                key = key + 1;
            }
        }, this);
        
        return splitedParams;
    },

    /**
     * Retorna a resposta das requisições.
     * Superlogica_Js_Response quando apenas adicionado uma URL.
     * Array de Superlogica_Js_Response quando adicionadas várias URLs
     *
     * @return Superlogica_Js_Response|Array
     */
    getResponse : function(cacheLabel){
        
        return this._sendRequest(null,cacheLabel);        
        
    },
    
    /**
     * Utilizado para processar a resposta ( Json )
     */
    _processarResponses : function(response){
        var dataCount = 0;
        var erros =0 ;
        
        Object.each(
            response.data,
            function( item ){
                dataCount = dataCount+1;
                if ( ( item.status > 206 ) || ( item.status == 0 ) ){
                    erros = erros + 1;
                }
            },
            this
        );
        var msg = "Todos itens foram processados com sucesso.";
        var status;
        if ( ( this._getTotalDatas() == 1 ) && ( typeof response.data[0] == 'object' ) ){
                status = response.data[0].status;
        }
     
        if ( ( !status ) && ( dataCount > 0 ) && ( dataCount == erros ) ){
            msg = "Todos itens foram processados COM ERRO.";
            status = 500;
        }else if ( ( !status ) && ( erros >0 ) ){
            msg = "Processado com sucesso mas, "+erros+" "+ ( erros > 1 ? "itens foram processados" : 'foi processado') +" COM ERRO.";
            status = 500;
        }else if ( !status ){
            status = 200;
        }

        response.status = status;
        response.msg = msg;
        
        return response;
        
    },
    
    /**
     *  Envia a requisição de forma assincrona
     *  
     */
    enviarAssincrono : function(callback, cacheLabel ){
        if (Object.getLength( this._urls ) != 1){
            throw "Impossível fazer requisição assincrona com mais de 1 requisição.";
        }
        return this._sendRequest(callback, cacheLabel);
    },

    /**
     * Envia as requisições e retorna as respostas
     * 
     * @return Superlogica_Js_Response|Array
     */
    _sendRequest : function(callback, cacheLabel){

        if ((cacheLabel) && ( Superlogica_Js_Request.cache[cacheLabel])){
            if ( typeof callback == 'function' ){
                callback(Superlogica_Js_Request.cache[cacheLabel]);
                return this;
            }else
                return Superlogica_Js_Request.cache[cacheLabel];
        }
        
        
        var reference = this;

        var totalUrls = Object.getLength( this._urls );
        
        var urls = Object.keys( this._urls );
        var params = Object.values( this._urls );

        if ( this._handler ){
            this.inserirLoadingImg();
        }
        for ( var x = 0; totalUrls > x; x++ ){
            
            var url = urls[x];
            var item = params[x];
            
            var continuar = true;
            
            if ( item.length > 1 ){
                item = this._parseMultipleRequest( item, url );
            }
            
            for ( var chave in item ){
                if ( !item.hasOwnProperty( chave) ){
                    continue;
                }
                var parametros = typeof item[chave] == 'object' ? item[chave] : {};
                
                // Codifica a URL para evitar erros com palavras 
                // acentuadas que sejam passadas como parametros
                url = encodeURI(url);
                
                this._ajaxParams['async'] = typeof callback == 'function'; 
                var ajaxParams = Object.append(
                    this._ajaxParams,
                    {

                        "url" : url,

                        "data" : parametros,

                        "type" : this._method.toLowerCase(),
                        
                        "complete" : function( xhr, textStatus ){
                            try{
                                var json = new Superlogica_Js_Json( xhr.responseText ).decode();
                                if ( !json ){
                                    throw "Json inválido";
                                }
                            }catch( e ){
                                json = {'status' : ( textStatus =='timeout' ? 200 : 500 ), 'msg' : xhr.responseText, 'data':[], 'invalidresponse' : 1};
                                if ( textStatus =='timeout') json['timeout'] = 1; 
                            }

                            if ( ( typeof json.count != 'undefined' ) && ( typeof json.columns != 'undefined' ) ){
                                json = Superlogica_Js_Request._normalizarResponseColumns( json );
                            }
                            
                            if ( typeof reference['_comStatus' + json.status] == 'function'){
                                var retorno = reference['_comStatus' + json.status].apply( reference, [ parametros, json, decodeURI(url) ] );
                                if ( retorno === -1 ){
                                    x = x-1;
                                    continuar = -1;
                                }else if( retorno === 0){
                                    continuar = 0;
                                }else if ( typeof retorno == 'object'){
                                    continuar = 0;
                                    json = retorno;
                                }else if( retorno ){
                                    continuar = true;
                                }
                            }
                            
                            if ( continuar === true || typeof retorno == 'object' )
                                reference._adicionarAoResponse( json );
                            
                            if ((typeof callback == 'function')){
                                if ( continuar !== -1 || continuar ){
                                   reference.removerLoadingImg();                                   
                                   if ( textStatus == 'timeout' || ( textStatus != 'abort' && xhr.getAllResponseHeaders() ) ){
                                       var response = new Superlogica_Js_Response( JSON.encode( reference._processarResponses(reference._responses)) , typeof reference._responseOptions != 'undefined' ? reference._responseOptions : {} );
                                       if ((cacheLabel)&&(response.isValid())){
                                           Superlogica_Js_Request.cache[cacheLabel] = response;
                                       }
                                       callback(response);
                                   }
                                }   
                            }
                            
                        }

                    }
                );

                var jqXHR = jQuery.ajax( ajaxParams );

                if ( continuar === -1 || !continuar ){
                    break;
                }

            }
            
            if ( !continuar ){
                //this._responses = {'status':200, 'data':[]};
                break;
            }
            
        }
        
        if ( typeof callback != 'function' ){
            this.removerLoadingImg();
            var response = new Superlogica_Js_Response( this._processarResponses(this._responses) , typeof this._responseOptions != 'undefined' ? this._responseOptions : {} );
            if ((cacheLabel)&&(response.isValid())){
                  Superlogica_Js_Request.cache[cacheLabel] = response;
             }
            return response;
        } else {
            return jqXHR;
        }

    },

    /**
     * Insere a msg de loading
     */
    inserirLoadingImg : function( handler ){
        
        if( handler )
            this._handler = handler;
        
        if ( !this._handler ) return false;

        this._imgLoading = new Superlogica_Js_Elemento('<img />')
            .atributo('src', APPLICATION_CONF["APPLICATION_CLIENT_TEMA_URL"] + '/img/load.gif')
            .atributo('alt', 'Carregando... aguarde.' )
            .atributo('style', 'margin-top: 5px');
        this._handler.esconder();
        this._imgLoading.inserirDepoisDe( this._handler );
        
    },

    /**
     * Remove a imagem de loading
     */
    removerLoadingImg : function(){
        if ( this._imgLoading ){
            this._imgLoading.remover();
            this._handler.mostrar();
        }
    },

    /**
     * Adiciona uma resposta ao array de respostas
     */
    _adicionarAoResponse : function( response ){
        var multipleresponse;

        if ( typeof response.multipleresponse != 'undefined'){
            multipleresponse = parseInt( multipleresponse );
        }

        if ( multipleresponse == 1 || (typeOf( response.data ) == 'array' && parseInt(response.invalidresponse,10) !== 1 ) ){
            Object.each(
                response.data,
                function( item, chave ){
                    this._responses.data.push( item );
                },
                this
            );
        }else{
            this._responses.data.push( response );
        }
    },

    /**
     * Retorna o total de multiple responses
     * 
     * @return integer
     */
    _getTotalDatas : function(){
        var totalData = 0;
        if ( typeof this._responses == 'object' ){
            Object.each( this._responses.data, function(){
                totalData++;
            });
        }
        return totalData;
    },

    /**
     * Adiciona comportamento quando status de uma resposta for 409 ( atualizar schema )
     *
     * @param object params Parametros que foram enviados para requisição
     * @param object dados JSON de resposta
     * @return integer 0 = parar todos requisições, 1 = continuar normalmente, -1 = volta para requisição anterior
     */
    _comStatus409 : function( params, dados ){

        if ( !confirm( dados.msg +"\n\n Deseja continuar?" ) )
            return 0;

        var location = new Superlogica_Js_Location()
                            .setApi(true)
                            .setModuleName('default')
                            .setController('auth')
                            .setAction('updateSchema')
                            .setParam('filename', params.filename ?  params.filename : Cookie.read('filename') );
        var request = new Superlogica_Js_Request( location.toString() );
        request._comStatus202 = null;       
        return request.getResponse().isValid() ? -1 : 0;
    },

    /**
     * Adiciona comportamento quando status de uma resposta for 401 ( atualizar schema )
     *
     * @param object params Parametros que foram enviados para requisição
     * @param object dados JSON de resposta
     * @return integer 0 = parar todos requisições, 1 = continuar normalmente, -1 = volta para requisição anterior
     */
    _comStatus401 : function( params, dados ){
        window.location.reload();
        return 0;
    }

    
    
});



/**
 * Variavel estatica de cache
 */
Superlogica_Js_Request.cache = {};


Superlogica_Js_Request.setCache = function (cacheLabel, json){
    try{
        var _json = new Superlogica_Js_Json( json ).decode();
        if ( !_json ){
            throw "Json inválido";
        }
    }catch( e ){
        _json = {'status' : 500, 'msg' : json, 'data':[], 'invalidresponse' : 1};
    }

    if ( ( typeof _json.count != 'undefined' ) && ( typeof _json.columns != 'undefined' ) ){
        _json = Superlogica_Js_Request._normalizarResponseColumns( _json );
    }        
    Superlogica_Js_Request.cache[cacheLabel] = new Superlogica_Js_Response(_json);
    
};

/**
 * Transforma o padrão antigo ( com columns e count ) no novo formato de resposta
 * 
 * @param object response
 * @return object
 */
Superlogica_Js_Request._normalizarResponseColumns = function( response ){
    var dataNormalizado = {};
    Object.each( response.data, function(item, chave){
        dataNormalizado[chave] = {};
        Object.each( response.data[chave], function(item2, chave2){
            dataNormalizado[chave][ response['columns'][chave2] ] = response['data'][chave][chave2];
        });
    });
    response.data = dataNormalizado;
    response.multipleresponse = 1;
    return response;
};