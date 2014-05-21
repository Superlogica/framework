var Superlogica_Js_Notificacao = new Class({
        
    /**
     * Tempo em milisegundos que a msg fica aberta
     * @var int
     */
    _tempoAberto : 5000,
    
    /**
     * Mensagem a ser exibida
     * @type {String}
     */
    _msg : "",

    /**
     * Tipo da mensagem
     * Disponíveis: success, warning, info ou error
     * @type {String}
     */
    _tipo : "",

    /**
     * Tipo padrão a ser utilizado caso não seja informado
     * @type {String}
     */
    _tipoPadrao :'success',
    
    /**
     * Chamada ao instanciar o objeto
     */
    initialize : function( msg, tipo ){        
        toastr.options = {
            closeButton: true,
            positionClass: "toast-bottom-right",
            timeOut: this._tempoAberto
        };
        this.setMsg( msg );
        this.setTipo( tipo );
    },
    
    /**
     * Seta a msg da notificação
     * @param string msg
     */
    setMsg : function( msg ){
        this._msg = msg ? msg : "";
    },

    /**
     * Retorna a msg da notificação
     * @return string
     */
    getMsg : function(){
        return this._msg;
    },

    /**
     * Seta qual tipo a ser utilizado na notificação
     * @param {String} tipo Disponível: success (padrão), warning, info, error
     */
    setTipo : function(tipo){
        this._tipo = tipo;
    },

    /**
     * Retorna qual o tipo da notificação
     * @return {String}
     */
    getTipo : function(){
        return this._tipo ? this._tipo : this._tipoPadrao;
    },
        
    /**
     * Função chamada para mostrar o box
     * 
     * @param string msg
     */
    show : function(){
        var tipo = this.getTipo();
        var msg = this.getMsg();
        toastr[tipo](msg);
    }

});
