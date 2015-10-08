var Superlogica_Js_Location = new Class({

    /**
     * Armazena a string location
     * @var string
     */
    //_location : null,

    _prefixo : null,

    /**
     * Armazena os parametros da URL
     * @var array
     */
    _params : {},

    /**
     * URL para o Client
     *
     * @var string
     */
    _urlClient : APPLICATION_CONF["APPLICATION_CLIENT_URL"],

    /**
     * URL para a API
     *
     * @var string
     */
    _urlApi : APPLICATION_CONF["APPLICATION_API_URL"],
    
    /**
     * Nome do modulo atual da instancia
     * @var string
     */
    _moduleName : APPLICATION_CONF["APPLICATION_MODULE"],

    /**
     * Nome do modulo atual da instancia
     * @var string
     */
    _modulesNames : APPLICATION_CONF["APPLICATION_MODULES"],
    
    /**
     * Nome do modulo atual ( Nunca alterado, utilizado para consulta )
     * @var string
     */
    _atualModuleName : APPLICATION_CONF["APPLICATION_MODULE"],
        
    /**
     * Action da url atual
     * @var string
     */
    _action : null,
    
    /**
     * Controller da url atual
     * @var string
     */
    _controller : null,

    /**
     * Id utilizado para requisições ao action index passando o ID como parametro
     * @var integer
     */
    _id : null,
    
    /**
     * Armazena o protocolo utilizado no tostring
     * @var string
     */
    _protocolo : null,
    
    /**
     * Informa se é proxy ou não
     * @var boolean
     */
    _proxy : false,
    
    /**
     * Construtor
     * Seta o location atual utilizado na classe
     *
     * @param location
     */
     initialize : function( location ){

        if ( !location ){
            location = this._getPropriedadeNativa('href');
        }
        this.setLocation( location );
        
    },

        /**
         * Seta a url client
         * 
         * @param string $url
         * @return Superlogica_Location 
         */
    setUrlClient : function ( url ){

        this._urlClient = url;

        return this;
    },

    /**
     * Seta a url api
     * 
     * @param string $url
     * @return Superlogica_Location 
     */
    setUrlApi : function ( url ){

        this._urlApi = url;

        return this;
    },    

    /**
     *  Verifica se o servidor esta rodando no host local
     */
    isLocalHost : function(){
        var reg = /^(localhost|127\.0\.0\.1)(\:|$)/g;
        return (reg.exec(this.getHost()) != null);

    },
    
    /**
     *  Verifica se o servidor esta rodando no host local
     */
    naIntranet : function (){
        var host = this.getHost();

        if (this.isLocalHost()) return true;
        
        if ( this._isIp(host) ) {
            return this._ipReservado(host);
        } else { 
            /**
             *  Https não possibilita pegar o ip do usuário, 
             *  então não continua a verificação pois iria retornar true
             */
            if(this._isHttps()) return false;
            
            // Pra não resolver o nome, que é muito lento, usamos o ip do 
            // usuário para ver se a conexão entre server e client passou pela internet.
            // Esse método pode falhar mas a maioria dos casos vai funcionar
            
            var ips = (APPLICATION_INFO['VISITANTE_IP'] +' '+ APPLICATION_INFO['VISITANTE_IPS']).split( /(,| |;)/ );
            var intranet = true;
            Object.each(ips, function( ip ){
                // Função _isIp utilizada pois ip pode ser uma string vazia
                if ( this._isIp(ip) && !this._ipReservado( ip )){
                    intranet = false;
                }
            }, this );
            return intranet;
            
        }
    },
    
    
    /**
     *  Verifica se uma string tem formato de ip
     */
    _isIp : function(host){
        var reg = /^([0-9]{1,3}.){4}$/;
        return (reg.exec(host) != null);
    },    
    
    _ipReservado : function(ip){
        var reg = /^(10|172\.16|192\.168|127\.0\.0\.1)/;
        return (reg.exec(ip) != null);
    },      
      

    /**
     * Seta o location e popula as variaveis necessárias da classe
     * 
     * @param string location
     */
    setLocation : function ( location ){
        
        this._params = {};

        var api =this._isApi(location);

        if ( api === null )
            throw "Location aceita apenas URLs do Aplicativo. Url inválida: "+location + ". Deveria começar com (se client): "+this._urlClient+ "ou (se api): "+this._urlApi;

        this.setApi( api );

        location = location.replace( this._prefixo, '' );
      
        this._ancora = this._getAncora( location );
        
        location = location.replace(/#.+?$/im,'');

        var _moduleName = location.match(/^\/?(.+?)($|\/|\?)/);
        if ( _moduleName ){
            Object.each( this._modulesNames, function( valor ){
                if (  _moduleName[1] == valor ){
                    this.setModuleName( _moduleName[1] );
                }
            }, this );
        }
        var local = this._parseControllerEAction( location );
        
        this.setController( local['controller'] );
        this.setAction( local['action'] );
        
        location = this._removerBarrasExtras( location.replace( this._controller, '').replace( this._action, '' ) );
        this._parseParams( location );

    },

    /**
     * Verifica se location é URL da API
     * 
     * Retornos:
     *      true : caso location seja para API
     *      false : caso location seja para Client
     *      null : caso não seja nenhum dos dois tipos
     *
     * @param string location
     * @return boolean|null
     */
    _isApi : function( location ){
        
        if ( location.indexOf( this._urlApi ) !== -1 ){
            return true;
        }
        if ( location.indexOf( this._urlClient ) !== -1 )
            return false;
        return null;
    },

    /**
     * Retorna o host da URL
     * 
     * @return string
     */
    getHost : function(){
        var match = this.toString().match( /(http(s)?:\/\/)?([0-9a-z_.]{1,})(\:|\/|$|\?)/i );
        return match ? match[3].trim() : match;
    },
    
    /**
     * Verifica se é https
     * 
     * @return boolean
     */
    _isHttps : function(){
        var match = this.toString().match( /(http(s)?:\/\/)?([0-9a-z_.]{1,})(\:|\/|$|\?)/i );
        return match[2] == 's';
    },    
    
    /**
     * Retorna o link ancora da URL
     * 
     * @param string location
     * @return string
     */
    _getAncora : function( location ){
        var ancora = location.match(/\#(.*)/,'');
        return ancora != null ? ancora[1] : '';
    },

    /**
     * Localiza as variaveis GET
     *
     * @param string location
     */
    _parseParams : function( location ){
        location = location.replace( new RegExp('^/?'+this._moduleName,'i'),'' );
        this._parseParamsGet( location );
        this._parseParamsNativos( location );
    },

    /**
     * Extrai os parametros GET existente no location informado
     * 
     * @param string location
     */
    _parseParamsGet : function( location ){
        var regexGetVars = new RegExp('\\?(.+?)$');
        var getVars = location.match( regexGetVars );
        
        if ( getVars != null ){
            var dadosVars= []; 
            var stringGetVars = this._removerCaracteresSeparadores(getVars[1]);
            
            this._parse_str(stringGetVars,dadosVars);
            
            
            Object.each(dadosVars, function(item, chave){
            	if ( chave && (item!==null))
                    this._params[chave]= item;
            }, this);
            
        }
        
        
        
        
//        if ( getVars != null ){
//            var stringGetVars = this._removerCaracteresSeparadores( getVars[0] );
//            var dadosVars = stringGetVars.split('&');
//            dadosVars.each(
//                function( item, chave ){
//
//                    var dadosVar = item.split('=');
//                    if ( dadosVar[0].indexOf('[') !== -1 ){
//                        dadosVar[0] = dadosVar[0].replace('[]','');
//                        //dadosVar = this._stringToArray( dadosVar[0] );
//                        if ( typeof this._params[ dadosVar[0] ] != 'object'){
//                            this._params[ dadosVar[0] ] = [];
//                        }
//                        this._params[ dadosVar[0] ].push( decodeURI( this.url_decode( dadosVar[1] ) ) );
//                    }else{
//                        this._params[ dadosVar[0] ] = decodeURI( this.url_decode( dadosVar[1] ) );
//                    }
//
//                },
//                this
//            );
//        }

    },

    /**
     * Extrai os parametros, separados por barras ( / ), da URL
     * 
     * @param string location
     */
    _parseParamsNativos : function( location ){
        var url = this._removerGetParams( this._removerPrefixos( location ) );

        var params = this._removerBarrasExtras(
            url .replace( '/'+this.getController()+'(\/|$|\?|\#)', '')
                .replace( '/'+this.getAction()+'(\/|$|\?|\#)', '')
                .replace(/^\/|\/$/ig,'')
        );
        
        if ( !params ) return true;
        
        var parametros = params.split('/');
        if ( parametros.length > 1 ){
            for( var x=0; parametros.length>x; x=x+2){
                this._params[ parametros[x] ] = parametros[x+1];
            }
        }

        if ( this.getAction() == 'id' ){
             var id = location.replace(/(\?.*$|\/.*$)/g,'');
             this.setId(id);
        }
    },


    /**
     * Retorna a propridade nativa do Location
     * 
     * @param string propriedade Uma das propriedade nativas do objeto location ( http://davidwalsh.name/javascript-window-location )
     * @retrun string
     */
    _getPropriedadeNativa : function( propriedade ){
        return window.location[ propriedade ];
    },

    

    /**
     * Retorna o prefixo desejado ( URL do client ou da API )
     * @return string
     */
    _getPrefixo : function (){
        return this._prefixo;
    },

    /**
     * Remove os prefixos da url informada ( clientURL e apiURL )
     *
     * @param string url
     * @return string
     */
    _removerPrefixos : function( url ){
        return url.replace( this._urlClient, '' ).replace( this._urlApi , '' );
    },

    /**
     * Insere os parametros na url informada
     *
     * @param string url
     */
    _paramsToString : function(){
        var queryString = '';
       var params = this._params;
        if ( this._proxy ){
            if ( this._id )
                params['remoteId'] = this._id;
            params['remoteController'] = this.getController();
            params['remoteAction'] = this.getAction();
        }
        Object.each(
            params,
            function(item, chave){
                if ( typeof( item ) == 'object' ){
                    queryString = queryString + chave + this._arrayToGetParam( item ).join( '&' + chave ) + '&';
                }else{
                    queryString = queryString + chave + "=" + item + '&';
                }
            },
            this
        );
        queryString = queryString.replace(/&$/,'');

        return queryString ? queryString : '';
    },


    /**
     * Transforma array para utilizar como string no HTTP
     * 
     * @param object array
     * @return string
     */
    _arrayToGetParam : function( array ){
        var params = [];
        Object.each( array, function( valor, chave ){
            if ( typeof valor == 'object' ){
                Object.each(valor, function(valor2, chave2){
                    params.push('['+chave+']['+chave2+']' + ( typeof valor2 == 'object' ? this._arrayToGetParam(valor2).join('') : '='+valor2) ) ;
                },this);
            }else{
                params.push('['+  chave +']='+valor);
            }
        }, this );
        return params;
    },

    /**
     * Seta o Action para Url
     *
     * @param string action
     * @return Superlogica_Js_Location
     */
    setAction : function( action ){
        if ( action ){
            this._action = action;
            this._id = null;
        }
        return this;
    },
    
    /**
     * Seta o modulo utilizado para montar o location
     * 
     * @param string moduleName
     */
    setModuleName : function( moduleName ){
        this._moduleName = moduleName;
        return this;
    },
    
    /**
     * Retorna o modulo que está sendo utilizado ou null caso não exista modulo
     * 
     * @return string|null
     */
    getModuleName : function(){
        return this._moduleName ? this._moduleName : 'default';
    },

    /**
     * Retorna um parametro do location
     *
     * @param string param Nome da variavel a ser retornada
     * @return string
     */
    getParam : function( param ){
        return this._params[param];
    },
    /**
     * Retorna um objeto contendo os parametros setados
     *
     * @return object
     */
    getParams : function(){
        return this._params;
    },
    
    /**
     * Seta um parametro para requisição
     *
     * @param string param Nome do parametro
     * @param mixed value
     * @return Superlogica_Js_Location
     */
    setParam : function( param, value ){
        
        if ( ( value === null || typeof value == 'undefined') && ( typeof this._params[param] != 'undefined' ) ){
            delete this._params[param];
        }else if (typeof value == 'undefined' || value === null ){
            return this;
        }else{
            this._params[param] = value;
        }
        return this;
    },

    /**
     * Seta os parametros para requisição
     *
     * @param object params
     * @return Superlogica_Js_Location
     */
    setParams : function( params ){
        /* setParams agora apaga os parametros setados anteriormente
         * incluse os que já vieram na URL
         * Alterado por Alan dia 14/04/2011
         */
        if ( typeof params == 'string' && params.trim() != '' ){
            this._parseParamsGet( '?'+params );
        } else {
            this._params = {};
            this.addParams( params );
        }
        return this;
    },

    /**
     * Adiciona parâmetros na requisição
     *
     * @param object params
     * @return Superlogica_Js_Location
     */
    addParams : function( params ){

        if ( typeof params == "object"){
            Object.each( params, function(item, chave){
                this.setParam( chave, item );
            }, this);
        }
        return this;
    },

    /**
     * Define o controller para requisição
     *
     * @param string controller
     * @return Superlogica_Js_Location
     */
    setController : function( controller ){
        this._controller = controller;
        return this;
    },

    /**
     * Seta se irá utilizar API ou Client ( default )
     *
     * @param boolean status
     * @return Superlogica_Js_Location
     */
    setApi : function( status ){
        if ( status )
            this._prefixo = this._urlApi;
        else
            this._prefixo = this._urlClient;
        return this;
    },

    /**
     * Seta o ID para requisições diretas a página ID do controller especificado
     * 
     * @param integer id
     * @return Superlogica_Js_Location
     */
    setId : function( id ){
        if ( /^[0-9A-Z]{1,}$/i.test(id) ){
            this._id = id;
            this._action = "";
        }
        return this;
    },

    /**
     * Retorna o ID
     * 
     * @return integer
     */
    getId : function(){
        return this._id;
    },

    /**
     * Retorna o controller atual
     * @return string
     */
    getController : function(){
        return this._controller !== null ? this._controller : this._parseControllerEAction()['controller'];
    },

    /**
     * Retorna a action atual do objeto
     * @return string
     */
    getAction : function(){
        return this._action !== null ? this._action : this._parseControllerEAction()['action'];
    },
            
    /**
     * Seta o protocolo que irá retornar no toString
     * @param string $protocolo
     * 
     */
    setProtocolo : function( protocolo ){
        this._protocolo = protocolo;
        return this;
    },
            
    /**
     * Remove os protocolos da url informada
     * 
     * @param string $url
     * @return string
     */
    _removerProtocolo : function( url ){
        return url.replace(/http(s)?:\/\//g,'');
    },

    /**
     * Extrai o Controller e o Action da url atual
     * @return object Objeto contendo os campos 'controller' e 'action'
     */
    _parseControllerEAction : function( location ){
        var locationAtual = this._removerPrefixos( location );
        
        var controller = locationAtual.match( /^\/?([a-z0-9]{1,})(\/|$|\?|\#)/im );
        if ( !controller ){
            controller = ['index'];
        }
        
        locationAtual =  locationAtual.replace( new RegExp( '^/?' + this._removerBarrasExtras( controller[0].trim() ) /*+ "(\/|$|\?|\#)"*/ ), '' );

        if (
            ( this._atualModuleName && this._atualModuleName.trim() == this._removerCaracteresSeparadores( this._removerBarrasExtras(controller[0])) ) 
            || (this._moduleName && this._moduleName.trim() == this._removerCaracteresSeparadores( this._removerBarrasExtras(controller[0]) ) ) 
        )
        {
            
            controller = locationAtual.match( /^\/?([a-z0-9]{1,})(\/|$|\?|\#)/im );
            if ( !controller )
                controller = ['index'];
            
            locationAtual =  locationAtual.replace( new RegExp( '^/' + this._removerBarrasExtras( controller[0].trim() ) /*+ "(\/|$|\?|\#)"*/ ), '' );

        }
        
        var action = locationAtual.match( /^\/?([a-z0-9]{1,})(\/|$|\?|\#)/im );
        var temId = locationAtual.match( new RegExp( action+'/[0-9]{1,}' ) );
        //var temId = locationAtual.match( new RegExp( action+'/[0-9A-Z]{1,}(/|$|?)' ) );
        if ( !action || ( action && ( action[1] == 'id' && temId ) ) ){
            action = ["index"];
        }

        action = this._removerCaracteresSeparadores( this._removerBarrasExtras( action[0] ) );
        controller = this._removerCaracteresSeparadores( this._removerBarrasExtras( controller[0] ) );
        return {'action' : action, 'controller' : controller};
    },

    /**
     *
     * Função padrão quando utilizado objeto com string
     * @return string URL setada
     */
    toString : function(){
        if ( this._proxy ){
            var controller = 'proxy';
            var action = 'index';
        }else{        
            var controller = this.getController();
            var action = this.getAction();
        }
        var controllerEAction = ( this._moduleName && this._moduleName != 'default' ? this._moduleName + '/' : "" ) ;

        if ( ( controller == 'index') && ( action == 'index') ){
            controllerEAction += '';
        }else{
            controllerEAction += controller + '/' + action;
        }
        var location = this._removerBarrasExtras(this._getPrefixo(),'/') + ( controllerEAction ? '/'+controllerEAction : '');
        if ( this._protocolo ){
            location = this._protocolo+'://'+ this._removerProtocolo( location );
        }        
        var id = this._id;
        if ( id != null ){
            location = location.replace( /\/$/,'') + '/id/' + id;
            this.setParam( 'id', null );
        }
        var paramsString = this._paramsToString();
        return  location + ( paramsString ? "?"+paramsString : '' ) ;
    },

    /**
     * Retorna a string sem as variaveis GET
     *
     * @param string string
     * @return string
     */
    _removerGetParams : function( string ){
        return string.replace(/\?.*?$/im,'');
    },
    
    /**
     * Remove as barras extras no começo e no final da string informada
     *
     * @param string string
     * @return string
     */
     _removerBarrasExtras : function( string ){
        return string.replace(/^\/{1,}|\/{1,}$/g, '');
    },
    
    /**
     * Remove os caracteres especiais da URL como ? que separa as variaveis e o # que separa a Ancora
     * 
     * @param string string
     * @return string
     */
    _removerCaracteresSeparadores : function( string ){
        return string.replace(/\?|\#/g,'');
    },
            
         /**
     *
     * Define um novo application para o location atual
     * 
     * @param string $application
     * @return Superlogica_Location 
     */
     setApplication : function(application){
        this.setUrlClient( this._urlClient.replace( /\/([0-9A-Z]{1,})$/i, '/'+application+'/') );
        this.setUrlApi( this._urlApi.replace( /\/([0-9A-Z]{1,})$/i, '/'+application+'/') );       
        this.setApi(this._isApi(this._prefixo));//redefine o _prefixo;
        
        return this;
    },

    /**
     * Decodifica acentuações da string passada
     * @param string str
     * @return string
     */
    urldecode : function(str) {
//        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
        var n, strCode, strDecode = "";

        for (n = 0; n < str.length; n++) {
            if (str.charAt(n) == "%") {
                strCode = str.charAt(n + 1) + str.charAt(n + 2);
                strDecode += String.fromCharCode(parseInt(strCode, 16));
                n += 2;
            } else {
                strDecode += str.charAt(n);
            }
        }

        return strDecode;
    },

    urlencodeRecursive : function(dados){
        if ( typeof dados != 'object' ) 
            return this.urlencode( dados );
        
        Object.each( dados, function(valor, chave ){
            dados[chave] = typeof valor == 'object' ? this.urlencodeRecursive(valor) : this.urlencode(valor);
        }, this );
        return dados;

    },
    
    urlencode : function (str) {
        // http://kevin.vanzonneveld.net
        // +   original by: Philip Peterson
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: AJ
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: travc
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Lars Fischer
        // +      input by: Ratheous
        // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Joris
        // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
        // %          note 1: This reflects PHP 5.3/6.0+ behavior
        // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
        // %        note 2: pages served as UTF-8
        // *     example 1: urlencode('Kevin van Zonneveld!');
        // *     returns 1: 'Kevin+van+Zonneveld%21'
        // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
        // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
        // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
        // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
        str = (str + '').toString();

        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    },    
    
    _parse_str : function (str, array) {
    // Parses GET/POST/COOKIE data and sets global variables  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/parse_str    // +   original by: Cagri Ekin
    // +   improved by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   reimplemented by: stag019    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: stag019
    // -    depends on: urldecode
    // +   input by: Dreamer
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)    // %        note 1: When no argument is specified, will put variables in global scope.
    // *     example 1: var arr = {};
    // *     example 1: parse_str('first=foo&second=bar', arr);
    // *     results 1: arr == { first: 'foo', second: 'bar' }
    // *     example 2: var arr = {};    // *     example 2: parse_str('str_a=Jack+and+Jill+didn%27t+see+the+well.', arr);
    // *     results 2: arr == { str_a: "Jack and Jill didn't see the well." }
    var glue1 = '=',
        glue2 = '&',
        array2 = String(str).replace(/^&?([\s\S]*?)&?$/, '$1').split(glue2),        i, j, chr, tmp, key, value, bracket, keys, evalStr, that = this,
        fixStr = function (str) {
            return that.urldecode(str).replace(/([\\"'])/g, '\\$1').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        };
     if (!array) {
        array = this.window;
    }
 
    for (i = 0; i < array2.length; i++) {        tmp = array2[i].split(glue1);
        if (tmp.length < 2) {
            tmp = [tmp, ''];
        }
        key = fixStr(tmp[0]);        value = fixStr(tmp[1]);
        while (key.charAt(0) === ' ') {
            key = key.substr(1);
        }
        if (key.indexOf('\0') !== -1) {            key = key.substr(0, key.indexOf('\0'));
        }
        if (key && key.charAt(0) !== '[') {
            keys = [];
            bracket = 0;            for (j = 0; j < key.length; j++) {
                if (key.charAt(j) === '[' && !bracket) {
                    bracket = j + 1;
                } else if (key.charAt(j) === ']') {
                    if (bracket) {                        if (!keys.length) {
                            keys.push(key.substr(0, bracket - 1));
                        }
                        keys.push(key.substr(bracket, j - bracket));
                        bracket = 0;                        if (key.charAt(j + 1) !== '[') {
                            break;
                        }
                    }
                }            }
            if (!keys.length) {
                keys = [key];
            }
            for (j = 0; j < keys[0].length; j++) {                chr = keys[0].charAt(j);
                if (chr === ' ' || chr === '.' || chr === '[') {
                    keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                }
                if (chr === '[') {                    break;
                }
            }
            evalStr = 'array';
            for (j = 0; j < keys.length; j++) {                key = keys[j];
                if ((key !== '' && key !== ' ') || j === 0) {
                    key = "'" + key + "'";
                } else {
                    key = eval(evalStr + '.push([]);') - 1;                }
                evalStr += '[' + key + ']';
                if (j !== keys.length - 1 && eval('typeof ' + evalStr) === 'undefined') {
                    eval(evalStr + ' = [];');
                }            }
            evalStr += " = '" + value + "';\n";
            eval(evalStr);
        }
    }},
        
    /**
     * Seta se é uma requisição proxy ou não
     * @param boolean proxy
     * @return Superlogica_Js_Location
     */
    viaProxy : function( proxy ){
        this._proxy = proxy;  
        return this;
    }


});
