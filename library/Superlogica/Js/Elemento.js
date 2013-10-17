/* 
 * Representa um ou mais elementos da página
 * 
 */
var Superlogica_Js_Elemento = new Class({

    /**
     * Elemento jQuery utilizado pela classe
     * @var jQuery
     */
    $_elemento : null,
    
    /**
     * Array com dados da classe instanciada
     * @var object
     */
    _data : {},
    
    /**
     * Objeto com atributos do elemento instanciado na classe
     * @var object
     */
    _atributos : {},
    
    /**
     *  Cria o elemento
     *
     * @param  elemento aceita os mesmos parametros que o jQuery
     */
    initialize : function( elemento, contexto ){
        this.setElemento(elemento, contexto);
    },

    /**
     *  Altera o elemento
     *
     * @param elemento aceita os mesmos parametros que o jQuery
     */
    setElemento: function( elemento, contexto ){
        
        if ( !elemento ) return false;

        if (instanceOf(elemento, Superlogica_Js_Elemento )){
            elemento = elemento.$_elemento;
        }        
        this.$_elemento = jQuery(elemento, contexto);
        
    },
    
    /**
     *  Seleciona o conteudo do elemento
     *
     * @return Superlogica_Js_Elemento
     */
    selecionar: function(){       
        this.$_elemento.select(); 
        return this;
    },        

    /**
     * Retirar a invisibilidade e mostrar o elemento
     *
     * @return object
     */
    mostrar : function( fade ){
        if ( fade ){
            delete arguments[0];
            var args = [];
            Object.each ( arguments, function(valor){args.push(valor);});
            this.$_elemento.fadeIn.apply( this.$_elemento, args );
        }else
            this.$_elemento.show().removeClass('blocoEscondido blocoInvisivel');
        return this;
    },

    /**
     * Retirar a visibilidade e mostrar o elemento
     *
     * @return Superlogica_Js_Elemento
     */
    esconder: function( fade ){
        if ( fade ){
            delete arguments[0];
            var args = [];
            Object.each ( arguments, function(valor){args.push(valor);});
            this.$_elemento.fadeOut.apply( this.$_elemento, args );
        }else
            this.$_elemento.hide().addClass('blocoEscondido');    
        return this;
    },
    
    /**
     * Retorna o elemento mais próximo pra cima na arvoré do DOM
     * Semelhante a closest do jquery
     * @param string seletor
     */
    maisProximo : function( seletor ){
        return new Superlogica_Js_Elemento( this.$_elemento.closest( seletor ) );
    },

    /**
     * Alterna entre visivel e invisivel
     *
     * @return Superlogica_Js_Elemento
     */
    trocarVisibilidade: function(){
        if (this.visivel()){
            return this.esconder();
        }
        return this.mostrar();
    },

    /**
     * Descobre se o elemento esta visivel
     *
     * @return boolean
     */
    visivel: function(){
        return this.$_elemento.is(':visible');
    },

    /**
     * Filtra apenas o primeiro item da seleção
     * Semelhando a jQuery().first()
     *
     * @return Superlogica_Js_Elemento
     */
    primeiro : function(){
        this.$_elemento = this.$_elemento.first();
        return this;
    },

    /**
     * Retorna uma instancia da classe do próximo elemento
     * 
     * @return Superlogica_Js_Elemento
     */
    proximo : function(){
        return new Superlogica_Js_Elemento( this.$_elemento.next() );
    },
    
    /**
     * Retorna uma instancia da classe do próximo elemento
     * 
     * @return Superlogica_Js_Elemento
     */
    anterior : function(){
        return new Superlogica_Js_Elemento( this.$_elemento.prev() );
    },

    /**
     * Simula o evento de 'focus' no elemento atual
     *
     * @return Superlogica_Js_Elemento
     */
    focar : function(){
        this.$_elemento.focus();
        return this;
    },
    
    /**
     * Retorna ou altera o atributo
     *
     * @param nome do atributo
     * @param valor opcional, se passar o valor do atributo será alterado
     * @return string|Superlogica_Js_Elemento
     */
    atributo: function(nome, valor){
        var retorno = this._atributos[nome];
        
        if ( !valor && retorno )
            return retorno;

        if ( valor )
            this._atributos[nome] = valor;
                
        retorno = this.$_elemento.attr(nome, valor);
        
        /**
         * DESCOMENTAR QUANDO VERSÃO DO JQUERY FOR SUPERIOR A 1.6
         * http://api.jquery.com/attr/
         * 
         * Foi alterado o comportamento da função attr. Após a versão 1.6, quando o atributo não
         * existir ele retornar 'undefined', e antes retornava uma string vazia.
         * 
         * Isso causou muitos conflitos quando estava testando e encontrei a solução adicionando a fução prop
         * com o método prop ele retornar uma string vazia mesmo não existindo o atributo.
         * 
         * Esse método foi criado exatamente para suprir esse necessidade que o attr causou.
         * 
         */
        
        if ( this.$_elemento.prop && !valor && !retorno )
            return this.$_elemento.prop(nome);
        
        if (!valor){
            return retorno;
        }
        return this;
    },

    /**
     * Remove o atributo informado do elemento
     * 
     * @param string nome
     * @return Superlogica_Js_Elemento
     */
    removerAtributo : function( nome ){
        delete this._atributos[nome];
        this.$_elemento.removeAttr( nome );
        return this;
    },
    
    /**
     * Retorna o nome da TAG do elemento selecionado
     * @return string
     */
    tagName : function(){
        var elemento = this.$_elemento.get(0);
        if ( !elemento ) return "";
        return elemento.nodeName;
    },

    /**
     * Retorna o conteudo HTML do elemento ou substitui o conteudo já existente pelo informado
     * Igual a .html() do jQuery
     * @param string OPCIONAL html
     * @return string
     */
    conteudo : function( html ){
    	if ( instanceOf( html, Superlogica_Js_Elemento ) ){
    		html = html.$_elemento;
    	}
        var retorno = this.$_elemento.html( html );
        if ( !html )
            return retorno;
        return this;
    },

    /**
     * Retorna um array de itens, que estavam separados por espaço, do atributo informado
     *
     * @param nome do atributo
     * @param valor opcional, se passar o valor do atributo será alterado
     * @return string|Superlogica_Js_Elemento
     */
    atributoToArray: function( nome ){
        var retorno = this.atributo( nome );
        return typeof retorno == 'string' ? retorno.split(' ') : [];
    },

    /**
     * Faz uma busca e retorna os elementos 
     *
     * @param query
     * @return Superlogica_Js_Elemento
     */
    encontrar: function (query){
        var $retorno = jQuery(query, this.$_elemento);
        if ($retorno.size() > 0 ){
            return new Superlogica_Js_Elemento($retorno);
        } else{
            return null;
        }
    },
      
    /**
     * Utilizada para filtrar os elementos atuais do jQuery conforme uma query css
     * @param string query Seletor para ser filtrado
     * @return Superlogica_Js_Elemento
     */
    filtrar : function( query ){
        return new Superlogica_Js_Elemento( this.$_elemento.filter(query) );
    },


    /**
     * Faz uma busca e retorna os elementos
     * O mesmo que jQuery.size();
     *
     * @return int
     */
    contar : function (){
        if ( this.$_elemento )
            return this.$_elemento.size();
        return 0;
    },


    /**
     * Verifica se o elemento é de um tipo
     * O mesmo que jQuery.is()
     * @param string query
     * @return boolean
     */
    eh: function (query){
        return this.$_elemento.is(query);

    },



    /**
   *  Adiciona o evento aoCarregar ao formulário
   *
   *   uso: <form aoCarregar='nomeDaFuncao nomeDeOutraFuncao' >
   *
   *    Superlogica_Js_Elements.implements({ nomeDaFuncao : function (Superlogica_Js_Elemento){}
   *
   *
   *    });
   *
   */
    _carregar : function(forcar){
        var seletor = '[comportamentos]';
        if (forcar !== true){
            seletor =  seletor + ':not([carregado])';
        }
        var elementos =  this.encontrar(seletor);
        
        if ( !elementos ) return null;
        var referencia = this;
        var metodoAposCarregar = {};
        // Comportamentos
        elementos.emCadaElemento(function(){
            var elemento = new Superlogica_Js_Elemento(this);
            var comportamentos = elemento.atributo('comportamentos');
            if ( !comportamentos ) return true;
            referencia.processarComportamento.apply(referencia, [ elemento, comportamentos ] );
        });
        
        // Eventos apos carregar
        elementos.emCadaElemento(function(){
            var metodoAposCarregar = this.atributo('aposCarregar');
            if ( !metodoAposCarregar )
            	return true;
            referencia.processarComportamento.apply(this, [ this, metodoAposCarregar ] );
        });
    },

    processarComportamento : function( elemento, comportamentos ){
        if ( !comportamentos )
            comportamentos = elemento.atributo('comportamentos');

        if ( !comportamentos ) return true;

        Object.each( comportamentos.split(' '), function( comportamento ){
            var classElemento = elemento;
            var arrComportamento = comportamento.split('.');
            if( arrComportamento.length > 1 && typeof arrComportamento[0] == 'string' ){
                if ( instanceOf( window[arrComportamento[0]], Class )){
                    classElemento = new window[arrComportamento[0]]( elemento );
                }else{
                    classElemento = new window["Superlogica_Js_"+arrComportamento[0].capitalize() ]( elemento );
                }
                comportamento = arrComportamento[1];
            }
            if ( instanceOf( window[comportamento], Class ) ){
                var instancia = new window[comportamento]( elemento ).carregarComportamentos();
            }else{
                var nomeDaFuncao = '__' + comportamento;
                if ( typeof classElemento[nomeDaFuncao] == 'function')
                    classElemento[nomeDaFuncao]( elemento, this );
            }
            
            
            
            elemento.atributo('carregado','sim');
        }, this);
    },

    /**
     * Responsável por carregar os comportamentos da classe
     *
     * @param boolean flag Passado true para carregar todos comportamentos novamente, inclusive os que já foram carregados
     */
    carregarComportamentos : function( forcar ){
        this._carregar( forcar );
        return this;
    },

    /**
    * Executa um função em cada elemento
    * O mesmo que jQuery.each();
    * @TODO alterar contexto do callback para Superlogica_Js_Elemento
    * @param callBack
    */
    emCadaElemento : function( callBack ){
        if ( this.$_elemento ){
            this.$_elemento.each( function(){
                var referencia = new Superlogica_Js_Elemento(this);
                var retorno = callBack.apply( referencia, arguments );
                if ( typeof retorno != 'undefined')
                    return retorno;
            });
        }
        return this;
    },

    /**
     * Executa um função em cada elemento filho do $_elemento
     * O mesmo que jQuery.children().each();
     * @TODO alterar contexto do callback para Superlogica_Js_Elemento
     * @param callBack
     */
    emCadaElementoFilho : function( callBack ){
        this.$_elemento.children().each( callBack );
    },

    /**
     * Clona uma tag e altera o id da tag criado pelo id informado na função.
     *
     * @param string IdNovaTag Id da nova tag
     * @return Superlogica_Js_Elemento
     */
    clonar : function ( IdNovaTag){
        var idAntigo = this.atributo('id');
        var $clone = this.$_elemento.clone( false );
        var novoElemento = new Superlogica_Js_Elemento($clone);
        var elementosComId = novoElemento.encontrar('[id]');
        
        if ( elementosComId ){
        	
            elementosComId.emCadaElemento(function(){
            	var id = this.atributo('id'); 
                if ( id ){
                    var prefixoId = IdNovaTag;
                    if ( typeof prefixoId == 'undefined'){
                        prefixoId = new String( (Math.random()*Math.random()) ).replace('.','');
                    }
                    this.atributo('id', prefixoId + "-" + id );
                    
                    this.atributo( 'prefixoid', prefixoId );
                }
            });
        }
        var elementosComDivId = novoElemento.encontrar('[divid]');

        if ( elementosComDivId ){
            elementosComDivId.emCadaElemento(function(){
                var elemento = new Superlogica_Js_Elemento( this );
                var divId = elemento.atributo('divid');
                if ( divId ){
                    var prefixoId = IdNovaTag;
                    if ( typeof prefixoId == 'undefined'){
                        prefixoId = new String( (Math.random()*Math.random()) ).replace('.','');
                    }
                    elemento.atributo( 'prefixoid', prefixoId );
                }
            });
        }
        if ( IdNovaTag )
            novoElemento.atributo('id', IdNovaTag+'-'+idAntigo);
        
        novoElemento._carregar(true);
        return novoElemento;
    },

    /**
     * Adiciona ou remove a classe informado do elemento
     */
    alternarClasse : function(classe){
        this.$_elemento.toggleClass(classe);
        return this;
    },
    
   /**
    * Adciona uma classe ao elemento
    *
    * @param string
    */
    adicionarClasse: function(classe){
        this.$_elemento.addClass(classe);
        return this;
    },

    /**
     * Adciona html no final do elemento
     *
     * @param string html
     * @param Superlogica_Js_Elemento
     */
    adicionarHtmlAoFinal : function( html ){
        if ( instanceOf( html , Superlogica_Js_Elemento ))
            this.$_elemento.append( html.$_elemento );
        else
            this.$_elemento.append( html );
        return this;
    },


    /**
     * Adciona html no inicio do elemento
     *
     * @param string html
     * @param Superlogica_Js_Elemento
     */
    adicionarHtmlAoInicio : function(html){
        if ( instanceOf( html, Superlogica_Js_Elemento)){
            html = html.$_elemento;
        }
        this.$_elemento.prepend(html);
        return this;
    },


    /**
     * Adciona os elementos antes de outro
     *
     * @param Superlogica_Js_Elemento
     */
    adicionarAoInicioDe: function(elemento){
        this.$_elemento.prependTo(elemento.$_elemento);
        return this;
    },

    /**
     * Adciona os elementos depois de outro
     *
     * @param Superlogica_Js_Elemento
     */
    adicionarAoFinalDe: function(elemento){
        this.$_elemento.appendTo(elemento.$_elemento);
        return this;
    },

    /**
     * Insere o elemento atual depois do elemento informado como parametro
     *
     * @param Superlogica_Js_Elemento
     * @return Superlogica_Js_Elemento
     */
    inserirDepoisDe : function( elemento ){
        this.$_elemento.insertAfter( elemento.$_elemento );
        return this;
    },

    /**
     * Insere o elemento/HTML passado depois do elemento atual
     * @param Superlogica_Js_Elemento|string
     * @return Superlogica_Js_Elemento
     */
    inserirDepois : function( html ){
        if ( instanceOf( html , Superlogica_Js_Elemento )){
            html = html.$_elemento;
        }
        this.$_elemento.after( html );
        return this;
    },

    /**
     * Insere o elemento atual depois do elemento informado como parametro
     *
     * @param Superlogica_Js_Elemento
     * @return Superlogica_Js_Elemento
     */
    inserirAntesDe : function( elemento ){
        this.$_elemento.insertBefore( elemento.$_elemento );
        return this;
    },
    
    envolverTudo : function( html ){
    	if ( instanceOf(html, Class)){
    		html = html.$_elemento;
    	}
    	this.$_elemento.wrapAll( html );
    	return this;
    },

    /**
     * Adiciona o elemento informado dentro do elemento selecionado na classe
     * envolvendo todos elementos filhos
     */
    envolverDentro : function( html ){
    	if ( instanceOf(html, Class)){
    		html = html.$_elemento;
    	}
    	this.$_elemento.wrapInner( html );
    	return this;
    },

    /**
     * Retorna um objeto com os ventos do elemento atual
     * @return object
     */
    getEventos : function(){
        var events = jQuery.data( this.$_elemento[0], 'events' );
        return events ? events : {};
    },
    
    /**
     * Retorna apenas o callback de um evento específico informado em 'tipo'
     * @return false|object
     */
    getEvento : function(tipo){
        return this.getEventos()[tipo];
    },
    
    /**
     * Simula o evento change para executa função em onChange
     *
     *
     **/
    simularAlteracao: function(){
            return this.simularEvento('change');
    },

    /**
     * Simula o evento click para executa função em onChange
     *
     **/
    simularClique: function(){
        return this.simularEvento('click');
    },

    /**
     * Simula o evento informado e passa os parametrosExtras para o ouvinte do evento
     * 
     * @param string tipo
     * @param object parametrosExtras
     * @return Superlogica_Js_Elemento
     */
    simularEvento : function( tipo, parametrosExtras){
        this.$_elemento.trigger( tipo, parametrosExtras );
        return this;
    },

    /**
     * Aplica css ao elemento
     * 
     * @param object options Array com atributos a serem setados
     * @return Superlogica_Js_Elemento
     */
    css : function(options){
        var retorno = this.$_elemento.css.apply( this.$_elemento, arguments );
        if ( retorno != this.$_elemento )
            return retorno;
        return this;
    },
    
    /**
     * Executa uma animação com o elemento de acordo com os parametros informados
     * 
     * @param object properties Array com propriedades CSS para animar o elemento
     * @param integer duration Duração da animação
     * @param string easing Nome da função de abrandamento
     * @param function complete Função chamada ao término da animação
     * @return Superlogica_Js_Elemento
     */
    animar : function( properties, duration, easing, complete ){
        this.$_elemento.animate(properties, duration ,easing,complete);
        return this;
    },

    /**
     * Informa aposição de topo e esquerda do elemento
     *
     */
    posicao : function(){
        var offset = this.$_elemento.offset();
        return {'topo' : offset.top, 'esquerda' : offset.left};
    },
    
    /**
     * Retorna a distancia, em px, do scroll em relação ao topo do elemento
     * 
     * @return integer
     */
    scrollTopo : function(){
        return this.$_elemento.scrollTop();
    },
    
    /**
     * Retorna a distancia, em px, do scroll em relação ao topo do elemento
     * 
     * @return integer
     */
    scrollEsquerda : function(){
        return this.$_elemento.scrollLeft();
    },
    

    /**
     * Informa a largura do elemento
     *
     */
    largura : function(){
        return this.$_elemento.width.apply(this.$_elemento,arguments);
    },
    
    /**
     * Retorna a largura total contando com margens e paddings
     * @return float
     */
    larguraTotal : function(){
        return this.largura() + this.larguraComMargens() + this.larguraComPaddings();
    },
    
    /**
     * Retorna a largura total contando com margens
     * @return float
     */
    larguraComMargens : function(){
        var cssMargins = parseInt(this.css('margin-left').replace('px'),10) + parseInt( this.css('margin-right').replace('px'), 10 );
        return this.largura() + cssMargins;
    },
    
    /**
     * Retorna a largura total contando com margens
     * @return float
     */
    larguraComPaddings : function(){
        var cssPaddings = parseInt(this.css('padding-left').replace('px'),10) + parseInt( this.css('padding-right').replace('px'), 10 );
        return this.largura() + cssPaddings;
    },

    /**
     * Informa a altura do elemento
     *
     */
    altura : function(){
        return this.$_elemento.height();
    },
    
    /**
     * Informa a altura do elemento com paddings
     *
     */
    alturaComPaddings : function(){
        var cssPaddings = parseInt(this.css('padding-top').replace('px'),10) + parseInt( this.css('padding-bottom').replace('px'), 10 );
        return this.$_elemento.height() + cssPaddings;
    },

    /**
     * Retorna o atributo nome do data
     *
     * @param string nome Nome do atributo.
     * @return string Conteúdo do atributo.
     */
    getDados: function (nome){
        var dados = this._data[nome];
        if ( !dados )
            dados = this.$_elemento.data(nome);
        
        if ( typeof dados == 'undefined' ) return null;
        return dados;
    },
    

    /**
     * Insere um atributo nome no data.
     *
     * @param string nome Nome do atributo.
     * @param string valor Valor a ser inserido no atributo nome.
     *
     * @return Superlogica_Js_Elemento this
     */
    setDados: function (nome, valor){
        this._data[nome] = valor;
        this.$_elemento.data(nome, valor);
        return this;
    },
    
    /**
     * Retorna as opções
     * 
     * @return mixed
     */
    getOpcoes : function(){
        return this.getDados('opcoes');
    },
    
    /**
     * Retorna uma única opção
     * 
     * @return mixed
     */
    getOpcao : function( nome ){
        return this.getOpcoes()[nome];
    },
    
    /**
     * Retorna o data
     */
    getData : function(){
        return this.getDados("data");
    },

    /**
     * Seta os dados do elemento atual
     * 
     * @param array data 
     */
    setData : function( data ){
        return this.setDados("data", data);
    },

    /**
     * Seta uma opção ao elemento atual
     * 
     * @param string opcao
     * @param mixed data
     */
    setOpcao : function(opcao, data ){
        var opcoes = this.getDados('opcoes');
        opcoes[opcao] = data;
        this.setDados( 'opcoes', opcoes );
    },
    
    /**
     * Insere um evento ao elemento
     * o mesmo que jQuery.bind
     *
     * @param string evento
     * @param function valor Valor a ser inserido no atributo nome.
     *
     * @return Superlogica_Js_Elemento this
     */
    bind: function (evento, callBack){
        var referencia = this;
        this.$_elemento.bind(evento,
            function(){
                referencia.setElemento( this );
                callBack.apply( referencia, arguments );
            }
            );
        return this;
    },
    
    /**
     * Remove um evento adicionado ao elemento
     * Se não informado parametro ele remove todos eventos adicionados
     * 
     * @param string|null evento
     * @return Superlogica_Js_Elemento
     */
    unbind : function( event ){
        this.$_elemento.unbind( event );
        return this;
    },
    
    /**
     * Delega um evento ao elemento atual para o seletor informado
     * 
     * Mais informações
     * @see http://api.jquery.com/delegate/
     * 
     * @param string seletor
     * @param string evento
     * @param function callback
     * @return Superlogica_Js_Elemento
     */
    delegate : function(){
        
        var callbackArg = 2;
        var callback;
        var referencia = this;
        
        if  ( typeof arguments[3] == 'function' )
            callbackArg = 3;

        callback = arguments[callbackArg];
        arguments[callbackArg] = function(){
            referencia.setElemento(this);
            callback.apply( referencia, arguments );
        };

        this.$_elemento.delegate.apply( this.$_elemento, arguments );
        return this;
        
    },
    
    /**
     * Remove um evento delegado ao elemento atual
     * Não passando nada ele remove todos eventos delegados
     * 
     * Mais informações
     * @see http://api.jquery.com/undelegate
     * 
     * @param string OPCIONAL seletor
     * @param string OPCIONAL evento
     * @param function OPCIONAL callback
     * @return Superlogica_Js_Elemento
     */
    undelegate : function(){
        this.$_elemento.undelegate.apply( this.$_elemento, arguments );
        return this;
    },

    /**
     * Remove o elemento do DOM
     * Semelhante a jQuery().remove()
     */
    remover : function(){
        this.$_elemento.remove();
    },

    /**
   * Remove uma classe do elemento
   *
   * @param callBack
   */
    removerClasse: function(classe){
        this.$_elemento.removeClass(classe);
        return this;
    },

    /**
     * Verifica se a classe informada existe no elemento selecionado
     * 
     * @param string classe
     * @return boolean
     */
    temClasse : function( classe ){
        return this.$_elemento.hasClass( classe );
    },


    
    /**
     * Retorna o nome da Tag do elemento
     * @return string
     */
    getNomeElemento : function(){
        if( typeof this.$_elemento[0] !='undefined' && typeof this.$_elemento[0].nodeName != 'undefined' )
            return this.$_elemento[0].nodeName.toLowerCase();
        else
            return "";
    },
            
    /**
     * Troca a variavel pelo valor informado no HTML do elemento
     * 
     * @param string variavel
     * @param string valor
     * @return void|boolean
     */
    _replaceHtmlVar : function ( variavel, valor ){
        var totalCheckbox = 0;
        var childs = this.$_elemento[0].childNodes;
        if ( !childs )
            return true;
        var temVariavel;
        var valor;
        for ( var key in childs ){
            temVariavel = 0;
            if ( childs[key].childNodes )
                totalCheckbox = totalCheckbox + new Superlogica_Js_Elemento(childs[key])._replaceHtmlVar( variavel, valor );
            if ( childs[key].nodeType === document.TEXT_NODE ){
                temVariavel = childs[key].nodeValue.indexOf( variavel ) !== -1 ? 1 : 0
                totalCheckbox += temVariavel;
                if ( temVariavel ){
                    valor = jQuery( '<span>' + (childs[key].nodeValue.replace( variavel, valor )) + '</span>' )[0];
                    childs[key].parentNode.replaceChild( valor, childs[key] );
                }
            }
        }
        return totalCheckbox;
    },

    /**
     *
     *  PLUGINS JQUERY
     *
     */
    
    /**
     * Abre a caixa de diálog
     */
    dialogo : function(){
        var retorno = this.$_elemento.dialog.apply( this.$_elemento, arguments );
        if ( arguments.length === 1 && typeof arguments[0] == 'string'){
            return retorno;
        }
        return this;
    },

    /**
     * Seta o autocomplete no elemento
     *
     * @param object options
     * @return Superlogica_Js_Form
     */
    autocomplete : function(){
        this.$_elemento.autocomplete.apply( this.$_elemento, arguments );
        return this;
    },

    /**
     * Seta o plugin autoNumeric
     * 
     * @param object options
     */
    autoNumeric : function( options ){
        this.$_elemento.autoNumeric( options );
        return this;
    },

    hint : function( options ){        
        this.$_elemento.hint( options );
        return this;
    },
    
    imgAreaSelect : function(){
        return this.$_elemento.imgAreaSelect( arguments[0] );
    },

    /**
     * Seta o plugin de mascara
     * 
     * @param string mask
     * @param object options
     */
    mask : function( mask, options ){
        this.$_elemento.mask(mask, options);
        return this;
    },
    
    /**
     * Retira o plugin de mascara
     */
    unmask : function(){
        this.$_elemento.unmask();
        return this;
    },
    
    /**
     * Seta o plugin do datepicker
     * @param options
     */
    datepicker : function(){
        var retorno = this.$_elemento.datepicker.apply( this.$_elemento, arguments );
        if ( arguments.length === 1 && typeof arguments[0] == 'string'){
            return retorno;
        }
        return this;
    },

    /**
     * Utiliza o plugin wysiwyg
     */
    wysiwyg : function(){
        return this.$_elemento.wysiwyg.apply( this.$_elemento, arguments );
    },
    
    /**
     * Proxy para o plugin joyride
     */
    joyride : function(){
        
        if ( typeof arguments[0] == 'object' && typeof arguments[0].postStepCallback == 'string' )
            arguments[0].postStepCallback = window[arguments[0].postStepCallback];
        
        if ( typeof arguments[0] == 'object' && typeof arguments[0].postRideCallback == 'string' )
            arguments[0].postRideCallback = window[arguments[0].postRideCallback];

        return this.$_elemento.joyride.apply( this.$_elemento, arguments );
    },
    
    /**
     * Proxy para o plugin lightbox
     */
    lightbox : function(options){
        /* 
            Para utilizar deve ser adicionado o css e o js
            APPLICATION_CLIENT_TEMA_URL . '/style/jquery.lightbox-0.5.css'
            PUBLIC_PATH.'/scripts/jquery.lightbox-0.5.min.js'
        */
        this.$_elemento.lightBox( Object.merge( typeof options == 'object' ? options : {}, {
                "imageLoading" : APPLICATION_CONF.APPLICATION_CLIENT_TEMA_URL + '/img/lightbox-ico-loading.gif',
                'imageBtnClose': APPLICATION_CONF.APPLICATION_CLIENT_TEMA_URL + '/img/lightbox-btn-close.gif',
                'imageBtnPrev' : APPLICATION_CONF.APPLICATION_CLIENT_TEMA_URL + '/img/lightbox-btn-prev.gif',
                'imageBtnNext' : APPLICATION_CONF.APPLICATION_CLIENT_TEMA_URL + '/img/lightbox-btn-next.gif',
                'txtImage' : 'Imagem',
                'txtOf' : 'de'
            }) 
        );
    },
    
    /**
     *
     *
     * ***************************************************
     *            C O M P O R T A M E N T O S
     * ***************************************************
     *
     *
     */

    /**
        * Se um elemento contiver esse comportamento, ao clicar sobre ele
        * a visibilidade será alterada da classe/id informada no atributo "divclass"/"divid", respectivamente ou dele própria, se nehuma das 2
        * Se DivId e DivClass tiverem valor, procurará os DivClass dentro do DivId
        * Além disso todos os divs com classe definida por 'divclassgrupo' também
        * vão perder a visibilidade
        *
        * @atributo divclass
        * @atributo divid
        * @atributo prefixoId
        * @atributo divclassgrupo
        * 
        * @param Superlogica_Js_Elemento
        *
        */
    __cliqueAlteraVisibilidade: function(elemento, contexto){
        
        this.bind('click', function(evento){
            
            evento.preventDefault();
            var alvo = null;
            var encontrou = false;

            //DivClassGrupo
            var divClassGrupo = this.atributo('divclassgrupo');
            if ( divClassGrupo ){
                alvo = contexto.encontrar('.'+divClassGrupo);
                if (alvo != null){
                    alvo.esconder();
                }
            }

            ['idexibir', 'classexibir', 'idesconder', 'classesconder'].each( function( item ){
                var exibirElemento = this.atributo( item );
                if ( typeof exibirElemento != 'undefined' ){
                    alvo = new Superlogica_Js_Elemento( ( item.indexOf('id') !== -1 ? '#' : '.' ) + exibirElemento );
                    if ( alvo ){
                        encontrou = true;
                        alvo[ item.indexOf('esconder') !== -1 ? 'esconder' : 'mostrar' ]();
                    }
                }
            }, this );

            if (encontrou) return ;
            
            //DivId
            var id = this.atributo('divid');
            var seletorMaisProximo = this.atributo('maisProximo');
            var divClass = this.atributoToArray('divclass');            
            if ( id || seletorMaisProximo ){
                encontrou = true;
                var prefixoId = this.atributo('prefixoId');
                if ( typeof prefixoId != 'undefined'){
                    id = prefixoId+'-'+id ;
                }
                if ( id && !seletorMaisProximo )
                    alvo = new Superlogica_Js_Elemento('#' + id);
                else
                    alvo = this.maisProximo( seletorMaisProximo );
                
                if (alvo != null){                    
                    if ( divClass.length == 0 ){
                        alvo.trocarVisibilidade();
                    } else {
                        Object.each( divClass, function( seletor ){
                            var alvo2 = alvo.encontrar( '.'+seletor );
                            if (alvo2 != null){
                                alvo2.trocarVisibilidade();
                            }
                        });
                                

                    }
                }

            }
            if (encontrou) return ;

            //DivClass                    
            if ( divClass ){
                encontrou = true;
                alvo = contexto.encontrar( '.' + divClass );
                if (alvo != null){
                    alvo.trocarVisibilidade();
                }
            }
            if (encontrou) return ;
                        

            // se não tiver atributos DivClass ou DivId, esconde a si mesmo
            this.esconder();
        });

    },
    
    /**
     * Alterna visibilidade do link como o form.
     * 
     * @param Superlogica_Js_Elemento
     *
     */
    __alternarVisibilidadeComForm : function(elemento, _classe){
    	var referencia = this;
    	var prefixoId = this.atributo('prefixoid');
    	var id = ( prefixoId ?  prefixoId + '-' : "" ) + this.atributo('divid');
		var _formulario = new Superlogica_Js_Elemento( '#' + id.replace(/%/g,'\\%') );
    	
    	if ( !_formulario ) return ;
    	
    	var formulario = _formulario.encontrar( "form" );
    	
    	if ( !formulario )
    		formulario = _formulario;
    	
    	
    	var fechar = formulario.encontrar('.fechar');
    	
    	if ( !fechar ) return;
    
    	fechar.bind('click', function(){
    		referencia.trocarVisibilidade();
		});
    	
    	formulario.atributo( 'aposSubmeter', (formulario.atributo('aposSubmeter') ? formulario.atributo('aposSubmeter')+" " : "" ) + 'aposSubmeterComSucessoFechar');
    	
    	this.bind('click', function(evento){
			 evento.preventDefault();	 
			 this.trocarVisibilidade();
			 formulario.focar();
		});
    },
       
    /**
     * Verifica se esta em ambiente local
     */
    __verificarHost : function(){

        this.bind('click', function(evento){
            var location = new Superlogica_Js_Location();
            if(location.naIntranet()){
                
                if( !confirm('Ops... Aparentemente seu servidor esta em sua intranet e não pode ser acessado pelos clientes. Continuar mesmo assim?') ){
                    evento.preventDefault();
                    evento.stopPropagation();
                    evento.stopImmediatePropagation();
                    return false;
                
                }
                
            }
        });
    },
        
    
    __imprimir: function(){
        this.bind('click', function(event){            
            event.preventDefault();
            elemento= new Superlogica_Js_Elemento(this);            
            
            var location= new Superlogica_Js_Location();            
            
            location.setApi(!elemento.atributo('download'))
                    .setParam('render','pdf')
                    .setParam('impressora',elemento.atributo('idImpressora'))
                    .setParam('download',elemento.atributo('download'));
                      
            var formulario = new Superlogica_Js_Form_Elementos(this).getForm();
            var fechar = formulario.encontrar('#fechar');
            fechar.simularEvento('click');
            if (!elemento.atributo('download')){
                var request = new Superlogica_Js_Request( location );
                request.enviarAssincrono(function(response){ 
                    if (!response.isValid()){
                        alert(response.msg);
                    }
                });  
            }else{
                window.open(location.toString(),'_blank','');
            }
           
            return true;
        });
    },

    __configurarImpressao : function(){
        if (!(navigator.platform=='Win32')){            
            var elemento = new Superlogica_Js_Form_Elementos(this).encontrar('a');
            var elementoLinha= elemento.maisProximo('li');
            elementoLinha.conteudo(elemento.conteudo());            
            return true;            
        }       
            
        this.bind('click', function(event){            
                event.preventDefault();
                
                var formulario = new Superlogica_Js_Form_Elementos(this).getForm();                
                var displayConfigurarImpressao= formulario.getDisplayGroup("DISPLAY_CONFIGURARIMPRESSAO");                
                displayConfigurarImpressao.mostrar(); 
        });
    }  
});


