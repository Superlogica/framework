var Superlogica_Js_Progressbar = new Class({
    
    /**
     * Action url
     *
     * @param string $url
     */
    
    Extends : Superlogica_Js_Elemento,

    _arAlertas : [],

    initialize : function(){
        return this;
    },
    
    toHtml : function( tamanho, texto, title, tipo){
        //precisa de tipo?
        
        if (!tipo) tipo = 'success';//success, warning, info, danger
        tamanho = parseInt( tamanho );
        if ( !texto ) texto = '';
        if ( !title ) title = '';
        
        var stProgressBar = "<div title='"+ title +"' class='progress ng-isolate-scope' animate='false' value='dynamic' type='success' >\n\
                                <div class='progress-bar progress-bar-" + tipo + "' ng-class='type &amp;&amp; 'progress-bar-' + type' ng-transclude='' style='transition: none; -webkit-transition: none; width: " + tamanho + "%;'>\n\
                                    <b class='ng-scope ng-binding'>"+ texto +"</b>\n\
                                </div>\n\
                            </div>";
        
        return stProgressBar;
    }
              
});
