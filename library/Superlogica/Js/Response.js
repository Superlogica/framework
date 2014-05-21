/**
 *
 * Classe responsavel por formatações e tratamentos de mensagens e respostas dos controllers
 *
 */
var Superlogica_Js_Response = new Class({

    /**
     * Response no formato objeto
     * @var string
     */
    _dados : {},
    
    /**
     * Id do div para colocar a mensagem quando não deseja mostrar o dialog
     * @var string
     */
    _idDiv : null,

    /**
     * Indica se a mesagem aparecerá automaticament ao instancia a classe
     */
    _autoThrowError : true,

    _callbackFunction : null,

    _esconderDetalhes : true,

    _ordemData : 0,


    /**
     * Objeto com as opções padrões do dialog ( é acrescentada outras opções via script )
     */
    _dialogOptions : {
        "resizable" : false,
        "draggable" : true,
        "modal" : true,
        "title" : 'Resultado do processamento',
        'width' : 400,
        'autoOpen' : false,
        'buttons' : {
            "Fechar" : function() {
                new Superlogica_Js_Elemento( this ).dialogo("close");
            }
        },
        'close' : function(){
            var dialog = new Superlogica_Js_Elemento(this);
            var callback = dialog.getDados('callbackFunction');
            if ( typeof callback == 'function'){
                callback.apply( this, [] );
            }
            dialog.remover();
        }
    },
    
    /**
     * Construtor
     * @param string json Json com os dados para dar resposta.
     * @param string div OPCIONAL Local onde deve informar a mensagem obtida.
     */
    initialize : function( responseText, options ){
        this.setDados( responseText );
        this.setOptions( options );

        if ( ( ( this._autoThrowError ) && ( !this.isValid() ) ) || ( options.exibirDetalhes ) ) {
            this._throwErrorMsg();
        }
        
        
    },

    /**
     * Utilizado para setar as opções de resposta
     * Cada chave do objeto correponde a uma função set da classe.
     * Para chamar o setAutoThrowError : options = { autoThrowError : false }
     * 
     * @param object options Objeto com todas opções a serem setadas.
     * @return boolean
     */
    setOptions : function( options ){
        if ( typeof options != 'object') return false;
        Object.each( options, function( item, chave){
            var functionName = chave.capitalize();
            if ( typeof this[ 'set' + functionName ] == 'function'){
                this[ 'set' + functionName ]( item );
            }
        }, this );
        return true;
    },

    /**
     *
     * Indica se o erro irá aparecer automaticamente quando a resposta não for valida.
     * 
     * @param booelan autoThrow
     */
    setAutoThrowError : function( autoThrow ){
        this._autoThrowError = autoThrow;
    },

    /**
     * Seta o ID do Div onde será apresentada a mensagem de erro
     *
     * @param string idDiv
     */
    setIdDiv : function(idDiv){
        this._idDiv = idDiv;
    },

    setCallbackFunction : function( callbackFunction ){
        this._callbackFunction = callbackFunction;
    },

    setEsconderDetalhes : function( esconder ){
        this._esconderDetalhes = esconder;
    },

    /**
     * Transforma a resposta em JSON
     * @param
     */
    setDados : function( dados ){
        if ( typeof dados == 'object'){
            this._dados = dados;
        }else{
            try{
                this._dados = new Superlogica_Js_Json( dados ).decode();
                if ( !this._dados ){
                    throw "Json inválido.";
                }
            }catch(e){
                this._dados = dados;
            }
        }
    },

    /**
     *
     * @param
     */
    isValid : function(){
        return (typeof this._dados == 'object') && ( this._dados['status'] < 299 ) && (this._dados['status'] != 0);        
    },

    isTimeout : function(){
        
        if (!this.getData(-1)[0]) return false;
        return ( this.getData(-1)[0].timeout == 1 );
    },

    isMultipleResponse : function(){
        
        if (!this.getData(-1)[0]) return false;
        return ( this.getData(-1)[0].multipleresponse == 1 );
        
    },

    /**
     * Coloca mensagem no div(se passar o div) ou abre o dialog
     * @param
     */
    _throwErrorMsg : function(){
        
        var errorMsg = this.getMsg();        
        if ( !errorMsg || errorMsg.trim() == '' )
            return true;
        
        if ( typeof this._idDiv == 'string' ){
            this._sendDivMsg();
        } else {
            this._sendDialogMsg();
        }
    },

    /**
     * Adiciona mensagem no div
     * @param
     */
    _sendDivMsg : function(){
        new Superlogica_Js_Elemento( '#' + this._idDiv ).adicionarHtmlAoFinal( this.getDetalhes() );
    },

    /**
     * Envia a resposta para o dialog
     */
    _sendDialogMsg : function(){
          
        var detalhes = this.getDetalhes();
        
        var txtBtnDetalhes = [ this._esconderDetalhes ? 'Detalhes >>' : '<< Detalhes', this._esconderDetalhes ? '<< Detalhes' : 'Detalhes >>' ];
        var exibindoDetalhes = this._esconderDetalhes;
        if ( this.getDados() && this.getDados().data && this.getDados().data.length > 1 ){
            this._dialogOptions.buttons[ txtBtnDetalhes[0] ] = function(event){
                var btnDetalhes = new Superlogica_Js_Elemento( event.target );
                
                if ( !btnDetalhes.eh( 'button' ))
                    btnDetalhes = btnDetalhes.encontrar('.ui-button-text');
                
                if( exibindoDetalhes ){
                    btnDetalhes.conteudo(txtBtnDetalhes[1]);
                }else{
                    btnDetalhes.conteudo(txtBtnDetalhes[0]);
                }
                var grid = new Superlogica_Js_Elemento(this)
                            .maisProximo('.ui-dialog')
                            .encontrar('.Superlogica_Js_Response_GridDiv');
                            
                if ( !grid ){
                    return ;
                }
                grid.trocarVisibilidade();
                exibindoDetalhes = !exibindoDetalhes;
            };
        }
        
        this._dialogOptions["dialogClass"] = this.getDados().status > 205  ||  this.getDados().status == 0 ? 'dialogError' : 'dialogInfo';

        var dialogDetalhes = this._createDialog( detalhes );
        dialogDetalhes.dialogo('open');
        
    },


    /**
     * Cria a janela do dialog com a mensagem informada
     *
     * @param string msg
     * @return object
     */
    _createDialog : function( msg ){
        var dialog = new Superlogica_Js_Elemento('<div></div>')
                    .adicionarClasse('divDialog')
                    .adicionarHtmlAoFinal( msg )
                    .dialogo( this._dialogOptions );
        if ( typeof this._callbackFunction != 'undefined'){
            dialog.setDados('callbackFunction', this._callbackFunction );
        }
        return dialog;
    },

    /**
     * Retorna os detalhes da requisição
     * 
     * @return object
     */
    getDetalhes : function(){
        var detalhes = new Superlogica_Js_Elemento( '<div>' + Superlogica_Js_String.nl2br(this.getMsg()) + "</div>" );

        if ( this.getDados().data.length >1 ){
            var htmlGrid = this._montarGrid().carregarComportamentos();
            detalhes.adicionarHtmlAoFinal( htmlGrid );
        }
        return detalhes;
    },
    
    /**
     * Cria o grid do dialog(necessário para múltiplas respostas)
     *
     * @return object
     */
    _montarGrid : function (){
        var divDetalhes = new Superlogica_Js_Elemento('<div class="Superlogica_Js_Response_GridDiv" style="margin-left:-30px; margin-top:35px; height: 200px; overflow-y: scroll;"><table class="Superlogica_Js_Grid" comportamentos="Superlogica_Js_GridResponse" data=\''+ new Superlogica_Js_Json( this.getDados().data ).encode() +'\' ></table></div>');
        if ( this._esconderDetalhes )
            divDetalhes.adicionarClasse('blocoEscondido');
        return divDetalhes;
    },

    /**
     * Retorna a variavel data da requisição
     * ou vazio caso não seja válido
     * @return object
     */
    getData : function( ordemData ){    	    	
    	
        this.setOrdemData( ordemData );
        var dados;
        if ( this._ordemData == -1 ){
        	
            dados = this._dados['data'];

        }else if ( ( typeof this._dados == 'object' ) && ( typeof this._dados['data'][this._ordemData] == 'object' ) && ( typeof this._dados['data'][this._ordemData]["data"] != 'undefined' ) ){
        	
            dados = this._dados['data'][this._ordemData]["data"];

        }else if ( typeof this._dados['data'][this._ordemData] == 'object'){
        	
            dados = this._dados['data'][this._ordemData];
            
        }
        
        return dados;
        
    },

    setOrdemData : function( ordemData ){
        if ( typeof ordemData == 'number')
            this._ordemData = ordemData;
    },

    /**
     * Retorna o status da requisição
     * @return boolean|integer
     */
    getStatus : function(){
        
        var status = 500;
        if ( typeof this._dados == 'object' ){
            status = this._dados['status'];
            if ( typeof this._dados['data'] =='object' && this._dados['data'].length == 1 && this._dados['data'][0]['status']){
                status = this._dados['data'][0]['status'];
            }
        }
        return status;

    },

    /**
     * Retorna a mensagem da resposta
     * @return string
     */
    getMsg : function(){
        //return this.getData().msg;
        var msg = this._dados;
        if ( typeof this._dados == 'object' ){
            msg = this._dados['msg'];
            if ( typeof this._dados['data'] =='object' && this._dados['data'].length == 1 && this._dados['data'][0]['msg']){
                msg = this._dados['data'][0]['msg'];
            }
        }
        return msg;
    },

    /**
     * Retorna toda a resposta da requisição.
     * 
     * @return object
     */
    getDados : function(){
        return this._dados;
    },

	/**
	* Retorna o total de elementos no data da resposta
	* @return integer
	*/
    getTotalData : function(){
        return Object.getLength( this.getData(-1) );
    }
    
});

