/**
 *
 * Utilizado para formatar campo como moeda
 *
 */
var Superlogica_Js_Currency = new Class({

    /**
     * Prefixo do valor formatado
     */
    currencyPrefix : 'R$',

    /**
     * Delimitador das casas decimais
     */
    currencyDelimiter : ',',

    /**
     * Retorna o valor no formato Currency -> 1.000,00
     * @param currency valor
     */
    toString : function( valor, casasDecimais, autoAcrescentarZeros ){

        var sinal = '';
        if ( valor < 0) {
            sinal = '-';
            valor = Math.abs(valor);
        }

        if ( isNaN( valor ) ){
            valor = "0";
        }
        
        var cents = Math.floor( ( valor * 100 + 0.5 ) % 100 );        
        if ( casasDecimais > 0 ){
            cents = '00';
            if ( valor.toString().indexOf('.') !== -1 ){
                cents = valor.toString().replace(/^[0-9]{1,}\./,'');
                cents = '0.'+cents.replace('.','');
                cents = Superlogica_Js_Currency.round( cents, casasDecimais );
                cents = (cents).toString().replace('0.','');
            }
            if ( autoAcrescentarZeros && cents.length < autoAcrescentarZeros ){                
                for( var x=0, centsLength = cents.length; x < autoAcrescentarZeros-centsLength ;x++){
                    cents = cents.toString()+'0';
                }
            }
        } else if (cents < 10){
            cents = "0" + cents;
        }
        valor = Math.floor( ( valor * 100 + 0.5 ) / 100 ).toString();

        
        for (var i = 0; i < Math.floor( ( valor.length-( 1 + i ) ) / 3 ); i++ ){
            valor = valor.substring( 0, valor.length-( 4 * i + 3 ) ) + '.'
                   +valor.substring( valor.length -( 4 * i + 3 ) );
        }

        return sinal + valor + ',' + cents;

    },


    /**
     * Retorna o valor no formato float -> 1,000.00
     * @param currency valor
     */
    toJson : function( valor, forceInt ){
        
        valor = parseFloat( new String( valor ).replace(/\./g,'').replace(/\,/g,'.') );
        if ( isNaN(valor) ){
            valor = forceInt ? 0 : "";
        }
        return valor;
    },


    /**
     * Retorna um valor formatado, cria classe específica para valor positivo ou negativo
     */
    toHtml : function( valor, destaque ){
        var valorFormatado = this.toString( valor );
        if (destaque){
            var retorno = valorFormatado.split(',');
            valorFormatado = "<span class='inteiro'>"+retorno['0']+"</span><span class='centavos'>,"+retorno['1']+"</span>";
        }
        
        if ( (typeof valor != 'undefined') && (valor.toFloat() < 0) ){
            return "<span class='numeric negativo'>"+valorFormatado+"</span>";
        }        
        return "<span class='numeric positivo'>"+valorFormatado+"</span>";        
    }    

});

Superlogica_Js_Currency.number_format = function(number, decimals, dec_point, thousands_sep){
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://getsprink.com)
    // +     bugfix by: Benjamin Lupton
    // +     bugfix by: Allan Jensen (http://www.winternet.no)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +     bugfix by: Howard Yeend
    // +    revised by: Luke Smith (http://lucassmith.name)
    // +     bugfix by: Diogo Resende
    // +     bugfix by: Rival
    // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
    // +   improved by: davook
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Jay Klehr
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Amir Habibi (http://www.residence-mixte.com/)
    // +     bugfix by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +      input by: Amirouche
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: number_format(1234.56);
    // *     returns 1: '1,235'
    // *     example 2: number_format(1234.56, 2, ',', ' ');
    // *     returns 2: '1 234,56'
    // *     example 3: number_format(1234.5678, 2, '.', '');
    // *     returns 3: '1234.57'
    // *     example 4: number_format(67, 2, ',', '.');
    // *     returns 4: '67,00'
    // *     example 5: number_format(1000);
    // *     returns 5: '1,000'
    // *     example 6: number_format(67.311, 2);
    // *     returns 6: '67.31'
    // *     example 7: number_format(1000.55, 1);
    // *     returns 7: '1,000.6'
    // *     example 8: number_format(67000, 5, ',', '.');
    // *     returns 8: '67.000,00000'
    // *     example 9: number_format(0.9, 0);
    // *     returns 9: '1'
    // *    example 10: number_format('1.20', 2);
    // *    returns 10: '1.20'
    // *    example 11: number_format('1.20', 4);
    // *    returns 11: '1.2000'
    // *    example 12: number_format('1.2000', 3);
    // *    returns 12: '1.200'
    // *    example 13: number_format('1 000,50', 2, '.', ' ');
    // *    returns 13: '100 050.00'
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
Superlogica_Js_Currency.round = function(value, precision, mode) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // +    revised by: Onno Marsman
  // +      input by: Greenseed
  // +    revised by: T.Wild
  // +      input by: meo
  // +      input by: William
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Josep Sanz (http://www.ws3.es/)
  // +    revised by: Rafa? Kukawski (http://blog.kukawski.pl/)
  // %        note 1: Great work. Ideas for improvement:
  // %        note 1:  - code more compliant with developer guidelines
  // %        note 1:  - for implementing PHP constant arguments look at
  // %        note 1:  the pathinfo() function, it offers the greatest
  // %        note 1:  flexibility & compatibility possible
  // *     example 1: round(1241757, -3);
  // *     returns 1: 1242000
  // *     example 2: round(3.6);
  // *     returns 2: 4
  // *     example 3: round(2.835, 2);
  // *     returns 3: 2.84
  // *     example 4: round(1.1749999999999, 2);
  // *     returns 4: 1.17
  // *     example 5: round(58551.799999999996, 2);
  // *     returns 5: 58551.8
  var m, f, isHalf, sgn; // helper variables
  precision |= 0; // making sure precision is integer
  m = Math.pow(10, precision);
  value *= m;
  sgn = (value > 0) | -(value < 0); // sign of the number
  isHalf = value % 1 === 0.5 * sgn;
  f = Math.floor(value);

  if (isHalf) {
    switch (mode) {
    case 'PHP_ROUND_HALF_DOWN':
      value = f + (sgn < 0); // rounds .5 toward zero
      break;
    case 'PHP_ROUND_HALF_EVEN':
      value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
      break;
    case 'PHP_ROUND_HALF_ODD':
      value = f + !(f % 2); // rounds .5 towards the next odd integer
      break;
    default:
      value = f + (sgn > 0); // rounds .5 away from zero
    }
  }

  return (isHalf ? value : Math.round(value)) / m;
}