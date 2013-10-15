jQuery(function(){
    
    var w = 0
    jQuery('#menu > ul > li').each(function(){
        w+= jQuery(this).innerWidth() + 1;
    });

    jQuery('#menu > ul').width(w);
    
    // Internet Explorer precisa setar no menu e não somente no UL
    jQuery('#menu').width(w);
    
    jQuery('#menu > ul > li')
        .hover(
            function(){
                jQuery('#menu').find('ul li ul').hide();
                jQuery(this).find('ul').show();
            },
            function(){
                jQuery(this).find('ul').hide();
            }
        )
        .focusin(function(){
            
            jQuery(this).unbind('keydown.menu').bind('keydown.menu', function(evento){
                
                var getActiveIndex = function( ul ){
                    var ativo = 0;
                    ul.find('li a').each(function( indice ){
                         if ( document.activeElement == this ){
                             ativo = indice;
                             return false;
                         }
                    });
                    return ativo;
                };
                
                var ul = jQuery(this).find('ul');
                var proximoIndice;
                var proximoElemento;
                                
                if( evento.keyCode == 40 ){
                    
                    evento.preventDefault();
                    
                    if ( !ul.is(':visible') ){
                        var elemento = jQuery(this);
                        ul.show().find('li:first a').focus();
                        ul.find('li a').unbind('focusout.menu focusin.menu').bind('focusout.menu focusin.menu', function(evento){
                            evento.stopPropagation();
                        });
                        
                        new Superlogica_Js_Elemento(document).bind('focusin.menu', function(){
                            elemento.focusout();
                            jQuery(this).unbind('focusin.menu');
                        });
                        
                    } else {
                        proximoIndice = getActiveIndex(ul)+1;
                        proximoElemento = ul.find('li:eq(' + proximoIndice + ') a');
                        if ( proximoElemento.size() )
                            proximoElemento.focus();
                        else{
                            ul.find('li:eq(0) a').focus();
                        }
                    }
                    
                } else if ( evento.keyCode == 38 && ul.is(':visible') ){
                    
                    evento.preventDefault();
                    
                    proximoIndice = getActiveIndex(ul)-1;
                    proximoElemento = ul.find('li:eq(' + proximoIndice + ') a');
                    if ( proximoElemento.size() )
                        proximoElemento.focus();
                    else{
                        ul.find('li:last a').focus();
                    }
                }
                
                
                
            });
        })
        .focusout(function(){
            jQuery(this).find('ul').hide();
        });

});