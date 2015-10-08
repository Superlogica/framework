function habilitarVisualizacaoImagens(container){
    var galeriaDeImgs = container.encontrar('a.galeria-imagem-upload');
    if ( galeriaDeImgs )
        galeriaDeImgs.lightbox();
}

function adicionarHiddenArquivosVazio(form){
    removerHiddenArquivosVazio(form);
    var hidden = new Superlogica_Js_Elemento('<input type="hidden" name="ARQUIVOS[]" value="" class="hiddenArquivosVazio" />');
    form.adicionarHtmlAoFinal( hidden );
}

function removerHiddenArquivosVazio( form ){
    var hidden = form.encontrar('.hiddenArquivosVazio');
    if ( hidden )
        hidden.remover();
}

function getExtensoesMiniaturasArquivo(){
    return ['jpg','png','jpeg','gif','bmp'];
}

function getHtmlExibicaoArquivo( dadosArquivo, tipoArquivo ){    
    var extensao = dadosArquivo.ST_EXTENSAO_ARQ.toLowerCase();
    var extensoesMiniaturas = getExtensoesMiniaturasArquivo();
    if ( jQuery.inArray(extensao, extensoesMiniaturas ) !== -1){
        return montarHtmlMiniaturaArquivo(dadosArquivo, tipoArquivo);
    }
    return montarHtmlArquivo(dadosArquivo, tipoArquivo);
}


function montarHtmlMiniaturaArquivo(dadosArquivo, tipoArquivo){
    var urlArquivo = getUrlArquivo(dadosArquivo.ID_ARQUIVO_ARQ, dadosArquivo.ST_HASH_ARQ, tipoArquivo).toString();
    var miniatura = '<img src="'+urlArquivo+'" width="100" border="0" />';
    return new Superlogica_Js_Elemento('<table width="140"><tr><td align="center"><a class="galeria-imagem-upload" href="'+urlArquivo+'">'+miniatura+'</a></td></tr></table>');
}

function montarHtmlArquivo(dadosArquivo, tipoArquivo){
    var urlArquivo = getUrlArquivo(dadosArquivo.ID_ARQUIVO_ARQ, dadosArquivo.ST_HASH_ARQ, tipoArquivo).toString();
    var icone = '<img src="'+getUrlIconeExtensao(dadosArquivo.ST_EXTENSAO_ARQ)+'" width="48" height="60" />';
    return new Superlogica_Js_Elemento("<table width='140'><tr><td align='center'><a target='_blank' href='"+urlArquivo+"'>"+icone+"</a></td></tr><tr><td align='center'><a target='_blank' href='"+urlArquivo+"'>"+dadosArquivo.ST_NOME_ARQ+"."+dadosArquivo.ST_EXTENSAO_ARQ.toLowerCase()+"</a></td></tr></table>");
    
}

function getUrlArquivo(idArquivo, hashArquivo, tipoArquivo){
    
    var strArea;
    switch( parseInt(tipoArquivo) ){
        case 1:
            strArea = 'areadocliente';
            break;
        case 2:
            strArea = 'areadocondomino';
            break;
        case 3:
            strArea = window.APPLICATION_CONF.APPLICATION_ID == 'condor' ? 'areadocolaborador' : 'areadofornecedor';
            break;
        default:
            return true;
    }
    var params = {
        'id' : idArquivo, //arquivo.ID_ARQUIVO_ARQ,
        'hash' : hashArquivo, //arquivo.ST_HASH_ARQ
        'tipo' : tipoArquivo
    };
    if ( window.APPLICATION_CONF.APPLICATION_ENV != 'production'){
        params.filename= window.LICENCA;
    }
                    
    return new Superlogica_Js_Location()
                .setController('publico')
                .setAction('downloadarquivo')
                .setParams(params);
}

function incluirFormUploadPutFile(btnAnexar){    
    new Superlogica_Js_Elemento( btnAnexar ).getForm(
        'Application_Forms_Arquivos_PutFile',
        function( containerForm ){
            
            var divForm = new Superlogica_Js_Elemento("#Application_Forms_Arquivos_PutFileDiv");
            if ( divForm.contar() )
                divForm.remover();
            
            containerForm.esconder().atributo('id', 'Application_Forms_Arquivos_PutFileDiv');
            new Superlogica_Js_Elemento("body").adicionarHtmlAoFinal( containerForm );
            btnAnexar.mostrar();
        },
        true
      );
}

function getUrlIconeExtensao(extensao){
    extensao = extensao.toLowerCase();
    var extensoesDisponiveis = ['3gp','ai','avi','bmp','cdr','divix','doc','eps','gif','graph','htm','html','indd','jpg','m4a','mov','mp3','mp4','mpg','odp','ods','odt','ppt','psd','svg','txt','wav','wmv','xls','pdf','zip','rar','exe','csv','xml','dmg'];
    var nomeImg = jQuery.inArray( extensao, extensoesDisponiveis)!== -1 ? extensao+'.png' : 'alternativo2.png';
    return 'https://superlogica.net/temas/'+APPLICATION_CONF.APPLICATION_CLIENT_TEMA+'/img/extensoes/' + nomeImg;
}

function adicionarAposEditar(form, campoIdResponsavel){
    var aposEditar = form.atributo("aposEditar");
    if ( !aposEditar ){
        aposEditar = '';
    }
    
    aposEditar = aposEditar.replace('desabilitarResponsavelAposEditar', '');
    aposEditar = jQuery.trim( aposEditar+' desabilitarResponsavelAposEditar' );
    
    form.atributo('aposEditar', aposEditar);
    form.setDados('campoIdResponsavel', campoIdResponsavel);
}
