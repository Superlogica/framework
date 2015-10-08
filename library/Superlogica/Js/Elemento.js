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

        // caso tenha popover de notificação então mostra novamente
        if ( this.temClasse('hasPopoverNotificar') ){
            this.popover('show');
        }else if ( this.temClasse('item') ){
            var elementoPopover = this.encontrar('.hasPopoverNotificar');
            if ( elementoPopover ){
                elementoPopover.emCadaElemento(function(){
                    this.popover('show');
                });
            }
        }
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

        // caso tenha popover de notificação então remove
        if ( this.temClasse('hasPopoverNotificar') ){
            this.popover('hide');
        }else if ( this.temClasse('item') ){
            var elementoPopover = this.encontrar('.hasPopoverNotificar');
            if ( elementoPopover ){
                elementoPopover.emCadaElemento(function(){
                    this.popover('hide');
                });
            }
        }

        return this;
    },
    
    /**
     * Retorna o elemento mais próximo pra cima na arvoré do DOM
     * Semelhante a closest do jquery
     * @param string seletor
     */
    maisProximo : function( seletor ){
        if(typeof seletor == 'undefined'){
            return new Superlogica_Js_Elemento( this.$_elemento.parent() );
        }
            
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
        
        if ( nome == 'checked' && typeof valor != 'undefined' && valor == ''){
            valor = false;
        }

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
            if ( retorno == 'checked' )
                return true;
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
        if ( 
            query.indexOf(':visible') !== -1
            && (
                this.$_elemento.is('input[type="checkbox"]')
                || this.$_elemento.is('input[type="radio"]') 
            )
        ){
            var item = this.maisProximo('.item');
            if ( item )
                return item.eh(query);
        }

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
        
        var elementosWysiwyg = this.encontrar('textarea.editorHtml');
        if ( elementosWysiwyg ){
        	
            elementosWysiwyg.emCadaElemento(function(){
                
                var elementoEditor = new Superlogica_Js_Form_Elementos( this );
                elementoEditor.wysiwyg('destroy');
            });
        }
        
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
                    
                    if ( this.eh('input') ){ // Só realiza as alterações do label caso campo que tenho id seja um input
                        var labelsDeMesmoId = novoElemento.encontrar("label[for='"+id+"']");                    
                        if ( labelsDeMesmoId && labelsDeMesmoId.contar() ){
                            labelsDeMesmoId.emCadaElemento(function(){
                                this.atributo('for', prefixoId + "-" + id );
                            })
                        }
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
    scrollTopo : function( valor ){
        
        if (  isNaN(valor) ){
            return this.$_elemento.scrollTop();
        }
        
        this.$_elemento.scrollTop( valor )
        return this;
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
     * @TODO deve desconsiderar valores negativos
     * @return float
     */
    larguraTotal : function(){
        var cssBorders = parseFloat(this.css('border-left-width').replace('px'),10) + parseFloat( this.css('border-right-width').replace('px'), 10 );
        var cssMargins = parseFloat(this.css('margin-left').replace('px'),10) + parseFloat( this.css('margin-right').replace('px'), 10 );
        var cssPaddings = parseFloat(this.css('padding-left').replace('px'),10) + parseFloat( this.css('padding-right').replace('px'), 10 );
        return this.largura() + cssPaddings + cssMargins + cssBorders;
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
     * Retorna a altura contando margends, paddings e bordas
     * @TODO deve desconsiderar valores negativos
     * @return float
     */
    alturaTotal : function(){
        var cssBorders = parseFloat(this.css('border-top-width').replace('px'),10) + parseFloat( this.css('border-bottom-width').replace('px'), 10 );
        var cssMargins = parseFloat(this.css('margin-top').replace('px'),10) + parseFloat( this.css('margin-bottom').replace('px'), 10 );
        var cssPaddings = parseFloat(this.css('padding-top').replace('px'),10) + parseFloat( this.css('padding-bottom').replace('px'), 10 );
        return this.$_elemento.height() + cssPaddings + cssMargins + cssBorders;
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
     * Insere um evento ao elemento só que antes dos eventos do mesmo tipo já inseridos anteriormente
     * @param string evento
     * @param function valor Valor a ser inserido no atributo nome.
     *
     * @return Superlogica_Js_Elemento this
     */
    prependBind : function (evento, callBack){
        this.emCadaElemento(function(){

            // array com todos eventos atrelados ao elemento
            var eventos = this.$_elemento.data('events');

            // caso não tenha nenhum evento então somente adiciona o evento informado
            if ( !eventos )
                return this.bind( evento, callBack );
            
            var _evento = evento.split('.');
            var eventoNome = _evento[0];
            var eventoNamespace = _evento[1];
            
            var handlersOrdenados = [{ 'handler' : callBack, 'namespace' : eventoNamespace }];
            Object.each(eventos, function( handlers, tipo){
                if ( tipo.toLowerCase() != eventoNome.toLowerCase() ){
                    return true;
                }
                
                // pega os eventos predefindos
                Object.each(handlers, function(handlerInfo){
                    if ( !handlerInfo.handler ) return true;

                    // remove todos eventos anteriores
                    this.unbind( tipo + ( handlerInfo.namespace ? '.'+handlerInfo.namespace : '' ) );

                    handlersOrdenados.push( { 'handler' : handlerInfo.handler, 'namespace' : handlerInfo.namespace } );
                }, this);              
                
            }, this);

            // adiciona novamente todos eventos agora na ordem correta
            Object.each(handlersOrdenados, function(eventInfo){
                this.bind( eventoNome + ( eventInfo.namespace ? '.'+eventInfo.namespace : '' ), eventInfo.handler );
            }, this);

        });

        return this;

    },
    
    /**
     * Remove um evento adicionado ao elemento
     * Se não informado parametro ele remove todos eventos adicionados
     * 
     * @param string|null evento
     * @return Superlogica_Js_Elemento
     */
    unbind : function( event, handler ){
        this.$_elemento.unbind( event, handler );
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
            if ( (childs[key].nodeType === document.TEXT_NODE) && (childs[key].nodeValue) ){
                temVariavel = childs[key].nodeValue.indexOf( variavel ) !== -1 ? 1 : 0
                totalCheckbox += temVariavel;
                if ( (temVariavel) && (childs[key].nodeValue) ){
                    valor = jQuery( '<span>' + (childs[key].nodeValue.replace( variavel, valor )) + '</span>' )[0];
                    childs[key].parentNode.replaceChild( valor, childs[key] );
                }
            }
        }
        return totalCheckbox;
    },

    /**
     * Exibe um popover de notificação no elemento atual
     * @param  {String} msg Texto a ser exibido no balão
     * @return {void}
     */
    notificar : function( msg, options ){

        if ( msg == 'fechar'){
            this.removerClasse('hasPopoverNotificar');
            this.popover('destroy');
            return true;
        }

        var elemento = this;
        var optionsPadrao = {
            'content' : msg,
            'html' : true,
            'placement' : 'top',
            'title' : function(){
                var linkClose = new Superlogica_Js_Elemento('<a href="javascript:void(0);" class="popover-close"><span class="glyphicon glyphicon-remove"></span></a>');
                linkClose.bind('click', function(){
                    elemento.popover('destroy');
                });
                return new Superlogica_Js_Elemento('<span>Aviso</span>').adicionarHtmlAoFinal(linkClose).$_elemento[0];
                
            }
        };

        this.popover( Object.merge( optionsPadrao, typeof options == 'object' ? options : {}) );

        this.popover('show');
        this.adicionarClasse('hasPopoverNotificar');
    },

    /**
     * Encapsulamento do plugin popover
     * @return {Object} Fluent Interface
     */
    popover : function(){
        if ( !this.$_elemento.popover ) return this;
        if ( typeof arguments[0] == 'object' && this.$_elemento ){
            this.$_elemento.popover('destroy'); // destroi o popover anterior pois não funcionar chamando duas vezes sem isso
            if ( !arguments[0].template ){
                var largura = arguments[0].width;
                if ( !largura ){
                    // caso a string passada seja maior que 30 caracteres então aumenta um pouco a largura do popover
                    largura = (typeof arguments[0].content=='string' && arguments[0].content.length > 30) || this.eh('input,select') ? 'medium' : '';
                }
                arguments[0].template = '<div class="popover '+(  largura ? 'popover-'+ largura : '' )+'"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
            }
            
            var elemento = this;
            
            var oldPlacement = arguments[0].placement ? arguments[0].placement : 'right';
            arguments[0].placement = function(tip, ele) {

                // altera o container do popover dinamicamente de acordo do elemento pai do elemento
                // colocado na função placement pois é a única função para a ser chamada dinamicamente
                var modalBody = elemento.maisProximo('.modal-body');
                var opcoesAtuais = elemento.$_elemento.data('bs.popover');                
                if ( !modalBody || modalBody.contar() <= 0 )
                    opcoesAtuais.options.container = 'body';
                else{
                    var idDoCorpoDoForm = 'corpoDoFormModal' + Superlogica_Js_String.numeroRandomico();
                    elemento.maisProximo('.corpoDoForm').atributo("id", idDoCorpoDoForm );
                    opcoesAtuais.options.container = '#'+idDoCorpoDoForm;
                }

                elemento.$_elemento.data('bs.popover',opcoesAtuais);

                var width = jQuery(window).width();
                var maiorLarguraDoPopover = 300; // largura do .popover-mediun (que é o mais utilizado)
                var distanciaDaEsquerda = elemento.posicao().esquerda + elemento.largura();

                var placementPadrao = oldPlacement;
                if ( distanciaDaEsquerda+maiorLarguraDoPopover > width )
                    placementPadrao = 'left';                

                return width >= 980 ? placementPadrao : ( elemento.posicao().topo < 50 ? 'bottom' : 'top' );
            };

        }


        this.$_elemento.popover.apply( this.$_elemento, arguments );

        if ( typeof arguments[0] == 'string' && arguments[0] == 'destroy' )
            this.removerClasse('hasPopover');
        else
            this.adicionarClasse('hasPopover');


        this.bind('show.bs.popover', function(){
            this.desabilitarComponenteAoScroll();
        });

        this.bind('hide.bs.popover', function(){
            this.removerEventoAoScrollComponente();
        });

        return this;
        
    },

    removerEventoAoScrollComponente : function(){
        var elemento = this;
        var tipoElementos = this.getNomeComponentes();
        if ( tipoElementos.length <= 0 ) 
            return true;

        var sufixoEvento = '';
        Object.each( tipoElementos, function(tipo){
            sufixoEvento += '_disable_' + tipo;
        });

        var corpoDoForm = elemento.maisProximo('.corpoDoForm');
        if ( corpoDoForm.contar() )
            corpoDoForm.unbind('scroll.'+sufixoEvento);
        
        new Superlogica_Js_Elemento(window).unbind('scroll.'+sufixoEvento);

    },

    desabilitarComponenteAoScroll : function(){
        var elemento = this;

        var tipoElementos = this.getNomeComponentes();
        if ( tipoElementos.length <= 0 ) 
            return true;
        
        var sufixoEvento = '';
        Object.each( tipoElementos, function(tipo){
            sufixoEvento += '_disable_' + tipo;
        });
        var desabilitarComponente = function(){
            Object.each( tipoElementos, function(tipo){
                elemento[tipo]( tipo == 'autocomplete' ? 'close' : 'hide');
            });
            this.unbind('scroll.'+sufixoEvento);
        };

        var corpoDoForm = elemento.maisProximo('.corpoDoForm');
        if ( corpoDoForm.contar() )
            corpoDoForm.bind('scroll.'+sufixoEvento, desabilitarComponente);
        new Superlogica_Js_Elemento(window).bind('scroll.'+sufixoEvento, desabilitarComponente);

    },

    getNomeComponentes : function(){
        var tipoElemento = [];

        if ( this.temClasse('hasDatepicker') ){
            tipoElemento.push('datepicker');
        }else if ( this.temClasse('slautocomplete') ){
            tipoElemento.push('autocomplete');
        }

        if ( this.temClasse('hasPopover') ){
            tipoElemento.push('popover');
        }

        return tipoElemento;
    },

    title : function( title, width ){
        this.popover({
            'content' : title, 
            'trigger' : 'hover',
            'placement' : this.atributo('hint-placement'),
            'html' : true                                                           //adicionado em 02/12/2014 por Felipe, para uso de HTML em hint
        });
        return this;
    },
    
    __hint : function(){
        var title = this.atributo('title');
        this.removerAtributo('title');
        this.title(title,'medium');
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
    
    __openDialog : function(){
        this
            .bind(
                'click',
                function(event){
                    
                    event.preventDefault();
                    var id = this.atributo('divid');                    
                    var divId = new Superlogica_Js_Elemento( '#' + id );
                    var div = divId.clonar();
                    div.openDialogo();
                }
            );
    },
    
    openDialogo : function( tituloForm, tituloAssistente, tamanhoHorizontal, tamanhoVertical, recarregarComportamentos ){
        
        if ( typeof recarregarComportamentos == 'undefined')
            recarregarComportamentos = true;
        
        if ( !tituloForm ) tituloForm = 'auto';        
        if ( !tituloAssistente ) tituloAssistente = 'auto';        
        if ( !tamanhoHorizontal ) tamanhoHorizontal = 'auto';        
        if ( !tamanhoVertical ) tamanhoVertical = 'auto';        
        
        var elementoConfiguracoesForm = this;
        var form = this;
        var focar = ( parseInt( form.atributo('focar') ) == 1 );
        if ( !elementoConfiguracoesForm.eh('form') ){
            elementoConfiguracoesForm = this.encontrar('form');
            if ( !elementoConfiguracoesForm )
                elementoConfiguracoesForm = this;
        }

        var larguraModal = '';
        if ( tamanhoHorizontal == 'min' ) larguraModal = 'modal-md';
        else if ( tamanhoHorizontal == 'max' ) larguraModal = 'modal-lg';
        else{
            
            larguraModal = 'modal-lg';
            if ( (elementoConfiguracoesForm.eh('form') || form.eh('.form_grid')) && ( !form.encontrar('.subForm') ) ) 
                larguraModal = 'modal-md';
        }
             
        var tamanhoForm = '';
        if ( tamanhoVertical == 'min' ) tamanhoForm = 'max-height';/*tamanho vertical do form*/
        else if ( tamanhoVertical == 'max' ) tamanhoForm = 'height';
        else{
            tamanhoForm = elementoConfiguracoesForm.temClasse('assistente_superlogica') ? 'height' : 'max-height';
        }
        
        var classHeader = elementoConfiguracoesForm.temClasse('assistente_superlogica') && (form.encontrar('.titleWizard') || form.encontrar('.noTitleWizard')) ? ' blocoEscondido' : '';
        if ( tituloForm != undefined ){
            
            if ( tituloForm == 1 ) classHeader = '';
            else if ( tituloForm == 0 ) classHeader = 'blocoEscondido';
        }
        
//        var classTitleWizard = elementoConfiguracoesForm.temClasse('assistente_superlogica') && (form.encontrar('.titleWizard') || form.encontrar('.noTitleWizard')) ? ' blocoEscondido' : '';
        if ( tituloAssistente != undefined ){
            
            if ( tituloAssistente == 1 ){
                form.atributo('force_titulo', '1');
            }else if ( tituloAssistente == 0 ){
                form.atributo('force_titulo', '-1');
            }
        }
        
        var btnFecharDialogo = "<button name='FECHAR_DIALOG' type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>";
        if ( parseInt(elementoConfiguracoesForm.atributo('comFechar')) === 0 ){
            btnFecharDialogo = '';
        }

        var htmlDialog = "<div class='modal' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\n\
                              <div class='modal-dialog "+ larguraModal +"'>\n\
                                  <div class='modal-content'>\n\
                                      <div class='modal-header " + classHeader + "'>"+btnFecharDialogo+"\
                                          <h4 class='modal-title' id='myModalLabel'>Modal title</h4>\n\
                                      </div>\n\
                                      <div class='modal-body'> </div>\n\
                                  </div>\n\
                              </div>\n\
                          </div>";

        var elementoDialog = new Superlogica_Js_Elemento( htmlDialog );        
        elementoDialog.encontrar('.modal-title').conteudo( elementoConfiguracoesForm.atributo('titulo') );
        elementoDialog.encontrar('.modal-body').conteudo( form );

        if ( !form.encontrar('.corpoDoForm') ){
            form.envolverTudo( "<div class='corpoDoForm'></div>" );
        }

        // Move o título do wizard pra dentro do corpo do form
        var titleWizard = form.encontrar('.titleWizard');
        if ( titleWizard ){
            var corpoDoForm = form.encontrar('.corpoDoForm');
            if ( corpoDoForm )
                corpoDoForm.adicionarHtmlAoInicio( titleWizard );
        }
        
        var btnFechar = elementoDialog.encontrar('button[name=FECHAR_DIALOG]');
        if ( btnFechar ){
            btnFechar.bind('click', function(){
                if( !instanceOf(form, Superlogica_Js_Form) ) return true;
                var elementoFechar = form.getElemento('fechar');
                if ( elementoFechar ){                
                    elementoFechar.simularClique();
                }
                return true;
            });
        }
        
        var elementoWindow = new Superlogica_Js_Elemento( window );
        elementoWindow.bind('resize.open_dialog', function(event){
            var corpoDoForm = elementoDialog.encontrar('.modal-body .corpoDoForm');
            if ( !corpoDoForm ){
                elementoWindow.unbind('resize.open_dialog');
            }
            

            if ( corpoDoForm ){
                
                var tamanhoDesconsiderar = 87;
                
                var titleHeader = elementoDialog.encontrar('.modal-header');       
                var botoesPadroesForm = form.encontrar('.botoesPadroes');         
                if ( ( titleHeader ) && ( titleHeader.eh(':visible') ) ){                    
                    tamanhoDesconsiderar = 75;
                } 
                
                if ( ( botoesPadroesForm ) && ( botoesPadroesForm.eh(':visible') ) ){
                    
                    tamanhoDesconsiderar = 65;
                    if (! ( ( titleHeader ) && ( titleHeader.eh(':visible') ) ) ){  
                        
                        tamanhoDesconsiderar = 75;
                    }
                }                
                
                var alturaPx = ( ( elementoWindow.altura() )* tamanhoDesconsiderar )/100;                
                corpoDoForm.css( tamanhoForm, alturaPx + 'px' );            
            }            
        });   

        form.removerAtributo('carregado');

        if ( recarregarComportamentos )
            form.maisProximo('.modal-body').carregarComportamentos( false );

        form.mostrar();
        
        elementoDialog.bind('show.bs.modal', function(){
            new Superlogica_Js_Elemento( 'body' ).adicionarClasse('modal-open');    
        });

        elementoDialog.bind('shown.bs.modal', function(){
            var grids = elementoDialog.encontrar('table.Superlogica_Js_Grid');
            if ( grids ){
                grids.emCadaElemento(function(){
                    var grid = new Superlogica_Js_Grid( this ).getRealInstance();
                    if ( typeof grid._aoIniciar != 'undefined')
                        grid._aoIniciar();
                });
            }
            elementoWindow.simularEvento('resize');
            setTimeout(function(){
                
                if ( focar ) {
                    
                    form.focar();
                }
            }, 400 );            
            
        });        

        elementoDialog.modal();        
        elementoDialog.bind('hide.bs.modal', function(){
            new Superlogica_Js_Elemento( 'body' ).removerClasse('modal-open');
        });
        elementoDialog.bind('hidden.bs.modal', function(){
            new Superlogica_Js_Elemento( this) .remover();
        });   
        
        return elementoDialog;
        
    },
    
    alterarTituloModal : function( titulo ){
        
        var elemento = this;
        var modalDialog = elemento.maisProximo('.modal-dialog');
        if ( modalDialog ){            
            modalDialog = new Superlogica_Js_Form_Elementos( modalDialog );
            var modalTitle = modalDialog.encontrar('.modal-title');
            if ( modalTitle ){                

                modalTitle.conteudo( titulo );
            }
        }
        
        return elemento;
    },

    fecharDialogo : function(){
        
        var elementoFechar = this.encontrar('.fechar');
        setTimeout(function(){

            if ( elementoFechar )
                elementoFechar.simularClique();
        }, 300 );
    },
    
    
    /**
     * Abre a caixa de diálog
     */
    modal : function(){

        this.$_elemento.modal({
            'keyboard': false,
            'backdrop' : 'static'
        });
        
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
        if ( mask.indexOf('*') !== -1 )
            mask = mask.replace( /\*/g, 'A');
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
    
    __replica : function(){        
        this.bind('change keyup', function(){
            if ( this.atributo("replicandoelemento") || this.atributo("replicaoff") ){
                this.removerAtributo('replicandoelemento');
                return true;
            }

            var elementoAtual = new Superlogica_Js_Form_Elementos(this);
            var valorAtual =  elementoAtual[ elementoAtual.eh('input,select,textarea') ? 'getJson' : 'conteudo']();            
            var nomeReplica = this.atributo('replica');
            
            var formulario = new Superlogica_Js_Form( this.maisProximo('form') );            
            var elementosReplica = formulario.encontrar('[replica="'+nomeReplica+'"]');            
            if (!elementosReplica || elementosReplica.contar() <= 1 )
                return true;            
            elementosReplica.emCadaElemento(function(){                
                if ( this.$_elemento[0] == elementoAtual.$_elemento[0] || this.atributo("replicaoff") )
                    return true;                
                var elemento = new Superlogica_Js_Form_Elementos(this);
                elemento.atributo("replicandoelemento",'1');
                elemento[ elemento.eh('input,select,textarea') ? 'setValue' : 'conteudo' ]( valorAtual );                
            });
        });        
    },
    
    __soma : function(){
        this.bind('change keyup', function(){
            var nomeSoma = this.atributo('somarem');
            var formulario = new Superlogica_Js_Form( this.maisProximo('form') );
            if ( !formulario || formulario.contar() <= 0 ){
                return true;
            }
            var elementosSoma = formulario.encontrar('[somarem="'+nomeSoma+'"]');
            if ( !elementosSoma ){
                return true; 
            }
            var total = 0;            
            elementosSoma.emCadaElemento(function(){               
                var elemento = new Superlogica_Js_Form_Elementos(this);                
                
                var valorItem = parseFloat( elemento[ elemento.eh('input,select,textarea') ? 'getJson' : 'conteudo' ]() );
                if ( isNaN(valorItem) )
                    valorItem = 0;
                total += valorItem;
            });            
            if ( nomeSoma.indexOf('#') === -1 || nomeSoma.indexOf('.') === -1 ){                
                formulario.getElemento(nomeSoma).setValue(total);
            }else{
                new Superlogica_Js_Elemento( nomeSoma ).conteudo( total );
                
            }
            
        });
    },
    
    /**
    * Se um elemento contiver esse comportamento, ao clicar sobre ele
    * a visibilidade será alterada da classe/id informada no atributo "divclass"/"divid"/"proximo", respectivamente e se esconderá
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
    __cliqueAlteraPropriaVisibilidade: function(elemento, contexto){
        
        this.bind('click.cliqueAlteraPropriaVisibilidade', function(evento){
            console.log('oi');
            this.trocarVisibilidade();
        });

    },
    
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
        
        this.bind('click.cliqueAlteraVisibilidade', function(evento){
            
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
            var seletorProximo = this.atributo('proximo');
            
            if ( id || seletorMaisProximo || seletorProximo){
                encontrou = true;
                var prefixoId = this.atributo('prefixoId');
                
                if ( typeof prefixoId != 'undefined'){
                    id = prefixoId+'-'+id ;
                }
                
                if ( id && !seletorMaisProximo && !seletorProximo )
                    alvo = new Superlogica_Js_Elemento('#' + id);
                else if ( seletorProximo ) 
                   alvo = this.proximo( seletorProximo );
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
    
    sortable : function(){
        this.$_elemento.sortable.apply( this.$_elemento, arguments);
        return this;
    },
            
    __mostrarElementosMouseover : function(){
        this.delegate('.mouseovercontainer', 'mouseover', function(){
            var elementos = this.encontrar('.blocoInvisivel')
            if ( elementos )
                elementos.removerClasse('blocoInvisivel').adicionarClasse('blocoVisivel');
        }).delegate('.mouseovercontainer', 'mouseout', function(){
            var elementos = this.encontrar('.blocoVisivel')
            if ( elementos )
                elementos.removerClasse('blocoVisivel').adicionarClasse('blocoInvisivel');
        });
    },

    /**
     * Executa um comportamento passado como parâmetro
     * Responsável por chamar comportamentos especificos dos elementos como: aposAbrirFormDialog, etc
     * @param  {String} atributoComportamento 
     * @return {void}                       
     */
    executarComportamento : function( atributoComportamento ){
        
        var argumentosComportamento = [];
        for ( var x=1; x<arguments.length; x++){
            argumentosComportamento.push(arguments[x]);
        }

        var comportamentos = this.atributoToArray(atributoComportamento);
        Object.each( comportamentos, function( comportamento ){
            if ( typeof this['__'+comportamento] == 'function'){
                this['__'+comportamento].apply( this, argumentosComportamento);
            }
        }, this);

    },
    
    __abrirFormDialog : function(){

      this.bind('click', function(){
        var nomeForm = this.getDados('nome-form');
        if ( nomeForm.indexOf('#') !== -1 ){
            var form = new Superlogica_Js_Form(nomeForm).clonar();
            form.openDialogo();
            this.executarComportamento('aposAbrirFormDialog', form.encontrar('form'));
        }else{
            this.getForm(nomeForm, function( container ){
                container.openDialogo(false);
                this.executarComportamento('aposAbrirFormDialog', container.encontrar('form'));
            });
        }
      });

    },

    /**
     * Adicionar comportamento para recarregar a página apos submeter
     * @param  {Superlogica_Js_Form} form 
     * @return {void}      
     */
    __adicionarAposSubmeterRecarregarPagina : function( form ){
      form.atributo('aposSubmeter', jQuery.trim( (form.atributo('aposSubmeter') ? form.atributo('aposSubmeter') : '') + ' recarregarPaginaAposSubmeterComSucesso') );
    },

    getForm : function(nomeForm, callback, naoProcessarComportamentos, viaProxy){
        this.inserirLoadingImg();

        var displayGroups = this.getDados('display-groups');
        var opcoesConstrutor = this.getDados('opcoes-construtor');
        var formAtributos = this.getDados('form-atributos');        
        var elemento = this;
        var locationForms = new Superlogica_Js_Location();
        locationForms.setController('forms').setAction('index').setApi(true).setParam({}).viaProxy(viaProxy? true : false);
        var request = new Superlogica_Js_Request( locationForms.toString(), {
            'nome': nomeForm,
            'interno' : viaProxy ? 0 : 1,
            'displayGroups' : displayGroups ? displayGroups : 0,
            'opcoesConstrutor' : opcoesConstrutor ? opcoesConstrutor : 0, 
            'formAtributos' : formAtributos ? formAtributos : 0
        });
        var nomeCacheForm = 'FORM'+nomeForm + JSON.encode(displayGroups) + JSON.encode(opcoesConstrutor) + JSON.encode(formAtributos);
        
        if ( typeof window.jsAdicionados == 'undefined')
            window.jsAdicionados = {};

        request.enviarAssincrono(function( response ){
        if ( response.isValid() ){
            var dados = response.getData();
            dados.html = Superlogica_Js_String.html_entity_decode( dados.html, 'ENT_QUOTES' );
            Object.each( dados.urls, function( url, chave ){
                var location = new Superlogica_Js_Location();
                location.setController(url.controller)
                        .setAction(url.action)
                        .setParams(url.params)
                        .viaProxy(viaProxy? true : false);
                if ( url.api )
                    location.setApi(true);            

                dados.html = dados.html.replace( '%url_form'+chave+'%', location.toString() );
            });

            if ( !window.jsAdicionados['FORM'+nomeForm] ){
                window.jsAdicionados['FORM'+nomeForm] = true;
                dados.js = Superlogica_Js_String.html_entity_decode( dados.js, 'ENT_QUOTES' );
                dados.html_append = Superlogica_Js_String.html_entity_decode( dados.html_append, 'ENT_QUOTES' );

                if ( dados.js ){
                    new Superlogica_Js_Elemento('head').adicionarHtmlAoFinal(
                        new Superlogica_Js_Elemento('<script></script>').conteudo(dados.js)
                    );
                }
                if( dados.html_append ){         
                    new Superlogica_Js_Elemento('#Superlogica_Layout_Codigos_Append').adicionarHtmlAoFinal(
                        dados.html_append 
                    );                    
                }
            }
            var form = new Superlogica_Js_Form( '<div>'+dados.html+'</div>' );

            if (!naoProcessarComportamentos){
                var divEnvolvida = new Superlogica_Js_Elemento('<div></div>');
                new Superlogica_Js_Elemento('#Superlogica_Layout_Codigos_Append').adicionarHtmlAoFinal( divEnvolvida );
                divEnvolvida.conteudo(form);
                divEnvolvida.carregarComportamentos();
            }

            callback.apply( elemento, [form] );
            
        }

        elemento.removerLoadingImg();
        
      }, nomeCacheForm );
        
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
    },

    inserirLoadingImg : function( handler ){
        
        if( !handler )
            handler = this;
        
        if ( !handler.eh( '.btn') )
            handler.adicionarClasse('blocoEscondido');

        var loadingImg = new Superlogica_Js_Elemento('<img class="imgLoading" />')
            .atributo('src', APPLICATION_CONF["APPLICATION_CLIENT_TEMA_URL"] + '/img/load.gif')
            .atributo('alt', 'Carregando... aguarde.' )
            .atributo('height','5')
            .atributo('width','21');

        if ( handler.eh( '.btn') ){
            loadingImg.css({
                'margin-left':'5px',
                'display':'inline-block'
            });
            handler.adicionarHtmlAoFinal( loadingImg );
        }else if ( this.maisProximo('.input-icone').contar() ){
            loadingImg.css({
                'position' : 'absolute',
                'top' : '14px',
                'right' : '10px'
            });
            loadingImg.inserirDepoisDe( handler );
        }else{
            loadingImg.atributo('style', 'margin-top:5px;');
            loadingImg.inserirDepoisDe( handler );
        }
    },

    /**
     * Remove a imagem de loading
     */
    removerLoadingImg : function(){

        var imgLoading;
        if ( this.eh( '.btn') ){
            imgLoading = this.encontrar('.imgLoading');
        }else{
            imgLoading = this.proximo();
        }

        if ( !imgLoading )
            return true;

        if ( imgLoading.eh('.imgLoading') )
            imgLoading.remover();

        this.removerClasse('blocoEscondido');

    },

    fecharAjuda : function(){
        
        var notificacao = this.maisProximo('.foobar-container-row');
        if ( notificacao && notificacao.contar() ){
            Superlogica_Js_Elemento.fecharNotificacao();
        }else{
            Superlogica_Js_Elemento.fecharModal();
        }
    }
    
});

Superlogica_Js_Elemento.adicionarJsAPagina = function(js, quoted){    
    if ( quoted )
        js = Superlogica_Js_String.html_entity_decode( js, "ENT_QUOTES" );

    new Superlogica_Js_Elemento("body").adicionarHtmlAoFinal(
        new Superlogica_Js_Elemento("<script></script>").conteudo(js)
    );   

}

Superlogica_Js_Elemento.fecharModal = function(){    
    new Superlogica_Js_Elemento("#myModal").$_elemento.modal("hide");    
};

Superlogica_Js_Elemento.fecharNotificacao = function(){    
    jQuery.foobar('close');
};

