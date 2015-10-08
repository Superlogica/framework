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
  // +   improved by: Atli ﬁÛr
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

Superlogica_Js_String.numeroRandomico = function(){
	return new String( (Math.random()*Math.random()) ).replace('.','');
};

Superlogica_Js_String.get_html_translation_table = function(table, quote_style) {
  //  discuss at: http://phpjs.org/functions/get_html_translation_table/
  // original by: Philip Peterson
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: noname
  // bugfixed by: Alex
  // bugfixed by: Marco
  // bugfixed by: madipta
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: T.Wild
  // improved by: KELAN
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: Frank Forte
  //    input by: Ratheous
  //        note: It has been decided that we're not going to add global
  //        note: dependencies to php.js, meaning the constants are not
  //        note: real constants, but strings instead. Integers are also supported if someone
  //        note: chooses to create the constants themselves.
  //   example 1: get_html_translation_table('HTML_SPECIALCHARS');
  //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

  var entities = {},
    hash_map = {},
    decimal;
  var constMappingTable = {},
    constMappingQuoteStyle = {};
  var useTable = {},
    useQuoteStyle = {};

  // Translate arguments
  constMappingTable[0] = 'HTML_SPECIALCHARS';
  constMappingTable[1] = 'HTML_ENTITIES';
  constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
  constMappingQuoteStyle[2] = 'ENT_COMPAT';
  constMappingQuoteStyle[3] = 'ENT_QUOTES';

  useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
  useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() :
    'ENT_COMPAT';

  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
    throw new Error('Table: ' + useTable + ' not supported');
    // return false;
  }

  entities['38'] = '&amp;';
  if (useTable === 'HTML_ENTITIES') {
    entities['160'] = '&nbsp;';
    entities['161'] = '&iexcl;';
    entities['162'] = '&cent;';
    entities['163'] = '&pound;';
    entities['164'] = '&curren;';
    entities['165'] = '&yen;';
    entities['166'] = '&brvbar;';
    entities['167'] = '&sect;';
    entities['168'] = '&uml;';
    entities['169'] = '&copy;';
    entities['170'] = '&ordf;';
    entities['171'] = '&laquo;';
    entities['172'] = '&not;';
    entities['173'] = '&shy;';
    entities['174'] = '&reg;';
    entities['175'] = '&macr;';
    entities['176'] = '&deg;';
    entities['177'] = '&plusmn;';
    entities['178'] = '&sup2;';
    entities['179'] = '&sup3;';
    entities['180'] = '&acute;';
    entities['181'] = '&micro;';
    entities['182'] = '&para;';
    entities['183'] = '&middot;';
    entities['184'] = '&cedil;';
    entities['185'] = '&sup1;';
    entities['186'] = '&ordm;';
    entities['187'] = '&raquo;';
    entities['188'] = '&frac14;';
    entities['189'] = '&frac12;';
    entities['190'] = '&frac34;';
    entities['191'] = '&iquest;';
    entities['192'] = '&Agrave;';
    entities['193'] = '&Aacute;';
    entities['194'] = '&Acirc;';
    entities['195'] = '&Atilde;';
    entities['196'] = '&Auml;';
    entities['197'] = '&Aring;';
    entities['198'] = '&AElig;';
    entities['199'] = '&Ccedil;';
    entities['200'] = '&Egrave;';
    entities['201'] = '&Eacute;';
    entities['202'] = '&Ecirc;';
    entities['203'] = '&Euml;';
    entities['204'] = '&Igrave;';
    entities['205'] = '&Iacute;';
    entities['206'] = '&Icirc;';
    entities['207'] = '&Iuml;';
    entities['208'] = '&ETH;';
    entities['209'] = '&Ntilde;';
    entities['210'] = '&Ograve;';
    entities['211'] = '&Oacute;';
    entities['212'] = '&Ocirc;';
    entities['213'] = '&Otilde;';
    entities['214'] = '&Ouml;';
    entities['215'] = '&times;';
    entities['216'] = '&Oslash;';
    entities['217'] = '&Ugrave;';
    entities['218'] = '&Uacute;';
    entities['219'] = '&Ucirc;';
    entities['220'] = '&Uuml;';
    entities['221'] = '&Yacute;';
    entities['222'] = '&THORN;';
    entities['223'] = '&szlig;';
    entities['224'] = '&agrave;';
    entities['225'] = '&aacute;';
    entities['226'] = '&acirc;';
    entities['227'] = '&atilde;';
    entities['228'] = '&auml;';
    entities['229'] = '&aring;';
    entities['230'] = '&aelig;';
    entities['231'] = '&ccedil;';
    entities['232'] = '&egrave;';
    entities['233'] = '&eacute;';
    entities['234'] = '&ecirc;';
    entities['235'] = '&euml;';
    entities['236'] = '&igrave;';
    entities['237'] = '&iacute;';
    entities['238'] = '&icirc;';
    entities['239'] = '&iuml;';
    entities['240'] = '&eth;';
    entities['241'] = '&ntilde;';
    entities['242'] = '&ograve;';
    entities['243'] = '&oacute;';
    entities['244'] = '&ocirc;';
    entities['245'] = '&otilde;';
    entities['246'] = '&ouml;';
    entities['247'] = '&divide;';
    entities['248'] = '&oslash;';
    entities['249'] = '&ugrave;';
    entities['250'] = '&uacute;';
    entities['251'] = '&ucirc;';
    entities['252'] = '&uuml;';
    entities['253'] = '&yacute;';
    entities['254'] = '&thorn;';
    entities['255'] = '&yuml;';
  }

  if (useQuoteStyle !== 'ENT_NOQUOTES') {
    entities['34'] = '&quot;';
  }
  if (useQuoteStyle === 'ENT_QUOTES') {
    entities['39'] = '&#39;';
  }
  entities['60'] = '&lt;';
  entities['62'] = '&gt;';

  // ascii decimals to real symbols
  for (decimal in entities) {
    if (entities.hasOwnProperty(decimal)) {
      hash_map[String.fromCharCode(decimal)] = entities[decimal];
    }
  }

  return hash_map;
};

