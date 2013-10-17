( function($){
    
    $(function(){
                
        $('button[dialogSelect]')
            .live(
                'click',
                function(event){
                    event.preventDefault();
                    var $btn = $(this);
                    var getSelectedContent = $btn.attr('getSelectedContent');
                    var setSelectedItem = $btn.attr('setSelectedItem');

                    var title = $btn.attr('title');
                        title = title ? title : "";

                    $.get(
                        $(this).attr('dialogSelect'),
                        function(data){

                            var divId = new String( (Math.random()*Math.random()) ).replace('.','');

                            $('<div id="'+divId+'">'+data+'</div>').appendTo('body');

                            $('#'+divId)
                                .dialog({
                                    "width" : 900,
                                    "height" : 400,
                                    "position" : 'center',
                                    "modal" : true,
                                    "resizable" : false,
                                    "title" : title,
                                    "close" : function(){
                                        $(this).remove();
                                    },
                                    'buttons':{
                                        'Selecionar' : function(){
                                            var selectedItem;

                                            if ( typeof getSelectedContent == 'string'){
                                                selectedItem = window[getSelectedContent]();
                                            }
                                            if ( typeof setSelectedItem == 'string'){
                                                window[setSelectedItem](selectedItem);
                                            }

                                            $(this).dialog('close');

                                        },
                                        'Cancelar' : function(){
                                            $(this).dialog('close');
                                        }
                                    }
                                });
                        }
                    );
                    return false;
                }
            );

    });

    this.loadFormsBehaviors = function(){


    }
    
}).apply( window, [jQuery] );
