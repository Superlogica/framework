var Superlogica_Js_Form_Relatorios = new Class({    
    
    /**
     * Classe principal para montar o template do Grid
     */
    Extends : Superlogica_Js_Form,
        
    __data : function(){    
        
        var conteudo= 
        '<option value="vazio" label="Todos os dias">Não definido</option>'+    
        '<option value="0" label="Hoje">Hoje</option>'+
        '<option value="1" label="Ontem">Ontem</option>'+
        '<option value="2" label="Fim do mês">Fim do mês</option>'+
        '<option value="3" label="Início do mês">Início do mês</option>'+
        '<option value="selecionar" label="Selecionar data">Selecionar data</option>';
                   
        this.conteudo(conteudo);
        
        if (!this.atributo('usarVazio')){             
            var $elemento= new Superlogica_Js_Form_Elementos(this);
            $elemento.setValue(0);
        }
        
        this.bind('change', function(event){                
            event.preventDefault();                
            var elemento= new Superlogica_Js_Form_Elementos(this);  
                
            var formulario= elemento.getForm();               
            var elementoData= formulario.getElemento(elemento.atributo('name')+'_DATA');
            
            if (!elementoData.getValue()){
                elementoData.setValue(new Superlogica_Js_Date().toString('m/d/Y'));
            }
            
            if (elemento.getValue()=='selecionar'){
                if (!elementoData.getValue()){
                    elementoData.setValue(new Superlogica_Js_Date().toString('m/d/Y'));
                }
                
                elementoData.getItem().mostrar();
            }else{               
                elementoData.setValue('').getItem().esconder();                                 
            }
                
        });
    },
    
    __periodo : function(){
        
        
        var conteudo= '<option value="vazio" label="Todos os meses">Não definido</option>'+
        '<option value="0" label="Mês atual">Mês atual</option>'+
        '<option value="-1" label="Mês anterior">Mês anterior</option>'+
        '<option value="-2" label="-2 meses do atual">-2 meses do atual</option>'+
        '<option value="1" label="Próximo mês">Próximo mês</option>'+
        '<option value="selecionar" label="Selecionar período">Selecionar período</option>';
        
        
        this.conteudo(conteudo);
        
        this._selecionarPeriodo('periodo');
    },
    
    __mes : function(){        
        var conteudo= '';
        
        if (this.atributo('semVazio')!='1'){
            conteudo= '<option value="vazio" label="Todos os meses">Não definido</option>';
        }
                
        conteudo= conteudo + '<option value="0" label="Mês atual">Mês atual</option>'+
        '<option value="-1" label="Mês anterior">Mês anterior</option>'+
        '<option value="-2" label="-2 meses do atual">-2 meses do atual</option>'+
        '<option value="1" label="Próximo mês">Próximo mês</option>'+
        '<option value="selecionar" label="Selecionar mês">Selecionar mês</option>';        
    
        if (this.atributo('outroPeriodo')=='1'){
            conteudo= conteudo+'<option value="outroperiodo" label="Outro período">Outro período</option>';
        }        
        
        this.conteudo(conteudo);
        
        this._selecionarPeriodo('mes');
    },
    
    __ano : function(){
        var conteudo=  '<option value="vazio" label="Todos os anos">Não definido</option>'+
        '<option value="0" label="Ano atual">Ano atual</option>'+
        '<option value="-1" label="Ano anterior">Ano anterior</option>'+
        '<option value="-2" label="-2 anos do atual">-2 anos do atual</option>'+
        '<option value="1" label="Próximo ano">Próximo ano</option>'+                       
        '<option value="selecionar" label="Selecionar ano">Selecionar ano</option>';
                   
        this.conteudo(conteudo);
        this._selecionarPeriodo('ano');
    },
    
    _selecionarPeriodo : function(tipo){  
        if (!this.atributo('usarVazio')){
            var $elemento= new Superlogica_Js_Form_Elementos(this);
            $elemento.setValue(0);
        }
        
        this.bind('change', function(event){  
            
            event.preventDefault();                
            var elemento= new Superlogica_Js_Form_Elementos(this);                                
            var formulario= elemento.getForm();
                       
            var elementoDataInicio= formulario.getElemento(elemento.atributo('name')+'_INICIO');
            var elementoDataFim= formulario.getElemento(elemento.atributo('name')+'_FIM');                       
                       
            if (tipo=='periodo'){                
                
                if (elemento.getValue()=='selecionar'){
                    if (!elementoDataInicio.getValue()){

                        elementoDataInicio.setValue(new Superlogica_Js_Date().toString('m/01/Y'));
                        elementoDataFim.setValue(new Superlogica_Js_Date().toString('m/t/Y'));
                        elementoDataFim.datepicker('option', 'minDate', new Date( new Superlogica_Js_Date().toString('m/01/Y') ) );
                    }

                    elementoDataInicio.getItem().mostrar();
                    elementoDataFim.getItem().mostrar();
                }else{
                    elementoDataInicio.setValue('').getItem().esconder();                    
                    elementoDataFim.setValue('').getItem().esconder();
                }
            }else if(tipo=='ano'){                           
                                
                if (elemento.getValue()=='selecionar'){
                    if (!elementoDataInicio.getValue()){
                        elementoDataInicio.setValue(new Superlogica_Js_Date().toString('m/01/Y'));
                        elementoDataInicio.datepicker('option', 'minDate', new Date( new Superlogica_Js_Date().toString('01/01/Y') ) );                                                                
                    }
                    
                    elementoDataInicio.getItem().mostrar();
                }else{
                    elementoDataInicio.setValue('');                    
                    elementoDataInicio.getItem().esconder();                
                }
            }else if (tipo=='mes'){                         
                if (elemento.getValue()=='outroperiodo'){                      
                    elementoDataInicio.atributo('format','date');
                    elementoDataInicio.date();
                    elementoDataInicio.setValue('')
                                        
                    elementoDataInicio.getItem().mostrar();
                    elementoDataFim.getItem().mostrar();
                }else if (elemento.getValue()=='selecionar'){                    
                    elementoDataInicio.atributo('format','date|mm/yy');
                    elementoDataInicio.date();   
                    elementoDataInicio.setValue('')
                    
                    elementoDataFim.getItem().esconder();                    
                    elementoDataInicio.getItem().mostrar();
                }else{
                    elementoDataFim.getItem().esconder();
                    
                    elementoDataInicio.setValue('');                    
                    elementoDataInicio.getItem().esconder();                
                }
            }          
        });
    },
    
    __validarDataPeriodo : function(){
        this.bind('change', function(event){
            event.preventDefault();                
            var elementoDataInicio= new Superlogica_Js_Form_Elementos(this); 
            var formulario= elementoDataInicio.getForm(); 
            
            var nomeElemento= elementoDataInicio.atributo('name');
            
            if (elementoDataInicio.getValue()){
                nomeElemento= nomeElemento.replace('INICIO','FIM');
                var elementoDataFim= formulario.getElemento(nomeElemento);
                
                if (elementoDataFim){
                    elementoDataFim.datepicker('option','minDate',new Date( new Superlogica_Js_Date(elementoDataInicio.getValue(),'d/m/Y').toString('m/d/Y') ));
                }
                
            }
                

        });        
    }
});