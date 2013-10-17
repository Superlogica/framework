var Superlogica_Js_Cron = new Class({    
    _url : null,
    
    _msg : null,
    
    _elementoAlvo : null,

    _statusParar : [],        
    
    _tentarNovamente : null,
        
    initialize : function(url,elementoAlvo, msg){
        this._url= url;
        
        if (!msg) 
            msg = 'Processando';       
                
        this._msg= msg;
        
        if (!elementoAlvo) 
            elementoAlvo = 'cron';
        
        this._elementoAlvo= new Superlogica_Js_Elemento('#'+elementoAlvo);    
    },
    
    parar : function(status,msg,tentarNovamente){
        this._statusParar.push ({
            'status':status,
            'msg':(typeof(msg == undefined) ) ? '' : msg,
            'tentarNovamente' : (typeof(tentarNovamente) == 'undefined' ) ? true : tentarNovamente
        });
        
        return this;
    },
    
    executar : function(){        
        var request = new Superlogica_Js_Request(this._url);
        request.setResponseOptions({
            autoThrowError : false
        });
        
        var cron = this;
        
        request.enviarAssincrono(function( response ){
            cron._processarResponse( response );
        });
    },
    
    _processarResponse : function(response){
        var msg='';        
        
        Object.each( this._statusParar, function(statusParar, indice){                    
            if (parseInt(response.getStatus())==parseInt(statusParar['status'])){
                msg= response.getMsg();
                
                if (statusParar['msg']){
                    msg= statusParar['msg'];
                }
                
                if (statusParar['tentarNovamente']){
                    var location= new Superlogica_Js_Location();
                    msg= msg+ ' <a href="'+location.toString()+'">Tentar novamente</a>.'
                }                
            }            
        }, this);
        
        if (msg.trim()==''){        
            
            
            var cron= this;            
            msg= this._msg+' <img alt="'+msg+'" src="'+APPLICATION_CONF['APPLICATION_CLIENT_TEMA_URL']+'/img/load.gif"/>';            
            setTimeout( function(){
                cron.executar();
            }, 5000 );
        }
        
        if (this._elementoAlvo)
            this._elementoAlvo.conteudo(msg).adicionarClasse('alerta');        
    }
});