/**
 *
 * Utilizado para formatar e gerar gráficos
 *
 */
var Superlogica_Js_Chart = new Class({
    
    /**
     * Objeto principal que contém todas funções padrões
     */
    Extends : Superlogica_Js_Elemento,

    /**
     * Comportamento para renderizar
     */
    __renderizar : function(){
        var chart = this;
       // Aguarda o google carregar suas dependencias
        google.setOnLoadCallback( function(){
            chart.renderizar();
        });


    },
    
    /**
     * Altera o dados e renderiza o gráfico
     */
    setData : function( data ){        
        this.parent( data );
        this.renderizar();
    },
    
    /**
     * Altera o conjunto cores das series de um determinado gráfico
     *
     * @param array data
     */
    setColors : function( data ){
        this.setOpcao('cores', data );
    },

    /**
     * Altera o conjunto de series de um determinado gráfico
     *
     * @param array data
     */
    setSeries : function( data ){
        this.setOpcao( 'series', data );
    },

    lastSerieIsLine : function( flag ){
        if (flag=== true) flag = 1;
        if (flag=== false) flag = 0;
        this.setOpcao( 'lastSerieIsLine', flag );
    },

    /**
     * Formata nosso array response ( data ) 
     * no padrão do DataTable do google visualization
     * uilizando apenas as colunas corretas ( series )
     * 
     * @param array series
     * @param array data
     */
    _dataToGoogleArray : function( series, data ){
        var dados = [series];
        var row = [];
        Object.each( data, function( linha ){
            row = [];
            Object.each( series,function( serie,indice ){
                if (indice==0){
                    row.push(linha[serie]);
                }else{
                    var valor = parseFloat(linha[serie]);
                    valor = isNaN(valor) ? null : valor;
                    row.push(valor);
                }
            });
            dados.push(row);
        });

        return dados;
    },

    /**
     * Renderiza o Grid de acordo com seus parametros
     */
    renderizar : function() {
        if ( !this.getData() )
            return true;
        
        var json = new Superlogica_Js_Json( this.getData() );
        if ( json._isUrl() ){
            var chart = this;
            var request = new Superlogica_Js_Request( this.getData() );
            request.enviarAssincrono( function(response){
                chart._desenharGrafico( response.getData(-1) );
            });
        } else {
            this._desenharGrafico( json.extrair(-1) );
        }
        
        
        
      },
    
    _dataToMorrisDonutArray : function( series, data ){
        var dados = [];
        var row = [];        
        Object.each( data, function( linha ){
            row = [];
            var item='label';
            Object.each( series,function( serie,indice ){
                row[item]= (item=='value') ? (isNaN(parseFloat(linha[serie])) ? null : parseFloat(linha[serie])) : linha[serie];
                item='value';   
            });

            dados.push(row);
        });

        return dados;
    },
    
    _seriesToMorrisLine : function( series, key ){
        var dados = [];
        var row = [];
        var x ='';        
        Object.each( series,function( serie,indice ){
            row = [];        
            if (indice==0){
                x=serie;
            }else{
                row.push(serie);                
                dados.push(row);
            }
        });
        
        return key=='y' ? dados : x;
    },    
    
      /**
       * Chamado para desenhar o gráfico
       * passando o json com dados do gráfico
       *
       * @param object json
       */
      _desenharGrafico : function( json ){
        
        var series = this.getOpcao('series');
        if(this.getOpcao('render') == 'PieChart'){
         
            var dados = this._dataToMorrisDonutArray( series, json );
            if(this.getOpcao('porcentagem')){
                Morris.Donut({
                    element: this.getOpcao('idGrafico'),
                    data: dados,
                    colors: this.getOpcao('cores'),
                    formatter: function (sx) { return sx + "%"}
                    });
            }else{
                Morris.Donut({
                    element: this.getOpcao('idGrafico'),
                    data: dados,
                    colors: this.getOpcao('cores')
                    });                
            }
            
        } else {
            var dados = this._dataToGoogleArray( series, json );


            var data = google.visualization.arrayToDataTable(dados);

            //formata cada coluna
            if (!this.getOpcao('valoresInteiros')){
                var formatter = new google.visualization.NumberFormat({decimalSymbol: ',',groupingSymbol: '.', negativeColor: 'red'});

                Object.each(series, function(item, key){
                        formatter.format(data,parseInt(key));
                 });
            }
            
            var options = {
                'width'  : this.getOpcao('largura'),
                'height' : this.getOpcao('altura'),
                'legend': 'bottom',
                'pieHole': 0.4,
                'colors': this.getOpcao('cores'),
                'pointSize': '6',                
                "backgroundColor" : "transparent"
            };

            if ( this.getOpcao('titulo') )
                options['title'] = this.getOpcao('titulo');

            if ( this.getOpcao('agrupado') )
                options['isStacked'] = true;

            if ( this.getOpcao('tipo') )
                options['seriesType'] = this.getOpcao('tipo');
            var lastSerieIsLine =   this.getOpcao('lastSerieIsLine');
            if ( lastSerieIsLine > 0 ){
                options['series'] = {};
               lastSerieIsLine--
               for(var lastSerie = Object.getLength(this.getOpcao('series'))-2; lastSerieIsLine >= 0; lastSerieIsLine-- ){
                options['series'][ lastSerie - lastSerieIsLine ] = {};
                options['series'][ lastSerie - lastSerieIsLine ]['type'] = 'line';
               }
            }



            var chart = new google.visualization[ this.getOpcao('render') ]( this.$_elemento[0] );
            chart.draw( data, options );  
            
            if ( options.width.indexOf('%') !== -1 || options.height.indexOf('%') !== -1 ){
                // comportamento para redimensionar gráficos junamente com a tela
                var elemento=this;
                new Superlogica_Js_Elemento(window).bind("resize", function (event) {
                    var timeoutChart = elemento.getDados( 'timeoutchart' );
                    if ( timeoutChart ){
                        clearTimeout( timeoutChart );
                        elemento.setDados( 'timeoutchart', null );
                    }

                    timeoutChart = setTimeout(function(){
                        chart.draw( data, options );
                        elemento.setDados( 'timeoutchart', null );
                    }, 50 );

                    elemento.setDados( 'timeoutchart', timeoutChart );

                }).simularEvento('resize');
            }
        }
        
        
      }
    
    
});