var Superlogica_Js_Cron = new Class({    
    _url : null,
    
    _msg : null,
    
    _elementoAlvo : null,
    
    _idElementoAlvo : null,

    _status : [],        
    
    _tentarNovamente : null,
        
    _callbackProcessar : null,
    
    _timeout : 5,
    
    _parar : false,
    
    _md5Alerta : null,
    
    initialize : function(url,elementoAlvo, msg){
        this._url= url;
        
     
        this._msg= msg;
        
        if (!elementoAlvo) 
            elementoAlvo = 'cron';
        
        this._idElementoAlvo= elementoAlvo;
        this._md5Alerta = new String( (Math.random()*Math.random()) ).replace('.','');
    },
    
    timeout : function(segundos){
        this._timeout = segundos;        
        return this;
    },
    
    aoProcessar : function(callback){
        this._callbackProcessar = callback;        
        return this;
    },
            
    pausar : function(){
        this._parar = true;        
        return this;
    },  
            
     reiniciar : function(){
        this.executar();       
        return this;
    },             
    
    setUrl : function(url){
        this._url= url;
        return this;
    },

    parar : function(status,msg,tentarNovamente){
        this._status.push ({
            'status':status,
            'msg':(typeof(msg)=== undefined ) ? '' : msg,
            'recarregar': false,
            'tentarNovamente' : (typeof(tentarNovamente) == 'undefined' ) ? true : tentarNovamente
        });
        
        return this;
    },
    

    recarregar : function(status){
        this._status.push ({
            'status': status,
            'recarregar': true,
            'tentarNovamente' : false
        });
        
        return this;
    },
    
    
    executar : function(){ 
        this._parar=false;
        this._elementoAlvo= new Superlogica_Js_Elemento('#'+this._idElementoAlvo); 
        var request = new Superlogica_Js_Request(this._url);
        request.setResponseOptions({
            autoThrowError : false
        });
        
        var cron = this;
        
        request.enviarAssincrono(function( response ){
            cron._processarResponse( response );
        });
    },
    
    
    executarAoCarregarPagina : function(){        
        var cron = this;
        var inited = false;
        new Superlogica_Js_Elemento( document ).bind('ready', function(){
            if ( inited ) return true;
            inited = true;
            cron.executar();
        });
        return this;
    },   
    
    alterarMensagem : function(msg, processando, tentarNovamente, tipoNotificacao){ 
         if (!this._elementoAlvo)
            return false; 
        if (msg.trim()==''){
            this._elementoAlvo.esconder();
            return;
        }

         if (processando==true) 
             msg= msg+' <img src="'+APPLICATION_CONF['APPLICATION_CLIENT_TEMA_URL']+'/img/load.gif"/>'; 
         if (tentarNovamente==true){
                    var location= new Superlogica_Js_Location();
                    msg= msg+ ' <a href="'+location.toString()+'">Tentar novamente</a>.'
          }
        
        new Superlogica_Js_Notificacao(msg,tipoNotificacao).show();
       
    },     
    
    _processarResponse : function(response){
        var msg='';        
        if ( typeof this._callbackProcessar == 'function'){
            var retorno = this._callbackProcessar( response );
            if ( retorno === false )
                return false;
        }
    
        Object.each( this._status, function(status, indice){                    

            if (parseInt(response.getStatus())==parseInt(status['status'])){
                msg= response.getMsg();

                if (status['recarregar']){
                    window.location.reload();
                }   
                
                this._parar = true;
                
                
                if (status['msg']===false){
                    return true;
                }
                
                if (status['msg']){
                    msg= status['msg'];
                }
                
                this.alterarMensagem(msg,false,status['tentarNovamente'], (status['tentarNovamente'] == 500 || status['tentarNovamente'] == 404) ? 'danger' : 'info' );
            }            
        }, this);

        if (!this._parar){        
            var cron= this; 
            setTimeout( function(){
                cron.executar();
            }, this._timeout*1000 );
        }

    }
});