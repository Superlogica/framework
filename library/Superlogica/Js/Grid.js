var Superlogica_Js_Grid = new Class({

    /**
     * Classe principal para montar o template do Grid
     */
    Extends : Superlogica_Js_Template,

    _closestInstance : null,
    
    /**
     * Delimitadores, da esquerda, das variáveis
     */
    _defaultLeftDelimiter : '{',

    /**
     * Delimitadores, da direita, das variáveis
     */
    _defaultRightDelimiter : '}',

    /**
     * Msg exibida quando nenhum item está marcado e o formulário multiplo for submetido
     * 
     * @var string
     */
    _msgNenhumItemMarcado : "Nenhum item marcado",

    /**
     * Classes CSS utilizadas pelo Grid
     */
    _cssGrid : {
        'linhaPar' : 'linhaPar',
        'linhaImpar' : 'linhaImpar',
        'rodape' : 'rodape',
        'cabecalho' : 'classGridCabecalho',
        'paginacao' : 'classGridPaginacao',
        'coluna' : 'classGridColuna',
        'botao' : 'Superlogica_Js_Grid_Botao',
        'botaoPersonalizado' : 'Superlogica_Js_Grid_Botao_Personalizado',
        'linhaSelecionada' : "linhaSelecionada",
        'marcador' : 'Superlogica_Js_Grid_Marcador',
        'marcadorPrincipal' : 'Superlogica_Js_Grid_MarcadorPrincipal',
        'linhaHover' : 'Superlogica_Js_Grid_LinhaHover',
        'marcadores' : "Superlogica_Js_Grid_Marcadores",
        "msgVazio" : "Superlogica_Js_Grid_MsgVazio"
    },
    
    /**
     * sobrescrito para fazer algumas rotinas para o Grid
     */
    carregarComportamentos : function(){
        
        this._adicionarMarcadores();
        this._adicionarBotoesAColuna();
        this._identificarPaginaAtual();
        var location = new Superlogica_Js_Location();
        this.setItensPorPagina( location.getParam('itensPorPagina') );
        this._normalizarLarguraColuna();
        this.parent.apply( this, arguments );

        var itensPorPagina = this.getItensPorPagina();
        var dados = this.getData();

        if ( (typeof dados == 'object') && (parseInt( itensPorPagina ) > Object.getLength( dados )) ){
            this.setOption('fimPaginacao', true );
            this._HTMLDesenharPaginacao();
        }
        
        var referencia = this;
        // Espera o Grid ser totalmente carregada para poder delegar seus eventos
        var intervalDelegate = setInterval( function(){
            if ( referencia.atributo( 'desenhado' )  ){
                referencia._delegarEventos();
                clearInterval( intervalDelegate );
            }
        },500);
        
        
    },
    
    /**
     * Delega todos eventos repetitivos ao template principal
     */
    _delegarEventos : function(){
        
        var grid = this.getClosestInstance();
        
        if ( grid.getDados('eventsDelegated') ) return true;        
        
        grid.setDados('eventsDelegated', true );
        
        // Selecionar linhas
        this.delegate(
            'tr.'+this._cssGrid['linhaPar']+', tr.'+this._cssGrid['linhaImpar'],
            'click',
            function(evento){    
                if ( this.temClasse( grid._cssGrid['linhaSelecionada'] ) ) return ;
                grid.selecionarLinha.apply( grid, [parseInt( this.atributo('indice') ) ] );
            }
        )
            
        // Mouse over e out da linha
        .delegate(
            'tr.'+this._cssGrid['linhaPar']+', tr.'+this._cssGrid['linhaImpar'],
            'mouseover',
            function(){
                this.adicionarClasse(  this._cssGrid['linhaHover'] );
                var dadosLinha = grid.getData( this.atributo('indice') );
                var botoes = this.encontrar( 'a.'+grid._cssGrid['botao'] );

                var mostrarItens = true;
                if ( typeof grid._adicionarBotoes == 'function' ){
                    mostrarItens = grid._adicionarBotoes( dadosLinha );
                }
                var itensInvisiveis = this.encontrar(".blocoInvisivel");
                if ( itensInvisiveis && mostrarItens ){
                    itensInvisiveis.removerClasse("blocoInvisivel").atributo('visibilidadeAlterada', '1');
                }

                if ( !botoes ) return true;
                botoes
                    .emCadaElemento( function(){
                        var elemento = new Superlogica_Js_Elemento( this );
                        if ( typeof grid['_aoMostrarBotao'+ elemento.atributo('acao').capitalize()] == 'function'){
                            grid['_aoMostrarBotao'+ elemento.atributo('acao').capitalize()].apply( grid, [ elemento.$_elemento, dadosLinha, parseInt( this.atributo('indice') ) ] );
                        }
                    });
            }
        )
        .delegate(
            'tr.'+this._cssGrid['linhaPar']+', tr.'+this._cssGrid['linhaImpar'],
            'mouseout',
            function(){
                
                this.removerClasse(this._cssGrid['linhaHover']);
                
                var dadosLinha = grid.getData( this.atributo('indice') );
                var mostrarItens = true;
                if ( typeof grid._adicionarBotoes == 'function' ){
                    mostrarItens = grid._adicionarBotoes( dadosLinha );
                }
                var itensMostrados = this.encontrar("[visibilidadeAlterada]")
                if ( itensMostrados && mostrarItens )
                    itensMostrados.adicionarClasse("blocoInvisivel").removerAtributo('visibilidadeAlterada');
                
            }
        )
            
        // Executa a ação de um botão
        .delegate(
            'a.'+this._cssGrid['botao'],
            'click',
            function(evento){
                
                var acao = this.atributo('acao');
                
                var infoBotao = grid._getInfoBotao(acao);
                
                if ( !infoBotao ) return true;
                
                evento.preventDefault();
                
                var dadosLinhas = grid.getDadosLinhasMarcadas();
                
                if ( infoBotao.multiplo && Object.getLength( dadosLinhas) <= 0 ){
                    alert( this._msgNenhumItemMarcado );
                    return true;
                }

                this.getClosestInstance().executarBotao.apply( this.getClosestInstance(), [ acao, this.atributo('indice'), this ] );
            }
            
        )
            
        // Evento para marcadores
        .delegate('input.'+this._cssGrid['marcador'],'change', function(){

            var marcadores = grid._getMarcadoresLinhas();
            if ( !marcadores ) return true;
            
            var desmarcados = false;
            marcadores.emCadaElemento(function(){
                if ( !this.eh(':checked') ){
                    desmarcados = true;
                    return false;
                }
            });
            
            var marcadorPrincipal = grid.encontrar( 'input.'+grid._cssGrid['marcadorPrincipal'] );            
            if ( marcadorPrincipal ){
                if ( desmarcados ){
                    marcadorPrincipal.atributo('checked', "");
                    marcadorPrincipal.atributo('tipo', 'todos');
                }else{
                    marcadorPrincipal.atributo('checked', "checked");
                    marcadorPrincipal.atributo('tipo', 'nenhum');
                }
            }
            if ( typeof grid['_aoMarcar'] == 'function')
                grid['_aoMarcar']( grid.getData(  parseInt( this.atributo('indice') ) ) );

        });                

        new Superlogica_Js_Elemento( window ).bind('resize.botoes_rodape', function(){
            grid._corrigirPosicaoDropDown();
        }).simularEvento('resize');

    },
    
    /**
     * Normaliza a largura da coluna de acordo com total de largura disponivel
     */
    _normalizarLarguraColuna : function(){
        var colunas = this.getOption('colunas');
        var larguraTotal = 0;
        Object.each( colunas, function( item ){    
            if ( !item['tamanho'] )
                throw "Coluna '"+ item['label']+"' não tem o atributo tamanho especificado.";
            larguraTotal += parseInt( item['tamanho'].replace(/px|\%/g,'') );
        });
        
        var tamanho = 0;
        var unidade = '';
        var _infoTamanho = null;
        var _tamanho = "";
        Object.each( colunas, function( item, chave ){
            _tamanho = new String( (item['tamanho'] ? item['tamanho'] : 0) );
            _infoTamanho = _tamanho.match(/^([0-9]{1,})(px|%)?$/);
            unidade = _infoTamanho[2];
            tamanho = parseInt( _infoTamanho[1] );
            colunas[chave]['tamanho'] = Math.round( tamanho * 100 / larguraTotal ) + unidade ;
        });
    },
    
    /**
     * Retorna o template do checkbox
     * @return string
     */
    _getTemplateCheckbox : function( indice ){
        
        var templateCheckbox = '<label class="ui-checkbox">\
        <input type="checkbox" indice="{indice}" class="'+ this._cssGrid['marcador']+'" />\
        <span>&nbsp;</span></label>';

        // var templateCheckbox = '<input type="checkbox" indice="{indice}" class="'+ this._cssGrid['marcador']+'" />';
        if ( typeof indice != 'undefined')
            templateCheckbox = templateCheckbox.replace( '{indice}', indice );
        return templateCheckbox;
    },
            
    /**
     * Troca o checkbox na string informada
     * 
     * @param string texto
     * @return string
     */
    _adicionarStringCheckbox : function( texto, indice ){
        var totalCheckbox = texto.match(/\{checkbox\}/g);
        texto = texto.replace( /\{checkbox\}/g, this._getTemplateCheckbox( indice ) );
        return { "string" : texto, "total" : totalCheckbox ? Object.getLength(totalCheckbox) : 0 };
    },
            
    /**
     * Adiciona coluna para marcadores
     */
    _adicionarMarcadores : function(){
        
        var comMarcadores = parseInt( this.getOption('comMarcadores') );
        var colunaReordenada = {};
        var colunas = this.getOption('colunas');
        if ( ( !isNaN( comMarcadores ) ) && ( comMarcadores === 1 ) ){ 
            var jsClassName = this.getOption('jsClassName');            
            colunaReordenada['checkbox'] = {
                'template' : this._getTemplateCheckbox(),
                'alinhamento' : 'center',
                'tamanho' : '1%',
                'classe' : 'noprint',
                'label' : '<label class="ui-checkbox">\
                            <input type="checkbox" indice="{indice}" tipo="todos" comportamentos="'+jsClassName+'.marcarMultiplos" class="'+ this._cssGrid['marcadorPrincipal']+'" />\
                            <span>&nbsp;</span></label>'
            };
        }

        Object.each( colunas, function( item, chave ){
            if ( item.label.indexOf( '{checkbox}' ) !== -1 ){
                item.label = this._adicionarStringCheckbox( item.label ).string;
            }
            colunaReordenada[chave]= item;
        });
        this.setOption( 'colunas', colunaReordenada );
    },

    /**
     * Adiciona os botões ao Grid
     */
    _adicionarBotoesAColuna : function(){
        var colunas = this.getOption('colunas');
        if ( parseInt(this.getOption('comColunaBotoes')) !== 1 ){
            delete colunas.botoes;
            this.setOption('colunas', colunas);
            return true;
        }
        var botoes = this._getBotoes();
        if( (!colunas) || (!botoes) || (Object.getLength(botoes) <= 0) ){
            return ;
        }
        var quantidadeBotoes = 0;
        Object.each(
            botoes,
            function( botao, nomeBotao ){
                if ( botao.multiplo )
                    return true;
                quantidadeBotoes++;
        });

        colunas['botoes'].template = this._getHtmlBotoes();
        colunas['botoes'].alinhamento = 'center';
        colunas['botoes'].tamanho = Math.round( quantidadeBotoes * 2.5 )+"%";
        colunas['botoes'].alinhamentovertical = "top";
        colunas['botoes'].classe = "noprint";
        this.setOption( 'colunas', colunas );
    },
    
    _getHtmlBotoes : function( indice ){
    	var htmlBotao = '';
    	var colunas = this.getOption('colunas');
        var botoes = this._getBotoes();
        if( (!colunas) || (!botoes) || (Object.getLength(botoes) <= 0) )
            return htmlBotao;       
        Object.each(
            botoes,
            function( botao, nomeBotao ){                
                if ( botao.multiplo )
                    return true;
                htmlBotao += this._parseBotao( botao, indice );
            },
            this
        );
    	return htmlBotao;
    },
    
    /**
     * Cria o html do botão para ser adicionado na coluna
     *
     * @param string botao Nome do botão
     * @return object
     */
    _parseBotao : function( botao, indice ){
        indice = !isNaN(parseInt(indice,10)) ? indice : '{indice}';
        var titulo = botao['titulo'];
            titulo = typeof titulo == 'string' ? titulo : botao['acao'].capitalize();

        var conteudoHref= "";
        if ( botao.multiplo ){
            conteudoHref = titulo;
            return '<a href="#" indice="'+indice+'" class="btn btn-default '+this._cssGrid['botao']+'" acao="'+botao['acao']+'">' + conteudoHref + '</a>';
        }

        var botaoImg = typeof botao['img'] == 'undefined' ?  APPLICATION_CONF['APPLICATION_CLIENT_TEMA_URL']+'/img/' + botao['acao'].toLowerCase() + '.png' : APPLICATION_CONF['APPLICATION_CLIENT_TEMA_URL']+'/img/' + botao['img'];
        conteudoHref = '<img src="' + botaoImg + '" title="' + titulo + '" alt="' + titulo + '" align="absmiddle" border="0" height="16" width="16" />';

        return '<a href="#" indice="'+indice+'" class="blocoInvisivel '+this._cssGrid['botao']+'" acao="'+botao['acao']+'">' + conteudoHref + '</a>';
        
    },
    
    /**
     * Processa a visibilidade dos botões quando é desenhada a linha
     */
    _processarVisibilidadeBotoes : function(){
        
        var grid = this.getClosestInstance();
        var linksBotoes = this.encontrar('a.Superlogica_Js_Grid_Botao');
        if ( !linksBotoes ) return true;
        
        linksBotoes.emCadaElemento(function(){
            var dadosLinha = grid.getData( this.atributo('indice') );
            var elemento = new Superlogica_Js_Elemento( this );
            if ( typeof grid['_aoMostrarBotao'+ elemento.atributo('acao').capitalize()] == 'function'){
                grid['_aoMostrarBotao'+ elemento.atributo('acao').capitalize()].apply( grid, [ elemento.$_elemento, dadosLinha, parseInt( this.atributo('indice') ) ] );
            }
        });
        
    },

    /**
     * Sobrescreve a função do template para montar template personalizado e não o conteudo do elemento
     */
    setTemplate : function(){
        var jsClassName = this.getOption('jsClassName');
        var template = '<tr comportamentos="' + jsClassName + '.comportamentosLinha" indice="{indice}">';
        Object.each( this.getOption('colunas'), function( item, nomeClasse ){
            var classe = (item.classe) ? item.classe : '';
            template = template + '<td indice="{indice}" class="' + jsClassName + '_' + nomeClasse.capitalize() + ' '+classe+'  " coluna="' + nomeClasse + '"';

            if( item.alinhamento )
                template = template+" align='" + item.alinhamento + "'";
            if ( item.tamanho )
                template = template+" width='" + item.tamanho + "'";
            if ( item.alinhamentovertical )
            	template = template+" valign='" + item.alinhamentovertical + "'";

            
            template = template+'>' + item.template + '</td>';

        }, this);
        template = template + '</tr>';
        this.parent( template );
    },

     /**
      * Sobrescreve a função de desenhar as linhas do Template
      * Utilizada para desenhas as lihas somente no corpo da tabela
      */
    _HTMLDesenharLinhas : function(){
        this._HTMLDesenharCabecalho();
        var dados = this.getData();

        var totalDados = typeof dados == 'object' ? Object.getLength( dados ) : 0;
        
        /*var tbody = this.encontrar('tbody');
        if ( !tbody ){
            this.adicionarHtmlAoFinal('<tbody>');
        }*/
        
        if (  totalDados <= 0 ){
            this._inserirMsgVazio();
        }else{
            this.parent();
        }
        
        /*if ( !tbody )
            this.adicionarHtmlAoFinal("</tbody>");*/
        
        if (  totalDados > 0 ){
            this._HTMLDesenharRodape();
            this._HTMLAdicionarBotoesRodape();
        }
        
    },

    /**
     * Cria o HTML dos botões multiplos
     */
    _HTMLAdicionarBotoesRodape : function(){

        var botoes = this._getBotoes();
        var comMarcadores = parseInt( this.getOption('comMarcadores') );
        
        if ( (!botoes) || ( !isNaN(comMarcadores) && comMarcadores === 0 ) ) return true;
        
        var referencia = this.getClosestInstance();

        var trMarcadoresMultiplos = referencia.encontrar( '.' + referencia._cssGrid['marcadores'] );
        if ( trMarcadoresMultiplos )
            trMarcadoresMultiplos.remover();

        var tfoot = this.encontrar('tfoot');
        var tr = new Superlogica_Js_Elemento('<tr class="'+ referencia._cssGrid['marcadores'] + '"><td colspan="'+this._getTotalColunas()+'"></td><tr>');
        tfoot.adicionarHtmlAoFinal( tr );

        this._HTMLAdicionarMarcar();
        this._HTMLAdicionarComMarcados();
        tr.carregarComportamentos();
        
        this._corrigirPosicaoDropDown();
    },

    /**
     * Adiciona os links para marcar as linhas do Grid
     */
    _HTMLAdicionarMarcar : function(){
        var linksSelecionar = {
            'todos' : function(){
                return true;
            },
            "nenhum" : function(){
                return false;
            }
        };
        var referencia = this.getClosestInstance();
        if ( typeof referencia._selecionar == 'object' ){
            Object.append( linksSelecionar, referencia._selecionar );
        }
        referencia.setOption('selecionar', linksSelecionar );

        var totalLinksSelecionar = Object.getLength( linksSelecionar ) - 1;
        
        var td = this.getClosestInstance().encontrar( 'tr.' + referencia._cssGrid['marcadores'] ).encontrar('td');
        var btnMarcar = new Superlogica_Js_Button();
            // btnMarcar.add('Marcar:', '', '', '', '' , '','', {'disabled' : 'disabled', 'btnClass': ''});
        var btnsMais = new Superlogica_Js_Button();

        var jsClassName = this.getOption('jsClassName');
        var x = 0;
        Object.each( linksSelecionar, function(valor, chave){
            var label = typeof valor['label'] == 'string' ? valor.label : chave.capitalize();
            // text, link, destaque, imagem, comportamentos, atributos
            btnsMais.addLink( label, '','','',jsClassName + '.marcarMultiplos', { 'tipo' : chave } );
            x++;
        });
        btnMarcar.addDropDown("Marcar", btnsMais);
        td.adicionarHtmlAoFinal( btnMarcar.toString() );
    },

    /**
     * Adiciona as acções que podem ser executadas com o itens marcados
     */
    _HTMLAdicionarComMarcados : function(){
        var botoes = this._getBotoes();
        var referencia = this.getClosestInstance();

        var totalBotoesMultiplos = 0;
        Object.each( botoes, function( valor, chave){
            if ( valor.multiplo )
                totalBotoesMultiplos++;
        }, this );
        
        if (!totalBotoesMultiplos) return this;
        var td = this.getClosestInstance().encontrar( 'tr.' + referencia._cssGrid['marcadores'] ).encontrar('td');
        // td.adicionarHtmlAoFinal( document.createTextNode('; Com marcados: ') );
        
        var limiteBtnMultiplosVisiveis = 3;
        var count = 0, totalBtnMais = 0;
        var btnsMais = new Superlogica_Js_Button();
        var btnMultiplo = new Superlogica_Js_Button();
            btnMultiplo.add( "Com marcados:", '', '', '', '' , '','', {'disabled' : 'disabled', 'btnClass': ''});

        
        
        Object.each( botoes, function( valor, chave){            
            if ( !valor.multiplo ) return ;
            if ( limiteBtnMultiplosVisiveis == count ){
                btnsMais.addLink( valor.titulo, '', '', '', '' , {"acao" : valor.acao, 'classe' : 'Superlogica_Js_Grid_Botao' });
                totalBtnMais++;
                return true;
            }
            btnMultiplo.add( valor.titulo, '', '', '', '' , '','', {"acao" : valor.acao, 'classe' : 'Superlogica_Js_Grid_Botao' } );
            count++;

        });

        if ( totalBtnMais ){
            btnMultiplo.addDropDown("Mais", btnsMais, true, { "posicao" : "acima" });
        }

        td.adicionarHtmlAoFinal( btnMultiplo.toString() );

    },

    /**
     * Marca/Desmarca os checkbox de acordo com o tipo informado
     *
     * @param string tipo
     */
    marcar : function( tipo ){
        var marcadores = this._getMarcadoresLinhas();

        if ( !marcadores ) return true;

        var templateTable = this.getClosestInstance();
        var infoSelecionar = templateTable.getOption('selecionar')[ tipo ];

        marcadores.emCadaElemento(function(){
            var dados = templateTable.getData( parseInt( this.atributo('indice') ));
            var callback = typeof infoSelecionar == 'function' ? infoSelecionar : infoSelecionar['callback'];
            if ( typeof callback == 'function' ){

                if ( !callback.apply( this, [dados]) )
                    this.removerAtributo('checked');
                else
                    this.atributo('checked', 'checked');
                
                this.simularAlteracao();
            }
        });
        
    },

    /**
     * Retorna os marcadores
     *
     * @param boolean checkeds True para retornar apenas os marcados, False somente desmarcados. Não informe para retornar todos independente do estado
     * @return Superlogica_Js_Elemento
     */
    _getMarcadoresLinhas : function( checkeds ){
        var grid = this.getClosestInstance();
        var seletor = 'input.'+this._cssGrid['marcador']+":not(."+this._cssGrid['marcadorPrincipal']+")";
        if ( typeof checkeds == 'boolean'){
            if ( checkeds === true )
                seletor = seletor+":checked";
            else
                seletor = seletor+":not(:checked)";
        }
        return grid.encontrar( seletor );
    },
    
    
    /**
     * Insere msg definida para Grid vazio
     * Quando não existente
     */
    _inserirMsgVazio : function(){
        
        if ( this._getContainerMsgVazio() ) return true;
        
        var cabecalho = this._getHTMLCabecalho();
        if ( cabecalho ) cabecalho.remover();
        
         
        this.adicionarHtmlAoFinal( '<tr class="' + this._cssGrid['msgVazio'] + '"><td colspan="' + Object.getLength( this.getOption('colunas') ) + '"> <div class="callout callout-warning">'+ this.getOption('msgVazio')  +'</div></td></tr>' );
        
            

    },

    /**
     * Remove a msg vazia quando se existir
     */
    _removerMsgVazio : function(){
        var msgVazio = this._getContainerMsgVazio();
        if ( msgVazio )
            msgVazio.remover();
        this._HTMLDesenharCabecalho();
    },
    
    /**
     * Remove o rodapé caso ele exista
     */
    _removerRodape : function(){
    	var rodape = this._getHTMLRodape();
        if ( rodape )
        	rodape.remover();
    },

    /**
     * Retorna o containver com a msg vazia ou false caso não encontrada
     * 
     * @return Superlogica_Js_Elemento|boolean
     */
    _getContainerMsgVazio : function(){
        var containerMsgVazio = this.encontrar( 'tr.'+this._cssGrid['msgVazio'] );
        if ( containerMsgVazio ) return containerMsgVazio;
        return false;
    },

    /**
     * Função chamada após desenhar uma ou várias linhas
     */
    _depoisDeDesenharLinha : function(){
        
        if ( Object.getLength( this.getData() ) <= 0 ){
            this._inserirMsgVazio();
            this._removerRodape();
            
            this.setOption('fimPaginacao', true );
            this._HTMLDesenharPaginacao();
            return ;
        }else{
            this._removerMsgVazio();
            this._HTMLDesenharCabecalho();
        }

        this._HTMLDesenharRodape();
        this._HTMLAdicionarBotoesRodape();
        //this._zebrarLinhas();
        
        var gridInstance = this.getClosestInstance();
        if ( typeof gridInstance._aposDesenharLinha == 'function'){
            gridInstance._aposDesenharLinha();            
        }

    },
            
    /**
     * Função utilizada para zebrar as linhas do grid
     * Pode ser chamada de fora pra redefinir classes quando uma linha é ocultada por js
     * 
     * @return boolean
     */
    zebrarLinhas : function(){  
        var grid = this.getClosestInstance();
        var contador = 0;
        var dados = grid.getData();
        if (!dados) 
            return true;
        
        var totalLinhas = Object.getLength( dados );
        if ( totalLinhas <= 0 )
            return true;
        
        var linhasVisiveis = grid.encontrar('tr.'+grid._classRows+':not(.blocoEscondido)');
        linhasVisiveis.removerClasse( grid._cssGrid['linhaImpar'] + " " + grid._cssGrid['linhaPar'] );
        
        var linhasImpares = linhasVisiveis.filtrar(':odd');
        if ( linhasImpares )
            linhasImpares.adicionarClasse(grid._cssGrid['linhaImpar']);
        
        var linhasPares =  linhasVisiveis.filtrar(':even');
        if ( linhasPares )
            linhasPares.adicionarClasse(grid._cssGrid['linhaPar']);
        
    },
        
    /**
     * Renderiza o Cabecalho do Grid
     */
    _HTMLDesenharCabecalho : function(){
 
        var trCabecalho = this.encontrar('.'+this._cssGrid['cabecalho']);
        if ( trCabecalho )
            trCabecalho.remover();
                
        var dadosLinha = this.getData();
        dadosLinha = typeof dadosLinha == 'object' ? dadosLinha : {};
                
        if ( (this.getOption('comCabecalho')==0) || (Object.getLength(dadosLinha) <= 0) ) return true;
        
        trCabecalho = new Superlogica_Js_Elemento('<tr class="' + this._cssGrid['cabecalho'] + '"></tr>');
        Object.each(
            this.getOption('colunas'),
            function( item, nomeColuna ){
                var label = this._parserLabelCabecalho( item.label, item.ordenacao );
                var classe = (item.classe) ? item.classe : '';
                var th = new Superlogica_Js_Elemento('<th coluna="' + nomeColuna + '">' + label + '</th>');
                if( item.alinhamento ){
                    th.atributo('align', item.alinhamento);
                    th.atributo('class','text-'+item.alinhamento+' '+classe );
                }
                if ( item.tamanho && item.tamanho != '0%' && item.tamanho != '0') // IE não aceita 0% e ocorre erro no js                    th.atributo('width', item.tamanho);
                    th.atributo('width', item.tamanho);
                
                trCabecalho.adicionarHtmlAoFinal( th );
            },
            this
        );
        var thead = this.encontrar('thead');
        if ( !thead ){
            thead = new Superlogica_Js_Elemento('<thead></thead>');
            this.adicionarHtmlAoInicio( thead.adicionarHtmlAoFinal(trCabecalho) );
        }else{
            thead.adicionarHtmlAoFinal(trCabecalho);
            trCabecalho.carregarComportamentos();
        }
        
    },

    /**
     * Renderiza o Rodapé do Grid
     */
    _HTMLDesenharRodape : function(){
        if ( !this._getHTMLPaginacao() )
            this._HTMLDesenharPaginacao();
        
        this._HTMLDesenharRodapePersonalizado();
        
    },

    /**
     * Retorna a referencia do rodapé e cria se não existir
     *
     * @return Superlogica_Js_Elemento
     */
    _getHTMLRodape : function(){
        var tfoot = this.encontrar('tfoot');
        if ( !tfoot ){
            tfoot = new Superlogica_Js_Elemento('<tfoot class="'+this._cssGrid['rodape']+'"></tfoot>');
            this.adicionarHtmlAoFinal( tfoot );
        }
        return tfoot;
    },

    /**
     * Retorna a referencia da paginação ou null se não existir
     *
     * @return Superlogica_Js_Elemento|null
     */
    _getHTMLPaginacao : function(){
        return this._getHTMLRodape().encontrar('tr.'+this._cssGrid['paginacao']);
    },
    
    /**
     * Retorno a linha do elemento do cabecalho
     * ou null se o cabecalho não for encontrado
     * 
     * @return Superlogica_Js_Elemento|null
     */
    _getHTMLCabecalho : function(){
        return this.encontrar( 'thead' );
    },

    /**
     * Desenha a paginação dentro do rodapé
     */
    _HTMLDesenharPaginacao : function(){
        if( this.getOption('fimPaginacao') ){

            var paginacao = this._getHTMLPaginacao();
            if ( paginacao )
                paginacao.remover();

        }else if( parseInt( this.getOption('comPaginacao') ) === 1 || this.getOption('comPaginacao') == 'auto' || this.getOption('comPaginacao') == 'todos' ){

            var jsClassName = this.getOption('jsClassName');
            var linkMaisItens = new Superlogica_Js_Elemento('<a href="javascript:void(0);" comportamentos="'+jsClassName+'.proximaPagina" class="paginacaoMaisItens">Mais Itens</a>');
            var linkAuto = new Superlogica_Js_Elemento('<a href="javascript:void(0);" comportamentos="'+jsClassName+'.autoPaginacao" class="Superlogica_Js_Grid_BtnAuto">Auto</a>');
            var linkTodosItens = new Superlogica_Js_Elemento('<a href="javascript:void(0);" comportamentos="'+jsClassName+'.todosItens">Todos Itens</a>');
            var divPaginacao = new Superlogica_Js_Elemento('<div class="paginacao"></div>');
                divPaginacao.adicionarHtmlAoFinal( linkMaisItens );
                divPaginacao.adicionarHtmlAoFinal( '<span> - </span>' );
                divPaginacao.adicionarHtmlAoFinal( linkAuto );
                divPaginacao.adicionarHtmlAoFinal( '<span> - </span>' );
                divPaginacao.adicionarHtmlAoFinal( linkTodosItens );

            var colunaPaginacao = new Superlogica_Js_Elemento( '<td></td>' );
                colunaPaginacao.adicionarHtmlAoFinal( divPaginacao );
                colunaPaginacao.atributo( 'colspan', this._getTotalColunas() );
            var linhaPaginacao = new Superlogica_Js_Elemento( '<tr class="'+this._cssGrid['paginacao']+'"></tr>' );
                linhaPaginacao.adicionarHtmlAoFinal( colunaPaginacao );

            this._getHTMLRodape().adicionarHtmlAoFinal( linhaPaginacao );

        }
    },
    
    /**
     * Desenha a linha personalizada do rodapé
     */
    _HTMLDesenharRodapePersonalizado : function(){
        var instanciaGrid = this.getClosestInstance();
        if ( typeof instanciaGrid['_formatarRodape'] == 'undefined' ){return;}
        
        var rodape = instanciaGrid['_formatarRodape']();
        var rodapeTr = this.encontrar('tfoot tr.rodapePersonalizado');
        
        if ( !rodapeTr ){
            rodapeTr = new Superlogica_Js_Elemento('<tr class="rodapePersonalizado"></tr>').adicionarClasse( this._cssGrid['rodape'] );
        }else{
            if ( Object.getLength( this.getData() ) <= 0 ){
                rodapeTr.remover();
                return ;
            }else{
                rodapeTr.conteudo('');
            }
        }

        for ( var x=0; rodape.length > x; x++) {

            var innerTd = rodape[x];
            var colspan = 1;
            while( ( typeof rodape[( x + colspan )] != 'undefined') && (rodape[( x + colspan )] == null ) ){
                colspan++;
            }
            
            if( colspan>1 ){
                x += (colspan-1);
            }
            
            rodapeTr.adicionarHtmlAoFinal(
                new Superlogica_Js_Elemento('<td></td>')
                    .atributo( 'colspan', colspan )
                    .adicionarHtmlAoFinal( innerTd )
            );
        }
        var rodapeExistente = this.encontrar('tfoot .'+this._cssGrid['rodape'] );
        if ( rodapeExistente )
            rodapeExistente.conteudo( rodapeTr.conteudo() );
        else
            this.encontrar('tfoot').adicionarHtmlAoFinal(rodapeTr);
    },
    
    /**
     * Retorna o total de colunas inseridas
     */
    _getTotalColunas : function(){
        return Object.getLength( this.getOption('colunas') );
    },

   /**
     * Carrega os comportamentos do cabecalho
     */
    _parserLabelCabecalho : function(labelAtual, ordenacao){
        var dadosOrdenacao = this._parseDadosOrdenacao(labelAtual, ordenacao);
        if ( dadosOrdenacao['url'] )
            return '<a href="' + dadosOrdenacao['url'] + '">' + dadosOrdenacao['label'] + '</a>';
        else
            return dadosOrdenacao['label'];
    },

    _parseDadosOrdenacao : function(labelAtual, ordenacao){

        if ( parseInt( this.getOption('comOrdenacao') ) === 0 || typeof labelAtual == 'undefined' || typeof ordenacao == 'undefined' ) return { 'label' : labelAtual };

        var ordenadoAsc = /( |%20|\+)asc/i.test( ordenacao );
        var ordenadoDesc = /( |%20|\+)desc/i.test( ordenacao );
        ordenacao = typeof ordenacao == 'object' ? ordenacao : [ordenacao];
        var locationAtual = new Superlogica_Js_Location();
        var tipoOrdenacaoAtual = 0;
        var ordenacaoEAAtual = false;
        var ordenacaoAtual = locationAtual.getParam( 'ordenacao' );

        if( ordenacaoAtual ){
            ordenacaoAtual = typeof ordenacaoAtual == 'object' ? ordenacaoAtual : [ordenacaoAtual];
            var ordenacaoAtualString = "";
            var ordenacaoString = "";
            Object.each ( ordenacao, function( item ){
                ordenacaoString = ordenacaoString + item.replace(/( |%20|\+)asc|( |%20|\+)desc/img, '').toLowerCase();
            });
            Object.each ( ordenacaoAtual, function( item ){
                tipoOrdenacaoAtual = /( |%20|\+)asc$/i.test( item ) ? 1 : /( |%20|\+)desc$/i.test( item ) ? 2 : 0;
                ordenacaoAtualString = ordenacaoAtualString + item.replace(/( |%20|\+)asc|( |%20|\+)desc/img,'').toLowerCase();
            });
            ordenacaoEAAtual = ordenacaoAtualString == ordenacaoString;
        }

            var atualizarOrdenacao = ordenadoDesc ? "%20ASC" : "%20DESC";
            var naoReplace = false;
            if ( ( ordenadoDesc || ordenadoAsc ) && !ordenacaoEAAtual ){
                atualizarOrdenacao = '';
                naoReplace = true;
            }

            if ( ordenacaoEAAtual ){
                atualizarOrdenacao = ( tipoOrdenacaoAtual === 2 ? "%20ASC" : "%20DESC" );
            }
            if( typeof ordenacao == 'object'){
                Object.each( ordenacao, function( item, chave ){
                    ordenacao[chave] = ( naoReplace ? item : item.replace(/( |%20|\+)asc|( |%20|\+)desc/img, '') ) + atualizarOrdenacao ;
                });
            }else{
                ordenacao = ( naoReplace ? ordenacao : ordenacao.replace(/( |%20|\+)asc|( |%20|\+)desc/img, '') ) + atualizarOrdenacao;
            }

        var imgOrdenacao = "";
        if ( ordenacaoEAAtual )
            imgOrdenacao = this._getImagemOrdenacao( ordenacao[0] );
        locationAtual.setParam('ordenacao', ordenacao );
        //return '<a href="'++'">' + imgOrdenacao + labelAtual + '</a>';
        return {  'url' : locationAtual.toString(), 'label' : imgOrdenacao + labelAtual };
    },

    /**
     * Retorna qual imagem utilizar de acordo com a ordenacao passada
     */
    _getImagemOrdenacao : function( ordenacaoAtual ){
        var img = "";
        var orderImg = '';
        var asc = /( |%20|\+)asc/i.test( ordenacaoAtual );
        var desc = /( |%20|\+)desc/i.test( ordenacaoAtual );

        if ( asc ){
            orderImg = 'down';
        }else if ( desc ){
            orderImg = "up";
        }

        if ( asc || desc ){
            img = '<img src="'+APPLICATION_CONF["APPLICATION_CLIENT_TEMA_URL"] + "/img/arrow_" + orderImg + '.png" border="0" align="absmiddle" />'
        }
        return img;
    },
    
    /**
     * Utilizado para setar a página atual caso ela não exista
     */
    _identificarPaginaAtual : function(){
        
        if ( typeof this._getPaginaAtual() == 'number' ) return ;

        var location = new Superlogica_Js_Location();
        var paginaAtual = location.getParam('pagina');
        if ( isNaN( parseInt( paginaAtual ) ) ) {
            paginaAtual = 1;
        }
        this._setPaginaAtual( parseInt( paginaAtual ) );
    },

    /**
     * Seta a pagina atual do Grid
     * @param integer pagina
     */
    _setPaginaAtual : function( pagina ){
        this.setDados('pagina', pagina);
    },

    /**
     * Retorna a pagina atual
     * @return integer
     */
    _getPaginaAtual : function(){
        return this.getDados('pagina');
    },

    /**
     * Seta a quantidade por página
     */
    setItensPorPagina : function( total ){
        if ( isNaN(parseInt(total)) ) return ;
        this.setOption('itensPorPagina', parseInt( total ) );
    },

    /**
     *
     */
    getItensPorPagina : function(){
        return parseInt( this.getOption('itensPorPagina') );
    },

    /**
     * Seleciona a linha informada
     * @param integer indice
     */
    selecionarLinha : function( indice ){
        if ( parseInt( this.getOption('comSelecao') ) !== 1 ) return ;
        this.encontrar('tr').removerClasse( this._cssGrid['linhaSelecionada'] );
        
        if( this._HTMLGetLinhaDesenhada( indice ) )
            this._HTMLGetLinhaDesenhada( indice ).adicionarClasse( this._cssGrid['linhaSelecionada'] );
    },


    /**
     * Retorna a instancia do Grid pai do elemento atual
     * @return Superligoca_Js_Grid
     */
    getClosestInstance : function(){
        var grid = new Superlogica_Js_Grid( this.parent() );
        return new window[ grid.getOption('jsClassName') ]( grid );
    },

    /**
     * Funções dos botões
     * 
     */
    
    /**
     * Executa o botão informado
     *
     * @param string action
     * @param integer indiceLinha
     * @param object $botao
     * @return boolean
     */
    executarBotao : function( acao, indiceLinha, $botao ){
    	
        var infoBotao = this._getInfoBotao(acao);
            indiceLinha = infoBotao.multiplo ? -1 : indiceLinha;
        var formulario = this._getFormBotao( acao, indiceLinha );
        
        var divClonado = formulario;
            formulario = formulario.encontrar('form');
        if ( formulario )
            formulario.setDados('tipo_botao', infoBotao.tipo );
        var naoPopular = false;
        var paramsEventos = {};
        
        var dadosLinha = this.getData( indiceLinha );
        if ( infoBotao.multiplo )
            dadosLinha = {};
        
        var form = formulario;
        
        if ( typeof this['_antes' + acao.capitalize() ] == 'function' ){

            if ( infoBotao.multiplo )
                paramsEventos = [ formulario ];
            else
                paramsEventos = [ dadosLinha, formulario, indiceLinha ];

            var antesDadosLinha = this['_antes' + acao.capitalize() ].apply( this, paramsEventos );
            if ( !antesDadosLinha ){
                return true;
            }else if ( typeof antesDadosLinha == 'object' || typeof antesDadosLinha == 'string'){
                dadosLinha = antesDadosLinha;
            }
        }


        if ( !infoBotao.multiplo )            
            dadosLinha = new Superlogica_Js_Json( dadosLinha ).setHandler( $botao ).extrair();                                
        
        var autoSubmit = false;
        
        if ( ( typeof infoBotao.tipo != 'undefined' ) && ( typeof this[ '_abrirForm'+infoBotao['tipo'].capitalize() ] == 'function') ){
            this[ '_abrirForm'+infoBotao['tipo'].capitalize() ]( divClonado, indiceLinha, acao );
        }else{
            autoSubmit = true;
        }


        if ( typeof this[ '_aposAbrirForm'+acao.capitalize() ] == 'function'){
            /*if ( infoBotao.multiplo )
                paramsEventos = [ formulario, divClonado ];
            else*/
                paramsEventos = [ dadosLinha, formulario, divClonado, indiceLinha ];
            if ( !this[ '_aposAbrirForm'+acao.capitalize() ].apply( this, paramsEventos ) ){
                naoPopular = true;
            }
        }
        
        if ( !formulario ) return true;

        if ( !naoPopular ){
            formulario.popular( dadosLinha );
        }
        if ( acao != 'delete')
            formulario.focar();
        if ( typeof this[ '_aposPopularForm'+acao.capitalize() ] == 'function'){
            this[ '_aposPopularForm'+acao.capitalize() ]( formulario );
        }

        var referencia = this;

        formulario
            .unbind( 'submit' )
            .bind(
                'submit',
                function( evento ){
                    evento.preventDefault();
                    referencia._salvarForm.apply( referencia, [ acao, formulario, indiceLinha ]);
                    return false;
                }
            );

        if ( autoSubmit ){
            form.simularEvento('submit');
        }

        return true;

    },
    
    /**
     * Função chamada após formulário ser submetido
     *
     * @param object event
     */
    _salvarForm : function( botao, formulario, indiceLinha ){

        var response = null;

        if ( typeof this['_aoSalvarForm'+botao.capitalize() ] == 'function' ){
            response = this['_aoSalvarForm'+botao.capitalize()]( botao, formulario, indiceLinha );
            
            if (response===false)
                return true;            
        }else if ( indiceLinha === -1 ){
            response = this._submeterFormEmLote( botao, formulario );
            if( response === null){
                alert( this._msgNenhumItemMarcado );
                return true;
            }
            /*var _response = new Superlogica_Js_Request( new Superlogica_Js_Location().setApi(true) ).getResponse();
            this._setData( _response.getDados(-1).data );
            this.redesenhar();*/
        }else{
            //var dados = formulario.toJson();
            response = formulario.submeter();
        }
        
        var retornar = false;
        var fecharLinha = true;
        if ( typeof this['_apos'+botao.capitalize() ] == 'function' ){
        	fecharLinha = this['_apos'+botao.capitalize()]( formulario, response, indiceLinha ); 
            if ( fecharLinha === -1 || !fecharLinha ){
                retornar = true;
            }
        }
        
        if ( response.isValid() ){

            if ( (fecharLinha !== -1 ) && ( typeof this._getInfoBotao(botao).tipo != 'undefined' ) && ( typeof this['_fecharForm'+this._getInfoBotao(botao).tipo.capitalize() ] == 'function') ){
                this['_fecharForm'+this._getInfoBotao(botao).tipo.capitalize() ]( formulario, response, indiceLinha );
            }else{
                if ( response.isValid() && botao.toLowerCase() == 'delete' ){
                    var formLinhaDeletada = this.encontrar('[formLine='+this.getClosestInstance().getOption('jsClassName') + '-'+ indiceLinha+']');
                    if ( formLinhaDeletada )
                        formLinhaDeletada.remover();
                    this.removerLinha.apply(this, [indiceLinha] );
                    retornar = true;
                }

            }

            if ( this.getDados().length <= 0)
                this._inserirMsgVazio();
        }
        
        
        if ( retornar )
            return true;

        if ( response.isValid() ){
            this.adicionarLinha( response.getData() , indiceLinha );
        }
    },

    /**
     * Submete o formulário com todas linhas marcadas no Grid
     * 
     * @param string botao
     * @param Superlogica_Js_Form formulario
     */
    _submeterFormEmLote : function( botao, formulario ){
        var dadosLinhas = this.getDadosLinhasMarcadas();
      
        if ( Object.getLength( dadosLinhas) <= 0 ) return null;

        var dadosForm = formulario.toJson();
        var infoBotao = this._getInfoBotao(botao);

        var dadosRequisicao = [];
        var dadosConcat = dadosForm;
        var x = 0;
        var request = new Superlogica_Js_Request();
            request.setHandler( formulario.encontrar('input[type=submit]:first') );
        request.setLimiteParamsPorRequisicao( infoBotao.itensPorPagina );
            
        Object.each( dadosLinhas, function( valor, chave ){
            
            dadosRequisicao[x] = {};

            Object.each( infoBotao.params, function( valor2, chave2 ){
                dadosConcat[chave2] = valor[valor2];
            });
            
            Object.each (dadosConcat, function( valor, chave ){
                dadosRequisicao[x][chave] = valor;
            });
            request.enviar( formulario.atributo('action'), dadosRequisicao[x] );
            
            x = x+1;
            
        });
        
        request.setResponseOptions( {'esconderDetalhes' : false} );

        var response = request.getResponse();

        // Exibe mensagem de sucesso do form
        var msgOff =  parseInt(formulario.atributo('msgsucessoff'));              
        if (isNaN(msgOff) || msgOff != 1) {                             
            if ( response.isValid() ){
                var msgSucesso = formulario.atributo('msgsucesso');
                if ( msgSucesso )
                    new Superlogica_Js_Notificacao( msgSucesso ).show();
            }
        }

        return response;
        
        
    },

    /**
     * Retorna dados das linhas marcadas
     * 
     * @return object
     */
    getDadosLinhasMarcadas : function(){
        var marcados = this._getMarcadoresLinhas(true);
        var result = {};
        var indice = 0;
        var referencia = this;
        
        if ( !marcados ) return result;

        marcados.emCadaElemento(function(){
            indice = parseInt( this.atributo('indice') );
            result[ indice ] = referencia.getData( indice );
        });
        return result;
    },

    /**
     * Função sobrescrita para remover a msg vazia quando 
     * chamada a função para adicionar linhas ao grid
     */
    adicionarLinhas : function(){
        this._removerMsgVazio();
        this.parent.apply( this, arguments );
    },
            
    /**
     * Retorna um objeto contendo informações sobre o formulário do botão informado
     *
     * Objeto retornado:
     *  form : Referencia ao formulário ( Superlogica_Js_Form )
     *  dados : Array com os campos do formulário ( chave => valor )
     *
     * @param string botao Nome do botão para pegar o formulário
     * @return object
     */
    _getFormBotao : function( botao, indiceLinha ){
        var form = null;
        
        if ( typeof this._getInfoBotao(botao)['tipo'] != 'undefined' && typeof this['_getForm' + this._getInfoBotao(botao)['tipo'].capitalize()] == 'function' ){
            form = this['_getForm' + this._getInfoBotao(botao)['tipo'].capitalize() ]( botao, indiceLinha);
            if ( form && form.contar() )
                return form;
                                    
        }
        
        form = new Superlogica_Js_Elemento( this._getInfoBotao(botao)['form'] );

        if ( form ){
        	return new Superlogica_Js_Form( form )
                        .clonar( this.getClosestInstance().atributo('id')+'-'+indiceLinha+'-'+botao )
                        .mostrar();
        }
        return false;
    },

    /**
     * Retorna o array com as informações sobre o botão passado como parametro.
     * 
     * @param string botao
     * @return object
     */
    _getInfoBotao : function( botao ){
        return this._getBotoes()[botao];
    },

    /**
     * Retorna o array com as configurações dos botões
     * 
     * @return object
     */
    _getBotoes : function(){
        return this.getOption('botoes');
    },
    
    /**
     * Retorna o array com as configurações dos botões
     * 
     * @return object
     */
    _getBotoesMultiplos : function(){
        var botoes = this._getBotoes();
        if ( botoes ){
            var botoesMultiplos = [];
            Object.each(botoes, function( valor ){
                if ( valor.multiplo )
                    botoesMultiplos.push( valor );
            });
            return botoesMultiplos;
        }
    },

    /**
     * Retorna a linha do formulário já existente o null se não existenet
     * 
     * @param string botao
     * @param integer indice
     * @return Superlogica_Js_Form|null
     */
    _getFormAbaixo : function( botao, indiceLinha ) {
        var grid = this.getClosestInstance();
        return new Superlogica_Js_Form( grid.encontrar('td[formLine^="' + grid.atributo('id') + '_Form-' + indiceLinha+ ( botao ? '-'+botao : '' ) + '"]') );
    },

    /**
     * Abre o formulário embaixo da linha
     */
    _abrirFormAbaixo : function( form, indiceLinha, acao ){

        var idForm = form.atributo('id');
        var grid = this.getClosestInstance();
        var formLine = grid.atributo('id') + '_Form-'+ indiceLinha + ( acao ? '-'+acao : '' );
        
        if ( indiceLinha === -1 ){
            var rodapeFormsMarcadores = grid.encontrar( '.' + grid._cssGrid['marcadores'] );
            if ( rodapeFormsMarcadores )
                rodapeFormsMarcadores.esconder();
        }
                
        form.removerAtributo('id');
        var tr = grid.encontrar( 'tr td[formLine^="' + grid.atributo('id') + '_Form-'+ indiceLinha +'"]');
        if ( tr ){
            tr.trocarVisibilidade();
            tr.maisProximo('tr').trocarVisibilidade();
        }

        var formRemovido = false;
        if ( tr && tr.contar() ){
            var formExistente = this._getFormAbaixo(null, indiceLinha);
            var formularioPassado = tr.encontrar('form');
            if ( formExistente.contar() && formExistente.getDados('btnAcao') != acao ){
                tr.remover();
                formRemovido = true;
            }else if ( formularioPassado && formularioPassado.atributo('action') != form.encontrar('form').atributo('action') ){
                tr.remover();
                formRemovido = true;
            }
        }

        if ( !tr || !tr.contar() || formRemovido ){
            tr = new Superlogica_Js_Elemento( '<tr></tr>' )
                    .atributo('id', idForm )
                    .setDados('btnAcao', acao )        
                    .adicionarHtmlAoFinal(
                        new Superlogica_Js_Elemento('<td></td>')
                            .setDados('btnAcao', acao )
                            .atributo( 'formLine', formLine )
                            .atributo( 'colspan', this._getTotalColunas() )
                            .adicionarHtmlAoFinal( form )
                    );
            tr.atributo('indice', indiceLinha );
            if( indiceLinha === -1 ){
                
                grid._getHTMLRodape().adicionarHtmlAoFinal( tr );
                
            } else{
                tr.inserirDepoisDe( this._HTMLGetLinhaDesenhada(indiceLinha)  );
            }
        }else{
            // Caso já tenha um formulário e não tenha sido removido então não precisa fazer nada novamente
            // Retornando false ele para a execução do executarBotao
            return false;

        }

    },

    _abrirFormDefault : function( divClonado ){  
        divClonado.adicionarClasse('form_grid').openDialogo();
    },

    _fecharFormDefault : function( formulario, response, indiceLinha ){
        formulario.maisProximo('.modal').$_elemento.modal('hide');
    },

    /**
     * Fecha o formulário embaixo da linhas
     */
    _fecharFormAbaixo : function( formulario, response, indiceLinha ){
        
       
        //var form = formulario.getForm();

        formulario.maisProximo('tr').remover();

        if ( indiceLinha === -1 ){
            var grid = this.getClosestInstance();
                grid._getHTMLRodape().encontrar( '.' + grid._cssGrid['marcadores'] ).mostrar();
            return true;
        }
        
        var elementoAtualizado = this._HTMLGetLinhaDesenhada( indiceLinha );
        if (elementoAtualizado == null) return true;
        var corAnterior = elementoAtualizado.css("background-color");
        elementoAtualizado.css( "background-color", corAnterior );
        return true;

    },
    
    /**
     *
     * COMPORTAMENTOS
     *
     */

    /**
     * Comportamento para zebrar as linhas do Grid
     */
    _zebrar : function( indice ){
        var referencia = this.getClosestInstance();
        indice = !isNaN(parseInt(indice)) ? indice : parseInt( this.atributo('indice') );
        this.adicionarClasse( indice%2 == 0 ?  referencia._cssGrid['linhaPar'] : referencia._cssGrid['linhaImpar'] );
    },

    /**
     * Carrega os comportamentos das linhas
     */
    __comportamentosLinha : function(){
        this._zebrar();
        this._formatarColunas();
        
        var grid = this.getClosestInstance();
        var botoes = grid._getBotoes();
        if ( botoes && Object.getLength(botoes) != Object.getLength(grid._getBotoesMultiplos() )  )
            this._processarVisibilidadeBotoes(); // Processa apenas botões não multiplos
        
    },

    /**
     * Comportamento para carregar a próxima página
     */
    __proximaPagina : function(){
        var templateTable = this.getClosestInstance();
        this.bind('click', function(evento){
            evento.preventDefault();
            templateTable._paginar();
        });
    },
    
    /**
     * Função que executa a paginaçao do Grid
     * 
     * @param function callback Chamado após a requisição acontecer. Superlogca_Js_Response é passado como parametro do callback
     */
    _paginar : function(callback){
        var templateTable = this.getClosestInstance();
        
        if ( templateTable.getDados('carregando') ) return true;
        
        templateTable.setDados('carregando', true );
        var pagina = templateTable._getPaginaAtual();
        var response = null;
        var divPaginacao = templateTable.encontrar( '.paginacao:not(.blocoEscondido)' );
        var request = null;
        
        this._desenharLinhasPaginadas = function( response ){
            var templateTable = this.getClosestInstance();
            var pagina = templateTable._getPaginaAtual();
            if ( response.isValid() ){

                if ( response.getData() && isNaN(parseInt( templateTable.getItensPorPagina() )) ){
                    templateTable.setItensPorPagina( response.getTotalData() );
                }
                if ( ( (!response.getData() || response.getTotalData()<=0) ) || ( response.getTotalData() < templateTable.getItensPorPagina()) ){
                    templateTable.setDados('carregandoTodosItens', false);
                    templateTable.setOption('fimPaginacao', true );
                    templateTable._HTMLDesenharPaginacao();
                    if ( (!response.getData() || response.getTotalData()<=0) ){
                        return ;
                    }
                }

                templateTable.adicionarLinhas(response.getData(-1));
                templateTable._setPaginaAtual( pagina+1 );
            }
            templateTable.setDados('carregando', false );
            if ( typeof callback == 'function'){
                callback(response);
            }
            
        }
        
        if ( typeof  templateTable['_aoPaginar'] == 'function'){

            response = templateTable['_aoPaginar'] ( pagina, divPaginacao );

            if ( typeof response == 'string'){
                request = new Superlogica_Js_Request( response );
                request.setHandler( divPaginacao );
                var grid = this;
                request.enviarAssincrono(function(response){
                    grid._desenharLinhasPaginadas(response);
                });
                return true;
            }

        }else{

            var location = new Superlogica_Js_Location();
                location.setApi(true).setParam("pagina", pagina+1 );
                location.setParam('format', null );             
            request = new Superlogica_Js_Request( location.toString() );
            request.setHandler( divPaginacao );
            var referencia = this;
            request.enviarAssincrono( function( response ){
                referencia._desenharLinhasPaginadas(response);
            });
        }
        

                
    },

    /**
     * Adicionar evento para carregar todos os itens
     */
    __todosItens : function(){
        var templateTable = this.getClosestInstance();
        this.bind('click', function(){
            templateTable.setDados('carregandoTodosItens', true);
            var intervalTodosItens = setInterval( function(){
                
                if ( !templateTable.getDados('carregando') ){
                    var paginacaoMaisItens = templateTable.encontrar("a.paginacaoMaisItens:not(.blocoEscondido)");
                    if ( paginacaoMaisItens && !templateTable.getDados('adicionandoLinhas') ){
                        setTimeout(function(){
                            paginacaoMaisItens.simularClique();
                        },200);                        
                    }else if ( !templateTable.getDados('adicionandoLinhas') )
                        templateTable.setDados('carregandoTodosItens', false );
                }
                
                if ( !templateTable.getDados('carregandoTodosItens') ){    
                    clearInterval( intervalTodosItens );
                    return ;
                }

            }, 100);
        });
        if ( this.getClosestInstance().getOption('comPaginacao') == 'todos' ){            
            this.simularClique();
        }
    },
    
    /**
     * Comportamento para auto paginação
     */
    __autoPaginacao : function(){
                
        var linkAuto = this.bind('click', function(){
            var grid = this.getClosestInstance();
                grid._getHTMLPaginacao().encontrar('.paginacao *').esconder();

            var html = new Superlogica_Js_Elemento(document);
            var elementoWindow = new Superlogica_Js_Elemento(window);
            
            if ( this.eh(':visible') )
                grid._paginar();
            
            elementoWindow.bind('scroll.autopaginacao', function(){
                var elemento = this;
                var timeoutId = this.getDados('timeoutId');
                if ( timeoutId ){
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(function(){
                    elemento.setDados('timeoutId', null);
                    if ( grid.getDados('autopaginacao') || grid.getDados('carregando') )
                    return true;
                                
                    if ( grid.getOption('fimPaginacao') ){
                        elemento.unbind('scroll.autopaginacao');
                        return true;
                    }

                    var posicaoScrollAtual = html.scrollTopo() + elementoWindow.altura();
                    var posicaoFimGrid = Math.round(grid._getHTMLRodape().posicao().topo) - 300;
                    if ( posicaoScrollAtual > posicaoFimGrid ){
                        grid.setDados('autopaginacao', true );
                        grid._paginar(function(){ grid.setDados('autopaginacao', false ); });
                        grid._timeInterval = 1000;
                        grid._linhasPorVez = 10;
                    }

                }, 100 );
                this.setDados('timeoutId', timeoutId);

            });
            
        });
        
        if ( this.getClosestInstance().getOption('comPaginacao') == 'auto' ){            
            linkAuto.simularClique();
        }

    },
    
    recarregar : function(){
        
        var urlRecarregar = '';
        var location = new Superlogica_Js_Location();
            location.setApi(true).setParam('format', null );
            
        if ( typeof  this._aoRecarregar == 'function'){
            urlRecarregar = this._aoRecarregar();
            if ( instanceOf( urlRecarregar, Superlogica_Js_Location ))
                location = urlRecarregar;
            else if ( typeof urlRecarregar == 'string' )
                location = new Superlogica_Js_Location(urlRecarregar);
            else
                return this;            
        }        
        
        if (!location.getParam('pagina'))
            location.setParam('pagina',1);
        
        var request = new Superlogica_Js_Request( location.toString() );
        var grid = this;
        request.enviarAssincrono(function( response ){
            if ( response.isValid() )
                grid.removerLinhas().adicionarLinhas( response.getData(-1) );
        });
        
        return this;
                
    },
            
    /**
     * Responsavel por formatar as colunas
     */
    _formatarColunas : function(){
        var instancia = this.getClosestInstance();
        var totalChecks = 0;
        this.encontrar( 'td' ).emCadaElemento(function(){
            var coluna = this.atributo('coluna');
            if (!coluna) return true;
            if( typeof instancia['_formatarColuna'+coluna.capitalize()] == 'function' ){
                var indice = parseInt( this.atributo('indice') );
                var data = instancia.getData( indice );
                var conteudoColuna = instancia['_formatarColuna'+coluna.capitalize()].apply( instancia, [ data, indice ] );
                if ( typeof conteudoColuna == 'string' ){
                    var dadosCheckboxes = instancia._adicionarStringCheckbox( conteudoColuna, indice );
                    var htmlBotoes = '<span class="'+instancia._cssGrid['botaoPersonalizado']+'">'+instancia._getHtmlBotoes(indice)+'</span>';
                    conteudoColuna = dadosCheckboxes.string;
                    conteudoColuna = conteudoColuna.replace(/{botoes}/g, htmlBotoes );
                    totalChecks += dadosCheckboxes.total;
                } else if ( instanceOf( conteudoColuna, Superlogica_Js_Elemento)) {
                    var htmlBotoes = '<span class="'+instancia._cssGrid['botaoPersonalizado']+'">'+instancia._getHtmlBotoes(indice)+'</span>';
                    totalChecks += conteudoColuna._replaceHtmlVar( '{checkbox}', instancia._getTemplateCheckbox( indice ) );
                    conteudoColuna._replaceHtmlVar( '{botoes}', htmlBotoes );
                }
                this.conteudo( conteudoColuna );
            }
        });

        if ( totalChecks > 0 ){
            instancia.setOption('comMarcadores', 1);
        }
        
    },

    /**
     * Comportamento quando clicar em um link dos marcadores do rodapé
     */
    __marcarMultiplos : function(){
        var referencia = this;
        this.bind('click', function(evento){
            var tipo = this.atributo('tipo');
            referencia.marcar( tipo );
        });

    },

    __aoFecharFormMultiplo : function(){
        var referencia = this;
        var fechar = this.encontrar('.fechar');
        if ( fechar )
            fechar.bind('click', function(){
                if ( referencia.getDados('tipo_botao') != 'abaixo' ) // caso o form não tenha sido aberto abaixo então não foi escondido os marcadores
                    return true;
                var grid = referencia.getClosestInstance();
                grid._getHTMLRodape().encontrar( '.' + grid._cssGrid['marcadores'] ).mostrar();
            });
    },

    __ordenar : function(){
        
        var ordenacao = new Superlogica_Js_Json( this.atributo('ordenacao') ).extrair();
        if ( typeof ordenacao != 'object' ) ordenacao = [ this.atributo('ordenacao') ];               
        this.conteudo( this._parserLabelCabecalho( this.conteudo(), ordenacao ) );
    },

    getRealInstance : function(){
        return new window[ this.getOption('jsClassName') ]( this );
    },
            
    _corrigirPosicaoDropDown : function(){
        var janela = new Superlogica_Js_Elemento( window );
        var processarClassesBotoesRodape = false;
        var larguraJanela = janela.largura();

        if ( larguraJanela <= 767 && !this.getDados('botoes_mobile') ){
            this.setDados('botoes_mobile', true );
            processarClassesBotoesRodape = 1;
        }else if ( larguraJanela > 767 && this.getDados('botoes_mobile') ){
            this.setDados('botoes_mobile', false );
            processarClassesBotoesRodape = 2;
        }
        var btnsGroup = this._getHTMLRodape().encontrar('.btn-group');
         if (btnsGroup){
            if(btnsGroup.posicao().topo >= 700){
                processarClassesBotoesRodape = 1;
                this.setDados('botoes_acima', false );
            }
        }
        if ( processarClassesBotoesRodape !== false){
            var btnsGroup = this._getHTMLRodape().encontrar('.btn-group');
            if ( btnsGroup ){
                btnsGroup.emCadaElemento(function(){
                    this[ processarClassesBotoesRodape ===1 ? 'adicionarClasse' : 'removerClasse' ]('dropup');
                });
            }
        }
        return true;
    }

});