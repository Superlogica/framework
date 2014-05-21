var Superlogica_Js_Button = new Class({
    
    /**
     * Action url
     *
     * @param string $url
     */
    _arButtons : [],

    initialize : function(){
        
        var args = arguments;
        if ( args.length > 0 ){
            this.add.call(this,arguments);
        }
        return this;
    },
    
    /**
     * 
     * @param type $text
     * @param type $destaque
     * @param type $link
     * @param type $openDivId
     * @param type $openDialogForm
     * @param type $imagem
     * @param type $comportamentos
     * @param type $atributos
     * @return \Superlogica_Button
     */
     add : function ( text, destaque, link, openDivId, openDialogForm, imagem, comportamentos, atributos ){
        
        if(typeof destaque == 'undefined'){
            destaque = false;
        }

        if(typeof comportamentos == 'undefined'){
            comportamentos = '';
        }
        
        var arAtributos = {};
        
        if(typeof atributos != 'undefined'){
            Object.each( atributos, function(valor,atributo){
                arAtributos[atributo] = valor;
            });
        }
        
        if ( typeof imagem != 'undefined' && imagem ){
            if ( typeof arAtributos.classe == 'undefined')
                arAtributos.classe = '';            
            if ( typeof arAtributos.title == 'undefined')
                arAtributos.title = '';
            
            arAtributos.classe += ' '+imagem+'';
            arAtributos.title += text;
            text = '';  
        }

        if ( comportamentos )
            arAtributos.comportamentos = comportamentos;

        if ( openDivId ){    
            arAtributos.divid = openDivId;
            arAtributos.comportamentos = comportamentos + " cliqueAlteraVisibilidade Form.formExibir ";
        }
        
        if ( openDialogForm ){
            arAtributos.divid = openDialogForm;
            arAtributos.comportamentos = comportamentos + " Form.openDialog";
        }
        
        this._arButtons.push(
             {
               'text' : text,
               'destaque' : destaque,
               'link' : link,
               'imagem' : imagem,
               'atributos' : arAtributos
            }
         );

        return this;
    },
    
    /**
     * 
     * @param type $text
     * @param type $divid
     * @param type $destaque
     * @param string $comportamentos
     * @param string $atributos
     * @return \Superlogica_Button
     */
    addFormDialog : function ( text, divid, destaque, comportamentos, atributos, imagem, formData, cadastrarOutro){
        
        if(typeof destaque == 'undefined'){
            destaque = false;
        }
        
        if(typeof cadastrarOutro == 'undefined'){
            cadastrarOutro = true;
        }
        
        if(typeof atributos == 'undefined'){
            atributos = {};
        }
        atributos['data'] =  new Superlogica_Js_Json(formData).encode();
        atributos['cadastrar_outro'] = parseInt(cadastrarOutro);

    
    
        
//        atributos.cadastrar_outro = parseInt( cadastrarOutro );

        this.add( text, destaque, '', '', divid, imagem, comportamentos, atributos );
        return this;
    },
    
    /**
     * 
     * @param type $text
     * @param type $divid
     * @param type $destaque
     * @param string $comportamentos
     * @param string $atributos
     * @return \Superlogica_Button
     */
    addOpenDiv : function ( text, divid, destaque, imagem, comportamentos, atributos ){
        if(typeof destaque == 'undefined'){
            destaque = false
        }
        if(typeof imagem == 'undefined'){
            imagem = '';
        }
        if(typeof comportamentos == 'undefined'){
            comportamentos = '';
        }
        if(typeof atributos == 'undefined'){
            atributos = '';
        }
        
        this.add( text, destaque, '', divid, '', imagem, comportamentos, atributos );
        return this;
    },
    
    /**
     * 
     * @param type $text
     * @param type $link
     * @param type $destaque
     * @param string $imagem
     * @param string $comportamentos
     * @param string $atributos
     * @return \Superlogica_Button
     */
    addLink : function ( text, link, destaque, imagem, comportamentos, atributos){        
        if(typeof destaque == 'undefined'){
            destaque = false
        }
        
        this.add( text, destaque, link, '', '', imagem, comportamentos, atributos );
        return this;
    },
    
    addDropDown : function ( text, button, destaque ){
        if(typeof destaque == 'undefined'){
            destaque = false
        }

        this._arButtons.push(
                         {
                           'text' : text,
                           'data' : button,
                           'destaque' : destaque
                        }
                     );
    },
    
    /**
     * 
     * @param type $text
     * @return string
     */
    toDropDown : function (text, destaque ){
        if(typeof destaque == 'undefined'){
            destaque = false
        }

        var classBtn = destaque ? "btn-success" : "btn-default";        
        
        var html=  '<div class="btn-group"><button id="btnGroupDrop1" type="button" class="btn '+classBtn+' dropdown-toggle" data-toggle="dropdown">'+text+' <span class="caret"></span></button><ul class="dropdown-menu" role="menu" aria-labelledby="btnGroupDrop1">';

        Object.each( this._arButtons, function(button){
            var link = linkToJs( button['link'] );
            var stAtributos = '';
            Object.each( button.atributos, function(valor, atributo){
                if ( atributo == 'classe')
                    atributo = 'class';
                stAtributos += atributo+"='"+valor+"' ";
            },stAtributos);
        
            html += "<li><a href='"+link+"' "+stAtributos+">"+button['text']+"</a></li>";
        }, this);
        html += "</ul> </div> ";   

        return html;
    },
    
    toString :  function(){
        
        var stElements = '';
        
        Object.each( this._arButtons, function(button,key){
            
            if ( typeof button.data == 'object' ){                
                  stElements +=  button.data.toDropDown( button.text, button.destaque );
                  return;
            }

            var _class = button.destaque ? "btn-success" : "btn-default";
            if ( typeof button.atributos.btnClass == 'string' ){
                _class = button.atributos.btnClass;
            }
            _class += (typeof button.classe != 'undefined') ? button.classe : '';
            
            if ( !button.atributos )
                button.atributos = {};

            if ( !button.atributos.classe ){
                button.atributos.classe = '';
            }

            button.atributos.classe += " btn "+_class;
            var stAtributos = '';
            var textoBotao =jQuery.trim( button.text.toLowerCase() );
            if ( textoBotao.indexOf('delete') !== -1 || textoBotao.indexOf('excluir') !== -1 ){
                button.atributos.classe = button.atributos.classe.replace('btn-danger','');
                button.atributos.classe += ' btn-danger';
            }

            Object.each( button.atributos, function(valor,atributo){
                if ( atributo == 'classe')
                    atributo = 'class';
                stAtributos += atributo+"='"+valor+"' ";
            },stAtributos);

            var link = linkToJs( button.link );
            stElements += "<a href="+link+" "+stAtributos+">"+button.text+"</a>";
            
//            $button['imagem']
        },stElements);
        
        if ( this._arButtons.length > 1 ){
            
            stElements = "<div class='btn-group'>"+stElements+"</div>";
        }
        
        return stElements;
    }
});


/**
 * 
 * @param type $link
 * @return type
 */
function linkToJs ( link ){   
    return (typeof link != 'undefined' && link != '') ? link : "javascript:void(0);";
};