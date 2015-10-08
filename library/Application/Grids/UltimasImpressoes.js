var Application_Grids_UltimasImpressoes = new Class({
    
    Extends : Superlogica_Js_Grid,
    	          
    _formatarRodape : function(){
        var itens = Object.getLength( this.getData() );
        var msgImpressoes = '<b>Listando '+ itens+ ' arquivo'+ ((itens > 1) ? 's' : '') + '.</b>';
        return [ msgImpressoes, null, null];
    },  
    
    _formatarColunaData : function (dados){
        var status = parseInt(dados.fl_status_fimp);        
        var hoje= new Superlogica_Js_Date();
                
        var data= dados.dt_impressao_fimp ? dados.dt_impressao_fimp : dados.dt_criacao_fimp;
        data= new Superlogica_Js_Date(data);
        
        var formato= 'd/m/Y H:i';
        
        if (data.toString('m/d/Y')==hoje.toString('m/d/Y'))
            formato= 'H:i';

        return data.toString(formato);
    },   

    _formatarColunaTitulo : function (dados, indice){
        var fl_disponivel_fimp= parseInt(dados.fl_disponivel_fimp);
        
        if (fl_disponivel_fimp == 0)        
            this._HTMLGetLinhaDesenhada( indice ).adicionarClasse('invalidado');        
        
        var status = parseInt(dados.fl_status_fimp);
        
        if (fl_disponivel_fimp == 0)
            status=' <span title="Arquivo indisponível no servidor" class="label label-danger">Indisponível</span>';        
        else            
            status= '';
                
        var usuario= dados.st_nome_usu ? ' <span class="descricao">Enviado por <span class="label label-report">'+dados.st_nome_usu+'</span></span>' : '';
        var impressora = '';
        if (dados.impressora_formatada)            
            impressora= '<br>'+dados.impressora_formatada;
        
        var location= new Superlogica_Js_Location()
                      .setController('impressoes')
                      .setParams({})
                      .setAction('')
                      .setId(dados.id_impressao_fimp)
                      .viaProxy(true)
                      .setParam('baixar',1);        
        var titulo= '';
        
        if ((this.extensoesPermitidas(dados)) || (dados.fl_tipoimpressao_fimp == 1)){
            var hint = '';
            if ( dados.st_descricao_fimp ){
              hint = 'comportamentos="hint" hint-placement="top" title="'+dados.st_descricao_fimp+'"';
            }
            var dadosAux = {};
            Object.each(dados, function(item, chave){
                dadosAux[chave.toUpperCase()]= item;   
            });        
                var linkDownload= new Superlogica_Js_Location().setController('impressoes').setParams({'id':dados.id_impressao_fimp}).setController('documentos').setAction('download').viaProxy(true).toString();
                titulo= ' <a id="linkDocumento'+dados.id_impressao_fimp+'" '+hint+' autoSalvar="1" controller="impressoes" action="post" params=\''+new Superlogica_Js_Json(dadosAux).encode()+'\' campo="ST_TITULO_FIMP" target="_blank" href="'+linkDownload+'">'+dados.st_titulo_fimp+'</a>';
                if(dados.fl_tipoimpressao_fimp == 1)
                    titulo= ' <a id="linkDocumento'+dados.id_impressao_fimp+'" '+hint+' autoSalvar="1" controller="impressoes" action="post" params=\''+new Superlogica_Js_Json(dadosAux).encode()+'\' campo="ST_TITULO_FIMP" target="_blank" href="'+location.toString()+'">'+dados.st_titulo_fimp+'</a>';
        }else{
            titulo= dados.st_titulo_fimp;
        }        

        var nomeCondominio = '';          

        var elementoColuna = new Superlogica_Js_Elemento('<div>' + status + titulo + nomeCondominio + impressora + usuario + '</div>');
        elementoColuna.carregarComportamentos();
        return elementoColuna;
    },
    
    extensoesPermitidas : function(dados){
        switch (this._getExtensaoArquivo(dados.st_arquivo_fimp)){
            case 'pdf' : 
            case 'jpg' :
            case 'jpeg':
            case 'png' :
            case 'doc' :
            case 'xls' :
            case 'ppt' :
            case 'gif' :
            case 'txt' :
            case 'rem' :
            case 'zip' :
            return true;
            default: return false;
        }
    },
        
    _getExtensaoArquivo : function(arquivo){        
        var caminho = arquivo;
      	arquivo = caminho.substring(caminho.lastIndexOf('/') + 1);
      	var extensao= arquivo.substring(arquivo.lastIndexOf('.') + 1);
        return extensao;
    },
   
    _aoPaginar : function( pagina ){
        return this._getUrlDados( pagina );
    },
    
    _aoRecarregar : function(){
        return this._getUrlDados();
    },
    
    _getUrlDados : function( pagina ){

        var location = new Superlogica_Js_Location();
        var dataMes = new Superlogica_Js_Date();
        location.setParam("pesquisa", location.getId() )
          .setParam("dtInicio", dataMes.toString('m/01/Y'))
          .setParam("dtFim", dataMes.toString('m/t/Y'))
          .setParam( 'itensPorPagina', this.getItensPorPagina() );

        location.setController('impressoes').setAction('index').setApi(true).viaProxy(true);

        if ( pagina ){
            location.setParam('pagina', pagina+1 );
        }
        return location.toString();
    },
            
    _formatarColunaEnviarEmail : function (dados, indice){
        var texto = '<span class="fa-lg fa fa-envelope blocoInvisivel"></span>';       
        var botao = new Superlogica_Js_Button();            
        botao.addFormDialog(texto,'Shared_Forms_FilaImpressoes_EmailDiv', false, 'hint', {'class':'link', 'title':'Enviar por e-mail'}, '', {ID_IMPRESSAO_FIMP:dados.id_impressao_fimp, ST_TITULO: dados.st_titulo_fimp + ' ' +dados.st_descricao_fimp}, false);

        var elementoBotao = new Superlogica_Js_Elemento('<span>'+botao.toString()+'</span>');

        return elementoBotao.carregarComportamentos();
    }            
});