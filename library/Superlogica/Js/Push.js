var Superlogica_Js_Push = new Class({
    /**
     * id dos clients que iram escutar esse canal
     * @var string
     */
    _clienteId : null,
    
    /**
     * objeto da classe do elasticpush
     * @var string
     */
    _elasticpush : null,

    /**
     * Construtor
     * Necessario implementar o codigo abaixo na sua pagina para que funcione
     */
     initialize : function( clienteId ){
         
//         alert(Superlogica_Js_Push.key);
//        //classe implementa em http://s3-sa-east-1.amazonaws.com/elasticpush/elasticpush.v1.0.min.js 
        this._elasticpush = new Elasticpush(Superlogica_Js_Push.key);
        this._clienteId = clienteId;        
    },
    
    getApp : function(channel){
//        var elasticpush = new Elasticpush(Superlogica_Js_Push.key);
        var app = this._elasticpush.subscribe(channel);
        app.setClientId(this._clienteId);
        return app;
    },

});