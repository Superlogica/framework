Superlogica_Js_Form.implement({
    __depoisPassoSelecionarModelo: function (acao, dadosForm) {
        var form = new Superlogica_Js_Form(this);
        var idModelo = form.getElemento('ID_MODELO_MOH').getValue();
        if (confirm('Salvar o texto na lista de modelos padrões?')) {
            var location = new Superlogica_Js_Location();
            location.setController('modelos')
                    .setAction(idModelo != 0 ? 'post' : 'put')
                    .setApi(true)
                    .viaProxy(true);

            dadosForm['ST_TEXTO_MOH'] = form.getElemento('ST_TEXTO_MOH').getValue();

            var request = new Superlogica_Js_Request(location, dadosForm);
            var response = request.getResponse();
        }
    }

});

Superlogica_Js_Form_Elementos.implement({
    __inserirVariavel: function () {
        this.bind('change', function (evento) {
            var form = this.getForm();
            if (!this.getSelectedText())
                return;
            var editor = form.getElemento('ST_TEXTO_MOH').wysiwyg('insertHtml', '%' + this.getSelectedText() + '%');
        });
    },
    __selecionarModelos: function () {

        this.bind('change', function (evento) {

            var form = this.getForm();
            var idModelo = form.getElemento('ID_MODELO_MOH');
            var excluirModelo = form.getElemento('excluirModelo');
            var editarModelo = form.getElemento('excluirModelo');

            if (idModelo && idModelo.getValue() != 0) {

                excluirModelo.mostrar();
                editarModelo.mostrar();

                //requisição para pegar texto
                var location = new Superlogica_Js_Location();
                location.setController('modelos')
                        .setAction('index')
                        .setParam('id', idModelo.getValue())
                        .setApi(true)
                        .viaProxy(true);

                var request = new Superlogica_Js_Request(location);
                var response = request.getResponse();
                var dados = response.getData();

                form.getElemento('ST_TITULO_MOH').setValue(dados.st_titulo_moh);
                form.getElemento('ST_TEXTO_MOH').setValue(dados.st_texto_moh);
                form.getElemento('ST_SUBTITULO_MOH').setValue(dados.st_subtitulo_moh);

            } else {
                form.getElemento('ST_TITULO_MOH').setValue('');
                form.getElemento('ST_TEXTO_MOH').setValue('');
                form.getElemento('ST_SUBTITULO_MOH').setValue('');
                editarModelo.esconder();
                excluirModelo.esconder();
            }
        });
    },
    __excluirModelo: function () {
        this.bind('click', function (evento) {
            if (confirm("Excluir este modelo de e-mail?")) {
                var modelo = this.getForm().getElemento('ID_MODELO_MOH');
                var location = new Superlogica_Js_Location();
                location.setController('modelos')
                        .setParams({})
                        .setParam('ID_MODELO_MOH', modelo.getValue())
                        .setAction('delete')
                        .setApi(true)
                        .viaProxy(true)
                        .toString();

                var request = new Superlogica_Js_Request(location);
                var response = request.getResponse();
                if (!response.isValid())
                    return false;

                var location = new Superlogica_Js_Location();
                location.setController('modelos')
                        .setParams({})
                        .setParam('semModelosPadroes', 1)
                        .setAction('index')
                        .setApi(true)
                        .viaProxy(true)
                        .toString();

                var request = new Superlogica_Js_Request(location);
                var response = request.getResponse();
                modelo.conteudo('');
                var elemento = '<option value="0" label="Escrever um novo texto" selected="selected">Escrever um novo texto</option>';
                Object.each(response.getDados().data, function (item, key) {
                    var texto = (item.st_titulo_moh == '') ? item.st_texto_moh_clear.substr(0, 50) + '...' : item.st_titulo_moh;
                    elemento += '<option value="' + item.id_modelo_moh + '" >' + texto + '</option>';
                });
                modelo.conteudo(elemento);
                modelo.simularEvento('change');
            }
        });
    }

});

function carregarModelosContratos(elementoModelos) {


    var location = new Superlogica_Js_Location();
    location.setController('modelos')
            .setParams({})
            .setParam('semModelosPadroes', 1)
            .setParam('label', '')
            .viaProxy(true)
            .setAction('index')
            .setApi(true)
            .toString();

    var request = new Superlogica_Js_Request(location);
    request.setHandler(elementoModelos);
    request.enviarAssincrono(function (response) {
        if (response.isValid()) {

            var modelos = response.getData(-1);
            var dados = [];
            Object.each(modelos, function (item) {

                var texto = (item.st_titulo_moh == '') ? item.st_texto_moh_clear.substr(0, 50) + '...' : item.st_titulo_moh;
                var modelo = {'id': item.id_modelo_moh, 'label': texto};


                dados.push(modelo);
            });

            dados.push({'id': '0', 'label': 'Insira seu modelo'});
            elementoModelos.setData(JSON.encode(dados));
            elementoModelos.simularEvento('change');

        }
    });

}
