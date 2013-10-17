
var Superlogica_Js_Template = new Class({

    /**
     * Class principal para herança das classes que manipulam elemento DOM
     * @var Superlogica_Js_Elemento
     */
    Extends : Superlogica_Js_Elemento,

    /**
     * Class utilizada em cada linha do template
     * @var string
     */
    _classRows : "Superlogica_Js_Template_Row",

    /**
     * Nome do comportamento que é carregado automaticamente
     */
    _nomeComportamento : "Superlogica_Js_Template",

    /**
     * Delimitador da esquerda das variaveis do template
     * @var string
     */
    _defaultLeftDelimiter : '%',

    /**
     * Delimitador da direita das variaveis do template
     * @var string
     */
    _defaultRightDelimiter : '%',

    /**
     * Linhas a cada setTimeout
     * @var integer
     */
    _linhasPorVez : 15,

    /**
     * Tempo para inserção de linhas
     * @var integer
     */
    _timeInterval : 600,

    /**
     * Tag principal do fragment
     * @var string
     */
    _fragmentTag : null,

    /**
     * Armazenará a instancia do fragmente que recebe
     * @var object
     */
    _fragment : null,

    /**
     * Armazena as opções da classe atual
     * @var object
     */
    _vars : {},
    
    initialize : function(){
        
        this.parent.apply( this, arguments );

        if ( !this.$_elemento ) return true;

        var configuracoes = this.atributo('conf');
        if ( !this.getOptions() && configuracoes && configuracoes.trim() != ''){
            this.setOptions( new Superlogica_Js_Json( configuracoes ).extrair() );
            //this.atributo('conf', '' );
        }
        var rightDelimiter = this.atributo('rightDelimiter');
        if ( !rightDelimiter )
            rightDelimiter = this._defaultRightDelimiter;

        var leftDelimiter = this.atributo('leftDelimiter');
        if ( !leftDelimiter )
            leftDelimiter = this._defaultLeftDelimiter;

       this.setLeftDelimiter( leftDelimiter );
       this.setRightDelimiter( rightDelimiter );

       var vars = this.getDados('vars');

       if ( !vars ){
           vars  = {

               'leftDelimiter' : leftDelimiter,
               'rightDelimiter' : rightDelimiter,

               'regex' : {
                   'vars' : new RegExp( '\\' + leftDelimiter + '([a-z0-9_.-]){1,}\\' + rightDelimiter ,'gim'),
                   'replaceDelimiters' : new RegExp(  leftDelimiter + '|' + rightDelimiter, 'gim' ),
                   'subItens' : new RegExp('<!-- ([a-z0-9_.-]{1,}).inicio -->(.+?)<!-- \\1.fim -->', 'im')
               }

           }

           this.setDados('vars', vars );
           
       }

       this._vars = vars;

       

    },

    /**
     * Cria o fragment utilizado para receber as linhas
     */
    _criarFragment : function(){
        
        var fragmentTag = this._fragmentTag;
        if ( !fragmentTag )
            fragmentTag = this.tagName();
        
        var frag = document.createDocumentFragment();
        var tagPrincipal = document.createElement( fragmentTag );
        this._fragment = new Superlogica_Js_Elemento(
            frag.appendChild( tagPrincipal )
        );

    },
    
    /**
     * Retorna o fragment
     * 
     * @return Superlogica_Js_Elemento
     */
    _getFragment : function(){
        if ( !this._fragment ){
            this._criarFragment();
        }
        return this._fragment;
    },

    /**
     * Função encarregada de carregar comportamentos
     */
    carregarComportamentos : function(){
                
        if ( !this.atributo( "idTemplate") )
            this.atributo( "idTemplate", String.uniqueID());
                
        var data = new Superlogica_Js_Json( this.atributo('data').replace(/^"|"$/g,'') ).extrair(-1);
        
        this._setData( data );

        if ( !this._getTemplate()  ){
            var template = this.conteudo();
            this.conteudo('');
            this.setTemplate( template );
        }
        
        this._criarFragment();

        if ( typeof this.atributo('carregado') == 'undefined' ){
            this._HTMLDesenharLinhas();
        }
        
    },

    /**
     * Seta uma opção no template
     *
     * @param string option
     * @param mixed valor
     */
    setOption : function( option, valor ){
        var options = this.getOptions();
        if ( typeof options != 'object' )
            options = {};
        options[option] = valor;
        this.setOptions(options);
    },

    /**
     * Retorna o valor da opção informada
     *
     * @param option
     * @return mixed
     */
    getOption : function(option){
        var options = this.getOptions();
        if ( !options ) return "";
        return options[option];
    },

    /**
     * Seta as opções para o template
     * @param object options
     */
    setOptions : function( options ){
        this.setDados('options', options);
    },

    /**
     * Retorna as opções setadas no template
     * @return object
     */
    getOptions : function(){
        return this.getDados('options');
    },
       
    /**
     * Retorna o template utilizado por essa instancia da classe
     * 
     * @return string
     */
    _getTemplate : function(){
        var idTemplate = this.atributo('idTemplate');
        return Superlogica_Js_Template.templates[idTemplate];
    },

    /**
     * Retorna o Data que está no elemento atual ou um único item cado indice seja passado
     * 
     * @param int OPCIONAL
     * @return object
     */
    getData : function( indice ){
        var data = this.getDados('dados');
        if ( typeof indice != 'undefined' )
            return data[indice];
        return data;
    },

    /**
     * Utilizado para setar o data no elemento
     * 
     * @para object
     */
    _setData : function( data ){
        this.setDados( 'dados', data );
    },

    /**
     * Redesenha todas linhas do Template
     */
    redesenhar : function(){

        var totalDados = this.getTotalLinhas();
        
        if ( totalDados <= 0){
        	this.removerLinhas();
        	if ( typeof this._depoisDeDesenharLinha == 'function' ){
                    this._depoisDeDesenharLinha.apply( this, [] );
        	}
        	return;
        }
        
        var linhasPorVez = this._linhasPorVez;
        var referencia = this;
        var indices = this.getIndicesExistentes();
        var x = 0;
        var dados = this.getData();
        var dadosLinha = {};
        var totalAnterior = this._getTotalLinhasHtml();
        var novoData = {};
        
        var intervalLinhas = setInterval(function(){
            for( ; x <= linhasPorVez && totalDados > x ; x++ ){
                dadosLinha = dados[indices[x]];
                referencia._HTMLExcluirLinha( indices[x] );
                referencia._atualizarData( dadosLinha, x );
                referencia.adicionarLinha( dadosLinha, x, false, true );
                novoData[x] = dadosLinha;
            }

            referencia.commit();

            if( totalDados <= x ){
                clearInterval(intervalLinhas);

                if ( totalAnterior > x ){
                    for( ; totalAnterior > x; x++ ){
                        referencia._HTMLExcluirLinha( x );
                    }
                }
                // Data é reordenado e precisa set alterado após redesenho completo
                referencia._setData(novoData);
                if ( typeof referencia['_depoisDeDesenharLinha'] == 'function' ){   
                    referencia['_depoisDeDesenharLinha'].apply( referencia, [] );
                }
            }else{
                linhasPorVez = linhasPorVez + referencia._linhasPorVez;
            }

        }, this._timeInterval );
        
    },
    
    /**
     * Retorna o total de linhas que estão no HTML
     * 
     * @return integer
     */
    _getTotalLinhasHtml : function(){
    	var htmlLinhas = this.encontrar("."+this._classRows);
    	if ( !htmlLinhas ) return 0;
        return parseInt( htmlLinhas.contar(), 10);
        
    },

    /**
     * Atualizar o dado informado de acordo com o indice passado
     * 
     * @param object dados
     * @param integer indice
     */
    _atualizarData : function( dados, indice ){
        var data = this.getData();
        dados = new Superlogica_Js_Json( dados ).extrair();
        if ( dados === null ){
            delete data[indice];
        }else{
            data[indice] = dados;
        }
        this._setData( data );
    },

    /**
     * Desenha a linha informada
     * 
     * @param int indice
     */
    _HTMLDesenharLinha : function( indice, toFragment ){
        var dados = this.getData(indice);
        var conteudoLinha = this._parseTemplate( dados, indice );
            conteudoLinha = new Superlogica_Js_Elemento( this._wrapContainer( conteudoLinha, indice ) );
        
        if ( !this._HTMLGetLinhaDesenhada( indice, toFragment ) && toFragment ){
            this._getFragment().adicionarHtmlAoFinal( conteudoLinha );
        }else if( ( typeof indice == 'number' ) && ( indice !== 0 ) ){
        	
        	var elementoAnterior = this._HTMLGetLinhaDesenhada( indice-1, toFragment );                                
        	if ( elementoAnterior ){
                    conteudoLinha.inserirDepoisDe( elementoAnterior );
        	}else {                    
        		var proximoElemento = this._HTMLGetLinhaDesenhada( indice+1, toFragment );                        
        		if ( proximoElemento )
        			conteudoLinha.inserirAntesDe( proximoElemento );
        		else
        			this.adicionarHtmlAoInicio( conteudoLinha );
        	}
        	
        }else{
        	
            if ( toFragment )
                this._getFragment()[ indice === 0 ? "adicionarHtmlAoInicio" : "adicionarHtmlAoFinal"]( conteudoLinha );
            else
                this[ indice === 0 ? "adicionarHtmlAoInicio" : "adicionarHtmlAoFinal"]( conteudoLinha );
        }
        
        if ( !toFragment ){
            conteudoLinha.carregarComportamentos( true );
            conteudoLinha.processarComportamento( conteudoLinha );
        }
        var form = new Superlogica_Js_Form( conteudoLinha ).popular( dados );
        
        /*  DEIXA TUDO MUITO LENTO POIS O GRID, QUANDO TEM CHECKBOX, FOCA NA LINHA QUE FOI CRIADA E
            A BARRA DE ROLAGEM DESCE SEMPRE PRA ULTIMA LINHA. NÃO DESCOMENTAR.*/
        //form.focar();
        
        return conteudoLinha;
    },

    /**
     * Encarregado de desenhar todas linhas que contem o Template
     */
    _HTMLDesenharLinhas : function(){

        /*var totalDados = this.getTotalLinhas();
        var indices = this.getIndicesExistentes();

        for( var x=0; totalDados > x ; x++ ){
            this._HTMLExcluirLinha( indices[x], true );
            this._HTMLDesenharLinha( indices[x], true );
        }
        this.commit();*/
        
        this._desenharLinha = function(){
            for( ; x <= linhasPorVez && totalDados > x ; x++ ){
                referencia._HTMLExcluirLinha.apply(referencia, [ indices[x], true ] );
                referencia._HTMLDesenharLinha.apply(referencia, [indices[x], true ] );
            }
            referencia.commit();
            if( totalDados <= x ){
                clearInterval(intervalLinhas);
                if ( typeof referencia['_depoisDeDesenharLinha'] == 'function' ){
                    referencia['_depoisDeDesenharLinha'].apply( referencia, [] );
                }
                referencia.atributo( 'desenhado', true );
            }else{
                linhasPorVez = linhasPorVez + referencia._linhasPorVez;
            }
        }
        
        var totalDados = this.getTotalLinhas();
        var referencia = this;
        var x = 0;
        var linhasPorVez = this._linhasPorVez;
        var indices = this.getIndicesExistentes();
        
        var intervalLinhas = setInterval( this._desenharLinha , this._timeInterval );

        this._desenharLinha();
        
    },

    /**
     * Exclui todas linhas do template
     */
    _HTMLExcluirLinhas : function(){
    	for( var x=0, total = this._getTotalLinhasHtml(); total>x ;x++  ){
    		this._HTMLExcluirLinha( x );
    	}
        
    },

    /**
     * Exclui a linha, informada em indice, do template
     * @param int indice
     */
    _HTMLExcluirLinha : function( indice, fragment ){
        var linha = this._HTMLGetLinhaDesenhada( indice, fragment );
        if ( linha )
            linha.remover();
    },

    /**
     * Retorna o Superlogica_Js_Template da linha informada
     * @param int indice
     * @return Superlogica_Js_Elemento
     */
    _HTMLGetLinhaDesenhada : function( indice, fragment ){
        var id = this.atributo("id");
        var containerLinhas = this;
        if ( fragment ){
            containerLinhas = this._getFragment();
        }
        return containerLinhas.encontrar('.' + this._classRows + '[id$="' + id + '-' + indice + '"]');
    },

    /**
     * Clona todo fragmento desenhado e trasnfere para o Grid
     * @return Superlogica_Js_Template
     */
    commit : function(){
        var fragmento = this._getFragment();
        var linhas = new Superlogica_Js_Elemento( fragmento.$_elemento.children().clone(true) );
        this.adicionarHtmlAoFinal( linhas );
        linhas.carregarComportamentos( true );
        this._criarFragment();
        return this;
    },

    /**
     * Retorna o Superlogica_Js_Elemento da linha passada como indice
     * Aconselhado a não utilzação para manipular a linha de fora da classe
     * 
     * @return Superlogica_Js_Elemento
     */
    getLinhaComoElemento : function( indice ){
        return this._HTMLGetLinhaDesenhada(indice);
    },

    /**
     * Retorna o total de linhas adicionadas ao template
     * @return int
     */
    getTotalLinhas : function(){
        var dados = this.getData();
        if ( dados && typeof dados == 'object' ) {
            return Object.getLength( dados );
        }
        return 0;
    },

    getPrimeiroIndice : function(){
        var indices = this.getIndicesExistentes();
        if (typeof indices == 'object') return indices[0];
        return -1;
    },

    /**
     * Retorna o indice da ultima linha
     * @return integer
     */
    getUltimoIndice : function(){
        var indices = this.getIndicesExistentes();
        if ( typeof indices == 'object' )
            return indices[ Object.getLength( indices )-1 ];
        return 0;
    },

    /**
     * Retorna um array com as chaves existentes no array de dados
     * @return array
     */
    getIndicesExistentes : function(){
        var indices = [];
        Object.each( this.getData(), function(item, chave){
            indices.push( parseInt( chave ) );
        });
        return indices;
    },

    /**
     * Seta o template
     *
     * @param string template
     */
    setTemplate : function(template){
        if ( template ){
            var idTemplate = this.atributo('idTemplate');
            Superlogica_Js_Template.templates[idTemplate] = template;
        }
    },
        
    /**
     * Insere um dado no elementoDestino
     * 
     * @param object|string data
     * @param int index Posição a ser inserido o dados
     * @param boolean naoExecutarProcedimentosAposDesenhar Caso True ele não chama o callback _depoisDeDesenharLinha
     * @return Superlogica_Js_Template
     */
    adicionarLinha : function( dados, indice, naoExecutarProcedimentosAposDesenhar, fragment ){
        indice = parseInt( indice );
        if ( isNaN( indice ) ) return false;
        
        indice = parseInt(indice);
        dados = new Superlogica_Js_Json( dados ).extrair();
        this.removerLinha( indice, naoExecutarProcedimentosAposDesenhar );
        this._atualizarData( dados , indice );
        this._HTMLDesenharLinha( indice, fragment );
        
        if ( !naoExecutarProcedimentosAposDesenhar && typeof this['_depoisDeDesenharLinha'] == 'function' ){
            this.commit();
            this['_depoisDeDesenharLinha']();
        }
        
        return this;
    },
    
    /**
     * Insere várias linhas no final do Template
     * @param object linhas
     */
    adicionarLinhas : function( linhas ){
        this.setDados('adicionandoLinhas', true);
    	linhas = new Superlogica_Js_Json( linhas ).extrair(-1);
    	    	
        var totalDados = linhas.length;
        
        // Como setInterval demora para acrescentar a linha no array então precisa ser acrescatado por aqui
        // para não prejudicar chamada em loop ao adicionarLinhas
        var indicesLinhas = [];
        var indicesExistentes = this.getIndicesExistentes();
        var ultimoIndice = indicesExistentes[ Object.getLength( indicesExistentes )-1 ];
        
        if ( typeof ultimoIndice == 'undefined' ){
        	ultimoIndice = -1;        	        	
        }
               
        Object.each( linhas, function( dados ){        	
            ultimoIndice = ultimoIndice+1;
            indicesLinhas.push( ultimoIndice );
            this._atualizarData( dados , ultimoIndice );
        }, this );

        var referencia = this;
        var intervalLinhas;
        var x = 0;
        var linhasPorVez = this._linhasPorVez;
        intervalLinhas = setInterval(function(){
            for( ; x <= linhasPorVez && totalDados > x ; x++ ){
                referencia.adicionarLinha.apply(referencia, [ linhas[x], indicesLinhas[x], true, true ] );
            }
            referencia.commit();
            if( totalDados <= x ){
                clearInterval(intervalLinhas);
                
                if ( typeof referencia['_depoisDeDesenharLinha'] == 'function' ){
                    referencia['_depoisDeDesenharLinha'].apply( referencia, [] );
                }
                referencia.getClosestInstance().setDados('adicionandoLinhas', false );
                referencia.atributo( 'desenhado', true );
            }else{
                linhasPorVez = linhasPorVez + referencia._linhasPorVez;
            }

        }, this._timeInterval );
        
        
    },

    /**
     * Remove a linha informada
     * 
     * @param integer indice
     * @return Superlogica_Js_Template
     */
    removerLinha : function( indice, naoExecutarProcedimentosAposDesenhar ){
        indice = parseInt( indice );
        if ( isNaN( indice ) ) return this;
        
        this._HTMLExcluirLinha( indice );
        this._atualizarData( null, indice );
        if ( !naoExecutarProcedimentosAposDesenhar &&  typeof this['_depoisDeDesenharLinha'] == 'function' ){
            this['_depoisDeDesenharLinha']();
        }
        return this;
    },

    /**
     * Remove as linhas do templates
     *
     * @param integer indice
     * @return Superlogica_Js_Template
     */
    removerLinhas : function(){
	this._HTMLExcluirLinhas();
        this._setData({});
        return this;
    },
    
    /**
     * Adiciona
     */
    _wrapContainer : function( html, index ){
        html = html.trim();
        
        var idElementoDestino = this.atributo('id');
        if ( !idElementoDestino ){
            idElementoDestino = String.uniqueID();
        }
        var elemento = new Superlogica_Js_Elemento( html );
        if ( /^\</.test( html ) ){
            elemento = elemento.adicionarClasse( this._classRows ).adicionarClasse( this._classRows+"_"+index  );
        }else{
            elemento = new Superlogica_Js_Elemento( '<div class="' + this._classRows + ' '+ this._classRows+"_"+index+ '">' + html + '</div>' );
        }
        return elemento.atributo( 'id', idElementoDestino + '-' + index );
    },

    
    
    /**
     * Troca os valores do template informado
     *
     * @param string template
     * @param object dados Variaveis a serem trocadas no template
     */
    _parseTemplate : function( dados, index, template ){
        template = template ? template : this._getTemplate();
        var templateParsed = template.replace( /\n|\r\n/g, '--nl--');
        var regexSubitens = this._vars['regex']['subItens'];
        //var regexSubitens = new RegExp('<!-- ([a-z0-9_.-]{1,}).inicio -->(.+?)<!-- \\1.fim -->', 'im');
        var blocos = {};
        for( ; ; ){
            var subitens = templateParsed.match( regexSubitens );
            if ( !subitens ) break;
            blocos[ subitens[1] ] = subitens[2];
            templateParsed = templateParsed.replace( regexSubitens , '%'+subitens[1]+'%' );
        }
        
        Object.each(
            dados,
            function(item, chave){
            	
            	if( (!blocos[chave]) && ( new RegExp( '\\'+this.getLeftDelimiter() + chave + '\\' + this.getRightDelimiter() ).test( templateParsed ) ) && ( typeof item == 'object') )
                    item = this._formatJson( item );
           	
                var objectParser = {};
                    objectParser[chave] = item;

                if ( typeof item == 'string'){
                    templateParsed = this.parse( templateParsed, objectParser );

                }else if( typeof item == 'object' ){
                    if ( !blocos[chave] ) return true;
                    var subTemplate = blocos[chave].replace( /%template%/g, template );
                    var subTemplateTexto = '';
                    
                    Object.each(
                        item,
                        function(item2,index2){
                            
                            subTemplateTexto = subTemplateTexto + this._parseTemplate( item2, index2, subTemplate );
                        },
                        this
                    );
                    templateParsed = templateParsed.replace( '%'+chave+'%', subTemplateTexto );
                }

            },
            this
        );

        var regSubTemplateLimpar = new RegExp('<!-- ([a-z0-9_.-]{1,})\.inicio -->(.+?)<!-- \\1\.fim -->', 'img');
            templateParsed = templateParsed.replace( regSubTemplateLimpar, '' );
        templateParsed = templateParsed.replace( /--nl--/g,"\n" );

        Object.each(
            [
                [ "parse", {'indice' : index} ],
                "_limparVarsVazias",
                [ "parse",  {'template' : this._getTemplate()} ],
                "_inserirDelimitadores"
            ],
            function( item ){
                templateParsed = typeof item == 'object' ? this[item[0]]( templateParsed, item[1] ) : this[item]( templateParsed );
            },
            this
        );
        
        return templateParsed;
    },
    
    /**
     * Formatar os dados em JSON
     * 
     * @param object dados
     * @return string 
     */
    _formatJson : function( dados ){
    	return new Superlogica_Js_Json( dados ).encode().replace( /"/g, '&quot;');
    },

    /**
     * Utilizado para substituir variaveis no template
     * 
     * @param string texto
     * @param object|url dados
     */
    parse : function( template, dados ){
    	
        dados = new Superlogica_Js_Json( dados ).extrair();
                
        if ( ( typeof template == 'undefined') || (typeof dados != 'object') ) return template;
        
        //var regexVars = new RegExp( this.getLeftDelimiter() +'(.+?)' + this.getRightDelimiter() ,'gim');
        var regexVars = this._vars['regex']['vars'];
        var matchs = template.match( regexVars );

        if ( ( matchs == null ) || ( typeof matchs != 'object' ) ) return template;
        
        for ( var y=0 ; matchs.length > y; y++){
            
            //var arrDados = matchs[y].replace( new RegExp( this.getLeftDelimiter() + '|' + this.getRightDelimiter() ,'gim' ),'' ).split('.');
            var arrDados = matchs[y].replace( this._vars['regex']['replaceDelimiters'],'' ).split('.'); // this.getLeftDelimiter() + '|' + this.getRightDelimiter()
            
            var templateTexto = dados;
            for ( var z = 0; arrDados.length > z; z++){
                if ( !templateTexto ) break;
                templateTexto = templateTexto[ arrDados[z] ];//.split('|')[0] ];
            }
            
            if ( typeof templateTexto != 'undefined' )
                template = template.replace( matchs[y], templateTexto );

        }
        
        return template;
    },

    /**
     * Insere os delimitadores nas tags
     * 
     * @param string texto
     * @return string
     */
    _inserirDelimitadores : function( texto ){
        var reference = this;
        ["rightDelimiter", "leftDelimiter"].each(function( item ){
            texto = texto.replace( new RegExp( item+'=.(.+?).', 'img'), item + '="' + reference["_"+item] + '"' );
            if ( !texto.match( new RegExp( item, 'im' ) )  ){
                texto = texto.replace( new RegExp('('+reference._classPrincipal+'.+?)\>', 'img'),  "$1 " + item + '="' + reference["_"+item] + '">' );
            }
        });
        return texto;
    },

    /**
     * Limpa as variaveis vazias do texto informado
     *
     * @var string texto
     * @return string
     */
    _limparVarsVazias : function( texto ){
        var regexRemoverVarVazias = new RegExp( '\\'+this.getLeftDelimiter()+'((?!template|\"|\')[a-z0-9_.-]{1,})\\'+this.getRightDelimiter() , 'img');
            texto = texto.replace( regexRemoverVarVazias , '' );
        return texto;
    },
    
    /**
     * Retorna o delimitador de variaveis da direita
     * @return string
     */
    getRightDelimiter : function(){
        return this.getDados('rightDelimiter');
    },
    
    /**
     * Retorna o delimitador de variaveis da esquerda
     * @return string
     */
    getLeftDelimiter : function(  ){
        return this.getDados('leftDelimiter');
    },
   /**
    * Altera o delimitador do lado direito do atributo, padrão "}"
    */
    setRightDelimiter : function( rightDelimiter ){
        if ( rightDelimiter ){
            this.setDados('rightDelimiter', rightDelimiter );
        }
    },
   /**
    * Altera o delimitador do lado esquerdo do atributo, padrão "{"
    */
    setLeftDelimiter : function( leftDelimiter ){
        if ( leftDelimiter ){
            this.setDados('leftDelimiter', leftDelimiter );
        }
    },

   /**
    * Retorna o Superlogica_Js_Template pai
    *
    * @param Superlogica_Js_Elemento $elemento
    * @return Superlogica_Js_Template
    */
    getClosestInstance : function( $elemento ){
        if ( !$elemento ) $elemento = this;
        return new Superlogica_Js_Template( $elemento.$_elemento.closest('[idTemplate]') );
    }

});

/**
 * Variavel que armazena todos templates
 * Necessário setar fora da classe para ser static
 */
Superlogica_Js_Template.templates = {};