Superlogica_Js_String.html_entity_decode = function(string, quote_style) {
  //  discuss at: http://phpjs.org/functions/html_entity_decode/
  // original by: john (http://www.jd-tech.net)
  //    input by: ger
  //    input by: Ratheous
  //    input by: Nick Kolosov (http://sammy.ru)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: marc andreu
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Fox
  //  depends on: get_html_translation_table
  //   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
  //   returns 1: 'Kevin & van Zonneveld'
  //   example 2: html_entity_decode('&amp;lt;');
  //   returns 2: '&lt;'

  var hash_map = {},
    symbol = '',
    tmp_str = '',
    entity = '';
  tmp_str = string.toString();

  if (false === (hash_map = Superlogica_Js_String.get_html_translation_table('HTML_ENTITIES', quote_style))) {
    return false;
  }

  // fix &amp; problem
  // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
  delete(hash_map['&']);
  hash_map['&'] = '&amp;';

  for (symbol in hash_map) {
    entity = hash_map[symbol];
    tmp_str = tmp_str.split(entity)
      .join(symbol);
  }
  tmp_str = tmp_str.split('&#039;')
    .join("'");

  return tmp_str;
};

Superlogica_Js_String.strip_tags = function(input, allowed) {
  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
};

Superlogica_Js_String.toAttrId = function(texto){
  var value = texto;
  var replace = '_';
                
  var trans = {
    '[¬¿¡ƒ√]' : 'A',
    '[‚„‡·‰]' : 'a',
    '[ »…À]'  : 'E',
    '[ÍËÈÎ]'  : 'e',
    '[ŒÕÃœ]'  : 'I',
    '[ÓÌÏÔ]'  : 'i',
    '[‘’“”÷]' : 'O',
    '[ÙıÚÛˆ]' : 'o',
    '[€Ÿ⁄‹]'  : 'U',
    '[˚˙˘¸]'  : 'u',
    'Á'       : 'c',
    '«'       : 'C' ,           
  };

  trans['\\s+'] = replace;
  trans['[^a-z0-9'+replace+']'] = '';
  trans[replace+'+'] = replace;
  trans[replace+'$'] = '';
  trans['^'+replace] = '';

  value = Superlogica_Js_String.strip_tags( value.toLowerCase() );
  var regExp;  
  Object.each(trans, function(val, key){
    regExp = new RegExp(key,'g');
    value = value.replace( regExp, val);
  });

  return jQuery.trim(Superlogica_Js_String.stripslashes(value));
};

Superlogica_Js_String.stripslashes = function(str) {
  return (str + '')
    .replace(/\\(.?)/g, function(s, n1) {
      switch (n1) {
        case '\\':
          return '\\';
        case '0':
          return '\u0000';
        case '':
          return '';
        default:
          return n1;
      }
    });
};
