var Superlogica_Js_Params = new Class({    

    /**
     * Classe principal para montar o template do Grid
     */
    Extends : Superlogica_Js_Template,

    initialize : function(){
        this.parent.apply( this, arguments );
    },

     /**
     * Sobrescreve a função do template para montar template personalizado e não o conteudo do elemento
     */
    setTemplate : function(){

        var referencia = this;
        this._referencia = this;

        var data = this.getData();
        var location = new Superlogica_Js_Location();
        // popula o valor
        Object.each(data, function (item, key){
            Object.each(item['params'], function(valor, param){
                item['params'][param] = location.getParam(param);
            });
                      
            item['valor'] = this[ '_valor'+item['tipo'].capitalize() ](data[key], key);
            if ( typeof item['valor'] == 'undefined' ){
                item['valor'] = "";
                Object.each(item['params'], function(value, key){
                    item['valor'] = item['valor'] + value;
                });
            }            
            item['valor'] = item['valor'] + this._getDelimitador(item);
            
            this._atualizarData(item, key);
        }, this);
        //retorna o template
        this.parent( "<span>%label% <a href='javascript:void(0);' comportamentos='Params.clique' paramId='%indice%'>%valor%</a> </span> " );

        //botão de fora
        new Superlogica_Js_Elemento( '<button class="blocoEscondido btn btn-primary" id="aplicarConfiguracoes" idTemplateAlvo="'+ this.atributo('idTemplate') +'">Aplicar</button>' )
            .inserirDepoisDe( this )
            .bind('click', function(){

                referencia._fazerRequisicao();
            });
    },

    /**
     * Comportamento quando clicar em algum elemento de filtro.
     */
    __clique : function(  ){
        this.bind('click',
            function (event){
                
                var indice = parseInt(this.atributo('paramId'));
                var params = new Superlogica_Js_Params().getClosestInstance(this);
                var data = params.getData(indice);
                data = params[ '_clique' + data.tipo.capitalize()].apply( params, [data, indice] );
        })


    },

   /**
    * Retorna o Superlogica_Js_Params pai
    *
    * @param Superlogica_Js_Template $elemento
    * @return Superlogica_Js_Template
    */
    getClosestInstance : function( elemento ){
        return new Superlogica_Js_Params(this.parent(elemento) );
    },

    /**
     * ***************************************************
     *     TIPOS DE PARAMETROS
     * ***************************************************
     */
    _cliquePeriodo : function( data, indice ){
        
        var referencia = this;
        var subformItem = referencia.encontrar('[paramid='+indice+']');      

        new Superlogica_Js_Date().selecionarPeriodo(data.params.dtInicio,data.params.dtFim,
            function(inicio,fim){

                data.params.dtInicio = inicio;
                data.params.dtFim = fim;
                data.valor = referencia._valorPeriodo(data, indice);
                referencia._analisaPossivelRequisicao();
                referencia.adicionarLinha(data,indice);
                return true;
        });

        return data;
    },

    /**
     * Retorna o valor do template de período
     */
    _valorPeriodo : function( data, indice ){

        var dtInicio = new Superlogica_Js_Date( ( typeof data.params.dtInicio != 'undefined' ) ? data.params.dtInicio : data.vazio.dtInicio );
        var dtFim = new Superlogica_Js_Date( ( typeof data.params.dtFim != 'undefined' ) ? data.params.dtFim : data.vazio.dtFim );
        return "Entre " + dtInicio.toString('d/m/Y') + " e " + dtFim.toString('d/m/Y');
    },

    /**
     * Executa quando clicar num template do tipo checkbox
     */
    _cliqueCheckbox : function( data, indice ){

        var referencia = this;
        var checkeds = 0;
        var nomeParam = '';
        Object.each(data['params'],
            function(item, key){
                nomeParam = key;
                Object.each(data['opcoes'],
                    function( valor, indice){

                        if ( (typeof item == 'object') && ( Object.getLength( typeof item == 'object' ? item : {} ) > 0 ) ){

                            Object.each(item,
                                function(valorParam, indiceParam){
                                    if  (valorParam == valor.id) {
                                        data['opcoes'][indice]['marcado'] = 'checked';
                                        checkeds++;
                                    }
                                });
                        }else{
                            if ( ( item == valor.id) || ( typeof item == 'undefined' ) ) {
                                data['opcoes'][indice]['marcado'] = 'checked';
                                checkeds++;
                            }
                        }

                    }
                );
            }
        );

        var elemento = new Superlogica_Js_Template( "<div class='conteudoParams' comportamentos='Superlogica_Js_Template' data='" + new Superlogica_Js_Json(data['opcoes']).encode() + "'><span><input name='" + nomeParam + "' type='checkbox' value='%id%' %marcado% />%label%<br></span></div>" );
            elemento.carregarComportamentos();

        var toolbar = this._HTMLDesenharToolbar({
            'Todos' : {
                "callback" : function(){
                    var checkboxes = elemento.encontrar("input[type='checkbox']");
                    checkboxes.emCadaElemento( function (){
                        this.atributo('checked', 'checked');
                    });
                },
                'atributos' : {
                    'id' : 'filtroMarcarTodosItens'
                }
            },
            'Nenhum' : {
                "callback" : function(){
                    var checkboxes = elemento.encontrar("input[type='checkbox']");
                    checkboxes.emCadaElemento( function (){
                        this.atributo('checked', '');
                    });
                }
            }
        });

        var botoesRodape = this._HTMLDesenharRodape( {
            'Aplicar' : {

                'tipo' : 'botao',
                'atributos' :  {
                    'class' : 'btn btn-primary'
//                    'comportamentos' : 'cliqueAlteraVisibilidade'
//                    'idexibir' : ( Object.getLength( this.getData() ) > 1 ) ? "aplicarConfiguracoes" : ""
                },
                'callback' : function(){
                    //informa quais elementos estão marcados
                    var checkboxes = elemento.encontrar("input[type='checkbox']");
                    data['params'][nomeParam] = [];
                    checkboxes.emCadaElemento( function (){
                        var checked = '';

                        var id = this.atributo('value');
                        if ( this.atributo('checked') == true){
                            checked = 'checked';
                        }
                        Object.each(data['opcoes'],
                            function( item, key){
                                if(item.id == id){
                                    data['opcoes'][key]['marcado'] = checked;
                                    if ( checked ){
                                        data['params'][this.atributo('name')].push( item.id );
                                    }
                                }
                            }, this
                        );
                    });

                    data.valor = referencia._valorCheckbox(data, indice);
                    referencia.adicionarLinha( data, indice );
                    dialogo.remover();
                    referencia._analisaPossivelRequisicao();

                    return true;
                }

            },

            ' ou ' : {
                'tipo' : 'textNode'
            },

            'Cancelar' : {
                'callback' : function(event){
                    dialogo.remover();
                }
            }

        });

        botoesRodape.carregarComportamentos();

        var dialogo = new Superlogica_Js_Elemento('<div></div>');
            dialogo.adicionarHtmlAoFinal( elemento );
            dialogo.adicionarHtmlAoFinal( botoesRodape );
            dialogo.adicionarHtmlAoInicio( toolbar );

        if (checkeds == 0){
            elemento._depoisDeDesenharLinha = function(){

                elemento.encontrar('#filtroMarcarTodosItens').simularClique();
            }

        }

        var subformItem = referencia.encontrar('[paramid='+indice+']');
        dialogo.dialogo({
            'modal' : true,
            'resizable' : false,
            'width' : 250,
            'position' : [parseInt( subformItem.posicao().esquerda ), parseInt( subformItem.posicao().topo )+20]
        });

    },

    _cliqueLink : function( data, indice ){

        var location = new Superlogica_Js_Location();
                location.setController(data['controller']);
                location.setId(data['id']);
                Object.each(data['parametros'], function(item, key){
                        location.setParam(key, item);
                });
                   window.open(location.toString());
    },


    _cliqueAutocomplete : function( data, indice ){

        var referencia = this;

        var dialogo = new Superlogica_Js_Elemento("<form></form>");
        var divAutoCompletes = new  Superlogica_Js_Elemento("<div class='autocomplete Superlogica_Params clearFix'></div>");

        var autoComplete = new Superlogica_Js_Elemento("<div class='item'><label class='formLabel'>"+data.autocomplete.label+"</label><br><div class='formElement'><input class='slautocomplete_default slautocomplete ui-autocomplete-input' comportamentos='Form_Elementos.autocomplete' url='"+data.url+"' type='text' popular='" + new Superlogica_Js_Json( data.autocomplete.popular ).encode() +"' mostrar='"+ new Superlogica_Js_Json( data.autocomplete.mostrar ).encode() +"' size=25 nomeReal='"+ data.autocomplete.nomereal +"' name='"+ data.autocomplete.name +"' ></div></div>");
        autoComplete.carregarComportamentos();
        var elementoHidden = new Superlogica_Js_Elemento("<div class='blocoEscondido' ><input type='text' nomeReal='"+data.elementoHidden.nomereal+"' name='"+ data.elementoHidden.name +"'></div>");

        var subformRow = new Superlogica_Js_Elemento("<div></div>");
        subformRow.adicionarHtmlAoFinal( autoComplete );
        subformRow.adicionarHtmlAoFinal( elementoHidden );
        
        var dados = ( (typeof data['params']  == 'undefined') || ( typeof data['params'][data['subform']]  == 'undefined') )? [{'empty':''}] : data.opcoes[data.subform];
        if (typeof data.subform != 'undefined'){
            
            var elementoExcluir = new Superlogica_Js_Elemento("<div class='item form-group'><div class='formElement'><div id='"+data.subform+ "-__indice__-"+"excluir"+data.subform+"' class='slTexto subFormExcluir lineSeparator subFormExcluir__indice__' nomereal='excluir"+data.subform+"' indice='__indice__' comportamentos='Form.subFormExcluir' type='button'><a href='javascript:void(0);'><span class='glyphicon glyphicon-trash'></span></a></div></div></div>");
            
            autoComplete.encontrar('.formElement').adicionarHtmlAoFinal( elementoExcluir );
            
            if (typeof data['param_submeter'] != 'undefined'){

                var location = new Superlogica_Js_Location(  data.url_recarregar );
                var locationAtual = new Superlogica_Js_Location();
                if (data['param_submeter'] == 'id'){
                    location.setId( locationAtual.getId(), locationAtual.getParam() );
                }else{
                    location.setParam(data['param_submeter'], locationAtual.getParam( data['param_submeter'] ) );
                }
                location.addParams( data['parametros_url'] );
                
                dados = new Superlogica_Js_Json( location.setApi( true ).toString() ).extrair(-1);
                dados = dados[0][ data['subform'].toLowerCase() ];                
            }else if ( (typeof data['opcoes'] == 'undefined') && ( typeof data.params[data.subform]  != 'undefined') ){

                dados = new Superlogica_Js_Json(  new Superlogica_Js_Location( data.url_recarregar )
                                    .setParam( data.param_recarregar, data.params[data.subform] )
                                    .setApi( true )
                                    .toString() ).extrair(-1);
            }
                 
            if ( Object.getLength( dados ) < 1) dados = [0];
            
            var subform = new Superlogica_Js_Elemento("<div data='"+ new Superlogica_Js_Json( dados ).encode()+"' comportamentos='Superlogica_Js_Template'  subform='"+data.subform+"' leftDelimiter='__' rightDelimiter='__' ></div>");
            subform.adicionarHtmlAoFinal( subformRow );

            var span = new Superlogica_Js_Elemento("<div class='subForm clearFix'></div>");
            span.adicionarHtmlAoFinal( subform );
            span.adicionarHtmlAoFinal( new Superlogica_Js_Elemento("<input name='maisum' type='button' class='subformmaisitens btn btn-link' comportamentos='Form.subformMaisItens' subform='"+data.subform+"' value='Mais um'><br>") );

            span.carregarComportamentos();
            divAutoCompletes.adicionarHtmlAoFinal( span );
        }else{
            divAutoCompletes.adicionarHtmlAoFinal( autoComplete );
            divAutoCompletes.adicionarHtmlAoFinal( elementoHidden );
        }

        dialogo.adicionarHtmlAoFinal( divAutoCompletes );
        dialogo.adicionarHtmlAoFinal( this._HTMLDesenharRodape( {
            'Aplicar' : {
                'tipo' : 'botao',
                'atributos' :  {
                    'class' : 'btn btn-primary'
                },                
                'callback' : function(event){
                    event.preventDefault();
                    var elemento = new Superlogica_Js_Form_Elementos( this );

                    data.opcoes = elemento.getForm().toArray();
                    data.valor = referencia._valorAutocomplete(data, indice);

                    if (typeof data['params'] == 'undefined'){
                        data['params'] = [];
                    }

                    if (typeof data.subform == 'undefined'){
                        
                        data['params'][data.elementoHidden.nomereal] = [];
                        var valorFinal = data['opcoes'][data.elementoHidden.nomereal] != 'undefined' ? data['opcoes'][data.elementoHidden.nomereal] : data['opcoes'][data.elementoHidden.nomereal.toLowerCase()];
                        data['params'][data.elementoHidden.nomereal] = valorFinal;                        
                        
                    }
                    else{
                        var params = data.opcoes[data.subform];
                        data['params'][data.subform] = [];
                        Object.each(params, function(item, key){
                            if (item[data.elementoHidden.nomereal] != '' && (typeof data.param_submeter == 'undefined')){
                                data['params'][data.subform].push( item[data.elementoHidden.nomereal] );
                            }else if (typeof data.param_submeter != 'undefined'){
                                data['params'][data.subform].push( item );
                            }
                        });
                        delete data['params']['maisum'];
                    }

                    dialogo.remover();
                    referencia.adicionarLinha( data, indice );
                    referencia._analisaPossivelRequisicao( data );
                    return true;
                }
            },
            ' ou ' : {
                'tipo' : 'textNode'
            },
            'Cancelar' : {
                'callback' : function(event){
                    dialogo.remover();
                }
            }
        }) );

        var subformItem = referencia.encontrar('[paramid='+indice+']');        
        
        dialogo.dialogo({
            'modal' : true,
            'resizable' : false,
            'width' : 350,
            'position' : [parseInt( subformItem.posicao().esquerda ), parseInt( subformItem.posicao().topo )+20]
        });        
    },

    _valorAutocomplete : function( data, indice ){

        var valorAutoComplete = '';
        var valorHidden = '';
        var opcoes ='';
        var qtdOpcoes = 0;                
        
        if ( (typeof data['opcoes'] == 'undefined') &&
           ( ( (typeof data['subform'] == 'undefined') && (typeof data['params'] =='undefined' ) ) ||
             ( (typeof data['subform'] != 'undefined') && (typeof data['params'][data['subform']]== 'undefined') )
            ) &&
           ( typeof data['param_submeter'] == 'undefined' ) ) {
            return data.vazio;
        }

        if (typeof data.subform != 'undefined'){
            
            if (typeof data['opcoes'] == 'undefined'){
                data['opcoes'] = [];
                data['opcoes'][data['subform']] = [];
                var location = new Superlogica_Js_Location( data.url_recarregar )
                                .setParam( data.param_recarregar, data.params[data.subform] )
                                .setApi( true );

                var result;
                if ( typeof data['param_submeter'] != "undefined"){

                    var locationAtual = new Superlogica_Js_Location();
                    if (data['param_submeter'] == "id"){
                        location.setId( locationAtual.getId() );
                    }else{
                        location.setParam( data['param_submeter'], locationAtual.getParam( data['param_submeter'] ) );
                    }

                    location.addParams( data['parametros_url'] );
                    result = new Superlogica_Js_Json( location.toString() ).extrair(-1);
                    result = result[0][ data['subform'].toLowerCase() ]                    
                }else{
                    result = new Superlogica_Js_Json( location.toString() ).extrair(-1);
                }

                if ( Object.getLength( result ) < 1){
                    return data['vazio'];
                }                
                data['opcoes'][data['subform']] =  result;
            }
            
            Object.each( data['opcoes'][data['subform'] ], function(item, key){
                if (typeof(data.autocomplete.nomereal) == 'object') {
                    Object.each( data.autocomplete.nomereal, function(valor, key){                                         
                        valorAutoComplete += (typeof item[valor] != 'undefined') ? item[valor] : item[valor.toLowerCase()] + ' ';
                    })
                } else {
                    valorAutoComplete = (typeof item[data.autocomplete.nomereal] != 'undefined') ? item[data.autocomplete.nomereal] : item[data.autocomplete.nomereal.toLowerCase()];                    
                }                   
                valorHidden = (typeof item[data.elementoHidden.nomereal] != 'undefined') ? item[data.elementoHidden.nomereal] : item[data.elementoHidden.nomereal.toLowerCase()];

                if ( (typeof valorAutoComplete  != 'undefined' ) && (typeof valorHidden != 'undefined' ) ){
                    if ( (valorAutoComplete != '' ) && (valorHidden != '') ){
                        opcoes = (qtdOpcoes < 1) ? valorAutoComplete : opcoes +"; " + valorAutoComplete
                        qtdOpcoes++;
                    }
                }
            })

            if (opcoes == "") opcoes = data['vazio'];
            return ( qtdOpcoes <= 5) ? opcoes : 'Vários';

        }else{

            valorAutoComplete = data.opcoes[data.autocomplete.nomereal];
            valorHidden = data.opcoes[data.elementoHidden.nomereal];
            if ( (typeof valorAutoComplete != 'undefined') && (typeof valorHidden != 'undefined') ){
                if ( (valorAutoComplete != '') && (valorHidden != '') ){
                    return valorAutoComplete;
                }
            }

        }
    },

    _cliqueSelecao : function( data, indice ){

        var referencia = this;

        var dialogo = new Superlogica_Js_Elemento("<div class='selecao'></div>");
        var ul = new Superlogica_Js_Elemento("<ul ></ul>");
        var li;

        Object.each(data['opcoes'], function(item, key){  
			var labelElemento = (typeof item['elemento'] != 'undefined') ? item.elemento.label : '';
            if (item.label == data.valor){
                li =  new Superlogica_Js_Elemento("<li idParam='"+item.id+"'><a href='javascript:void(0);'>"+item.label+' '+labelElemento+"</a></li>");
            }else{
                li =  new Superlogica_Js_Elemento("<li idParam='"+item.id+"'><a href='javascript:void(0);'>"+item.label+' '+labelElemento+"</a></li>");
            }
     
                
            li.bind('click',
                function(event){
                    var valorAtual;
					var parametroSelecao;
                    var li = new Superlogica_Js_Form_Elementos( this );                       

                    Object.each(data['params'], function(item, key){
                        valorAtual = item;						
                        data['params'][key] = li.atributo('idParam');
						parametroSelecao = key;                        
                    });
                    
					var tipoElemento = '';                        
                    Object.each(data['opcoes'], function(opcao, key){                                    
                        if ( (li.atributo('idParam') == opcao.id) && (opcao.elemento)){   
						    tipoElemento = opcao.elemento.tipo;
                            if (tipoElemento  == 'selecionardia'){                                  
                                var location = new Superlogica_Js_Location();                             
                                var selecionarData = new Superlogica_Js_Date().selecionarDia(location.getParam(opcao.elemento.parametrourl),
                                                                                function( dtInicio ){                                                                          
                                                                                    location.setParam(opcao.elemento.parametrourl, dtInicio);                                                                                   
                                                                                    location.setParam(parametroSelecao, opcao.id);                                                                                   																					
                                                                                    window.location.href = location.toString();        
                                                                                });                                                                                                                                                                          
                            }
                        }
                    });     
       
					if (tipoElemento  == 'selecionardia'){ 
						dialogo.remover();
						return false; 
					}
			   
                    if ( (valorAtual == li.atributo('idParam') && ( typeof referencia["__" + li.atributo('idParam')] != 'function') ) || (data.valor == item.label ) ){
                        dialogo.remover();                          
                        return false;
                    }

                    data.valor = referencia._valorSelecao(data, indice);                                   
                    
                    if( typeof referencia["__" + li.atributo('idParam')] == 'function'){                        
                        data.valor = referencia["__" + li.atributo('idParam')]( item );
                    }
                    
                    if (data.valor){
                        dialogo.remover();
                        referencia.adicionarLinha( data, indice );
                        referencia._analisaPossivelRequisicao();
                        return true;
                    }
                    return false;
                });

            ul.adicionarHtmlAoFinal( li );
        });

        var line = new Superlogica_Js_Elemento("<hr>");

        var botoesRodape = this._HTMLDesenharRodape( {
            'Cancelar' : {
                'callback' : function(event){
                    dialogo.remover();
                }
            }
        });

        dialogo.adicionarHtmlAoFinal( ul );
//        dialogo.adicionarHtmlAoFinal( line );
        dialogo.adicionarHtmlAoFinal( botoesRodape );

        var subformItem = referencia.encontrar('[paramid='+indice+']');
        dialogo.dialogo({
            'modal' : true,
            'resizable' : false,
            'position' : [parseInt( subformItem.posicao().esquerda ), parseInt( subformItem.posicao().topo )+20],
            'width' : 'auto'
        });

        dialogo.encontrar('a:first').simularEvento('focusin');
    },


    _valorSelecao : function( data, indice ){
        var opcao='';
        Object.each(data['params'], function(item, key){	         
            if (item != ''){
                opcao = item;
            }
        });
        
        if ( (opcao == '' ) || (typeof opcao == 'undefined') ){
            return data['vazio'];
        }else{
            var idSelecionada = opcao;
            var opcaoSelecionada;
            Object.each(data['opcoes'], function(item, key) {                
                if (item.id == idSelecionada){
                    if (typeof item.elemento  != 'undefined' ){
                        if (item.elemento.tipo == 'selecionardia'){
                            var location = new Superlogica_Js_Location();                     
                            var data = new Superlogica_Js_Date(location.getParam(item.elemento.parametrourl));
                            opcaoSelecionada = item.label+ ' '+data.toString('d/m/Y'); 
                        }
                    } else {
                        opcaoSelecionada = item.label;
                    }
                }
            }, this );
 
            return opcaoSelecionada;
        }
    },
    
    
    _cliqueData : function( data, indice ){               
        var location = new Superlogica_Js_Location();
        
        if (data.formato.toLowerCase() == 'selecionardia'){
            var selecionarData = new Superlogica_Js_Date().selecionarDia(
                location.getParam(data['popular'][0]),
                function( dtInicio ){
                    location.setParam(data['popular'][0], dtInicio)           
                    window.location.href = location.toString();
                    data.valor = dtInicio;
                }
            );                            
        }   

        if (data.formato.toLowerCase() == 'selecionarperiodo'){
            var location = new Superlogica_Js_Location();
            var selecionarData = new Superlogica_Js_Date().selecionarPeriodo(
                location.getParam("dtInicio"),
                location.getParam("dtFim"),
                function( dtInicio, dtFim){
                    location.setParam(data['popular'][0], dtInicio);
                    location.setParam(data['popular'][1], dtFim);
                    window.location.href = location.toString();
                }
            );
        }
    },  


    _valorData : function( data, indice ){    
        var location = new Superlogica_Js_Location(); 
        var opcao='';
        if(data.formato.toLowerCase() == 'selecionarperiodo'){
            var dtInicio = location.getParam(data['popular'][0]) ? location.getParam(data['popular'][0]) : data['vazio'][0];
            var dtFim = location.getParam(data['popular'][1]) ? location.getParam(data['popular'][1]) : data['vazio'][1];
            opcao = new Superlogica_Js_Date(dtInicio).toString('d/m/Y') + ' e ' +  new Superlogica_Js_Date(dtFim).toString('d/m/Y');
        } else
            opcao = new Superlogica_Js_Date(location.getParam(data['popular'][0])).toString('d/m/Y');
        
        if ( (opcao == '' ) || (typeof opcao == 'undefined') ){
            return data['vazio'];                  
        } else {
            return opcao;   
        }
    },



    /**
     * Cria e adiciona os elementos informados no rodapé
     *
     * @param array elemento
     * @return Superlogica_Js_Elemento
     */
    _HTMLDesenharRodape : function( elementos ){
        return this._HTMLDesenharElemento( {"classe" : "botoesRodape clearFix"}, elementos );
    },

    /**
     * Cria o toolbar dos checkboxes
     *
     * @param array elemento
     * @return Superlogica_Js_Elemento
     */
    _HTMLDesenharToolbar : function( options ){
        if ( typeof options != 'object') return this;

        var elementosInternos = {};
        Object.each( options, function( item, label ){
            elementosInternos[label] = {
                'atributos' : {
                    'class' : 'links'
                }
            };
            if ( typeof item.callback == 'function'){
                elementosInternos[label]['callback'] = item.callback;
            }

        }, this);

        return this._HTMLDesenharElemento( {"classe" : "clearFix"}, elementosInternos );
    },

    /**
     * Cria um elemento com subitens
     *
     * @param object opcoesElemento  Contém as informações sobre o elemento pai
     * @param object elementosInternos Objeto com elementos a serem adicionados internamente
     * @return Superlogica_Js_Elemento
     */
    _HTMLDesenharElemento : function( opcoesElemento, elementosInternos ){

        var elemento = new Superlogica_Js_Elemento('<div />');

        if ( opcoesElemento.classe ){
            elemento.adicionarClasse( opcoesElemento.classe );
        }

        if ( typeof elementosInternos == 'object'){
            Object.each( elementosInternos, function( item, label ){
                var tipoElemento = 'a';
                var atributos =  {'href' : "javascript:void(0);"};

                switch ( item.tipo ){
                    case 'botao':
                        tipoElemento = 'button';
                        break;
                    case 'textNode' :
                        elemento.adicionarHtmlAoFinal( document.createTextNode( label ) );
                        return ;
                        break;

                }

                atributos = Object.append( atributos, typeof item.atributos == 'object' ? item.atributos : {} );

                var htmlAtributos = "";
                Object.each( atributos, function( valor, atributo ){
                    htmlAtributos = htmlAtributos + atributo+'="'+valor+'"';
                });
                var subElemento = new Superlogica_Js_Elemento('<'+tipoElemento+' ' + htmlAtributos + '>'+ label +'</' + tipoElemento + '>');
                if ( typeof item.callback == 'function'){
                    subElemento.bind('click', item.callback );
                }
                elemento.adicionarHtmlAoFinal( subElemento );
            }, this );
        }
        return elemento;
    },

    /**
     * Retorna o valor do template de checkbox
     */
    _valorLink : function( data, indice ){

        return 'Mais opções';
    },

    _valorCheckbox : function( data, indice ){

        var result = '';
        var paramsSelecionados = 0;
        var arraySelecao = [];
        for( key in data['params'] ){
            if ( data['params'].hasOwnProperty(key) && typeof data['params'][key] == 'object' )
                paramsSelecionados = paramsSelecionados + Object.getLength( typeof data['params'][key] == 'object' ? data['params'][key] : {} );
        }

        if ( paramsSelecionados == Object.getLength( typeof data['opcoes'] == 'object' ? data['opcoes'] : {} ) )return data['vazio'];

        Object.each(data['params'],
            function(item, key){

                if (typeof item == 'undefined')return;
                Object.each(item,
                    function(valorItem, indiceItem){
                        Object.each(data['opcoes'],
                            function(opcao, indiceOpcao){

                                if ( typeof opcao.id == 'undefined' )return;
                                if ( valorItem == opcao.id ){
                                    arraySelecao.push( opcao.label );
                                }
                            }
                        );
                    }
                );

        });

        var nmSelecionadas = Object.getLength( typeof arraySelecao == 'object' ? arraySelecao : {} );
        Object.each(arraySelecao ,
            function(item, key){
                if (key == 0) result = item;
                else{
                    if ( (nmSelecionadas == 2) || (key == ( nmSelecionadas -1 ) ) ){
                        result = result + " e " +item;
                    }else{
                        result = result + ", " +item;
                    }
                }
            }
        )
        
        return ( result != '') ? result : data['vazio'];
    },

    /**
     * Verifica se é necessário já fazer a requisição
     * Quando tem somente uma opção no filtro, ele faz a requisição,
     * caso contrário mostra um botão aplicar
     */
    _analisaPossivelRequisicao : function ( dados ){

        var data = this.getData();
        if ( typeof dados != 'undefined' ){

            var paramSubmeter = (typeof dados['param_submeter'] != 'undefined') ? dados['param_submeter'] : 'id';
            if (typeof dados['url_submeter'] != 'undefined'){

                var locationAtual = new Superlogica_Js_Location();
                var valorSubmeter = locationAtual.getParam( paramSubmeter );
                if ( paramSubmeter == "id") valorSubmeter = locationAtual.getId();
                                        
                var template = this.getClosestInstance();
                var itens = template.getData();                
                var location = new Superlogica_Js_Location( dados['url_submeter'] );
                location.setParam(paramSubmeter, valorSubmeter);
                
                var params= {};   
                
                Object.each( itens, function ( item, chave ){
                    if ( item.params && typeof item.params == 'object' ){
                        Object.each( item.params, function( valor, chave2 ){
                            if ( typeOf(valor) == 'array' && valor.length <= 0 ){
                                item.params[chave2] = "";
                            }
                        });
                    }
                    
                    params= item.params;
                });
                                
                var request = new Superlogica_Js_Request( location.toString(), params ).getResponse();
                return false;
            }else{
                this._fazerRequisicao();
            }                            
        }
        
        //if ( Object.getLength( typeof data == 'object' ? data : {} ) == 1){
            this._fazerRequisicao();
        /*}else{
            new Superlogica_Js_Elemento( "#aplicarConfiguracoes" ).mostrar();
        }*/
    },

    /**
     * Faz a requisição ou guarda a url
     * @param <string >idTemplate id do template
     * @param <true> fazerRequisicao  true Faz a requisição com os parâmetros atuais,
     *                                false Guarda os parâmetros;
     */
    _fazerRequisicao : function (){

        var template = this.getClosestInstance();
        var dados = template.getData();
        var location = new Superlogica_Js_Location();        

        Object.each( dados, function( item ){            
            Object.each(item.params, function(valor, chave){
                if (valor == '') valor = null;
                location.setParam(chave, valor);
            })
        }, this );
        window.location.href = location.toString();
    },

    /**
     * Retorna o delimitador de cada params.
     */
    _getDelimitador: function( data ){

         return typeof data['delimitador'] != 'undefined' ? data['delimitador'] : '';
    }

});
Superlogica_Js_Params.chavesParaMaiusculo = function( array ){
    var array = Object.clone(array);
    Object.each( array, function( dados, chave ){
        if ( typeof dados == 'object' ){
              array[chave.toUpperCase() ] = Superlogica_Js_Params.chavesParaMaiusculo( dados );
        }else{
              array[chave.toUpperCase() ] = dados;
       }  
      if ( chave != chave.toUpperCase() )
           delete array[chave];
    });
    return array;
}