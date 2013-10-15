var Superlogica_Js_Form_Elementos = new Class({

    /**
     * Implementa a classe principal
     * @var array
     */
    Extends : Superlogica_Js_Elemento,
    
    /**
     * Construtor, informa o elemento a ser utilizado no contexto.
     * @param mixed element
     */
    initialize : function( element ){
        this.setElemento( element );
    },

    /**
     * Retorna o valor de um elemento no formato requerido pelo Client.
     * @return mixed
     */
    getValue : function (){
        var value;
        switch( this.getNomeElemento() ){
            case 'input' :
                var type = this.atributo('type');
                
                if ( type )
                    type = type.toLowerCase();
                
                if ( type == "checkbox"){

                    if ( this.eh(":checked") ){
                        var valorMarcado = this.atributo('value').trim();
                        value = valorMarcado && parseInt(valorMarcado) !== 0 ? valorMarcado : 1;
                    }else{
                        value = 0;
                    }

                    break;
                } else if ( type == 'radio'){
                    value = -1;
                    var formulario = this.getForm();
                    var elementosRadio = formulario.getElemento( this.atributo('name') );

                    elementosRadio.emCadaElemento( function(){
                        if (  this.atributo("checked") == true ){
                            value = this.$_elemento.val();
                            return false;
                        }
                    });
                }

                if ( !value )
                    value = this.$_elemento.val();
                break;
            case 'textarea' :
                    value = this.$_elemento.val();
                break;
            case 'select':
                var option = this.encontrar('option:selected');
                if ( !option ) 
                    option = this.encontrar('option:first');
                value = option ? option.$_elemento.val() : "";
                break;
            default :
                value = this.$_elemento.val();

        }
        
        if (  (!this.temClasse('not-required')) && ( ( this.getTipo() == "numeric" ) || ( this.getTipo() == "currency" ) ) && ( value == "") ){
            value = 0;
        }
        return value;
    },
    
    getSelectedText : function(){
    	if ( !this.eh('select')) return "";
        
    	var option = this.encontrar('option:selected');
        if ( !option )
            option = this.encontrar('option:first');
        
        if ( !option ) return '';
        
        return option.conteudo();
    },

    /**
     * Retorna o valor de um elemento no formato requerido pelo Server(json).
     *
     * @param object
     */
    getJson : function(){
        var value = this.getValue();
        return this.formatarValor( value, true );
    },

    /**
     * Seta um valor em um campo.
     * Importante: Verifica se o elemento é um input, textArea ou select
     * @param string json
     */
    setValue : function ( valor ){
        valor = this.formatarValor( valor, false);

        if ( this.temClasse('slautocomplete') ){
            
            var elemento = new Superlogica_Js_Elemento( this );
            elemento.atributo('selectedValue', valor);
            this.$_elemento.val( valor );

//            if (typeof(valor) == 'object'){
//
//                this.getForm().popular( valor );
//            }else{
//                if (valor.value){
//                    this.$_elemento.val( valor.value );
//                }
//                else this.$_elemento.val( valor );
//            }
            if ( this.getEvento('change') )
                this.simularAlteracao();
            return this;
        }
        
        switch( this.getNomeElemento() ){
            case 'input':
                var type = this.atributo('type');
                if ( type && type.toLowerCase() == "radio" ){
                	
                	this.emCadaElemento(function(){
                		if ( valor == this.$_elemento.val().toLowerCase() ){
                			this.atributo( "checked", true );
                		}
            		});
                	
                }else if ( type && type.toLowerCase() == "checkbox"){
                    
                    if (valor == '1'){

                        this.atributo( "checked", "checked" );
                        this.atributo( "value", 1 );
                    }else{
                        
                        this.removerAtributo( "checked");
                        this.atributo( "value", 0 );                        
                    }
                }else{
                    this.$_elemento.val( valor );
                }
                break;
            case 'select':
                this.emCadaElementoFilho(
                        function(){
                            var option = this;
                            if( !option.value ) return this;
                            var conteudo = option.value.trim();
                            // Adicionado new String pois quando passado um número não existe toLowerCase e ocorre um erro no script
                            if ( conteudo.toLowerCase() == new String(valor).toLowerCase()){
                                option.selected = true;
                            }
                        }
                    );
                        
                    var elementoDesabilitado= this.maisProximo('div.formElement').encontrar('input[selectalvo]');

                    if (elementoDesabilitado){
                        elementoDesabilitado.atributo('value', this.getSelectedText());
                    }
                break;
            case 'textarea':
                 
                if (this.atributo('class').indexOf('editorHtml')!==-1){
                    this.wysiwyg('setContent',valor);
                }else{
                    this.$_elemento.val( valor );
                }
                 break;                    
            default :
                this.$_elemento.val( valor );
        } 
        if ( this.getEvento('change') )
            this.simularAlteracao();
        return this;
    },

    /**
     * Retorna a classe existente no elemento
     *
     * @return string classe do elemento, ex: date, numeric
     */
    getTipo : function(){
        var format = this.atributo('format');
            format = format ? format : "";
                        
        if ( this.temClasse('dateTime') )    {
            return 'dateTime';
        }else if (this.temClasse('time')){
        	return 'time';
        }/*else if ( format.indexOf('horaminuto')!== -1 ){	        	
        	return 'time';
        }*/else if ( ( format.indexOf('date')!== -1 ) || ( this.temClasse('date') ) ){
            return 'date';
        }else if ( ( this.temClasse('currency') ) ){
            return 'currency';
        }else if ( ( this.temClasse('numeric') ) ){
            return 'numeric';
        }else if ( format.indexOf('integer')!== -1 ){
        	return 'integer';
        }
    },

    /**
     * Retorna o form no qual o elemento esta inserido
     *
     * @return Superlogica_Js_Form
     */
    getForm: function(){
        var $form = this.$_elemento && this.$_elemento[0] ? this.$_elemento[0].form : null;
        if( !$form )
            $form = this.maisProximo('form');
        return new Superlogica_Js_Form( $form );
    },

    /**
     * Formata um valor para o formato requerido pelo Server(json).
     *
     * @param string value
     * @return bool Se o valor será convertido para o formato requerido pelo Server
     */
    formatarValor : function( value, toJson){
        switch (this.getTipo()) {
        	case 'time':
        		format = this.getTimeInfo()['formato'];
        		if ( value.replace( new RegExp( format.replace(/[0-9]/g, '' ), 'g') ) )
        			return ""; 
        		var date = new Superlogica_Js_Date( value, format);
        		return date.toString( format );
        		break;        	
            case 'dateTime':
                if (!value.replace(/\//g,'').trim() ) return "";
                var outFormat = 'm/d/Y H:i:s';
                var format = 'd/m/Y H:i:s';
                if ( !toJson ){
                    format = 'm/d/Y H:i:s';
                    outFormat = 'd/m/Y H:i:s';
                }
                var date = new Superlogica_Js_Date( value, format);
                
                if ( !Superlogica_Js_Date.isDate( value, format ) ) return "";
                
                return date.toString( outFormat );
                break;
            case 'date':
                if ( !value || !value.replace(/\//g,'').trim() ) return "";
                var outFormat = 'm/d/Y';
                var format = 'd/m/Y';
                if ( !toJson ){                    
                    format = null; //'m/d/Y H:i:s';
                    outFormat = 'd/m/Y';
                }
                switch ( this.getDateInfo()['tipo'] ){
	            	case 'mensal':	            		
	            		if ( !toJson ){
	            			format = 'm/d/Y';
	            			outFormat = 'm/Y';
	            		}else{
	            			format = 'm/Y';
	            			outFormat = 'm/d/Y';
	            		}
	            			
	            		break;
            	}
                var date = new Superlogica_Js_Date( value, format);
                
                if ( !Superlogica_Js_Date.isDate( value, format ) ) return "";

                return date.toString( outFormat );
                break;

            case 'currency':
            case 'numeric':
                return new Superlogica_Js_Currency()[ toJson ? "toJson" : 'toString' ]( value, toJson ? !this.temClasse('not-required') : this.atributo('decimal') );
            case 'integer':                
            	return parseInt(value,10);
            	break;
            default :
                return value;
        }
    },

    /**
     * Retorna informações sobre o campo caso ele seja do tipo date
     * @return object
     */
    getDateInfo : function(){
        if ( this.getTipo() != 'date') return {};

        var format = this.atributo('format');
        var mask = '99/99/9999';
        var tipo = 'diario';
        var formato = 'dd/mm/yy';

        if( format ){
            format = format.split('|');
            if ( typeof format == 'object' && typeof format[1] == 'string' ){
                formato = format[1];
            }
        }
        switch( formato ){
            case 'mm/yy' :
                    mask = '99/9999';
                    tipo = 'mensal';
        }
        return {"formato" : formato, 'mascara' : mask, 'tipo' : tipo};

    },
    
    getTimeInfo : function(){
//    	if ( this.getTipo() != 'time') return {};
    	
    	var format = this.atributo('format');
    	var mask = '99:99:99';
    	var tipo = 'time';    	        
    	var formato = 'H:i:s';
    	
        if( format ){
            format = format.split('|');
            if ( typeof format == 'object' && typeof format[1] == 'string' ){
                formato = format[1];
            }
        }
        switch( formato ){
            case 'HH:ii' :
                    mask = '99:99';
                    tipo = 'time';
        }      
        
        return {"formato" : formato, 'mascara' : mask, 'tipo' : tipo};
    	
    },

    /**
     *  Desabilita o elemento
     *  @return Superlogica_Js_Form_Elementos
     */
    desabilitar : function( eliminarFoco ){
        
        this.$_elemento.addClass('desabilitado');
        
        // 'Readonly' não funciona no botões do datepicker        
        var atributoDesabilitar = 'readonly';
        if ( eliminarFoco === true )
            atributoDesabilitar = 'disabled';
        if ( this.temClasse('hasDatepicker') )
            atributoDesabilitar = 'desabled';
        this.$_elemento.attr(atributoDesabilitar, atributoDesabilitar);
        
        if ( this.atributo('type') == 'submit' || this.eh('button') ){
            this.adicionarClasse("botao");
        }
        if ( this.temClasse("hasDatepicker") && !this.datepicker( "isDisabled" )){
            this.datepicker('disable');
        }
        if ( this.atributo("type") == 'checkbox' || this.atributo('type') == 'radio'){
            this.atributo('disabled', 'disabled');
        }
        if ( this.eh("select")){
            var larguraSelect = this.css('width');
            this.esconder();
            var formulario = this.getForm();
            var inputEscondido = new Superlogica_Js_Form_Elementos( formulario.encontrar('input[selectalvo="'+this.atributo('name')+'"]') );
            this.atributo( 'selectname', this.atributo('name') );
            if ( !inputEscondido || inputEscondido.contar()<=0 ){
                var textSelect = new Superlogica_Js_Form_Elementos("<input></input>");
                    textSelect.atributo( 'selectalvo', this.atributo('name') )
                        .setValue( this.getSelectedText() )
                        .desabilitar()
                        .css('width', larguraSelect )
                        .inserirDepoisDe( this );
                
            }else
                inputEscondido.setValue( this.getSelectedText() );
        }
        return this;
    },
    /**
     *  Habilita o elemento
     *  @return Superlogica_Js_Form_Elementos
     */
    habilitar : function(){
        this.removerClasse('desabilitado');  
        // 'Readonly' não funciona no botões do datepicker
        this.removerAtributo( 'readonly' );
        this.removerAtributo( 'disabled' );
        if ( this.temClasse("hasDatepicker") && this.datepicker( "isDisabled" ) ){
        	this.datepicker('enable');
        }
        if ( this.atributo("type") == 'checkbox' || this.atributo('type') == 'radio'){
            this.removerAtributo('disabled');
        }
        var selectName = this.atributo('selectname');
        if ( selectName && selectName.trim() ){
            var formulario = this.getForm();
            var select = this;
            var inputSelect = formulario.encontrar('input[selectalvo="'+selectName+'"]');
            new Superlogica_Js_Elemento( select ).mostrar();
            inputSelect.remover();
        }
        return this;
    },

    /**
     * Seta o elemento como numérico
     */
    numeric : function( options ){

        options = Object.append( {/* plugin defaults */
                aNum: '0123456789',/*  allowed  numeric values */
                aNeg:  '-',/* allowed negative sign / character */
                aSep:  '.',/* allowed thousand separator character */
                aDec:  ',',/* allowed decimal separator character */
                aSign: '',/* allowed currency symbol */
                pSign: 'p',/* placement of currency sign prefix or suffix */
                mNum: 15,/* max number of numerical characters to the left of the decimal */
                mDec: 4,/* max number of decimal places */
                dGroup: 3,/* digital grouping for the thousand separator used in Format */
                mRound: 'S',/* method used for rounding */
                aPad: true/* true= always Pad decimals with zeros, false=does not pad with zeros. If the value is 1000, mDec=2 and aPad=true, the output will be 1000.00, if aPad=false the output will be 1000 (no decimals added) Special Thanks to Jonas Johansson */
            }, typeof options == 'object' ? options : {} );

        this.autoNumeric(options);

        return this;

    },

    /**
     * Seta o elemento como currency
     */
    currency : function(){
        return this.autoNumeric({/* plugin defaults */
            aNum: '0123456789',/*  allowed  numeric values */
            aNeg: '-',/* allowed negative sign / character */
            aSep: '.',/* allowed thousand separator character */
            aDec: ',',/* allowed decimal separator character */
            aSign: '',/* allowed currency symbol */
            pSign: 'p',/* placement of currency sign prefix or suffix */
            mNum: 15,/* max number of numerical characters to the left of the decimal */
            mDec: 2,/* max number of decimal places */
            dGroup: 3,/* digital grouping for the thousand separator used in Format */
            mRound: 'S',/* method used for rounding */
            aPad: true/* true= always Pad decimals with zeros, false=does not pad with zeros. If the value is 1000, mDec=2 and aPad=true, the output will be 1000.00, if aPad=false the output will be 1000 (no decimals added) Special Thanks to Jonas Johansson */
        });
    },

    /**
     * Seta o elemento como integer
     */
    integer : function( options ){
        options = Object.append({/* plugin defaults */
            aNum: '0123456789',/*  allowed  numeric values */
            aNeg: '-',/* allowed negative sign / character */
            aSep: '',/* allowed thousand separator character */
            aDec: ',',/* allowed decimal separator character */
            aSign: '',/* allowed currency symbol */
            pSign: 'p',/* placement of currency sign prefix or suffix */
            mNum: 15,/* max number of numerical characters to the left of the decimal */
            mDec: 0,/* max number of decimal places */
            dGroup: 3,/* digital grouping for the thousand separator used in Format */
            mRound: 'S',/* method used for rounding */
            aPad: true/* true= always Pad decimals with zeros, false=does not pad with zeros. If the value is 1000, mDec=2 and aPad=true, the output will be 1000.00, if aPad=false the output will be 1000 (no decimals added) Special Thanks to Jonas Johansson */
        }, typeof options == 'object' ? options : {} );

        return this.autoNumeric(options);
    },

    dateTime : function(){
        
        this.unmask().mask('99/99/9999 99:99:99');
    },

    time : function(){
    	
    	var padroesTime = this.getTimeInfo();
    	this.unmask().mask(padroesTime['mascara']);
    },
    /**
     * Seta o campo atual como datepicker
     * 
     */
    date : function(){
    	
        if ( ( this.eh('[readonly]') ) || ( this.eh('[type=hidden]') ) )
        	return true;
        
        this.emCadaElemento(function(){
                var elemento = new Superlogica_Js_Elemento(this);
                var inputDate = elemento.removerAtributo('id');
                var triggerBtn = inputDate.proximo();
                if ( triggerBtn.temClasse('ui-datepicker-trigger') ){
                    triggerBtn.remover();
                }
            })
            .unmask()
            .mask(
                '99/99/9999',
                {
                    "placeholder" : " "
                }
            )
            .removerClasse('hasDatepicker')
            // NOVO
            .emCadaElemento(function(){
                var elemento = new Superlogica_Js_Form_Elementos(this);
        	var padroesData = elemento.getDateInfo();

        	elemento
                    .datepicker( {
                        "dateFormat" :  "dd/mm/yy",
                        "showOn" : 'button',
                        "buttonImage" : APPLICATION_CONF['APPLICATION_CLIENT_TEMA_URL'] + "/img/calendar.png",
                        "buttonImageOnly" : true,
                        "showOtherMonths" : true,
                        "selectOtherMonths" : true,
                        "showButtonPanel" : true,
                        "changeMonth": true,
                        "changeYear": true,

                        'onSelect' : function(){
                            this.focus();
                            elemento.simularAlteracao();
                        },

                        'beforeShow' : function(input, inst){
                            var elementoAtual = new Superlogica_Js_Form_Elementos( input );
                            var padroesData = elementoAtual.getDateInfo();

                            switch( padroesData.tipo ){
                                case 'mensal':
                                    inst.settings.currentText = "Mês Atual";
                                    inst.settings.onChangeMonthYear = function( year, month, inst ){
                                            month = parseInt(month);
                                            month = month < 10 ? '0'+month : month;
                                            elementoAtual.datepicker('setDate', new Date( month + '/01/' + year) );
                                    };

                                    var data = elementoAtual.getValue();                                    
                                    if ( !data ) break;

                                    data = data.split('/');

                                    inst.trigger.currentMonth = data[0];
                                    inst.trigger.currentDay = '01';
                                    inst.trigger.currentYear = data[1];

                                    inst.selectedMonth = parseInt( data[0] );
                                    inst.selectedDay = 1;
                                    inst.selectedYear = parseInt( data[1] );


                                    break;
                            }
                            inst.settings.dateFormat = padroesData.formato;

                            elementoAtual.unmask().mask( padroesData.mascara, {
                                "placeholder" : " "
                            } );

                            new Superlogica_Js_Elemento('#ui-datepicker-div')
                                    .removerClasse('calendarioMensal calendarioAnual calendarioPeriodo')
                                    .adicionarClasse( 'calendario' + padroesData.tipo.capitalize() );

                        }
                    })
                    .unmask()
                    .mask(
            		padroesData.mascara,
                        {
                            "placeholder" : " "
                        }
                    );


            })
            .atributo( "align", "absmiddle")
            .proximo()
            .atributo( "align", "absmiddle")
            .css('cursor','pointer');
    },

    hint : function(){

        this.$_elemento.tipsy();
    },

    clearAutocompleteCache : function(){

        var sourceFunction = this.getDados('sourceFunction');
        if ( typeof sourceFunction == 'function' ){
            this.autocomplete('option','source', sourceFunction);
        }
        return this;
    },
    
    __editorHtml : function(){
        /**
         * Algumas vezes o comportamento esta sendo chamado duas vezes, provavelmente por erro estrutural
         * isso faz com que abra dois editores no forme,
         * foi colocada a condição abaixo para adiciona-lo apenas quando ainda não existir
         **/
        if(!this.getForm().encontrar('.wysiwyg')){
            this.wysiwyg({
                controls: {
                    createLink : {visible : false},
                    unLink : {visible : false},
                    indent: {visible : false},
                    outdent: {visible : false},
                    insertHorizontalRule: {visible : false},
                    insertImage: {visible : false},
                    insertTable: {visible : false},
                    subscript: {visible : false},
                    superscript: {visible : false},
                    code: {visible : false},
                    strikeThrough: {visible : false},
                    undo: {visible : false},
                    redo: {visible : false},
                    justifyFull: {visible : false}
                },
                plugins : {
                    i18n : {
                        lang: 'pt_br'
                    } 
                }
            });
        }
    },    

    /**
     * Evento para os campos autocomplete
     */
    __autocomplete : function(){
    	var instanciaClasse = this;
    	
        var autoComplete = this;
            autoComplete.atributo('autoopen', '1');
        if ( autoComplete.atributo('autoOpenCache') || autoComplete.atributo('autoopen') ){
            autoComplete.bind('focus', function(){
                var elemento = new Superlogica_Js_Form_Elementos( this );                
                setTimeout( function(){
                    if ( ( !autoComplete.atributo('autoOpenCache') && (elemento.getValue() || elemento.atributo('disabled') || elemento.atributo('readonly')) || (elemento.getDados('populado') && elemento.atributo('autoopen'))) )
                        return true;
                    elemento.autocomplete( 'search' , ' ' );
                }, 0 );
            });
        }
        var sourceFunction = function( request, sendResponse){

            var autocompleteAtual = new Superlogica_Js_Elemento( this.element );
            var cached = autocompleteAtual.atributo('cached');
            var autoOpenCache = autocompleteAtual.atributo('autoOpenCache');

            var params = {};

            if ( !cached )
                params['pesquisa'] = request.term;
            
            if ( request.term == ' ' ){                
                delete params['pesquisa'];
            }
            
            params['pagina'] = 1;
            params['itensPorPagina'] = ( typeof autocompleteAtual.atributo('itensporpagina') != 'undefined' ) ? autocompleteAtual.atributo('itensporpagina') : 10;
            if ( cached ) params['itensPorPagina'] = 999999999;

            var urlRequisicao = autocompleteAtual.atributo('url');
            if ( !urlRequisicao ){
                
                var actionAuto = autocompleteAtual.atributo('action');
                    actionAuto = actionAuto ? actionAuto : 'index';
                    
                var controllerAuto =  autocompleteAtual.atributo('controller');
                    controllerAuto = controllerAuto ? controllerAuto : 'index';
                    
                var paramsAuto = JSON.decode(autocompleteAtual.atributo('params'));
                
                var locationAuto = new Superlogica_Js_Location();                
                    locationAuto.setApi(true).setController( controllerAuto ).setAction( actionAuto );
                    
                if ( paramsAuto )
                    locationAuto.setParams( paramsAuto );
                else
                    locationAuto.setParams( [] );
                urlRequisicao = locationAuto.toString();
            }
            
            if ( typeof instanciaClasse["__"+urlRequisicao] == 'function'){
                urlRequisicao = instanciaClasse["__"+urlRequisicao]();
            }
            autocompleteAtual.setDados('requestParams',params);
            var controllerRequest = new Superlogica_Js_Request( urlRequisicao, params );
            var processarAutocomplete = function( response ){
                autocompleteAtual.setDados( 'jqXHR', null );
                if ( !response.isValid() ){
                    return false;
                }

                var jsonResposta = response.getData( -1 );
                var arrResponse = [];
                var arrItens = {};
                var valores = new Superlogica_Js_Json( autocompleteAtual.atributo('mostrar') ).extrair();
                var popular = new Superlogica_Js_Json( autocompleteAtual.atributo('popular') ).extrair();

                var label;
                Object.each( jsonResposta, function(item, chave ){

                    label = '';
                    arrItens = {};

                    Object.each(valores, function ( val, indice){
                        if (label){
                            label = label + " " + item[ val.toLowerCase() ];
                        }else{
                            label = item[ val.toLowerCase() ];
                        }
                    });

                    Object.each(popular, function ( response, elemento ){

                        /*se for popular um campo com vários valores*/
                        if(typeof response == 'object'){

                            Object.each(response, function(element, indice){
                                if (typeof item[ element.toLowerCase() ] != 'undefined'){

                                    if (typeof arrItens[elemento] != 'undefined'){
                                        arrItens[elemento] = arrItens[elemento] + " " + item[ element.toLowerCase() ];
                                    }else{
                                        arrItens[elemento] = item[ element.toLowerCase() ];
                                    }
                                }
                            })

                        }else if (typeof item[ response.toLowerCase() ] != 'undefined'){

                            if (typeof arrItens[elemento] != 'undefined'){
                                arrItens[elemento] = arrItens[elemento] + " " + item[ response.toLowerCase() ];
                            }else{
                                arrItens[elemento] = item[ response.toLowerCase() ];
                            }
                        }
                    });

                    arrItens['label'] = label;
                    arrItens[autocompleteAtual.atributo("name")] = label;
                    arrItens['responseDados'] = item;
                    
                    arrResponse.push(
                        arrItens
                    );
                });

                if (cached){
                    autocompleteAtual.setDados( 'sourceFunction', sourceFunction );
                    autocompleteAtual.autocomplete('option', 'source', arrResponse );
                    autocompleteAtual
                        .unbind('keyup.autocompleteKeyup')
                        .bind('keyup.autocompleteKeyup', function(event){
                            var elemento = new Superlogica_Js_Form_Elementos( this );
                            // Precionado esc aborta edição
                            if ( event.keyCode == 27 ){
                                elemento.simularEvento('blur');
                                return true;
                            }
                            if ( !(""+elemento.getValue()).trim() ){
                                this.autocomplete( 'search' , ' ' );
                            }
                        });
                }

                if ( (!cached && !autoOpenCache) || ( cached && autoOpenCache ) ){
                    var elementoAutocompleteAtual = new Superlogica_Js_Form_Elementos(autocompleteAtual);
                    var valorAnterior = elementoAutocompleteAtual.$_elemento[0].value;
                    sendResponse( arrResponse );
                    elementoAutocompleteAtual.$_elemento[0].value = valorAnterior;
                    autocompleteAtual.simularEvento('aposListar',[arrResponse]);
                }else
                    autocompleteAtual.autocomplete( "search" , request.term );
            };
            
            if ( autocompleteAtual.eh('.slautocomplete_default') ){
                var jqXHR = autocompleteAtual.getDados('jqXHR');
                if ( jqXHR )
                    jqXHR.abort();
                jqXHR = controllerRequest.enviarAssincrono(processarAutocomplete);
                autocompleteAtual.setDados('jqXHR',jqXHR);
            }else
                processarAutocomplete( controllerRequest.getResponse() );

        };

        this
            .bind('keydown', function(evento){
                if ( !autoComplete.eh('.slautocomplete_default') || (evento.keyCode >= 37 && evento.keyCode <= 40 && evento.keyCode != 9 ) )
                    return true;
                
                var autocomplete = this;
                autocomplete.adicionarClasse('searching');
                
                var timeoutAutocomplete = this.getDados('timeoutAutocomplete');
                if ( timeoutAutocomplete )
                    clearTimeout(timeoutAutocomplete);
                timeoutAutocomplete = setTimeout(function(){
                    autocomplete.removerClasse('searching');
                }, 1500 );
                this.setDados('timeoutAutocomplete', timeoutAutocomplete);
                
            })
            .atributo( 'autocomplete', 'off')
            .autocomplete({

                'source' : sourceFunction,
                
                'search' : function(event, ui){
                    var elemento = new Superlogica_Js_Form_Elementos( event.target );
                    elemento.adicionarClasse('searching'); 
                },
                
                'select' : function(event, ui){
                    var elemento = new Superlogica_Js_Form_Elementos( event.target );
                    var desabilitarTab = elemento.atributo('selecionaraotab');
                    // Não seleciona se der TAB
                    if( event.keyCode == 9 && desabilitarTab && parseInt(desabilitarTab) === 0 )
                        return false;
                    
                    // não seleciona se for titulo
                    if ( ui.item.desabilitado ){
                        event.preventDefault();
                        return false;
                    }
                    
                    var formulario = elemento.getForm();
                        formulario.popular( ui.item ); 
                        
                    // Cancela a requisição caso ainda esteja acontecendo
                    var jqXHR = elemento.getDados('jqXHR');
                    if ( jqXHR ){
                        jqXHR.abort();
                        elemento.setDados( 'jqXHR', null );
                    }
                                        
                },

                'open' : function( event, ui ){
                    var autocomplete = autoComplete.$_elemento.data( "autocomplete" );
                    
                    // Quando autocomplete abrir e não tiver foco no campo que ele pertence então fecha o autocompelte
                    if ( event.target !== document.activeElement )
                        autoComplete.autocomplete('close');
                    
                    var menu = autocomplete.menu;
                    var elemento = new Superlogica_Js_Form_Elementos( event.target );
                    var comportamentoSelecao = elemento.atributo('canSelect');
                    var janela = new Superlogica_Js_Elemento(window);
                    var menuElemento = new Superlogica_Js_Elemento( menu.element )
                        .unbind('mouseleave.slautocomplete mouseenter.slautocomplete')
                        .bind('mouseleave.slautocomplete', function(){
                            janela
                                .unbind('scroll.slautocomplete')
                                .bind('scroll.slautocomplete', function(){
                                    new Superlogica_Js_Elemento(this).unbind('scroll.slautocomplete');
                                    elemento.autocomplete('close');                            
                                });
                        })
                        .bind('mouseenter.slautocomplete', function(){
                            janela.unbind('scroll.slautocomplete');
                        });

                    if ( comportamentoSelecao ){
                        if ( typeof elemento['__'+comportamentoSelecao] != 'function' )
                            throw 'Função "' + comportamentoSelecao + '" não implementada em Form_Elementos.';
                        menuElemento.emCadaElementoFilho(function(){
                            var elementoAutoComplete = new Superlogica_Js_Elemento( this );
                            var dadosItem = elementoAutoComplete.getDados('item.autocomplete');
                            var continuar = elemento['__'+comportamentoSelecao]( dadosItem.responseDados );
                            if ( continuar === false ){                                
                                dadosItem.desabilitado = true;
                                elementoAutoComplete.setDados('item.autocomplete', dadosItem );
                                elementoAutoComplete
                                    .bind('click mouseenter focus', function(event){
                                        event.preventDefault();
                                        event.stopPropagation();
                                        menu.deactivate( jQuery.Event({ type: "mouseenter" }), this.$_elemento );
                                        return false;
                                    })
                                    .encontrar('a')
                                    .bind('click mouseenter focus', function(event){
                                        event.preventDefault();
                                        event.stopPropagation();
                                        menu.deactivate( jQuery.Event({ type: "mouseenter" }), this.$_elemento );
                                        return false;
                                    });
                                elementoAutoComplete.removerClasse('ui-menu-item').adicionarClasse('desabilitado');
                            }
                        });
                        
                    }
                    
                    // Seleciona o primeiro item habilitado caso esteja fazendo uma busca
                    if ( typeof autoComplete.getValue() != 'undefined' && autoComplete.getValue() != '' ){                        
                        new Superlogica_Js_Elemento( menu.element ).emCadaElementoFilho(function(){
                            var elementoAtual = new Superlogica_Js_Elemento(this);
                            if ( !elementoAtual.temClasse('desabilitado') ){
                                menu.activate( jQuery.Event({ type: "mouseenter" }), elementoAtual.$_elemento );
                                return false;
                            }                        
                        });
                    }
                    
                    var autocompleteAjuda = menuElemento.encontrar('.autocomplete-ajuda');
                    if ( autocompleteAjuda && autocompleteAjuda.contar() )
                        autocompleteAjuda.remover();
                    
                    var params = autoComplete.getDados('requestParams');
                    if ( params && params.itensPorPagina && menuElemento.encontrar('li').contar() == params.itensPorPagina ){
                        var elementoAjuda = new Superlogica_Js_Elemento('<li class="autocomplete-ajuda">Digite para buscar mais itens</li>');
                        menuElemento.adicionarHtmlAoFinal( elementoAjuda );    
                    }
                    
                    var jsMenu = new Superlogica_Js_Elemento( menu.element );
                    var posicaoMenu = jsMenu.posicao();
                    var inputAutocomplete = new Superlogica_Js_Elemento( this );

                    var limiteAutocomplete = posicaoMenu.topo + jsMenu.altura();
                    var limiteJanela = janela.scrollTopo() + janela.altura();

                    if ( limiteJanela < limiteAutocomplete ){
                        setTimeout(function(){
                            jsMenu.css({
                                'top' : inputAutocomplete.posicao().topo - ( jsMenu.altura()+inputAutocomplete.altura()-10 )
                            });
                        },0);
                    }

                    autoComplete.setDados('opened', true );
                    autoComplete.removerClasse('searching');
                    
                    autoComplete.setDados( 'populado', true );
                    
                },
                
                'close' : function(){                    
                    var autoComplete = new Superlogica_Js_Form_Elementos( this );
                    autoComplete.setDados('opened', true );                   
                    autoComplete.removerClasse('searching');
                    
                    var valorAtual = autoComplete.getValue();
                    var valorEsperado = autoComplete.atributo('selectedValue');
                    var retornarValorPadrao = parseInt( autoComplete.atributo('retornarpadrao') )
                    if ( valorAtual != valorEsperado && !isNaN(retornarValorPadrao) ){
                        autoComplete.setValue( valorEsperado );
                    }
                    
                    setTimeout( function(){
                        autoComplete.setDados( 'populado', false );
                    }, 100 );
                    
                }
                
            })
            .bind(
                'blur',
                function(event){
                    var autoComplete = new Superlogica_Js_Form_Elementos( this );
                    
                    var formulario = autoComplete.getForm();
                    var valorAtual = autoComplete.getValue();
                    var valorEsperado = autoComplete.atributo('selectedValue');
                    var retornarValorPadrao = parseInt( autoComplete.atributo('retornarpadrao') )
                    if ( valorAtual != valorEsperado ){

                        if ( isNaN( retornarValorPadrao ) ){
                            var elementos = new Superlogica_Js_Json( autoComplete.atributo('popular') ).extrair();

                            Object.each(elementos, function( response, elemento ){
                                elemento = formulario.getElemento( elemento );
                                elemento.setValue( '' );
                            });
                        }
                        autoComplete.setValue( isNaN(retornarValorPadrao) ? '' : valorEsperado );
                    }
                    
                }
            );    
    },

    __autocompleteFormPut : function(elemento, contexto ){
        var autocomplete = this;
        
        var btnNovo = this.maisProximo('div').encontrar('.linkNovoAutocomplete');
        if ( btnNovo )
            btnNovo.remover();
        
        btnNovo = new Superlogica_Js_Form_Elementos("<button type='button' class='linkNovoAutocomplete' title='" + autocomplete.atributo('tituloBtnNovo') + "'>Novo</button>");
        btnNovo.bind('click', function(event){
            autocomplete = new Superlogica_Js_Form_Elementos( this.maisProximo('div').encontrar('input') );
            event.preventDefault();
            var containerForm =  new Superlogica_Js_Elemento( '#Superlogica_Layout_Codigos_Append div.'+autocomplete.atributo('formHash') ).clonar();
            
            var titulo = (autocomplete.atributo('tituloBtnNovo')+"").trim();
            if ( titulo ){
                var elementoTitulo = containerForm.encontrar("h2");
                if ( !elementoTitulo ){
                    elementoTitulo = new Superlogica_Js_Elemento("<h2></h2>");
                    containerForm.adicionarHtmlAoInicio( elementoTitulo );
                }
                elementoTitulo.conteudo(titulo);
            }
            
            var form = new Superlogica_Js_Form( containerForm.encontrar("form") );
                        
            form.limpar();
            form.mostrar().focar();
            
            var linkImportar = form.encontrar('.importar');
            if ( linkImportar )
                linkImportar.esconder();
            
            form.encontrar('.fechar').unbind('click.autocomplete').bind('click.autocomplete', function(){
                containerForm.dialogo('close');
                containerForm.dialogo('destroy');
                containerForm.maisProximo('.autocompleteFormPut').remover();
                form.setDados( 'autocompleteFormAtual', null );
            });
            
            form
                .atributo("aposSubmeter", 'verificarFormAutocomplete')
                .setDados(
                    'autocompleteFormAtual',
                    {
                        'autocomplete' : autocomplete,
                        'containerForm' : containerForm
                    });
            
            containerForm.mostrar();
            containerForm.dialogo({'modal':true,'width':'650px','dialogClass':'autocompleteFormPut'});
            form.focar();
            
        })
        .inserirDepoisDe( this );
        
    },
    
    /**
     * Mostra a opção de definir valores padrões
     */
    __redefinirValoresPadroes : function(){
        this
            .bind(
                'click',
                function(event){                    
                    event.preventDefault();
                    var formulario = this.getForm();                    
                    var displayAssistenteDigitacao = formulario.getDisplayGroup("ASSISTENTE_DIGITACAO");
                    displayAssistenteDigitacao.adicionarClasse('atencao');

                    var divMsg = formulario.encontrar('#msgDiv');
                    
                    if ( divMsg == null){                        
                        divMsg = new Superlogica_Js_Form_Elementos('<div id="msgDiv"></div>');
                        
                        divMsg.inserirAntesDe(formulario.getElemento('DEFINIR_VALORES_PADROES'));
                    }
                    var divImportacao= formulario.encontrar('button.importar');
                    
                    if (divImportacao!=null){
                    	divImportacao.esconder();
                    }
                    
                    
                    divMsg.conteudo('Preencha os campos com os valores desejados e clique em definir.');
                    
                    formulario.getElemento('DEFINIR_VALORES_PADROES').mostrar();
                    formulario.getElemento('CANCELAR_DEFINIR').mostrar();
                    formulario.getElemento('PREENCHER_USANDO_VALORES_PADROES').esconder();
                    this.esconder();
                }
            );
    },

    /**
     * Define os valores padrões para o formulário
     */
    __definirValoresPadroes : function(){
        this
            .bind(
                'click',
                function(event){
                    event.preventDefault();                    
                    if ( !confirm( "Deseja redefinir os valores padrões por esses informados no formulário?" ) )
                        return false;

                    var formulario = this.getForm();
                    var displayAssistenteDigitacao = formulario.getDisplayGroup("ASSISTENTE_DIGITACAO");
                    var location = new Superlogica_Js_Location();

                    var data = this.getArrayValoresPadroes(formulario);

                    location.setController('Usuarioconfiguracoes')
                            .setAction('put')
                            .setParam('ST_NOME_CONF', formulario.atributo('id') )
                            .setParam('ST_VALOR_CONF', new Superlogica_Js_Json( data ).encode() )
                            .setApi( true )

                    var request = new Superlogica_Js_Request( location.toString() );
                    request.setHandler( this );
                    request.getResponse();

                    var divMsg = formulario.encontrar('#msgDiv');

                    if ( divMsg == null){
                        divMsg = new Superlogica_Js_Form_Elementos('<div id="msgDiv"></div>');
                        displayAssistenteDigitacao.adicionarHtmlAoFinal( divMsg );
                    }                   

                    formulario.encontrar('button[name=PREENCHER_USANDO_VALORES_PADROES], button[name=REDEFINIR_VALORES_PADROES], button.importar').mostrar();
                    
                    formulario.getElemento('CANCELAR_DEFINIR').esconder();
                    this.esconder();
                    displayAssistenteDigitacao.removerClasse('atencao');

                    divMsg.conteudo('');
                }
            );
    },

    /**
     * Preenche o formulário com os valores padrões
     */
    __preencherFormUsandoValoresPadroes : function(){
        this
            .bind(
                'click',
                function(event){
                    event.preventDefault();
                    
                    var formulario = this.getForm();
                    var location = new Superlogica_Js_Location();
                    var request = new Superlogica_Js_Request(
                        location.setController('Usuarioconfiguracoes')
                                .setAction('index')
                                .setParam('ST_NOME_CONF', formulario.atributo('id') )
                                .setApi( true ) );                   
                         request.setHandler( this );

                    if (request.getResponse().getData() == ''){
                        var divMsg = formulario.encontrar('#msgDiv');

                        if ( divMsg == null){
                            divMsg = new Superlogica_Js_Form_Elementos('<div id="msgDiv"></div>');                            
                            divMsg.inserirAntesDe(formulario.getElemento('DEFINIR_VALORES_PADROES'));
                        }
                        divMsg.conteudo('Valores padrões não definidos para este formulário.');
                    }else{
                        formulario.popular( new Superlogica_Js_Json( request.getResponse().getData() ).extrair() );
                        formulario.focar();
                    }
                    
                    return false;                   
                }
            );
    },

    __cancelarDefinirValoresPadroes: function(){
        this
            .bind(
                'click',
                function(event){
                    event.preventDefault();

                    var formulario = this.getForm();
                    var displayAssistenteDigitacao = formulario.getDisplayGroup("ASSISTENTE_DIGITACAO");
                    formulario.getElemento('DEFINIR_VALORES_PADROES').esconder();

                    formulario.encontrar("button[name=PREENCHER_USANDO_VALORES_PADROES], button[name=REDEFINIR_VALORES_PADROES], button.importar").mostrar();
                    
                    this.esconder();
                    displayAssistenteDigitacao.removerClasse('atencao');
                    
                    var divMsg = formulario.encontrar('#msgDiv');

                    if ( divMsg == null){
                        divMsg = new Superlogica_Js_Form_Elementos('<div id="msgDiv"></div>');
                        displayAssistenteDigitacao.adicionarHtmlAoInicio( divMsg );
                    }
                    
                    divMsg.conteudo('');
                }
            )
    },
   
    __abrirFormularioImportacao: function(){
    	this.bind( 'click', function( evento ){
            evento.preventDefault();
            var formulario= this.getForm();
            var location = new Superlogica_Js_Location();
                location.setController('lotes')
                        .setAction('importar')
                        .setParams({})
                        .setParam('id',formulario.atributo('id'));
            document.location = location.toString();
            return true;
    	});
    },
    
   /**
    * Aplica a busca a url
    */
    __submeterBusca: function(){
        this
            .bind(
                'click',
                function(event){
                    event.preventDefault();
                    
                    var btBusca= this.atributo('id');
                    
                    var location= new Superlogica_Js_Location();
                    var pesquisa= this.getForm().getElemento('pesquisa').getValue();
                    
                    if (btBusca=='buscarEmTudo'){
                        location.setParam('pesquisa',null);
                        location.setParam('pesquisaEmTudo',pesquisa ? pesquisa : null);
                    }else{
                        location.setParam('pesquisaEmTudo',null);
                        location.setParam('pesquisa',pesquisa ? pesquisa : null);
                    }
                    
                    document.location = location.toString();
                });
    },

    __popularBusca: function (){
        var location= new Superlogica_Js_Location();
        this.getForm().getElemento('pesquisa').setValue(location.getParam('pesquisaEmTudo') ? location.getParam('pesquisaEmTudo') : location.getParam('pesquisa'));
    },

    /**
    * Submete o formulario usando o ajax
    */

    __limparBusca: function(){
        this
            .bind(
                'click',
                function(event){               
                    event.preventDefault();
                    var location = new Superlogica_Js_Location();
                    location.setParam('pesquisa');
                    location.setParam('pesquisaEmTudo');
                    document.location = location.toString();
                });
    },
    
    
    getArrayValoresPadroes : function(formulario){

        var data = formulario.toJson();
        var elementos = formulario.encontrar( '[naoTemValorPadrao=1]' );
        
        if (elementos==null) return data;
        
        elementos.emCadaElemento( function(){
            var elemento = new Superlogica_Js_Form_Elementos( this );
            var nome = elemento.atributo('name');
            var subform = elemento.atributo('subform');            
            if ( typeof data[nome] != 'undefined')
                delete(data[nome]);
            else if ( typeof data[subform] != 'undefined')
                delete(data[subform]);            
        });
        
        return data;
    },
    
    /**
     *Exclui id passado do form.
     *
     */
    __aoExcluir : function(){
     	this.bind('click', function(evento){
     		if ( confirm("Excluir?")){	
	     		var form = this.getForm();
	     		var location = new Superlogica_Js_Location( form.atributo('action') );
	     			location.setAction('delete');
	     		var request = new Superlogica_Js_Request( location.toString(), form.toJson() );
	     		request.setHandler(this);
	     		var response = request.getResponse();
	     		var aposExcluir = form.atributoToArray('aposExcluir');
		        if (aposExcluir){
		            Object.each( aposExcluir, function( item, chave){
		                if ( typeof form[ '__'+ item ] != 'function' )
		                    throw "Função '" + '__' + item + "' não implementada no Superlogica_Js_Form.";
		                else
		                    form[ '__'+ item ]( form, response );
		            }, this );
		        }
     		}
 		}); 
    },
    
    getItem : function(elemento){ 
       return this.maisProximo('.item');
    },

    /**
     * Cria o array data num select
     */
    setData : function( data ){   
        if ( !this.eh('select')) return this;
        
        var elementoAtual = this;
        elementoAtual.atributo('data', data);     
        elementoAtual.conteudo('');
        elementoAtual._criarItensSelect( JSON.decode( data ) );
        return this;
    },

    /**
     * Retorna o array data de um select
     */
    getData : function(){

        var elemento = this;
        if ( !elemento.eh('select')) return this;
        return new Superlogica_Js_Json( elemento.atributo('data') ).extrair();
    },

    /**
     * Retorna os dados do índice selecionado num select
     */
    selecionada : function(){

        var elemento = this;
        var indiceSelecionado = elemento.$_elemento[0].selectedIndex ;
        var arData = new Superlogica_Js_Json( elemento.atributo('data') ).extrair();
        if (arData ) return arData[indiceSelecionado];
    },
    
    /**
     * Comportamento para campos de CEP do software
     */
    __buscarCep : function(){
        var nomeCep = this.atributo('name').split('_');
        var elementosEndereco = {};
        var form = this.getForm();
        var temBairro = false;
        Object.each( ['BAIRRO',"ENDERECO","COMPLEMENTO","CIDADE","ESTADO",'NUMERO'], function(campo){
            
            // não preenche complemento caso tenho bairro
            if ( temBairro && campo.toLowerCase() == 'complemento') 
                return true;
            var nomeCampo = nomeCep.length <= 1 ? campo : nomeCep[0]+"_"+campo+"_"+nomeCep[2];
            var elemento = form.getElemento( nomeCampo );
            if ( elemento ){
                
                if ( campo.toLowerCase() == 'bairro')
                    temBairro = true;
                
                elementosEndereco[campo] = elemento;
                
            }
        });
        
        if ( !this.getItem().encontrar('.linkBuscaExterna') ){
            var textoAjuda = new Superlogica_Js_Elemento("<a class='linkBuscaExterna' href='http://www.buscacep.correios.com.br/servicos/dnec/menuAction.do?Metodo=menuEndereco' target='_blank' title='Não sabe o CEP?'>Não sabe o CEP?</a>");
            textoAjuda.inserirDepoisDe( this );
        }
        
        this.bind('keyup', function(){            
                var elemento = new Superlogica_Js_Form_Elementos(this);
                if ( this.eh('readonly') || elemento.eh('[disabled]') || elemento.temClasse('desabilitado')) 
                    return false;
                var cep = elemento.getValue().replace(/ |-/g,'');
                var cepPesquisado = elemento.getDados('cepPesquisado');
                if ( cep.length == 8 && cep != cepPesquisado){
                    elemento.setDados('cepPesquisado', cep);
                    this.adicionarClasse("buscando");
                    var location = new Superlogica_Js_Location();
                    location.setApi(true).setController("cep").setAction('index');
                    var request = new Superlogica_Js_Request(location.toString(), { 'cep': cep } );
                    request.setResponseOptions({'autoThrowError':false});
                    var jqxhr = this.getDados('jqxhr');
                    if ( jqxhr )
                        jqxhr.abort();                
                    jqxhr = request.enviarAssincrono(function(response){
                        elemento.removerClasse("buscando");
                        elemento.setDados('jqxhr', null);
                        if ( response.isValid() ){
                            var dados = response.getData();
                            Object.each( elementosEndereco, function( campo, nome ){
                                campo.setValue( campo.getValueOfLabel( dados[ nome.toLowerCase() ]) );
                                campo.setValue( dados[ nome.toLowerCase() ] );                                
                            });
                            if ( elemento.eh(":focus") && elementosEndereco['NUMERO'] )
                                elementosEndereco['NUMERO'].simularEvento('focus');                        
                        }
                    });
                    this.setDados('jqxhr', jqxhr);
                }
        })
        .unmask()
        .mask("99999-999",{"placeholder":" "})
        .bind('mouseup', function(){
            if ( this.eh('readonly') || this.eh('[disabled]') || this.temClasse('desabilitado')) 
                    return false;
            this.simularEvento("select");
        });
    },

    /**
     * Retorna a linha atual do Subform
     */
    getLinhaAtual : function(){

        return this.maisProximo('.Superlogica_Js_Template_Row');
    },
    
    /**
     * Retorna o valor do select apartir de seu label
     * @return null|string
     */
    getValueOfLabel : function( label ){
        if ( !this.eh('select') )
            return null;        
        var valor = null;
        this.emCadaElementoFilho(function(){
            if ( valor !== null ) return false;
            var elemento = new Superlogica_Js_Elemento(this);
            // verifica o option
            if ( elemento.eh('option') && ( valor = getValue(label, elemento )) !== null ){
                return valor;
            }
            // verifica os optgroup
            if ( elemento.eh('optgroup') ){
                elemento.emCadaElementoFilho(function(){
                    if ( valor !== null ) return false;
                    var elemento = new Superlogica_Js_Elemento(this);
                    valor = getValue( label, elemento );
                });
                
            }
            
            function getValue( label, elemento ){  
                var jsElemento = elemento.$_elemento[0];
                if ( jsElemento.innerHTML.trim().toLowerCase() == label.trim().toLowerCase() ){
                    return jsElemento.value;
                }
                return null;
            }
        });
        return valor;
    },

	 
	_criarItensSelect : function(arData){
		var elementoAtual = this;
		var elemento = "";   
		Object.each(arData, function(item, key){    
			if ((typeOf(item.subitens) == 'object') || (typeOf(item.subitens) == 'array')){
				elemento += "<optgroup label='"+item.label+"'>";     
				Object.each(item.subitens, function(subitem, subkey){ 
					elemento += criarOption( subitem );
				}); 
				elemento += "</optgroup>";          
			} else {
				elemento = criarOption( item );
			}
			
			function criarOption( options ){
				if (options.selected){
					elemento = "<option value='"+options.id+"' label='"+options.label+"' selected='selected'>"+options.label+"</option>";     
				} else {
					elemento = "<option value='"+options.id+"' label='"+options.label+"' >"+options.label+"</option>"
				}
				return elemento;
			}
			elemento = new Superlogica_Js_Elemento( elemento );
			elemento.adicionarAoFinalDe( elementoAtual );
		});
	},  
		   
    __alterarSenha : function(){        
        this.atributo('style','color:#CCC');
        this.bind('focus', function(evento){
            var campoPassword = new Superlogica_Js_Elemento('<input type="password" name="SMTP_SENHA" id="SMTP_SENHA" value="" quebradelinha="1" carregado="sim" >')
            .bind('blur', function(evento){
                if(this.atributo('value').trim() != '') return;
                var campoOriginal = new Superlogica_Js_Elemento('<input type="text" name="SMTP_SENHA" id="SMTP_SENHA" value="Clique para alterar" comportamentos="Form_Elementos.alterarSenha" quebradelinha="1" style="color:#CCC" carregado="sim">').inserirDepoisDe( this );
                this.processarComportamento(campoOriginal);
                this.remover();
            }).inserirDepoisDe(this).focar();
            this.remover();
        });
    },
    
    __combo : function(){
        var combo = this
            .envolverTudo('<span style="position:relative;"></span>')
            .adicionarClasse('sl-combo-handler')
            .bind('click.combo focusin.combo', function(evento){                
                evento.stopPropagation();
                var acoes = this.getDados('acoes');
                var acaoPadraoInvocada = false;
                var comportamento;
                Object.each( acoes, function( dados ){
                    comportamento = dados.comportamento;
                    if ( evento.type != 'focusin' && !acaoPadraoInvocada && dados.padrao && typeof combo[comportamento] == 'function' ){
                        acaoPadraoInvocada = true;
                        combo[comportamento](dados);
                        new Superlogica_Js_Elemento(window).simularEvento('click.combo');
                    }
                });

                if ( !acaoPadraoInvocada && evento.type != 'focusin' ){
                    comboHandler.simularEvento('click.combo');
                }

            });
        
        var comboHandler = new Superlogica_Js_Elemento('<a href="javascript:void(0);" class="combo ' + combo.atributo('class') + '">&nbsp;</a>');
        comboHandler
            .bind('click.combo focusin.combo', function(event){
                event.stopPropagation();
                
                var janela = new Superlogica_Js_Elemento(window);
                if ( new Superlogica_Js_Elemento("#sl-combo").contar() )
                    janela.simularEvento('click.combo');
                
                this.adicionarClasse("active");

                combo.removerClasse('sl-combo-handler')
                    .adicionarClasse('sl-combo-handler-clicked');
                
                var acoes = combo.getDados('acoes');
                
                if ( typeof acoes != 'object') return true;
                
                var htmlCombo = new Superlogica_Js_Elemento("<ul id='sl-combo' class='sl-combo "+ (combo.atributo('class').indexOf('destaque') !== false ? 'destaque' : "" ) +"'></ul>");
                var comboItem;
                Object.each( acoes, function( dados, label ){
                    label = dados.label ? dados.label : label;
                    var comportamento = dados.comportamento;
                    comboItem = new Superlogica_Js_Elemento("<li><a href='javascript:void(0);'>"+label+"</a></li>");
                    var link = comboItem.encontrar('a');
                    if(typeof dados.href == "undefined"){
                        link.bind('click', function(event){
                            if ( typeof this[comportamento] == 'function')
                                this[comportamento]( dados );
                        });
                    }else{
                        link.atributo('href',dados.href);
                        if ( dados.target ){
                            link.atributo('target',dados.target);
                        }
                        if(typeof comportamento != "undefined")
                            link.atributo('comportamentos',comportamento);
                    }
                    link.bind('focusin', function(evento){
                        evento.stopPropagation();
                    });
                    htmlCombo.adicionarHtmlAoFinal(comboItem);
                });
               
               
                htmlCombo
                    .bind('keydown.combo', function( evento ){
                        if ( evento.keyCode != 40 && evento.keyCode != 38 ) 
                            return true;
                        
                        evento.preventDefault();
                        
                        var proximoIndice = 0;
                        var elementoAtivo = 0;
                        htmlCombo.encontrar('li a').emCadaElemento(function( indice ){
                            if ( document.activeElement == this.$_elemento[0] ){
                                elementoAtivo = indice;
                            }
                        });
                        
                        proximoIndice = evento.keyCode == 40 ? elementoAtivo+1 : elementoAtivo-1;
                        var proximoElemento = htmlCombo.encontrar('li:eq('+proximoIndice+') a');
                        
                        if ( proximoElemento )
                            htmlCombo.encontrar('li:eq('+proximoIndice+') a').simularEvento('focus');
                        else{
                            htmlCombo.encontrar( evento.keyCode == 40 ? 'li:first a' : 'li:last a' ).simularEvento('focus');
                        }
                        
                    })
                    .inserirDepoisDe( this )
                    .css({
                        'top' : combo.altura(),
                        'left' : 0
                    })
                    .carregarComportamentos();
                
                janela.bind('click.combo',function(){
                    combo.removerClasse('sl-combo-handler-clicked')
                        .adicionarClasse('sl-combo-handler');                        
                    comboHandler.removerClasse('active');
                    htmlCombo.remover();
                    this.unbind('click.combo');
                });
                
                new Superlogica_Js_Elemento(document).bind('focusin.combo', function(){
                    janela.simularEvento('click.combo');
                    this.unbind('focusin.combo');
                });
                
                if( event.type == 'focusin' )
                    htmlCombo.encontrar('li:first a').simularEvento('focus');
                
            })
            .inserirDepoisDe( this );

    },
    
    /**
     * Limita um textarea
     */
    __limitarTextarea : function(){
        var item = this.getItem();        
        var descricao = item.encontrar('.descricao');
        if ( !descricao ){
            descricao = new Superlogica_Js_Elemento("<div class='descricao'>&nbsp;</div>");
            descricao.adicionarAoFinalDe( item.encontrar('.formElement') );
        }
        this.bind('keyup change paste', function(){
            this.removerAtributo('maxlength');
            var elemento = this;
            setTimeout(function(){
                var limite = elemento.getDados('limite_caracteres');
                
                var valor = elemento.getValue();
                var quantCaracteres = valor.length;
                if ( quantCaracteres > limite ){
                    elemento.setValue( valor.substr(0,limite) );
                }
                var quantCaracteresFaltantes = limite - quantCaracteres;
                var textoDescricao = 'Faltam ' + quantCaracteresFaltantes +' caracteres.';
                if ( quantCaracteresFaltantes <= 0 ){
                    textoDescricao = "&nbsp;";
                }
                descricao.conteudo(textoDescricao);
            }, 50);
        }).simularAlteracao();
    }
});
