var Superlogica_Js_Utf8 = {

    /**
     * Codifica uma string
     *
     * @param string|object valor
     * @return string|object
     */
    encode : function( valor ){
        Object.each( valor, function( value, chave ){
            valor[chave] = typeof value == 'object' ? Superlogica_Js_Utf8.encode(value) : encodeURIComponent(value);
        }, this );
        return valor;
    },

    /**
     * Decodificada uma string codificada por encodeURI
     * 
     * @param string|object valor
     * @return string|object
     */
    decode : function( valor ){
        Object.each( valor, function( value, chave ){
            valor[chave] = typeof value == 'object' ? Superlogica_Js_Utf8.decode(value) : decodeURIComponent(value);
        }, this );
        return valor;
    }

};