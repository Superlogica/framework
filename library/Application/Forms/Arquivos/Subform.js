Superlogica_Js_Form.implement({
    
    __verificarTotalArquivosAdicionados : function(dadosTemplate, formulario){
                
        var dadosArquivos = dadosTemplate.getData();
        if (!dadosArquivos){
            dadosTemplate.removerLinhas();
        }
        
        var primeiroValor = null;
        var indicePrimeiroValor = null;
        Object.each(dadosArquivos, function(dado, indice){
            if ( primeiroValor ) return true;
            primeiroValor = dado;
            indicePrimeiroValor = indice;
        });

        if (
            !dadosArquivos || 
            Object.getLength(dadosArquivos) <= 0 ||
            typeof primeiroValor.empty != 'undefined' ||
            typeof primeiroValor.st_nome_arq == 'undefined'
        ){
            // remove pelo indice pois o removerLinhas não funciona quando indice 0 já não existe mais (caso a primeira linha seja removida antes da segunda por exemplo)
            dadosTemplate.removerLinha(indicePrimeiroValor);
            adicionarHiddenArquivosVazio(formulario);
            formulario.getDados('campoIdResponsavelArquivos').simularAlteracao();
        }
    },
    
    __recarregarListaArquivosAposUpload : function(form, response){        
        if ( !response.isValid() )
            return true;
        
        // Recarrega apenas o grid quando não tem o form informado
//        if ( !window.formArquivos ){
//            var arquivos = new Application_Grids_Arquivos(".Application_Grids_Arquivos");
//            arquivos.recarregar();
//            return true;
//        }
        
        // necessário selecionar o template novamente para referenciar ao objeto correto
        var template = new Superlogica_Js_Template( window.formArquivos.getSubForm("ARQUIVOS") );

        var ultimoIndice = template.getUltimoIndice();
        var proximoIndice = ultimoIndice === null ? 0 : ultimoIndice + 1;
        template.adicionarLinha(response.getData(), proximoIndice);
        removerHiddenArquivosVazio( window.formArquivos );
        window.formArquivos.getDados('campoIdResponsavelArquivos').simularAlteracao();
        
    },
    
    __antesExcluirSubFormARQUIVOS : function( dadosTemplate, formulario, indice ){
                
        var idArquivo = null;
        Object.each(dadosTemplate.ARQUIVOS, function(arquivo){
            if ( idArquivo === null )
                idArquivo = arquivo.ID_ARQUIVO_ARQ;
        });

        if ( !idArquivo ) 
            return true;
        
        if ( !confirm("Excluir?") )
            return false;
        
        var locationRemoverArquivo = new Superlogica_Js_Location();
            locationRemoverArquivo.setController('arquivos').setAction('delete').viaProxy(true).setParams({}).setApi(true);
        var request = new Superlogica_Js_Request(locationRemoverArquivo.toString(), {'ID_ARQUIVO_ARQ': idArquivo, 'FORCAR_REMOCAO' : 1 });
        var response = request.getResponse();        
        return response.isValid() ? true : false;
        
    }
    
});

