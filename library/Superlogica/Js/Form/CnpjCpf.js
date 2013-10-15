/**
 * Manipulação para CnpjCpf 
 *
 * @author Saylor Damasceno
 */
var Superlogica_Js_CpfCnpj = new Class({
    
    /**
     * Guarda a string ja limpa
     * @var string
     */
    _doc : '',
    
    /**
     * Guarda o tipo de documento a que a string se refere
     * @var string
     */
    _tipo : '',

    /**
     * Recebe a string e um tipo opcional
     * @param string string
     * @param string tipo
     * @return Superlogica_CnpjCpf 
     */
    create : function( string,tipo){
        this._doc = string;
        
        this.docLimpar();
        
        this._tipo = tipo ? tipo : 'AUTO';

        return this;        

    },
    
    
    /**
     * @return string com mascara referente ao tipo da mesma
     */
    toRaw : function (){
        var doc = this._doc;
        if(this._tipo == 'AUTO') this._cpfOrCnpj();

        if(this._tipo == 'CPF'){
            //Coloca um ponto entre o terceiro e o quarto dígitos
            doc = doc.replace(/(\d{3})(\d)/,"$1.$2");

            //Coloca um ponto entre o sexto e o quarto dígitos
            doc = doc.replace(/(\d{3})(\d)/,"$1.$2");

            //Coloca um hífen entre o terceiro e o quarto dígitos
            doc = doc.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
            
            return doc;
        }else if(this._tipo == 'CNPJ'){
            //Coloca ponto entre o segundo e o terceiro dígitos
            doc = doc.replace(/^(\d{2})(\d)/,"$1.$2");

            //Coloca ponto entre o quinto e o sexto dígitos
            doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");

            //Coloca uma barra entre o oitavo e o nono dígitos
            doc = doc.replace(/\.(\d{3})(\d)/,".$1/$2");

            //Coloca um hífen depois do bloco de quatro dígitos
            doc = doc.replace(/(\d{4})(\d)/,"$1-$2");

        }else{
            doc = '';
        }

        return doc;
    },
    
    /**
     * @return o documento
     */
    toString : function(){
        return this._doc;
    },
    
    /**
     * @return o tipo de documento
     */    
    getTipoDocumento : function(){
        var result;
        this._cpfOrCnpj();
        
        if(this._tipo == 'CPF')
            result = 1;
        else if(this._tipo == 'CNPJ')
            result = 2;
        else
            result = 0;//nenhum dos dois
        
        return result;
    },
    
    /**
     * Verifica se o documento é um cnpj valido
     */
    cnpjValido : function(){
        return this._validarCnpj();
    },
    
    /**
     * Verifica se o documento é um cpf valido
     */
    cpfValido : function(){
        return this._validarCpf();
    },
    
    /**
     * Verifica se o documento é valido
     */
    docValido : function(){
        return this._validarDoc();
    },
    
    /**
     * Tira os caracteres especiais de um CNPJ
     * @return CNPJ sem os caracteres especiais.
     */
    cnpjLimpar : function(){
        return this._doc.replace(/[^0-9]/img, '');
    },
    
    /**
     * Tira os caracteres especiais de um CNPJ
     * @return CPF sem os caracteres especiais.
     */
    cpfLimpar : function(){
        return this._doc.replace(/[^0-9]/img, '');
    },

    /**
     * Tira os caracteres especiais do documento
     * @return _doc sem os caracteres especiais.
     */
    docLimpar : function(){
        return this._doc.replace(/[^0-9]/img, '');
    },
    
    /**
     * Tenta identificar o tipo de documento que a string se refere
     */
    _cpfOrCnpj : function(){
        if(this._doc.length == 11)
            this._tipo = 'CPF';
        else if(this._doc.length == 14)
            this._tipo = 'CNPJ';
        
        return this;
    },    

    _validarCnpj : function(){
        var cnpj = this.cnpjLimpar();

        if  ( (cnpj=='11111111111111')||(cnpj=='22222222222222')
            ||(cnpj=='33333333333333')||(cnpj=='44444444444444')
            ||(cnpj=='55555555555555')||(cnpj=='66666666666666')
            ||(cnpj=='77777777777777')||(cnpj=='88888888888888')
            ||(cnpj=='99999999999999')||(cnpj=='00000000000000')){

            return false;
        }

        if( (cnpj.length != 14) || (isNaN(cnpj)) ) return false;

        var j = 5;
        var k = 6;
        var i;
        var soma1 = 0;
        var soma2 = 0;

        for (i = 0; i < 13; i++){
            j = j == 1 ? 9 : j;
            k = k == 1 ? 9 : k;
            soma2 += (cnpj[i] * k);
            if (i < 12)  soma1 += (cnpj[i] * j);
            k--;
            j--;
        }

        var digito1 = ((soma1 % 11) < 2) ? 0 : 11 - soma1 % 11;
        var digito2 = ((soma2 % 11) < 2) ? 0 : 11 - soma2 % 11;

        return ( (cnpj[12] == digito1) && (cnpj[13] == digito2) );
    },
    
    _validarCpf : function(){
        var cpf = this.cpfLimpar();
        if( cpf.length != 11 
                || cpf == '00000000000'
                || cpf == '11111111111'
                || cpf == '22222222222'
                || cpf == '33333333333'
                || cpf == '44444444444'
                || cpf == '55555555555'
                || cpf == '66666666666'
                || cpf == '77777777777'
                || cpf == '88888888888'
                || cpf == '99999999999'){
            return false;
        }else{
            var t;
            var d;
            var c;
            for (t = 9; t < 11; t++) {
                for (d = 0, c = 0; c < t; c++) {
                    d += cpf[c] * ((t + 1) - c);
                }
                d = ((10 * d) % 11) % 10;
                if (cpf[c] != d) {
                    return false;
                }
            }

            return true;
        }
    },
    
    _validarDoc : function(){
        if(this._validarCnpj() || this._validarCpf() )
            return true;
        else
            return false;
    }
});