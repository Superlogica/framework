var Superlogica_Js_Form_EmLinha = new Class({
    
    /**
     * Classe principal para montar o template do Grid
     */
    Extends : Superlogica_Js_Form,
        
    /**
     * Habilita a edição do elemento
     */
    editar : function(){ 
        var primeiroElemento = null;
        this.emCadaElemento(function(){
            var elemento = new Superlogica_Js_Form_EmLinha( this );
            if ( elemento.eh( '.'+Superlogica_Js_Form_EmLinha.css.classElementoAtivo ) ) 
                return true;
            
            var antesEditar = elemento.atributo('antesEditar');        
            if ( typeof elemento[antesEditar] == 'function'){                
                var retorno = elemento[antesEditar]();
                if ( retorno === false ){
                    return true;
                }
            }
            
            elemento
                .adicionarClasse( Superlogica_Js_Form_EmLinha.css.classElementoAtivo )
                .bind('click.formEmLinha', function(event){
                    event.preventDefault();
                });
                
            var conteudo = elemento.conteudo();
            var inputEditor = new Superlogica_Js_Form_Elementos("<input type='text' name='formEmLinha' />");
                inputEditor.atributo( elemento._getAtributosInput() );
            inputEditor.processarComportamento( inputEditor );
            inputEditor.setValue( elemento._formatInputValue(conteudo) );
            
            if ( !primeiroElemento )
                primeiroElemento = inputEditor;
            
            var valorAnterior = inputEditor.getValue();
            elemento
                .conteudo( inputEditor )
                .setDados( 'valorhtml', conteudo )
                .setDados( 'valorinput', valorAnterior );
        
            inputEditor
                .unbind('keydown.autosize')
                .bind("keydown.autosize", function(){
                    var novoValor = inputEditor.getValue();
                    this.atributo('size', new String(novoValor).length );
                })
                .simularEvento("keydown")
                .bind('keydown.formEmLinha change.formEmLinha paste.formEmLinha', function(){
                    inputEditor.removerClasse( Superlogica_Js_Form_EmLinha.css.classElementoErro );
                });
                    
            if ( parseInt(elemento.atributo('autoSalvar'),10) == 1 ){                
                inputEditor
                    .unbind('keydown.formEmLinha blur.formEmLinha focus.formEmLinha change.formEmLinha paste.formEmLinha')
                    .bind('focus.formEmLinha', function(){
                        this.setDados('salvo', false);
                    })
                    .bind("blur.formEmLinha keydown.formEmLinha", function(event){
                        if ( (event.type == 'keydown' && event.keyCode != 13) || this.getDados('salvo') )
                            return true;
                        this.setDados('salvo', true);
                        elemento.salvar();
                    });
            }
        });
                
        if ( primeiroElemento && this.contar() == 1 ){
            primeiroElemento
                .simularEvento('focus')
                .simularEvento('select');
        }
        
    },
    
    /**
     * Salva os dados
     */
    salvar : function(){
        
        var elemento = this;
        var input = this.getInput();
        if ( !elemento.eh( '.'+Superlogica_Js_Form_EmLinha.css.classElementoAtivo ) || input.eh('.'+Superlogica_Js_Form_EmLinha.css.classElementoErro) ) 
            return true;        
        var forcarEnvio = parseInt(elemento.atributo('forcarenvio'));
        forcarEnvio = isNaN(forcarEnvio) ? 0 : forcarEnvio;
        if ( input.getValue() == elemento.getDados('valorinput') && !forcarEnvio ){
            new Superlogica_Js_Form_EmLinha( elemento ).desabilitarEdicao();
            return true;
        }
        
        var controllerName = this.atributo("controller");
        var actionName = this.atributo("action");        
        var params = new Superlogica_Js_Json(this.atributo("params")).extrair(-1);
        params = typeof params == 'object' ? params : {};
        params[elemento.atributo('campo')] = input.getJson();
        
        var location = new Superlogica_Js_Location();
            location.setApi(true);
        if ( controllerName )
            location.setController( controllerName );
        if ( actionName )
            location.setAction( actionName );
        var antesSalvar = this.atributo("antesSalvar");
        if ( typeof this[antesSalvar] == 'function' ){
            var retorno = this[antesSalvar]( params );
            if ( retorno === false ){
                return true;
            }
        }
        var request = new Superlogica_Js_Request( location.toString(), typeof params == 'object' ? params : {} );
        request.setResponseOptions({
            callbackFunction : function(){
                input.focar();
            }
        });
        request.setHandler(input);
        request.enviarAssincrono( function( response ){
            if ( response.isValid() ){
                elemento.setDados('valorhtml', params[elemento.atributo('campo')] );
                new Superlogica_Js_Form_EmLinha( elemento ).desabilitarEdicao();
                var aposSalvar = elemento.atributo('aposSalvar');
                if ( typeof elemento[aposSalvar] == 'function'){
                    elemento[aposSalvar]( params, response );
                }
            }else{
                input.adicionarClasse( Superlogica_Js_Form_EmLinha.css.classElementoErro );
            }
        });
    },
    
    /**
     * Desabilita a edição do campo
     */
    desabilitarEdicao : function(){
        this.emCadaElemento(function(){
            var elemento = new Superlogica_Js_Form_EmLinha( this );
            if ( !elemento.temClasse( Superlogica_Js_Form_EmLinha.css.classElementoAtivo ) ) 
                return true;
            elemento
                .removerClasse( Superlogica_Js_Form_EmLinha.css.classElementoAtivo )
                .conteudo( elemento.getDados('valorhtml') )
                .unbind('click.formEmLinha');
            var aposDesabilitar = elemento.atributo('aposDesabilitar');
            if ( typeof elemento[aposDesabilitar] == 'function'){
                elemento[aposDesabilitar]();
            }   
        });
    },
   
    /**
     * Retorna o input do elemento 
     */
    getInput : function(){
        return new Superlogica_Js_Form_Elementos( this.encontrar('input'));
    },
            
    _getTipo : function(){
        return this.atributo("tipo");
    },
            
    _getAtributosInput : function(){
        var tipo = this._getTipo();
        var atributos = {};
        switch ( tipo ){
            
            case 'decimal' :
                var casasDecimais = parseInt( this.atributo('casasDecimais'), 10);
                atributos = {
                    'class' : 'numeric',
                    'comportamentos' : 'Form.numeric'
                };
                if ( casasDecimais ){
                    atributos['decimal'] = casasDecimais;
                }
                break;
            
        }
        return atributos;
    },
            
    _formatInputValue : function( valor ){
        var tipo = this._getTipo();
        switch( tipo ){
            case 'numeric':
            case 'decimal' :
                valor = new Superlogica_Js_Currency().toJson( valor );
                break;
        }
        return valor;
    }
    
});

/**
 * Nomes de classes no CSS utilizada pelos elementos da classe
 * Objeto estatico pois é utilizado fora desta classe também
 */
Superlogica_Js_Form_EmLinha.css = {
    classElementoAtivo : 'active',
    classElemento : 'editorInline',
    classElementoErro : 'erroRequisicao'
};
