var Superlogica_Js_String = new Class({});
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
