
Superlogica_Js_Elemento.implement({

    __autocompleteSelecionarOutraLicenca : function(){

        var form = new Superlogica_Js_Form('#Application_Forms_Licencas_Selecionar');
        this.bind('change', function(evento){
            var elementoLicenca = form.getElemento('LICENCA');
            var licenca = elementoLicenca.getValue().trim().toLowerCase();
            
            if ( typeof elementoLicenca.getDados('opened') != 'boolean')
                return true;

            if ( licenca == window.LICENCA ){
                elementoLicenca.simularEvento('blur');
                return true;
            }
            if(licenca){
                
                var urlAuth = 'https://superlogica.net/clients/?licenca='+licenca;
                if(window.urlAutenticacaoWhiteLabel)urlAuth = window.urlAutenticacaoWhiteLabel+'?licenca='+licenca+'&email='+window.usuarioLogado;
                
                elementoLicenca.simularEvento('blur');
                window.location.href = urlAuth;
            }                
                
        });
        
        var stLicenca = form.getElemento('LICENCA')
//            .bind('blur', function(){
//                this.adicionarClasse('link').desabilitar();
//                this.atributo('style','background-color: transparent; color:#fff !important');
//            })
//            .bind('mousedown', function(evento){
//                this.removerClasse('link').selecionar().habilitar();
//                this.atributo('style','background-color: #fff; color:#000 !important');
//            })
            .bind('mouseup',function(event){
                /*
                    Quando clicado no campo a ação padrão é colocar o cursor onde está o mouse
                    Então deve ser chamado o método preventDefault()
                    para permanecer o campo todo selecionado
                */    
                event.preventDefault();
            })
            .adicionarClasse('link');

            setTimeout( function(){
                //stLicenca.simularEvento('blur');
            },100);        
    }
});
