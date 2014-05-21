var Superlogica_Js_String = new Class({

    /**
     * Guarda o tipo de documento a que a string se refere
     * @var string
     */
    _values : [],

    pluralizar : function ( nmQuantidade, palavraSingular, palavraPlural ){

        var stTexto =  Superlogica_Js_String._pluralizar( nmQuantidade, palavraSingular, palavraPlural );
        if ( stTexto != '')
            this._values.push( stTexto );
    },

    toString : function(){

        var nmItens = Object.getLength( this._values );
        var colaPrincipal = ',';
        var colaExtra = 'e';

        if ( nmItens == 0 ) return '';

        var stFraseFormatada = '';
        Object.each(this._values, function(item, key){

            stFraseFormatada += item;
            if ( key == ( nmItens -1 ) ){
                stFraseFormatada += '.';
                return;
            }

            if ( key == ( nmItens -2 ) )
                stFraseFormatada += " " + colaExtra + " ";
            else
                stFraseFormatada += colaPrincipal + " ";
        });

        return stFraseFormatada;
    }
});
Superlogica_Js_String.Formatar =
	function(texto, tamanhoDesejado, caracterAcrescentar, acrescentarADireita) {


        var caracterAcrescentar = caracterAcrescentar.replace( /[^a-zA-Z0-9_.]/g,"");
        var tamanhoTexto = texto.length;
        var quantidadeAcrescentar = tamanhoDesejado - tamanhoTexto;
		var textoAux = '';

        if (quantidadeAcrescentar < 0)
			quantidadeAcrescentar = 0;
        if (caracterAcrescentar == '')
			caracterAcrescentar = ' ';

        var posicaoInicial = (tamanhoTexto >= tamanhoDesejado) ? tamanhoTexto - tamanhoDesejado : 0;
        var i = 0;
        while (i < quantidadeAcrescentar){
                textoAux = textoAux.concat( caracterAcrescentar );
                i++;
        }
        if (acrescentarADireita == true) {
            texto = texto.substr(0, tamanhoDesejado).concat(textoAux);
        } else {
            texto = textoAux.concat(texto.substr(posicaoInicial, tamanhoDesejado));
        }
        return texto;
    }

Superlogica_Js_String.nl2br = function(str, is_xhtml) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Philip Peterson
  // +   improved by: Onno Marsman
  // +   improved by: Atli Þór
  // +   bugfixed by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Maximusya
  // *     example 1: nl2br('Kevin\nvan\nZonneveld');
  // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
  // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
  // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
  // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
  // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};

Superlogica_Js_String.pluralizar = function( nmQuantidade, palavraSingular, palavraPlural ) {

    return Superlogica_Js_String._pluralizar( nmQuantidade, palavraSingular, palavraPlural );
};

Superlogica_Js_String._pluralizar = function( nmQuantidade, palavraSingular, palavraPlural ) {

    if ( ( isNaN(nmQuantidade)) || ( nmQuantidade == 0 ) )
        return '';
    if ( nmQuantidade == 1 )
        return nmQuantidade + " " + palavraSingular;
    else{

        if ( typeof palavraPlural == 'undefined' )
            palavraPlural = palavraSingular + "s";
        return nmQuantidade + " " + palavraPlural;
    }
};
