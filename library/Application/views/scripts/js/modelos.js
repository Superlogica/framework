/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Superlogica_Js_Elemento.implement({
    
    __processarModelos: function() {
        
        var elementoProcessarModelo = new Superlogica_Js_Form_Elementos("#statusProcessamentoModelo");
        var dadosModelo = new Superlogica_Js_Json(elementoProcessarModelo.atributo('data')).extrair();
        dadosModelo = dadosModelo['data'];
                
        var urlDestino = dadosModelo.todos[0]['url_destino']; //url para onde o modelo vai enviar os dados
        var urlOrigem = dadosModelo.todos[0]['url_origem'] ;
        
        var apenassalvar = dadosModelo.todos[0]['apenas_salvar'] ;
        
        var tituloModelo = dadosModelo.st_titulo_moh;
        var subTituloModelo = dadosModelo.st_subtitulo_moh;
        var textoModelo = dadosModelo.st_texto_moh;        
        var tiponotificacao = dadosModelo.tipo_notificacao ? dadosModelo.tipo_notificacao : dadosModelo.todos[0]['tipo_notificacao']  ;
        var label = dadosModelo.st_label_moh ? dadosModelo.st_label_moh : '';
        
        var idModelo = dadosModelo.todos[0]['id_modelo_moh'];
        
        idModelo = salvarModeloNoFinanceiro( tituloModelo, subTituloModelo, textoModelo, idModelo, label );
        dadosModelo.todos[0]['id_modelo_moh'] = idModelo;
        
        if ( apenassalvar  == 1) {
            window.location = urlOrigem;
        } else {

            var idTimeOut = setTimeout(function() {

                var alerta = new Superlogica_Js_Alertas();
                new Superlogica_Js_Elemento("<div id='alertaModelos'></div>")
                        .inserirDepoisDe(elementoProcessarModelo);
                var conteudo;
                if (!tiponotificacao)
                    conteudo = 'A geração esta demorando um pouco, você pode esperar ou a qualquer hora abrir a <a href=' + getUrlAposSubmeter(tiponotificacao) + '>fila de emails</a>.';
                else
                    conteudo = 'A geração esta demorando um pouco, você pode esperar ou a qualquer hora abrir o <a href=' + getUrlAposSubmeter(tiponotificacao) + '>histórico de impressão</a>';

                alerta.remove('alertaModelos').add(conteudo, 'warning', 'alertaModelos', 'alertaModelos');

            }, 6000);

            var request = new Superlogica_Js_Request(urlDestino, dadosModelo);
            request.setResponseOptions({autoThrowError: true});
            request.enviarAssincrono(function(response) {

                //caso nao tenha url para direcionar envia para fila de emails ou impressao
                if (response.isValid()) {
                    clearTimeout(idTimeOut);
                    var dados = response.getData();
                    if (dados.redirect) {
                        window.location = dados.redirect;
                    } else {
                        window.location = getUrlAposSubmeter(tiponotificacao);
                    }
                }

            });
        }
    },
});

function getUrlAposSubmeter(tiponotificacao) {

    //direcionar apos Submeter ou caso a requisição esteja demorando muito
    var locationAposGerar = new Superlogica_Js_Location();
    locationAposGerar.setParams({})
            .setController(!tiponotificacao ? 'filadeemails' : 'impressoes')
            .setAction('index')
            .setApi(false)
            .viaProxy(true);

    return locationAposGerar.toString();
}

//Salva ou edita um modelo no financeiro antes de enviar para o app
function salvarModeloNoFinanceiro( titulo, subtitulo, texto, idModelo, label ){
    
    if( idModelo == '' || idModelo == 0 )idModelo = '';
    var location = new Superlogica_Js_Location()
            .setController('modelos')
            .setAction( idModelo ? 'post' : 'put')
            .setApi(true)
            .viaProxy(true);


    var request = new Superlogica_Js_Request(location.toString(), {
        'ST_TEXTO_MOH': texto,
        'ST_SUBTITULO_MOH': subtitulo,
        'ST_TITULO_MOH': titulo,
        'ID_MODELO_MOH': idModelo,
        'ST_LABEL_MOH' : label 
    });
    
    request.setResponseOptions({autoThrowError : true});
    var response = request.getResponse();
    var dados = response.getData();
  
    return dados.id_modelo_moh;

}

