var Superlogica_Js_Notificacao = new Class({
        
    /**
     * Tempo em milisegundos que a msg fica aberta
     * @var int
     */
    _tempoAberto : 5000,
    
    _msg : "",
    
    /**
     * Chamada ao instanciar o objeto
     */
    initialize : function( msg ){
        this.setMsg(msg);
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
     * Cria o div com informações padrões
     * 
     * @return Superlogica_Js_Elemento
     */
    _createBox : function(){
        var box = new Superlogica_Js_Elemento("<div></div>");
        box.adicionarClasse( 'blocoEscondido' ).adicionarClasse( 'Superlogica_Js_Notificacao' );
        return box;
    },
    
    /**
     * Retorna um novo box ou a referencia para o que já existe na tela
     * 
     * @param string classe Classe do elemento
     * @param string texto Conteudo da msg
     * @return Superlogica_Js_Elemento
     */
    _getBox : function( classe, texto ){
        
        var notificacao = new Superlogica_Js_Elemento("div.Superlogica_Js_Notificacao");
        if ( !notificacao || notificacao.contar() <= 0 ){
            notificacao = this._createBox();
            new Superlogica_Js_Elemento('#conteudo').adicionarHtmlAoInicio( notificacao );
        }
        notificacao.conteudo( texto );      
        notificacao.adicionarClasse(classe);
        
        return notificacao;
    },
    
    /**
     * Responsável por mostrar o box
     * 
     * @param string tipo
     * @param string texto
     */
    _show : function( tipo, texto ){
        var box = this._getBox( tipo, texto );
            box.mostrar();
        
        new Superlogica_Js_Elemento(window.document).simularEvento('scroll');
        new Superlogica_Js_Elemento(window).simularEvento('resize');
        
        setTimeout(function(){
            box.esconder(true, function(){
                new Superlogica_Js_Elemento(this).remover();
            });
        }, this._tempoAberto );
        
    },
    
    /**
     * Função chamada para mostrar o box
     * 
     * @param string msg
     */
    show : function( msg ){
        if ( !msg )
            msg = this.getMsg();
        this._show( 'info', msg );
    }
        
});

Superlogica_Js_Notificacao.atualizarPosicoes = function( distanciaTopo ){
    var notificacao = new Superlogica_Js_Elemento("div.Superlogica_Js_Notificacao");
    var conteudo = new Superlogica_Js_Elemento("#conteudo");
    var paddingTopo = parseFloat( (conteudo.css('padding-top')+"").replace('px','') );
    var marginTopo = parseFloat( (conteudo.css('margin-top')+"").replace('px','') );
    
    if ( isNaN(marginTopo)) marginTopo = 0;
    if ( isNaN(paddingTopo)) paddingTopo = 0;
    notificacao.css({'top': conteudo.posicao().topo + distanciaTopo +paddingTopo+marginTopo });
};

new Superlogica_Js_Elemento(window.document).bind('scroll.Superlogica_Js_Notificacao', function(){
    var elemento = this;
    var timeoutPosicaoNotificacao = elemento.getDados('timeoutPosicaoNotificacao');
    if ( timeoutPosicaoNotificacao ) return true;
    timeoutPosicaoNotificacao = setTimeout( function(){
        
        elemento.setDados('timeoutPosicaoNotificacao', null );
        var conteudo = new Superlogica_Js_Elemento("#conteudo");
        var notificacao = new Superlogica_Js_Elemento("div.Superlogica_Js_Notificacao");
        if ( notificacao.contar() <= 0 )
            return true;

        if( conteudo.contar() <= 0)
            conteudo = new Superlogica_Js_Elemento('body');
        var distanciaTopo = conteudo.posicao().topo;
        var scrollTopo = elemento.scrollTopo();
        if (  scrollTopo > distanciaTopo ){
            Superlogica_Js_Notificacao.atualizarPosicoes( scrollTopo - distanciaTopo );
        }
        
    }, 100 );
    elemento.setDados('timeoutPosicaoNotificacao', timeoutPosicaoNotificacao );
});
new Superlogica_Js_Elemento(window).bind('resize.Superlogica_Js_Notificacao', function(){
    var notificacao = new Superlogica_Js_Elemento(".Superlogica_Js_Notificacao");
    var documento = new Superlogica_Js_Elemento(window.document);
    var larguraTela = documento.largura();
    notificacao.css({
        'left' : (larguraTela/2) - (notificacao.largura()/2)
    });
});