Superlogica_Js_Elemento.implement({
    
    __carregarComportamentoArquivos : function(){
        
        var container = this;
        if ( !container )
            return true;
        
        container.encontrar('.subformmaisitens').esconder();
        container.removerClasse('subFormHideDelimiters');
        
        var btnAdicionarArquivo = container.encontrar('.btnAdicionarArquivoIframe');
        var comportamentoJaExistia = false;
        if ( btnAdicionarArquivo ){
            comportamentoJaExistia = true;
            btnAdicionarArquivo.maisProximo('div').remover();
            new Superlogica_Js_Elemento(".adicionarArquivoIframe").remover();
        }
        
        var form = new Superlogica_Js_Form_Elementos( this ).getForm();
        if ( !form )
            return true;
        
        adicionarHiddenArquivosVazio(form);
        
        var campoIdResponsavel = form.getElemento( this.getDados('campo-id-responsavel') );
        if ( !campoIdResponsavel ){
            container.adicionarClasse('subFormHideDelimiters');
            return true;
        }
        
        adicionarAposEditar(form, campoIdResponsavel);
        
        var campoAutocomplete = form.getElemento( this.getDados('campo-autocomplete') );
        if ( !campoAutocomplete )
            return true;
                    
        var template = new Superlogica_Js_Template( container.encontrar('div[comportamentos="Superlogica_Js_Template"]') );
        
        // Só remove os elementos da lista caso for a primeira vez que passe no comportamento
        if ( !comportamentoJaExistia ){
            template.removerLinhas();
        }
        
        
        var aposLimpar = form.atributo('aposLimpar');
        if ( !aposLimpar )
            aposLimpar = '';   
        aposLimpar = aposLimpar.replace('limparCamposUploadArquivo','').trim();
        aposLimpar += ' limparCamposUploadArquivo';
        form.atributo('aposLimpar', aposLimpar.trim());
        
        btnAdicionarArquivo = new Superlogica_Js_Button();
        btnAdicionarArquivo.addFormDialog("Anexar", 'Application_Forms_Arquivos_PutFileDiv',false,'Form.uploadAuto',{
            'classe' : 'btnAdicionarArquivoIframe'
        },'', { 'FL_TIPO_ARQ' : this.getDados('fl-tipo'), 'ID_FERRAMENTA_ARF' : this.getDados('fl-ferramenta') });
        
        var elementoBtn = new Superlogica_Js_Form_Elementos(btnAdicionarArquivo.toString());        
            elementoBtn.css({
                'margin-left' : '10px',
                'margin-bottom' : '10px'
            });
            
        incluirFormUploadPutFile(elementoBtn);
        
        var elementoBtnContainer = new Superlogica_Js_Form_Elementos('<div></div>');
            elementoBtnContainer.conteudo(elementoBtn);
            elementoBtnContainer.carregarComportamentos();
            
        
        var legend = this.maisProximo('fieldset').encontrar('legend');
        if ( legend ){
            
            var containerHelp = legend.encontrar('.containerHelp');
            if ( containerHelp )
                containerHelp.remover();
            
            if ( window.APPLICATION_CONF.MODULE_ID == 'condor' || window.APPLICATION_CONF.MODULE_ID == 'financeiro' ){
                containerHelp = new Superlogica_Js_Elemento('<i class="fa fa-question-circle containerHelp"></i>')
                    .title(window.labelValoresArmazenamento);
            }
        
            legend.adicionarHtmlAoFinal(containerHelp);
            
        }
        
        container.adicionarHtmlAoInicio(elementoBtnContainer);
        
        window.formArquivos = form;
        
        campoIdResponsavel.unbind('change.verificacaoArquivosIframe').bind('change.verificacaoArquivosIframe',function(){
            var valor = this.getValue();
            elementoBtn[ valor ? 'habilitar' : 'desabilitar']();
            var dados = JSON.decode( elementoBtn.atributo('data') );
            dados.ID_RESPONSAVEL_ARQ = valor;
            elementoBtn.atributo('data', JSON.encode(dados));
            
            var idArquivo = null;
            Object.each( form.toJson().ARQUIVOS, function(arquivo){
                if ( idArquivo === null )
                    idArquivo = arquivo.ID_ARQUIVO_ARQ;
            });
            form.setDados('campoIdResponsavelArquivos', campoIdResponsavel );
            if ( idArquivo ){
                campoAutocomplete.desabilitar();
                campoAutocomplete.title('Necessário remover os arquivos para alterar');
            }else{
                campoAutocomplete.habilitar();
                campoAutocomplete.popover('destroy');
            }
        });
        
        setTimeout(function(){
            campoIdResponsavel.simularAlteracao();
        },0);
        

    }
    
});

Superlogica_Js_Form.implement({
    
    __limparCamposUploadArquivo : function(){
        this.getSubForm('ARQUIVOS').encontrar('.subFormExcluir').simularClique();
    },
    
    __desabilitarResponsavelAposEditar : function(){
        this.getDados('campoIdResponsavel').simularAlteracao();
    }
    
});

Superlogica_Js_Form_Elementos.implement({
    
    __montarUrlDownloadArquivo : function(){
        this.bind('change', function(){
            
            var elemento = this;
            setTimeout(function(){
                
                var form = new Superlogica_Js_Form( elemento.maisProximo('.Superlogica_Js_Template_Row') );
                if ( form.contar() <= 0 ) 
                    return true;

                if ( form.encontrar('.btnDownloadArquivo') )
                    return true;

                var dadosArquivos = form.toJson();
                var tipoArquivo = elemento.maisProximo('fieldset').getDados('fl-tipo');            
                var dadosArquivo;
                Object.each(dadosArquivos.ARQUIVOS, function(arquivo){
                    dadosArquivo = arquivo;
                });

                var htmlArquivo = getHtmlExibicaoArquivo(dadosArquivo,tipoArquivo);
                htmlArquivo.inserirDepoisDe( form.getElemento("ST_NOME_ARQ").getItem() );
                habilitarVisualizacaoImagens( new Superlogica_Js_Template(elemento).getClosestInstance() );
            },10);
        });
        
    }
    
});