var Superlogica_Js_GridResponse = new Class({

    Extends : Superlogica_Js_Grid,

    initialize : function(){
        
        this.parent.apply( this, arguments );
        
        this.setOptions( {
            'colunas' : {
                "imagem" : {
                    "label" : "&nbsp;",
                    "alinhamento" : "center",
                    'tamanho' : '10%'
                },
                "status" : {
                    'label' : 'Status',
                    'template' : '{status}',
                    'alinhamento' : 'center',
                    'tamanho':'10%'
                },
                "mensagem" : {
                    'label' : 'Mensagem',
                    'template' : '{msg}',
                    'tamanho':'75%'
                }

            },

            "comSelecao" : 0,

            "comBotaoTodosOsItens" : 0,

            "comPaginacao" : 0,

            "comOrdenacao" : 0,

            "comMarcadores" : 0,

            "jsClassName" : "Superlogica_Js_GridResponse"

        } );
    },

    _formatarColunaImagem : function( dados ){
        var src = APPLICATION_CONF["APPLICATION_CLIENT_TEMA_URL"]+'/img/check.png';
        var alt = "Sucesso";
        if( parseInt(dados.status) > 299 || parseInt(dados.status) == 0 ) {
            src = APPLICATION_CONF["APPLICATION_CLIENT_TEMA_URL"]+'/img/error_black.png';
            alt = 'Erro';
        }
        return "<img src='"+src+"' title='"+alt+"' alt='"+alt+"' />";
    }

});
