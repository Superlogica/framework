var Superlogica_Js_Form = new Class({

    /**
     * Extende as classes principal para manipulação dos elementos.
     */
    Extends : Superlogica_Js_Elemento,
    
    /**
     * Nome da Img de Load
     * @var string
     */
    imgLoadName : "load.gif",

    /**
     * Objeto com o nome das classes utilizadas no CSS e nos códigos Js
     * @var object
     */ 
    _assistenteConfigPadroes : {
        'textoProximo' : "Próximo >>",
        'textoAnterior' : "<< Anterior",
        'classGenerica' : 'assistente_passo',
        'classPassoEspecifico' : 'passo', // O número do passo será concatenado ao final desta classe
        'classBtnProximo' : 'assistente_passo_proximo',
        'classBtnAnterior' : 'assistente_passo_anterior',
        'comBtnFechar' : true,
        'seletorElementoIgnorado' : ':not([name])'
    },
    
    /**
     * Popula os campos que existem no contexto do elemento.
     * Importante : Aceita o json ou uma url
     * 
     * @param Superlogica_Js_Form
     */
    popular : function( data ){
        //var elements = this.$_elemento.find("input, textarea, select");

        Object.each(
            data,
            function( item, key ){
                if ((item!=null) && ( typeof(item) == 'object' )){
                    
                    var subForm = this.getSubForm(key);
                    
                    if (subForm == null){
                        return true;
                    }
                    var templateSubForm = new Superlogica_Js_Template( subForm );
                    //templateSubForm.removerLinhas();
                    if ( templateSubForm.atributo('carregado') != 'true' )
                        templateSubForm.carregarComportamentos();
                    
                    Object.each( item, function(item2, indice){
                        templateSubForm.adicionarLinha(item2, indice );
                    }, this);
                    
//                    if ( templateSubForm.getTotalLinhas() > 1 ){
//                    	//templateSubForm.adicionarClasse('subFormComMultiplosDados');
//                        templateSubForm.encontrar('.subformExcluir:first').mostrar();
//                    }
                    return true;
                }
                var formElement = this.getElemento( key );
                if ( formElement == null) return true;

                formElement.setValue( item );
            },
            this
        );
            
        return this;
    },
    
    
  /**
   *  Adiciona o evento onLoad ao formulário
   *
   *   uso: <form onLoad='nomeDaFuncao' >
   *
   *    function nomeDaFuncao(Superlogica_Js_Form){
   *
   *    }
   *
   */
  _aoCarregar : function(){
      var $form = this._getForm();
      if ($form == null) return this;
      if ($form.attr('carregado') == 'true') return this;
      var callBack = $form.attr('onLoad');
      if (callBack){
          window[ callBack ]( this );
      }
   //   $form.data('Superlogica_Js_Form',this);
      $form.attr('carregado','true');

  },

   /**
     * Clona um form e retira os ids dos elementos do form
     * @param string idNovoForm Id do novo form
     * @return Form criado
     */
    clonar : function (idNovoForm){
        var formNovo = new Superlogica_Js_Form( this.parent( idNovoForm ) );
        formNovo.carregarComportamentos();
        return formNovo;
    },
    /**
     * Retorna os valores do form ao seu original
     *  o mesmo efeito que resetar
     * @param boolean forcar, se true mesmo nao encontrando o formulario zera os campos
     *
     */
    limpar : function (forcar){
        //zera valores
        var data = this.toArray();
        //var subForms = [];
        var elements = [];

        Object.each( data, function(item, key){
            if( typeof(item) == 'object' ){
                //subForms[key] = [{'empty':''}];
                var subForm = this.getSubForm(key);
                if (subForm == null){
                    return true;
                }
                var templateSubForm = new Superlogica_Js_Template( subForm );
                templateSubForm.removerLinhas();
                templateSubForm.adicionarLinha( {'empty':''}, 0 );
            } else{
                elements[key] = '';
                
                // Form.reset();//, utilizado mais abaixo, não funciona para campos hidden
                // http://stackoverflow.com/questions/2559616/javascript-true-form-reset-for-hidden-fields
                // Mas também não pode limpar o valor dessa forma
//                var formElemento = this.getElemento(key);//
//                if ( formElemento.atributo('type') == 'hidden' )
//                    formElemento.setValue('');

            }

        }, this);
        
        var elementosNaoLimpar = this.encontrar(".naoLimpar");
        var arCamposNaoLimpar = [];
        if ( elementosNaoLimpar ){
            
            elementosNaoLimpar.emCadaElemento(function(){
                var elemento = new Superlogica_Js_Form_Elementos( this );
                arCamposNaoLimpar[ elemento.atributo('name') ] = elemento.getJson();            
            });        
        }
        
        //this.popular( subForms );

        var $form = this._getForm()[0];
        if ($form!= null){
          $form.reset();
        }else{
            if (forcar === true){
                this.popular( elements );
            } else{
                throw 'Superlogica_Js_Form.limpar() nao encontrou o formulário.';
            }
        }
        this.popular( arCamposNaoLimpar );//Popula os campos com a classe naoLimpar usando o valor antigo
        
        var naoResetarAssistente = parseInt( this.atributo('naoResetarAssistente'), 10 );
        if ( naoResetarAssistente !== 1 )
            this.mostrarPasso(1);
        return this;
    },
    
    /**
     * Retorna os campos para seus valores iniciais
     * utilizando o atributo data do formulário.     * 
     */
    resetar : function(){
    	
    	var dados = new Superlogica_Js_Json( this.atributo('data') ).extrair();
        var form = this;
        if (!dados){
            form = this.encontrar('form');
            if (form) dados = new Superlogica_Js_Json( form.atributo('data') ).extrair();
        }

        form.limpar();
    	if ( dados ){
            this.popular( dados);
    	}
    	
    },

    /**
     * Retorna um array no formato campo => valor de todos os campos.
     * @param bool toJson Formata os valores no formato que o server precisa ou que o client precisa.
     */
    _toArray : function ( toJson, classe ){
        
        var seletor = 'input, select, textarea';
        if ( typeof classe == 'string')
            seletor = 'input.'+classe+', select.'+classe+', textarea.'+classe;
        
        var elementos = this.encontrar( seletor );
        var array = {};
        
        if (!elementos) return array;

        elementos.emCadaElemento( function(){

            var elemento = new Superlogica_Js_Form_Elementos( this );

            if ( !elemento.atributo('name').trim() )
                return true;

            if ( elemento.eh('[type=checkbox]') || elemento.eh('[type=radio]') ){
                if( !elemento.eh(':checked') ) return true;
            }
            
            var chaveElemento = elemento.atributo('name').split('[');

            var valorElemento = toJson ? elemento.getJson() : elemento.getValue();
            if ( chaveElemento.length > 1){
                var valorMultiArray = {};
                for ( var x = ( chaveElemento.length-1); x > 0; x-- ){
                    var chaveElementoAtual = chaveElemento[x].replace( /\]|\"|\'/g , "" );
                    if ( chaveElemento[ chaveElemento.length-2 ].replace( /\]|\"|\'/g , "" ) == "__indice__") continue;
                    if ( x == (chaveElemento.length-1) ){
                        valorMultiArray[ chaveElementoAtual ] = valorElemento;
                    }else{
                        valorMultiArray[ chaveElementoAtual ] = Object.append( Object.clone( valorMultiArray ) );
                        delete valorMultiArray[ chaveElemento[x+1].replace( /\]|\"|\'/g , "" ) ];
                    }

                }
                array[ chaveElemento[0] ] = Object.merge( typeof array[ chaveElemento[0] ] == 'object' ? array[ chaveElemento[0] ] : {}, valorMultiArray );
            }else{
                array[ elemento.atributo('name') ] = valorElemento;
            }

        });
        
        return array;
    },
    
    __desabilitar : function(){

        var formulario = this;
        formulario.desabilitar();
    },
    
    /**
     * Desabilita todos os campos do form
     * 
     */
    desabilitar : function (){
        var form = this.encontrar('form');
        if ( !form )
            form = this;
        form.adicionarClasse('desabilitado');
        
        var elementos = this.encontrar( 'input, select, textarea, button' );
        if (!elementos) return false;
        elementos.emCadaElemento( function(){ 
        	var elemento = new Superlogica_Js_Form_Elementos( this );
        	elemento.desabilitar();
        });
        
        
        var funcaoExec = form.atributo("formatarAoDesativar");
        if (typeof funcaoExec != 'undefined'){

            var arrExecucao = funcaoExec.split('.');
            var classe = new window[arrExecucao[0]]();
            var nomeDaFuncao = arrExecucao[1];
            var resultado = "";
            if ( typeof classe[ nomeDaFuncao ] == 'function'){
                //alert( form.atributo('data') );
                resultado = classe[nomeDaFuncao]( new Superlogica_Js_Json(form.atributo('data')).extrair(), form );
                var spanWrap = form.encontrar("#"+form.atributo("id")+"_Wrap");
                if ( spanWrap == null ){
                    form.envolverDentro("<span id="+form.atributo("id")+"_Wrap></span>");
                    spanWrap = form.encontrar("#"+form.atributo("id")+"_Wrap");
                }
                spanWrap.esconder();
                var elemento = form.encontrar("#"+form.atributo("id")+"_Span");
                if (elemento == null){
                    elemento = new Superlogica_Js_Elemento( "<span id='"+form.atributo("id")+"_Span'></span>" );
                    elemento.css('cursor', 'pointer');
                    elemento.bind("click", function( event ){
                        var formulario = new Superlogica_Js_Form( form );
                        formulario.habilitar();
                        formulario.focar();
                    });

                    form.adicionarHtmlAoFinal( elemento );
                }
                elemento.conteudo( resultado );
                elemento.processarComportamento( elemento );
                elemento.mostrar();
            }
        }

    },
    
    
    /**
     * Desabilita todos os campos do form
     * 
     */
    habilitar : function (){
        var form = this.encontrar('form');
        if ( !form )
            form = this;
        form.removerClasse('desabilitado');
        
        var elementos = this.encontrar( 'div, input, select, textarea, button' );
        if (!elementos) return false;
        elementos.emCadaElemento( function(){
        	var elemento = new Superlogica_Js_Form_Elementos( this );
        	elemento.habilitar();
        });
        
        
        var funcaoExec = form.atributo("formatarAoDesativar");        
        if (typeof funcaoExec != 'undefined'){

            var arrExecucao = funcaoExec.split('.');
            var classe = new window[arrExecucao[0]]();
            var nomeDaFuncao = arrExecucao[1];
            var resultado = "";
            if ( typeof classe[ nomeDaFuncao ] == 'function'){
                
                var spanElementos = form.encontrar("#" + form.atributo("id") + "_Span");
                if ( spanElementos == null) return this;
                spanElementos.esconder();
                form.encontrar("#" + form.atributo("id") + "_Wrap").mostrar();

                var funcaoAposHabilitar = form.atributo("aoHabilitar");
                if (typeof funcaoAposHabilitar != 'undefined'){

                    var arrExecAposHabilitar = funcaoAposHabilitar.split('.');
                    var classeAposHabilitar = new window[arrExecAposHabilitar[0]]();
                    var funcaoAposHabilitar = arrExecAposHabilitar[1];
                    if ( typeof classeAposHabilitar[ funcaoAposHabilitar ] == 'function'){

                        classeAposHabilitar[ funcaoAposHabilitar ]( form, new Superlogica_Js_Json(form.atributo('data')).extrair() );
                    }
                }
            }
        }

    },      
    
    /**
     * Retorna um array no formato campo => valor de todos os campos,
     * com os campos formatados da maneira requerida pelo Client.
     */
    toArray : function ( classe ){
        return this._toArray( false, classe );
    },

    /**
     * Retorna um array no formato campo => valor de todos os campos,
     * com os campos formatados da maneira requerida pelo Server(Json).
     */
    toJson : function ( classe ){
        return this._toArray( true, classe );
    },
    
    /**
     * Coloca focus no primeiro elemento do div/form
     */
    focar : function (){
        
        var primeirosCampo = this.encontrar('input:not(:disabled):not(.desabilitado):visible:first, textarea:not(:disabled):not(.desabilitado):visible:first, select:not(:disabled):not(.desabilitado):visible:first, button.checkbox-trigger:not(:disabled):not(.desabilitado):visible:first');

        if (primeirosCampo) {
            new Superlogica_Js_Elemento(
                primeirosCampo.primeiro()
                ).focar();
        }
        
        
        return this;
    },
    
    /**
     * MostrarCamposPrincipais
     */
    mostrarCamposPrincipais: function(){  
        
        var camposSecundarios = this.encontrar('.item:not(.campoPrincipal), fieldset:not(.campoPrincipal), div.subForm:not(.campoPrincipal), img.ui-datepicker-trigger, input.subformmaisitens, button.subFormExcluir');
        if ( camposSecundarios ){
            camposSecundarios.emCadaElemento(function(){
                if ( !this.eh(':visible') )
                    return true;
                this.esconder().adicionarClasse('campoSecundario');
            });
        }
            
        this.encontrar('.item.campoPrincipal, fieldset.campoPrincipal, div.subForm.campoPrincipal').mostrar();
        
        this.removerClasse('mostrandoTodosCampos');
        this.adicionarClasse('mostrandoCamposPrincipais');        
    },
    __mostrarCamposPrincipais : function(){
        this.mostrarCamposPrincipais();
    },

    /**
     * Mostrar todos os campos
     */   
    mostrarTodosOsCampos: function(){
    	var camposSecundarios = this.encontrar('.campoSecundario')
    	if ( camposSecundarios ){
            camposSecundarios.emCadaElemento(function(){
                this.mostrar();
            });
        }    	
    	this.adicionarClasse('mostrandoTodosCampos');
    	this.removerClasse('mostrandoCamposPrincipais');    	
    },
    
    
    /**
     * Retorna o formulario informado.
     */
    getForm : function(){
        return this.$_elemento;
    },
    
    /**
     * Retorna o primeiro $formulario do contexto. ( Utilizado apenas internamente )
     * 
     * return jQuery $form
     * 
     */
    _getForm : function(){
        if ( this.eh('form') ) return this.$_elemento;
        var $form = this.encontrar("form:first");
        if ( $form && $form.eh('form') ) return $form.$_elemento;
        return null;
    },

    /**
     * Seta um formulário no contexto.
     */
    setForm : function( form ){
        this.setElemento( form );
        return this;
    },
    
    /**
     * Seleciona um elemento pelo atributo 'name'
     * 
     * @param stirng name Valor que o atributo deve conter
     * @return Superlogica_Js_Elemento
     */
    getElementoPorName : function( name ){
        return this.selecionarPorAtributo( 'name', name );
    },
    
    /**
     * Seleciona um elemento pelo atributo 'nomereal'
     * 
     * @param stirng nomeReal Valor que o atributo deve conter
     * @return Superlogica_Js_Elemento
     */
    getElementoPorNomeReal : function( nomeReal ){
        return this.selecionarPorAtributo( 'nomereal', nomeReal );
    },
    
    /**
     * Seleciona um elemento pelo atributo 'nomeReduzido'
     * 
     * @param stirng nomeReduzido Valor que o atributo deve conter
     * @return Superlogica_Js_Elemento
     */
    getElementoPorNomeReduzido : function( nomeReduzido ){
        return this.selecionarPorAtributo( 'nomeReduzido', nomeReduzido );
    },
    
    /**
     * Seleciona um elemento pelo 'atributo' que contenho o valor igual a 'valorAtributo'
     * 
     * @param stirng atributo Nome do atributo
     * @param stirng valorAtributo Valor que o atributo deve conter
     * @return Superlogica_Js_Elemento
     */
    selecionarPorAtributo : function( atributo, valorAtributo ){
        var $elemento = null;
        var seletor = [];
        Object.each( ['input','textarea','select','button','div'], function( tagName ){
            //if ( $elemento ) return false;
            //$elemento = this.encontrar( tagName+"[" + atributo + "='" + valorAtributo + "']");
            seletor.push( tagName+"[" + atributo + "='" + valorAtributo + "']" );
        }, this );
        $elemento = this.encontrar( seletor.join(', '));
        return $elemento && $elemento.contar() ? $elemento : null;
    },

   /**
    *  Retorna um elemento
    *  
    *  @param string name
    *  @param Superlogica_Js_Form_Element
    *  @return Superlogica_Js_Form_Elementos
    */
    getElemento : function ( name ){
        
        // Seleciona pelo name
        var $elemento = null;
        Object.each( [name.toUpperCase(), name.toLowerCase(), name], function(  valor ){
            if ( $elemento ) return false;
            $elemento = this.getElementoPorName( valor );
        }, this );

        if ( !$elemento ){
            // Seleciona pelo nomeReal
            Object.each( [name.toUpperCase(), name.toLowerCase()], function( valor ){
                if ( $elemento ) return false;
                $elemento = this.getElementoPorNomeReal(  valor );
            }, this );
        }

        if ( !$elemento ){
            // Seleciona pelo nomeReduzido
            Object.each( [name.toUpperCase(), name.toLowerCase()], function( valor ){
                if ( $elemento ) return false;
                $elemento = this.getElementoPorNomeReduzido(  valor );
            }, this );
        }

        if ( !$elemento  )
            return null;
                
        if (  $elemento.atributo('type') == 'hidden' ){
            var $checkbox = null;
            Object.each( [name.toUpperCase(), name.toLowerCase(), name ], function( valor ){
                if ( $checkbox  ) return false;
                $checkbox = this.encontrar( "input[type='checkbox'][name='" + valor + "']");
            }, this );
            
            if ( $checkbox )
                $elemento = $checkbox;

        }
        return new Superlogica_Js_Form_Elementos( $elemento );
        
    },
    
    /**
     * Retorna todos elementos do form
     * @return Superlogica_Js_Form_Elementos
     */
    getElementos : function( comElementoTexto ){
        var seletor = 'input,textarea,select,button';
        if ( comElementoTexto === true )
            seletor = seletor+',div[name]';
        return new Superlogica_Js_Form_Elementos( this.encontrar(seletor) );
    },

    /**
     * Retorna o elemento label
     * @return Superlogica_Js_Form_Elementos
     */
    getLabel : function( name ){

        var $elemento = null;
        $elemento = this.encontrar('label[for='+ name +']');
        if ( !$elemento  ) return null;
        return new Superlogica_Js_Form_Elementos( $elemento );
    },

    getBotaoExcluir : function( indice ){
        
        var classeSubform = '.subFormExcluir';
        if ( indice > 0 ) classeSubform += indice;
        
        var botoesExcluir = this.encontrar('div.item ' + classeSubform);
        if ( !botoesExcluir  ) return null;
        return new Superlogica_Js_Form_Elementos( botoesExcluir );
    },

    /**
     *
     * @param object extraParams Parametros extras que não
     *      estão presentes no formulários ( tem prioridade sobre os que já estão )
     * @return Superlogica_Js_Response
     */
 	/**
     *  Retorna o template de um subform
     *
     *  @param string name
     *  @param Superlogica_Js_Template
     */
    getSubForm : function (name){
        var elemento = this.encontrar("[comportamentos*=Superlogica_Js_Template][subform=" + name.toUpperCase() + "]");
        if ( !elemento || !elemento.contar() ){
            elemento = this.encontrar("[comportamentos*=Superlogica_Js_Template][subform=" + name.toLowerCase() + "]");
        }
        if ( !elemento || !elemento.contar() ){
            elemento = this.encontrar("[comportamentos*=Superlogica_Js_Template][subform=" + name + "]");
        }
        if ( !elemento || !elemento.contar() ){
            return null;
        }
        /*var subForm = $elemento.getDados('Superlogica_Js_Template');
        if (subForm == null){
           $elemento.removerAtributo('loaded'); // não deveria estar aqui, mas há um bug na classe Superlogica_Js_Template
           new Superlogica_Js_Template().renderizar();  //idem
           subForm = $elemento.getDados('Superlogica_Js_Template');
        }*/
        return elemento;
    },
    
    /**
     * Retorna os subforms do formulário atual
     * @return Superlogica_Js_Form
     */
    getSubForms : function(){
        return new Superlogica_Js_Form( this.encontrar('.subForm') );
    },

   /**
     * Submete o formulário de acordo com seus atributos
     *
     * @return Superlogica_Js_Response
     * 
     * */
    submeter : function( options, classe ){
        options = typeof options == 'object' ? options : {};
        var dados = this.toJson( classe );        
        this.simularEvento('beforeSubmit', [dados]);      
        var attrAction = 'action' + ( classe ? classe : '' );
        var location = new Superlogica_Js_Location( this.atributo(attrAction) );
        var url = location.setApi( true ).toString();
        var btnSubmit = typeof options.handler != 'undefined' ? options.handler : this.encontrar('input[type="submit"]:first');
        var request = new Superlogica_Js_Request( url, dados );
            request.setHandler( btnSubmit );
        
        var formulario = this;
        options.response = options.response ? options.response : {};
        var oldResponse = options.response.callbackFunction;
        options.response.callbackFunction = function(){
            formulario.focar();
            if ( typeof oldResponse == 'function')
                oldResponse.apply(this,arguments);
        };
        request.setTimeOut( formulario.atributo('timeout') );
        request.setResponseOptions( options.response );
        var response = null;
        if ( options.callback ){
            var form = this;
            response = request.enviarAssincrono(function(response){
                form._aposSubmeter.apply( form, [response, dados]);
                options.callback.apply( form, [response]);
            });
        } else {
            response = request.getResponse();
            this._aposSubmeter( response, dados );
            return response;
        }
    },
    
    _aposSubmeter : function( response, dados ){
        var atualizarDados =  parseInt(this.atributo('atualizardados'));        
        
        if ( ( response.isValid() ) && ( isNaN(atualizarDados) || atualizarDados === 1 ) ){
            this.atributo('data', new Superlogica_Js_Json( dados ).encode() );
        }
        
        var aposSubmeter = this.atributoToArray('aposSubmeter');
        if (aposSubmeter){
        	
            Object.each( aposSubmeter, function( item, chave){
                if ( typeof this[ '__'+ item ] != 'function' )
                    throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form.";
                else
                    this[ '__'+ item ]( this, response );
            }, this );
        }
        
        var msgOff =  parseInt(this.atributo('msgsucessoff'));				
		if (isNaN(msgOff) || msgOff != 1) {								
			if ( response.isValid() ){
				var msgSucesso = this.atributo('msgsucesso');
				// if ( (typeof msgSucesso == 'undefined') || (msgSucesso === false) ){
				// 	msgSucesso = "Salvou com sucesso"; // Agora sempre pega do atributo do formulário
				// }
				if ( msgSucesso )
					new Superlogica_Js_Notificacao( msgSucesso ).show();
			}
        }	

        if ( response.isValid() && response.getData(0) && parseInt( response.getData(0).status ) === 200 ){
            this.deleteFromCookie();
        }
        
        if ( response.isValid() )
            this._getOpcoesAssistente(true);
                
        var fecharAposSalvar = this.getElemento('CONTINUAR_CADASTRANDO_APOS_SALVAR') ? ( this.getElemento('CONTINUAR_CADASTRANDO_APOS_SALVAR').getJson() == 0 ) : true;
        if ( ( fecharAposSalvar ) && ( response.isValid() ) ){
            
            this.atributo('limpar', '0');
            var fechar = this.getElemento('fechar');
            if ( fechar )
              fechar.simularClique();
        }
    },

    /**
     * Função sobrescrita para retornar a instancia desta Classe
     * 
     * @param string query Consulta a ser executada no elemento atual
     * @return Superlogica_Js_Form
     */
    encontrar : function (query){
        var $retorno = this.parent( query );
        if ( $retorno && $retorno.contar() > 0 ){
            return new Superlogica_Js_Form($retorno);
        } else{
            return null;
        }
    },


    openDialogo : function(){

//        modal-sm
        var form = this;
                
        var elementosBotoesPadroes = form.encontrar('.botoesPadroes');
        if ( elementosBotoesPadroes ){
            
            form.encontrar('dl.zend_form').envolverTudo( "<div class='corpoDoForm'></div>" );
            elementosBotoesPadroes.inserirDepoisDe( form.encontrar('.corpoDoForm') );
            elementosBotoesPadroes.adicionarClasse('modal-footer');            
            var flCadstrarOutro = parseInt( form.atributo('cadastrar_outro') );
            
            if ( flCadstrarOutro == 1 ){
                var elemento = new Superlogica_Js_Form_Elementos("<div class='item' style='display: block;'><label class='ui-checkbox'> <input type='checkbox' name='CONTINUAR_CADASTRANDO_APOS_SALVAR' class='integer naoLimpar' comportamentos='Form.integer'> <span><button type='button' comportamentos='Form_Elementos.linkMarcarCheckbox' class='btn btn-link checkbox-trigger' >Após salvar cadastrar outro</button></span></label></div>");
                elemento.adicionarAoInicioDe( form.encontrar('.botoesPadroes fieldset') );
            }
            
            form.encontrar('.botoesPadroes').carregarComportamentos();

            var btFechar = elementosBotoesPadroes.getElemento('fechar');
            if ( btFechar ){
                btFechar.atributo('data-dismiss', 'modal');        
            }            
        }
       
       form.parent();
              
    },    

    /**
     *
     *  COMPORTAMENTOS PARA OS FORMULARIOS
     *
     *
     */

    /**
     * Evento para adicionar mais um item no subform
     */
    __subformMaisItens : function(){

        var elemento = new Superlogica_Js_Form_Elementos( this );
        
        this
            .bind(
                'click',
                function ( event ){
                    var formulario = elemento.getForm();                    
                    event.preventDefault();
                    var subForm = formulario.getSubForm( this.atributo('subform' ) );
                    var template = new Superlogica_Js_Template( subForm );

                    var proximoIndice = template.getUltimoIndice()+1;
                        template.adicionarLinha( {'empty':''} , proximoIndice );
                    // Foca no primeiro elemento do novo item
                    var form = new Superlogica_Js_Form( template.getLinhaComoElemento( proximoIndice ) );
                    form.focar();

                    if ( typeof this['__'+'aposAdicionarSubForm'+template.atributo('subform')] == 'function'){
                        var dadosTemplate = new Superlogica_Js_Form( template._HTMLGetLinhaDesenhada( this.atributo('indice') ) ).toArray();
                        this['__'+'aposAdicionarSubForm'+template.atributo('subform')]( dadosTemplate, formulario);
                    }


                    //template.adicionarClasse('subFormComMultiplosDados');
//                    template.encontrar('.subformExcluir:first').mostrar();
                }
            );
    },
    
    /**
     * Evento para excluir um item do subform
     */
    __subFormExcluir : function(){
        this
            .bind(
                'click',
                function ( evento ){
                    //if ( evento.which === 1 ) return false;
                    evento.preventDefault();
                    var templateSubform = new Superlogica_Js_Template( this ).getClosestInstance();
                    
                    var dadosTemplate = new Superlogica_Js_Form( templateSubform._HTMLGetLinhaDesenhada( this.atributo('indice') ) ).toArray();
                    var formulario = new Superlogica_Js_Form_Elementos( this ).getForm();
                    
                    if ( typeof this['__'+'antesExcluirSubForm'+templateSubform.atributo('subform')] == 'function'){
                        var respostaAntesExcluir = this['__'+'antesExcluirSubForm'+templateSubform.atributo('subform')]( dadosTemplate, formulario, this.atributo('indice') );
                        if ( respostaAntesExcluir === false) return;
                    }
                    
                    var linhaExcluida = parseInt( this.atributo('indice') );
                    if ( templateSubform.getTotalLinhas() <= 1 ){   
                        
                        templateSubform.adicionarLinha( {'empty':''}, templateSubform.getUltimoIndice() );
                        
//                        Ademilson diz: comentei esse código para que a linha 0 seja excluída como as outras são. Conversei também com o Alan
//                    }else if ( !isNaN(linhaExcluida) && linhaExcluida === 0 ){
//                        
//                        var dados = new Superlogica_Js_Form( templateSubform ).toJson()[templateSubform.atributo('subform')];
//                        delete dados[ this.atributo('indice') ];
//                        templateSubform._setData( dados );
//                        templateSubform.redesenhar();
//                        var contexto = this;
//                        templateSubform._depoisDeDesenharLinha = function(){
//                            if ( typeof contexto['__'+'aposExcluirSubForm'+templateSubform.atributo('subform')] == 'function'){
//                                contexto['__'+'aposExcluirSubForm'+templateSubform.atributo('subform')]( dadosTemplate, formulario);
//                            }
//                        }
//                        return true;
                    } else {
                        templateSubform.removerLinha( this.atributo('indice') );
                    }                                       

                    var contexto = this;
                    setTimeout(function(){
                        if ( typeof contexto['__'+'aposExcluirSubForm'+templateSubform.atributo('subform')] == 'function'){
                            contexto['__'+'aposExcluirSubForm'+templateSubform.atributo('subform')]( dadosTemplate, formulario);
                        }
                    }, 100 );
                }
            );
    },


    /**
     * Comportamento para campos numéricos
     */
    __numeric : function(){
        this.emCadaElemento(function(){
            var elemento = new Superlogica_Js_Form_Elementos( this );
            var options = {};
            var format = elemento.atributo('format');
            if ( format )
                options['aNum'] = format;
            
            var decimal = elemento.atributo('decimal');
            if ( decimal )
                options['mDec'] = decimal;
            
            var autoPadding = parseInt( elemento.atributo('autoPadding'), 10);
            if ( !isNaN(autoPadding) )
                options['aPad'] = autoPadding === 1 ? true : false;

            elemento.numeric( options );

        });
    },

    __hint : function(){
        new Superlogica_Js_Form_Elementos( this ).hint();
    },
    
    /**
     * Adiciona comportamento para campos currency
     */
    __currency : function(){
        new Superlogica_Js_Form_Elementos( this ).currency();
    },

    /**
     * Adiciona comportamento para campos integer
     */
    __integer : function(){
        if ( this.eh('input'))
            new Superlogica_Js_Form_Elementos( this ).integer();
    },

    /**
     * Adiciona comportamento para formatar valores
     */
    __formatar : function(){
        this.emCadaElemento(function(){
            var elemento = new Superlogica_Js_Form_Elementos(this);
            var format = elemento.atributo('format').split('|');
            
            var tipo = format[0];
            var params = {};

            for ( var x =1; format.length > x; x++){
                if ( format[x] ){
                    var param = format[x].split(':');
                    params[param[0]] = param[1];
                }
            }

            switch (tipo){

                case 'currency':
                    params['allow'] = '.,-';
                    tipo = "numeric";
                    break;
            }
            
            if( typeof elemento.$_elemento[tipo] == 'function'){
                elemento.$_elemento[tipo](params);
            }else if ( typeof elemento[tipo] == 'function' ){
                elemento[tipo](params);
            }

        });
    },

    /**
     * Comportamentos dos links que exibem um formulário escondido
     */
    __formExibir : function(){
        this
            .bind(
                'click',
                function(event){
                    event.preventDefault();
                    var id = this.atributo('divid');
                    if ( id ){
                        var prefixoId = this.atributo('prefixoId');
                        if ( typeof prefixoId != 'undefined'){
                            id = prefixoId+'-'+id ;
                        }

                        var form = new Superlogica_Js_Form( '#' + id );
                        form.resetar();
                        form.focar();
                    }

                }
            );
    },

    /**
     * Comportamentos dos links que exibem um formulário
     */
    __openDialog : function(){
        this
            .bind(
                'click',
                function(event){
                    
                    event.preventDefault();
                    var id = this.atributo('divid');
                    
                    if ( id ){
                        var prefixoId = this.atributo('prefixoId');
                        if ( typeof prefixoId != 'undefined'){
                            id = prefixoId+'-'+id ;
                        }

                        var formDiv = new Superlogica_Js_Form( '#' + id );
                        var form = formDiv.encontrar('form').clonar();
                        
                        var dataAtual =  new Superlogica_Js_Json( form.atributo("data") ).extrair();
                        if (typeof dataAtual != 'object')
                            dataAtual = {};
                        
                        var dataLink =  new Superlogica_Js_Json( this.atributo('data') ).extrair();
                        if (typeof dataLink != 'object')
                            dataLink = {};
                        
                        var dadosForm = Object.merge( dataLink, dataAtual );
                        
                        var comportamentos = form.atributo('comportamentos');
                        if ( comportamentos.indexOf('popularAoCarregar') === -1 ){
                            form.atributo( 'comportamentos', comportamentos + ' Form.popularAoCarregar' );
                        }
                        
                        form.atributo('data', new Superlogica_Js_Json( dadosForm  ).encode() );
                        form.atributo('cadastrar_outro', this.atributo('cadastrar_outro') );

                        form.openDialogo();
                    }

                }
            );
    },
    
   /**
    * Submete o formulario usando o método get
    */

    __submeterUsandoGet: function(){
        this
            .bind(
                'submit',
                function(event){
                    event.preventDefault();
                    var form = new Superlogica_Js_Form( this );
                    var params = form.toJson();
                    var location = new Superlogica_Js_Location();
                    Object.each( params, function( item, chave ){
                        location.setParam( chave, item );
                    });
                    document.location = location.toString();
                });
        
    },


   /**
    * Submete o formulario usando o ajax
    */

    __submeterUsandoAjax: function(){
        var aposSubmeter = function( response ){
            var form = this;
            var arDadosForm = form.toArray();

            var limpar = parseInt( form.atributo('limpar') );
            if ( response.isValid() && limpar !== 0  ){
                form.limpar().focar();

                var aposLimpar = form.atributoToArray('aposLimpar');
                if (aposLimpar){

                    Object.each( aposLimpar, function( item, chave){
                        if ( typeof this[ '__'+ item ] != 'function' )
                            throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form.";
                        else
                            this[ '__'+ item ]( form, arDadosForm );
                    }, this );
                }

            }
        };
        
        this
            .bind(
                'submit',
                function(event){                          
                    event.preventDefault();
                    var form = new Superlogica_Js_Form( this );
                    if ( parseInt( form.atributo("async"), 10 ) === 1 ){
                        form.submeter({ 'callback' : 
                            function( response ){
                                aposSubmeter.call( form, response );
                            }
                        });
                    } else {
                        response = form.submeter();
                        aposSubmeter.call( form, response );
                    }
                    
                });
    },
    

   /**
    * Popula o formulário com as variáveis obtidas na url
    */
    __popularComGet : function(){
        this.popular(new Superlogica_Js_Location().getParams());
    },

    __autofoco : function(){
        this.focar();
    },
    
    /**
     * Fecha o formulário automaticamente quando for excluiro com sucesso
     */
    __aposExcluirComSucessoFechar : function(form, response){
    	if ( !response.isValid()) return;
		form.encontrar(".fechar").simularClique();
    },    
    /**
     * Fecha o formulário automaticamente quando for submetido com sucesso
     */
    __aposSubmeterComSucessoFechar : function(form, response){
    	if ( !response.isValid()) return;
		form.encontrar(".fechar").simularClique();
    },

    /**
     * Comportamento para popular formulário pelo atributo popular
     */
    __popularAoCarregar : function(){
        
        var dados = new Superlogica_Js_Json( this.atributo('data') ).extrair();
        
        if ( !dados ) return true;
        var form = this;

        var antesPopular = form.atributo('antesPopular');
        if ( antesPopular && antesPopular.trim() ){
            Object.each( antesPopular.split(' '), function( valor ){
                if ( typeof this['__'+valor] == 'function'){
                    this['__'+valor]( dados );
                }
            }, this );
        }

        /*Object.each( dados, function(valor, chave){
            if ( typeof valor != 'object'  ) return true;
            var subform = form.getSubForm( chave );
            if ( !subform ) return true;
            var data = new Superlogica_Js_Json( dados[chave] ).encode();
            if ( ( !data ) || ( (typeof dados[chave] == 'object') && ( Object.getLength(dados[chave]) <= 0) )){
                data= [{'empty':'1'}];
            }
            dados[chave] = data;
            //subform.atributo('data', data );
            if ( typeof dados[chave] == 'object' && Object.getLength(dados[chave]) > 1 ){
                subform.adicionarClasse('subFormComMultiplosDados');
            }
            //delete( dados[chave] );
        });*/

        form.popular( dados );
        
        var aposPopular = form.atributo('aposPopular');
        if ( aposPopular && aposPopular.trim() ){
            Object.each( aposPopular.split(' '), function( valor ){
                if ( typeof this['__'+valor] == 'function'){
                    this['__'+valor]( dados );
                }
            }, this );
        }
    },

    /**
     * Retorna o display group a partir do nome.
     * @param nome Nome do displayGroup
     */
    getDisplayGroup : function( nome ){

        return this.encontrar('[id$="fieldset-'+nome+'"]' );
    },

    /**
     * faz a requisição com os dados do formulário
     */
    __submeterComDadosDoFormulario : function(){

        this.bind('submit', function( evento, dados ){

            evento.preventDefault();
            var dados = this.toJson();
            delete dados['salvar'];

            var location = new Superlogica_Js_Location();
            location.setParams( dados );
            window.location = location.toString();
        })
    }, 
    
    /**
     * Disabilita os campos do Form e habilita ao clicar   
     *
     */
    __habilitarAoClicar : function(elemento, _classe){
        
        var form = new Superlogica_Js_Form( this );
            form.desabilitar();
        this.bind('focusin', function(evento){
            form.habilitar();
        }).bind('focusout', function(evento){            
            if ( !mouseEntered ){
                form.desabilitar();
            }
        });

        var mouseEntered = true;        
        this.bind('mouseover', function(){
            mouseEntered = true;
        }).bind('mouseout', function(){
            mouseEntered = false;
        });
    },
    
    __autoSize : function(){
        
        var maxWidth = parseInt(this.atributo('maxlength'),10);
        var minWidth = parseInt(this.atributo('minlength'),10);
        var comfortZone = parseInt(this.atributo('comfortZone'),10);
        
        var o = {
            "maxWidth": !isNaN(maxWidth) && maxWidth > 0 ? maxWidth : 500,
            "minWidth": !isNaN(minWidth) && maxWidth >= 0 ? minWidth : 50,
            "comfortZone" : !isNaN(comfortZone) && maxWidth >= 0 ? comfortZone : 20
        };
        
        minWidth = o.minWidth;
        var val = '';
        var input = new Superlogica_Js_Form_Elementos(this);
        var testSubject = new Superlogica_Js_Elemento('<tester/>').css({
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontSize: input.css('fontSize'),
            fontFamily: input.css('fontFamily'),
            fontWeight: input.css('fontWeight'),
            letterSpacing: input.css('letterSpacing'),
            whiteSpace: 'nowrap'
        });
        
        testSubject.inserirDepoisDe(input);
        
        this.bind('keyup keydown blur update', function(){

            if (val === (val = input.getValue().trim())) {return;}

            // Enter new content into testSubject
            var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            testSubject.conteudo(escaped);
                        
            // Calculate new width + whether to change
            var testerWidth = testSubject.largura();
            var newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth;
            var currentWidth = input.largura();
            var isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                     || (newWidth > minWidth && newWidth < o.maxWidth);
            
            //alert('aqui');
            
            // Animate width
            if (isValidWidthChange) {
                input.largura(newWidth);
                input.atributo('size',newWidth);
            }

        }).simularEvento('keyup');
        
    },
    
    __testeEmail : function(){
        this.bind( 'click', 
            function(event){
                event.preventDefault();
                var params= {};
                var elemento = new Superlogica_Js_Form_Elementos( this );
                var form = elemento.getForm();
                var formEmail = form.getDisplayGroup("Enviodeemail");
                params['remetente'] = formEmail.getElemento('SMTP_SENDER').getValue();
                params['email'] = formEmail.getElemento('SMTP_EMAIL').getValue();
                params['senha'] = formEmail.getElemento('SMTP_SENHA').getValue();
                params['pop'] = formEmail.getElemento('SMTP_POP').getValue();
                params['pop_port'] = formEmail.getElemento('SMTP_POPPORT').getValue();
                params['smtp'] = formEmail.getElemento('SMTP_HOST').getValue();
                params['smtp_port'] = formEmail.getElemento('SMTP_PORT').getValue();                
                params['usuario'] = formEmail.getElemento('SMTP_USUARIO').getValue();
                params['tls'] = formEmail.getElemento('SMTP_TLS').getValue();
                params['auth'] = formEmail.getElemento('SMTP_AUTH').getValue();
                if(APPLICATION_CONF['MODULE_ID'] == 'financeiro')
                    params['cco'] = formEmail.getElemento('SMTP_CCO').getValue();
                var dataAtual = new Superlogica_Js_Date().toString('r');

                if(params['remetente'] == '' || params['email'] == ''){
                    alert('Nome e E-mail do remetente devem ser preenchidos!');
                    return true;
                }
                else if(params['senha'] == ''){
                    alert('Senha do remetente deve ser preenchida!');
                    return true;
                }

                var emlTeste = "Subject: Teste de envio\n"+
                "To: "+params['remetente']+" <"+params['email']+">\n"+
                "Content-Type: multipart/alternative; boundary=20cf3011e1155125f404b1ed2e5b\n"+
                "Date: "+dataAtual+"\n"+
                "MIME-Version: 1.0\n\n"+

                "--20cf3011e1155125f404b1ed2e5b\n"+
                "Content-Type: text/plain\n"+
                "Content-Transfer-Encoding: quoted-printable\n\n"+

                "Isto é um teste de envio.\n\n"+

                "--20cf3011e1155125f404b1ed2e5b\n"+
                "Content-Type: text/html\n"+
                "Content-Transfer-Encoding: quoted-printable\n\n"+

                "Isto é um teste de envio.\n\n"+

                "--20cf3011e1155125f404b1ed2e5b--";
                            

                var location = new Superlogica_Js_Location();
                params['ST_EMAIL_FE'] = emlTeste;
                var dados = {
                    'todos' : params
                    };
                location.setController("filadeemails")
                .setAction("teste")
                .setApi(true);                        
                
                var linkTeste = formEmail.getElemento('SMTP_TESTE');
                var request = new Superlogica_Js_Request(location.toString(), dados );
                request._handler = linkTeste;
                response = request.getResponse();

                if(response.isValid())
                    alert('E-mail enviado com sucesso para '+params['email']);

            });

    },

    __ajudaEmail : function(){            

        var elemento = new Superlogica_Js_Form_Elementos( this );
        var form = elemento.getForm();
        var label = form.encontrar('label[for=SMTP_AJUDA]');

        new Superlogica_Js_Elemento('<a href="http://superlogica.com/faq/00259" target="_blank" class="clearfix link">'+
                label.conteudo()+
            '</a>').inserirDepoisDe( label );
        
            label.remover();
        
        form.getElemento('SMTP_AJUDA').remover();

    },

    __collapsible : function(){
        var elementosDobraveis = this.encontrar('.collapsible');
        var imgDown = 'fa-angle-down';
        var imgRight = 'fa-angle-right';

        if ( elementosDobraveis ){
            elementosDobraveis.emCadaElemento(function(){
                var legend = new Superlogica_Js_Elemento( this.encontrar('legend:first') );

                var legendsExtras = this.encontrar('legend:eq(1)');
                if ( legendsExtras )
                    legendsExtras.remover();

                if ( legend.contar() <=0 || legend.getDados('collapsible') || this.eh('.collapse_fixed') )
                    return true;
                this.adicionarClasse('form_accordion_item');
                var fieldset = this;
                
                legend.unbind('click.collapsible').bind("click.collapsible", function(evento){
                    evento.preventDefault();
                    evento.stopPropagation();
                    var closed = fieldset.temClasse('closed');
                        fieldset.alternarClasse('closed');                    
//                    fieldset[ closed ? "adicionarClasse" : "removerClasse"]('opened'); 
                    
                    this.encontrar('.fa')
                        .removerClasse( imgDown+ ' ' + imgRight )
                        .adicionarClasse( closed ? imgDown : imgRight );

                    if ( closed ){
                        new Superlogica_Js_Form(fieldset).focar();
                    }
                    fieldset = new Superlogica_Js_Form_Elementos( fieldset );
                    if ( typeof fieldset[ '__' + fieldset.atributo('aoExpandir') ] == 'function' )
                        fieldset[ '__' + fieldset.atributo('aoExpandir') ]( closed );
                });
                
                legend.setDados( 'collapsible', true );
                
                if ( legend.encontrar('button') )
                    return true;

                legend.envolverDentro('<button type="button"></button>');

                var fieldset = legend.maisProximo("fieldset");
                var fieldsetFechado = fieldset.temClasse('closed');
                legend.adicionarHtmlAoInicio('<span class="fa '+ (fieldsetFechado ? imgRight : imgDown) +'"></span>');
                
            });            
        }

        
    },
    
    __verificarFormAutocomplete : function(form, response){
        if ( response.isValid() ){
            
            var dadosAutocomplete = this.getDados('autocompleteFormAtual');
            var valores = new Superlogica_Js_Json( dadosAutocomplete.autocomplete.atributo('mostrar') ).extrair();
            var item = response.getData();
            var label = '';
            var deletarCampos = [];
            Object.each(valores, function ( val, indice){
                if (label){
                    label = label + " " + item[ val.toLowerCase() ];
                }else{
                    label = item[ val.toLowerCase() ];
                }
            });
            
            dadosAutocomplete.autocomplete.atributo('selectValue', label );
            dadosAutocomplete.autocomplete.setValue(label);
            
            var popular = new Superlogica_Js_Json( dadosAutocomplete.autocomplete.atributo('popular') ).extrair();
            var dadosPopular = {};
            Object.each(popular, function ( response, elemento ){

                /*se for popular um campo com vários valores*/
                if(typeof response == 'object'){

                    Object.each(response, function(element, indice){
                        if (typeof item[ element.toLowerCase() ] != 'undefined'){

                            if (typeof dadosPopular[elemento] != 'undefined'){
                                dadosPopular[elemento] = dadosPopular[elemento] + " " + item[ element.toLowerCase() ];
                            }else{
                                dadosPopular[elemento] = item[ element.toLowerCase() ];
                            }
                        }
                    })

                }else if (typeof item[ response.toLowerCase() ] != 'undefined'){

                    if (typeof dadosPopular[elemento] != 'undefined'){
                        dadosPopular[elemento] = dadosPopular[elemento] + " " + item[ response.toLowerCase() ];
                    }else{
                        dadosPopular[elemento] = item[ response.toLowerCase() ];
                    }
                }
                
                
                
            });

            // Retira o próprio autocompelte do array para popular o form
            var autocompleteName = dadosAutocomplete.autocomplete.atributo('name');
            var autocompleteNomeReal = dadosAutocomplete.autocomplete.atributo('nomereal');
            var autocompleteNomeReduzido = dadosAutocomplete.autocomplete.atributo('nomereduzido');            
            Object.each([ autocompleteName, autocompleteNomeReal, autocompleteNomeReduzido ], function( name ){
                if ( typeof name == 'string' && name != '' ){
                    delete dadosPopular[ name.toLowerCase() ];
                    delete dadosPopular[  name.toUpperCase() ];
                }
            });
            
            dadosAutocomplete.autocomplete.getForm().popular( dadosPopular );
            this.getElemento("fechar").simularClique();
            
            var elementoAtual = dadosAutocomplete.autocomplete;
            var timeoutFocarProximoCampo = function(){
                // Foco no próximo campo
                var proximoElemento = new Superlogica_Js_Form( elementoAtual.maisProximo('.item').proximo() ).getElementos();
                
                if ( !proximoElemento || (proximoElemento.contar() <= 0) )
                    return true;
                
                if ( proximoElemento.eh(':visible') )
                    proximoElemento.focar();
                else{
                    elementoAtual = proximoElemento;
                    timeoutFocarProximoCampo();
                }
            };
            setTimeout( timeoutFocarProximoCampo, 10 );

        }
    },
    
    /**
     * Armazena as informações do form em um cookie
     */
    saveToCookie : function(){
        var dados = this.toJson();
        var cookieName = this.atributo('cookie_name');
        Cookie.write( 
            cookieName ? cookieName : this.atributo('id'),
            JSON.encode(dados),
            { 'duration' : 1 } // duration em dias
        );
    },
    
    /**
     * Popula o form com as informações salvas no cookie caso ele exista
     */
    loadFromCookie : function(){
        var cookieName = this.atributo('cookie_name');
        var dados = Cookie.read( cookieName ? cookieName : this.atributo('id') );
        if ( dados )
            this.popular( JSON.decode(dados) );
    },
    
    /**
     * Deleta o cookie do form
     */
    deleteFromCookie : function(){
        var cookieName = this.atributo('cookie_name');
        Cookie.dispose( cookieName ? cookieName : this.atributo('id') );
    },
            
    /**
     * Retorna o objeto com as configurações do assistente
     * @return object
     */            
    _getOpcoesAssistente : function( verificarPassos ){
        
        if ( typeof verificarPassos == 'undefined' )
            verificarPassos = false;
        
        var opcoes = this.getDados('assistente_processado');
        if ( !verificarPassos ) return opcoes;
        
        var opcoesForm = this.getDados('assistente');
        opcoes = Object.merge( 
            this._assistenteConfigPadroes,
            typeof opcoesForm == 'object' ? opcoesForm : {}
        );
            
        if ( typeof opcoes.itens !='object' ) 
            return true;
        
        var result = [];
        var retorno;
        var nomeFuncao;
        Object.each( opcoes.itens, function( valor, nome ){
            
            retorno = true;
//            nomeFuncao = "__aoProcessar" + new String(nome).capitalize();
            nomeFuncao = "__passo" + new String(nome).capitalize()+"Ativo";
            if ( typeof this[ nomeFuncao ] == 'function' ){
                retorno = this[ nomeFuncao ]( valor );
            }

            if ( retorno !== false ){
                result[nome] = valor;
            }
            
        }, this);
        
        opcoes.itens = result;
        
        this.setDados('assistente_processado', opcoes);
        return opcoes;
    },
    
    _adicionarAtributosElementos : function(){

        var opcoesForm = this.getDados('assistente');
        var opcoes = Object.merge( 
            this._assistenteConfigPadroes,
            typeof opcoesForm == 'object' ? opcoesForm : {}
        );
        if ( !opcoes.itens || typeof opcoes.itens != 'object')
            return true;
        
        var itens = [];
        var passo = 0;
        var nomesPassos = [];
        Object.each( opcoes.itens, function( campos, nomePasso ){
            Object.each ( campos.elementos, function( campo ){
                itens[campo.toLowerCase()] = nomePasso;
                nomesPassos[passo+1] = nomePasso;
            });            
            passo++;
        });
        
        var formulario = this;
        formulario.setDados( 'nomesPasssos', nomesPassos );
        var adicionarAtributosElemento = function( elemento, passo ){

            elemento.adicionarClasse(opcoes.classGenerica);            
            if ( passo ){                
                elemento.adicionarClasse( opcoes.classPassoEspecifico + passo )
                    .atributo('passo', passo );
            }
        };
        
        var removerAtributosElemento = function( elemento ){
            var totalPassos = Object.getLength( opcoes.itens );
            elemento.removerClasse(opcoes.classGenerica);
            for ( var x=0; x<totalPassos;x++ ){
                elemento.removerClasse( opcoes.classPassoEspecifico + nomesPassos[x] )
                    .removerAtributo('passo', nomesPassos[x] );
            }
            
        };
        
        this.getElementos(true).emCadaElemento(function(){
            if ( this.eh( opcoes.seletorElementoIgnorado ) ) 
                return true;

            var elemento = new Superlogica_Js_Form_Elementos(this);            
            var nomeElemento = elemento.atributo('name').toLowerCase();
            removerAtributosElemento(elemento);
            adicionarAtributosElemento( elemento, itens[nomeElemento] );
        });
        
        // Esconde os subforms
        this.getSubForms().emCadaElemento(function(){
            removerAtributosElemento(this);
            adicionarAtributosElemento(this);
            this.adicionarClasse('blocoEscondido');
        });
        
        Object.each( itens, function( passo, campo ){
            var subform = formulario.getSubForm( campo );
            if ( subform && subform.contar() ){
                subform = new Superlogica_Js_Form(subform.maisProximo('.subForm'));
                adicionarAtributosElemento( subform, passo );
                subform.getElementos(true).emCadaElemento(function(){
                    if ( this.eh( opcoes.seletorElementoIgnorado ) ) 
                        return true;
                    removerAtributosElemento(this);
                    adicionarAtributosElemento( new Superlogica_Js_Form_Elementos(this), passo );
                });
            }
        });
    },
    
    /**
     * Retorna o nome do passo do indice informado
     * @return string
     */
    _getNomePassoByIndice : function( indice ){
        var opcoes = this._getOpcoesAssistente();
        if ( !opcoes.itens || typeof opcoes.itens != 'object')
            return true;
        var passo = '';
        var x=1;
        indice = parseInt(indice,10);
        Object.each( opcoes.itens, function( campos, nomePasso ){
            if ( indice == x )
                passo = nomePasso
            x++;
        });
        return passo;
    },
    
    /**
     * Retorna o indice do passo através do nome informado
     * @return int
     */
    _getIndiceByNomePasso : function( passo ){
        var opcoes = this._getOpcoesAssistente();
        if ( !opcoes.itens || typeof opcoes.itens != 'object')
            return true;
        var indice = '';
        var x=1;
        Object.each( opcoes.itens, function( campos, nomePasso ){
            if ( passo == nomePasso )
                indice = x;
            x++;
        });
        return indice;
    },
            
    /**
     * Comportamentos para criar e gerenciar o assistente do formulário
     */
    __assistente : function(){
        
        var formulario = this;        
        var opcoes = this._getOpcoesAssistente(true);
        formulario.setDados('assistentePassoAtual', this._getNomePassoByIndice(1) );
        formulario.adicionarClasse('assistente_superlogica');
        this._adicionarAtributosElementos();
        
        var callback =  function(event){
            event.preventDefault();
            event.stopPropagation();
            var elemento = new Superlogica_Js_Form_Elementos( this );
            var formulario = elemento.getForm();      
            var nomePasso = formulario.getDados('assistentePassoAtual');
            var aoAlterarPasso = '__depoisPasso' + nomePasso.capitalize();
            var permitirAlterarPasso = true;
            if ( typeof formulario[aoAlterarPasso] == 'function' ){
                permitirAlterarPasso = formulario[aoAlterarPasso]( 
                    parseInt(this.atributo('acao'),10) === 1,
                    new Superlogica_Js_Form( '<form></form>' )
                        .conteudo( formulario
                            .encontrar('.'+opcoes.classPassoEspecifico+formulario.getDados('assistentePassoAtual'))
                            .clonar() 
                        )
                        .popular( formulario.toJson() ) // Correção para Internet explorer ( ele remove os valores em inputs clonados )
                        .toJson()
                );
            }            
            if ( permitirAlterarPasso !== false ){  
                
                // caso esteja avançando o assistente então valida os campos
                if ( parseInt(this.atributo('acao'),10) === 1 ){
                  var elementosPassos = new Superlogica_Js_Form_Elementos( formulario
                    .encontrar('.'+opcoes.classPassoEspecifico+formulario.getDados('assistentePassoAtual')) 
                  );

                  if ( !elementosPassos.isValid() )
                    return false;

                }

                formulario._getOpcoesAssistente(true);
                var indicePasso = formulario._getIndiceByNomePasso( formulario.getDados('assistentePassoAtual') );
                var mostrarPasso = formulario._getNomePassoByIndice( parseInt(this.atributo('acao'),10) === 1 ? indicePasso+1 : indicePasso-1);
                formulario.mostrarPasso( mostrarPasso );
            }
            
        };
        var btnSubmit = this.getElemento("salvar");
            btnSubmit.esconder();
        var btnsAcao = this.encontrar('.'+opcoes.classBtnProximo+', .'+opcoes.classBtnAnterior);
        if ( btnsAcao && btnsAcao.contar() )
            btnsAcao.remover();
        
        var btnProximo = new Superlogica_Js_Elemento("<input type='submit' value='"+opcoes.textoProximo+"' acao='1' class='linkSubmit btn btn-primary btn-form "+opcoes.classBtnProximo+"' />");
            btnProximo.esconder().bind('click',callback);
        if ( opcoes.textoAnterior ){
            var btnAnterior = new Superlogica_Js_Elemento("<input type='button' value='"+opcoes.textoAnterior+"' acao='0' class='linkButton btn btn-default btn-form "+opcoes.classBtnAnterior+"' />");
                btnAnterior.esconder().bind('click',callback);
                btnAnterior.inserirAntesDe( btnSubmit );
        }

        btnProximo.inserirDepoisDe( btnSubmit );
        
        
        this.mostrarPasso( formulario.getDados('assistentePassoAtual'), false );
        
    },
    
    /**
     * Verifica se o passo informado pode ser mostrado
     * Caso não posso então retorna o nome do próximo/anterior passo ativo disponível
     */
    _tratarPasso : function( passo ){        
        var opcoes = this._getOpcoesAssistente();
        var proximoPasso = null;
        var indiceAnterior = this._getIndiceByNomePasso( this.getDados('assistentePassoAtual') );
        var avancando = true;
        do{
            
            var passoAtivo = false;
            Object.each(opcoes.itens, function( valor, nomePasso ){
                if ( nomePasso == passo ){
                    passoAtivo = true;
                }
            });

            if ( passoAtivo ){
                proximoPasso = passo;
                break;
            }

            var opcoesForm = this.getDados('assistente');
            opcoes = Object.merge( 
                this._assistenteConfigPadroes,
                typeof opcoesForm == 'object' ? opcoesForm : {}
            );

            
            var x = 1;
            var itens = {};
            var passoOrdenados = {};
            Object.each(opcoes.itens, function( valor, nomePasso ){
                itens[nomePasso] = x; 
                passoOrdenados[x] = nomePasso;
                x++;
            });
            
            avancando = indiceAnterior < itens[passo];
            passo = passoOrdenados[ avancando ? itens[passo]+1 :  itens[passo]-1  ];
            
        }while ( !proximoPasso && passo );
        
        return proximoPasso;
    },
    
    /**
     * Altera o título do assistente
     */
    alterarTitulo : function( titulo ){ 
        
        var tituloAssistente = this.encontrar(".titleWizard .titulo");
        if ( tituloAssistente ) tituloAssistente.conteudo( titulo );
        return this;
    },
    
    /**
     * Mostra o passo informado pelo parametro
     * 
     * @param int passo
     */
    mostrarPasso : function( passo, verificarPassos ){        
        var opcoes = this._getOpcoesAssistente(true);
        var formulario = this;
        var opcoesForm = this.getDados('assistente');
        
        if ( typeof opcoesForm == 'undefined' && opcoesForm )
            return true;
        
        if ( typeof verificarPassos == 'undefined')
            verificarPassos = true;
        
        var opcoes = this._getOpcoesAssistente( verificarPassos );
            
        if ( !opcoes || typeof opcoes.itens != 'object')
            return true;
        
        if ( !isNaN(parseInt(passo)))
            passo = this._getNomePassoByIndice( passo);
        
        passo = this._tratarPasso(passo);
        
        var infoPassoAtual = {};        
        var nomePassoAtual = '';
        var indicePassoAtual = this._getIndiceByNomePasso(passo);
        for ( var key in opcoes.itens ){
            if ( key == passo ){
                infoPassoAtual = opcoes.itens[key];
                nomePassoAtual = key;
            }
        }
        

        var btnSubmit = formulario.getElemento("salvar");
        
        var btnProximo = formulario.encontrar("."+opcoes.classBtnProximo);
        var btnAnterior = formulario.encontrar("."+opcoes.classBtnAnterior);
        var mostrarSalvar = false;
        var numPassos = Object.getLength(opcoes.itens);
        
        var itens = formulario.encontrar('.'+opcoes.classGenerica)
        if ( !itens ) 
            return true;
        
        itens.emCadaElemento(function(){

            var passoElemento = this.atributo("passo");
            var visibilidadeElemento = passoElemento != passo ? 'esconder' : 'mostrar';    
            var item = new Superlogica_Js_Form_Elementos( this ).getItem();
            if ( this.atributo('name') ){
                item[visibilidadeElemento]();
                if ( item.contar() <= 0 )
                    this[visibilidadeElemento]();
            }
            if ( this.atributo('name') == btnSubmit.atributo('name') && visibilidadeElemento == 'mostrar')
                mostrarSalvar = true;            
            var displayGroup = item.maisProximo('div.formDisplayGroup');
            if ( displayGroup ){
                displayGroup[visibilidadeElemento]();
            }

            var subform = this.maisProximo('.subForm');
            if ( subform ){
                subform[visibilidadeElemento]();
            }

        });
        
        var botoesPadroes = formulario.encontrar('.botoesPadroes');
        if ( botoesPadroes )
            botoesPadroes.mostrar();
        var elementoContinuarCadastrando = formulario.getElemento('CONTINUAR_CADASTRANDO_APOS_SALVAR');
        if ( elementoContinuarCadastrando )
            elementoContinuarCadastrando.getItem().mostrar();
        
        if ( opcoes.comBtnFechar )
            formulario.getElemento("fechar").mostrar();
        btnSubmit.esconder();
        btnProximo
            .atributo('value', infoPassoAtual.textoProximo ? infoPassoAtual.textoProximo : opcoes.textoProximo )
            .esconder();
    
        btnAnterior.atributo('value', infoPassoAtual.textoAnterior ? infoPassoAtual.textoAnterior : opcoes.textoAnterior ); 
        
        if ( btnAnterior )
            btnAnterior.esconder();

        if ( numPassos > 1 && btnAnterior && (indicePassoAtual > 1 || indicePassoAtual == numPassos) ){
            btnAnterior.mostrar();
        }
        
        if ( indicePassoAtual == numPassos || numPassos == 1 || mostrarSalvar )
            btnSubmit.mostrar();
                    
        if ( indicePassoAtual < numPassos )
            btnProximo.mostrar();                

        var titulo = infoPassoAtual.titulo;
        var elementoTitulo = formulario.encontrar(".tituloAssistente");
        if ( elementoTitulo && elementoTitulo.contar() )
            elementoTitulo.esconder();        
        
        var corpoDoForm = false;
        if ( titulo ){
            if ( !elementoTitulo || elementoTitulo.contar() <= 0 ){
                
                var subtitulo = this.atributo('titulo') ? this.atributo('titulo') : '';
                elementoTitulo = new Superlogica_Js_Elemento("<div class='mini-box titleWizard'> <span class='box-icon bg-info'> <i class='fa fa-magic'></i> </span> <div class='box-info'> <p class='size-h2 titulo'></p> <p class='text-muted'>" + subtitulo + "</p> </div> </div> " );
                
                corpoDoForm = this.encontrar('.corpoDoForm');
                if ( this.encontrar('.titleWizard') )
                    this.encontrar('.titleWizard').remover();
                if ( !corpoDoForm ){                 
                    corpoDoForm = this;
                }
                
                corpoDoForm.adicionarHtmlAoInicio( elementoTitulo );
            }
            elementoTitulo.mostrar();
            elementoTitulo.encontrar('.titulo').conteudo( titulo );
        }
        
        var indiceAtualPasso = this._getIndiceByNomePasso( formulario.getDados('assistentePassoAtual' ) );
        var indiceProximoPasso = this._getIndiceByNomePasso( passo );        
        var avancando = indiceAtualPasso <= indiceProximoPasso ;
        formulario.setDados('assistentePassoAtual', passo );
        
        var aposMostrarPasso = '__antesPasso' + nomePassoAtual.capitalize();
        if ( typeof formulario[aposMostrarPasso] == 'function' ){
            formulario[aposMostrarPasso]( passo, avancando );
        } 
        
        if ( corpoDoForm ){
            corpoDoForm.scrollTopo( 0 );
        }
        formulario.focar();
    },

    /**
     * Comportamento para habilitar a edição do conteúdo do elemento
     */
    __formEmLinha : function(){
        this.atributo("autoSalvar", 1);
        this.bind('mousedown focusin', function(event){
            event.preventDefault();
            new Superlogica_Js_Form_EmLinha( this ).editar();
            return false;
        }).adicionarClasse( Superlogica_Js_Form_EmLinha.css.classElemento );        
    },
    
    /**
     * Transforma um botão em um upload automático
     */
    __uploadAuto : function(){

        this.bind('mouseenter.uploadAuto', function(){
            
            var form = new Superlogica_Js_Form( "#"+this.atributo('divid')+" form:first").clonar("FORM_UPLOAD", true);
            var classeUploadAuto = this.atributo('divid')+'UploadAuto';
            var bodyElemento = new Superlogica_Js_Elemento("body");
            var formExistente =  bodyElemento.encontrar('.'+classeUploadAuto);
            if ( formExistente ){
                formExistente.remover();
            }
            form.adicionarClasse( classeUploadAuto ).css('z-index',99999999);
            bodyElemento.adicionarHtmlAoFinal( form );
            var campoArquivo;
            form.getElementos().emCadaElemento(function(){
                if ( this.atributo("type").toLowerCase().trim() == 'file')
                    campoArquivo = this;
            });

            form.css({
                'height' : 0,
                'width' : 0,
                'margin' : 0,
                'padding' : 0,
                'border': 0,
                'border-radius': 0,
                'overflow' : 'hidden',
                'display' : 'inline-block',
                'background': 'none',                
                'box-shadow': 'none'
            });
            
            campoArquivo.css({
                'opacity' : 0,
                'position' : 'absolute',
                'z-index' : 99999999
            })
            .bind('click', function(event){
                form.atributo('escolhaDeArquivosAberta','1');
                event.stopPropagation();
            })
            .bind('change', function(){
                form.simularEvento('submit');
            })
            .mostrar();
            var elemento = this;
            bodyElemento.bind('mousemove.uploadAuto', function(event){
                
                if ( form.atributo('escolhaDeArquivosAberta') ){
                    return true;
                }
                
                campoArquivo.css({
                    'top' : event.pageY-10,
                    'left' : (event.pageX - campoArquivo.largura()) + 10
                });
                
                var altura = elemento.alturaComPaddings();
                var largura = elemento.larguraComPaddings();
                var posicao = elemento.posicao();
                
                if ( isNaN(altura) || isNaN(largura)){
                    bodyElemento.unbind('mousemove.uploadAuto');
                    form.remover();
                    return true;
                }
                                
                // Calcula o mousemove enquanto o usuário estiver dentro do botão
                // 'mouseleave' não estava funcionando
                if ( 
                        ( event.pageY < (posicao.topo) ) || // saiu por cima
                        ( (posicao.topo + altura) < event.pageY ) || // saiu por baixo
                        ( event.pageX < (posicao.esquerda) ) || // saiu pela esquerda
                        ( event.pageX > (posicao.esquerda+largura) ) // Saiu pela direita
                        
                ){
                    bodyElemento.unbind('mousemove.uploadAuto');
                    if (  new Superlogica_Js_Form_Elementos(campoArquivo).getValue().length <= 0 )
                        form.remover();
                    return true;
                }
                
            });

        });
        
    },
    
    __abrirApi : function(){
        if (  this.maisProximo('.subForm').contar() || this.encontrar('div.linkAjuda')) return true;        
        var linkApi = new Superlogica_Js_Elemento("<div class='linkAjuda'><button comportamentos='Form.clickAbrirApi' type='button' class='btn btn-link'>API</button></div>");
        linkApi.carregarComportamentos();

        this.encontrar('.zend_form').adicionarHtmlAoInicio( linkApi );
    },
            
    __clickAbrirApi : function(){
        this.bind("click", function( event ){
            event.preventDefault();
            var form = new Superlogica_Js_Form_Elementos( this ).getForm();
            var locationApi = new Superlogica_Js_Location();
            locationApi.setController('lotes').setAction('importar').setParam('id', form.atributo('formname'));
            window.open( locationApi.toString(),'_blank');
        });
    },

    /**
     * Valida os campos do form
     * @param  {Boolean}  somenteValidar True para não exibir a mensagem de erro
     * @return {Boolean}
     */
    isValid : function( somenteValidar ){
      return this.getElementos().isValid( somenteValidar );
    },


    __comportamentoEdicao : function(){

        var form = this;
        var fechar = form.getElemento('fechar');
        var btnEditar = this.getElemento('editar');

        btnEditar.bind('click', function( event ){
            event.preventDefault();
            
            fechar.mostrar();
            var elemento = this;
            var aoEditar = form.atributoToArray('aoEditar');
            var permitirEditar = true;
            var habilitarChamado = false;

            var funcaoHabilitar = function(){

                if ( habilitarChamado ) 
                    return true;

                var btnSalvar = form.getElemento('salvar');

                habilitarChamado = true;
                elemento.esconder();

                form.habilitar();
                if ( form.encontrar('.campoPrincipal'))
                  form.mostrarTodosOsCampos();
                
                if ( btnSalvar )
                    btnSalvar.mostrar();
                
                var botaoExcluir = form.getElemento('excluir')
                if ( botaoExcluir )
                    botaoExcluir.mostrar();

                form.focar();

                var aposEditar = form.atributoToArray('aposEditar');
                if (aposEditar){
                    Object.each( aposEditar, function( item, chave){
                        if ( typeof form[ '__'+ item ] != 'function' )
                            throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form (aposEditar).";
                        else
                            form[ '__'+ item ]();
                    }, this );
                }

            };

            if (aoEditar){
                Object.each( aoEditar, function( item, chave){
                    if ( typeof form[ '__'+ item ] != 'function' )
                        throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form (aoEditar).";
                    else
                        permitirEditar = form[ '__'+ item ]( funcaoHabilitar );
                }, this );
            }

            if ( !habilitarChamado && permitirEditar ){
                funcaoHabilitar();
            }

        });

        fechar.unbind('click').bind('click', function(event){

            if ( this.maisProximo('.modal-body').contar() )
                return true; // caso esteja em um modal então ele apenas fecha o modal e não desabilita novamente

            var desabilitarChamado=false;
            var permitirDesabilitar = true;
            var elemento = this;
            
            var aoDesabilitar = form.atributoToArray('aoDesabilitar');
            if (aoDesabilitar){
                Object.each( aoDesabilitar, function( item, chave){
                    if ( typeof form[ '__'+ item ] != 'function' )
                        throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form (aoDesabilitar).";
                    else
                        permitirDesabilitar = form[ '__'+ item ]( funcaoDesabilitar );
                }, this );
            }

            if ( !desabilitarChamado && permitirDesabilitar ){
                funcaoDesabilitar();
            }

            event.stopImmediatePropagation();
            event.preventDefault();

        });
        
        var funcaoDesabilitar = function(){

            form.desabilitar();
            if ( form.encontrar('.campoPrincipal'))
              form.mostrarCamposPrincipais();
            form.encontrar('.botoesPadroes').mostrar();
            form.encontrar('.botoesPadroes fieldset').mostrar();
            var botaoSalvar = form.getElemento('salvar');
            if ( botaoSalvar )
                botaoSalvar.esconder();

            var botaoExcluir = form.getElemento('excluir');
            if ( botaoExcluir )
                botaoExcluir.esconder();

            fechar[ (!fechar.maisProximo('.modal-body').contar() ? 'esconder' : 'mostrar') ]();

            btnEditar.mostrar();            
            var aposDesabilitar = form.atributoToArray('aposDesabilitar');
            if (aposDesabilitar){
                Object.each( aposDesabilitar, function( item, chave){
                    if ( typeof form[ '__'+ item ] != 'function' )
                        throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form (aposDesabilitar).";
                    else
                        form[ '__'+ item ]();
                }, this );
            }

        };

        setTimeout(function(){
          funcaoDesabilitar();
        },0);

        if ( !this.maisProximo('.modal-body').contar() )
            fechar.esconder();
          else
            fechar.mostrar();
        
    },

});
