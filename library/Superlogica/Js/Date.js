/**
 *
 * Classe responsavel por formatações e tratamentos de datas
 *
 */
var Superlogica_Js_Date = new Class({

    /**
     * Expressão regular para timestamp
     * @var string
     */
    regexTimestamp : /^[0-9]{1,}$/,

    /**
     * Expressão regular para formato MySql
     * @var string
     */
    regexDataMySql :/([0-9]{2,4})-([0-9]{1,2})-([0-9]{1,2})( ([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}))?/,

    /**
     * A data a ser manipulada
     * Padrão a data de agora
     * @var Date
     */
    //_data : new Date(),

    /**
     * Timestamp da data manipulada
     * @var integer
     */
    timestamp : null,
   
    _opcoes : {
        'selecionarAnual' : true,
        'selecionarPeriodo' : true,
        'selecionarMensal' : true
    },

    _invalid : false,

    /**
     * Construtor
     * 
     * @param string OPICIONAL data Data a ser manipulada na classe
     */
    initialize : function( data, formato ){
        this.setData( data, formato );
    },

    /**
     * Seta data na classe
     * 
     * @param mixed data
     * @param string formato Formato da data passada.
     */
    setData : function( data, formato ){
        
        if ( instanceOf( data, Date) || !data ){
            
            var dataAgora = instanceOf( data, Date) ? data : new Date();
            this.setTimestamp( Superlogica_Js_Date.mktime( dataAgora.getHours(), dataAgora.getMinutes(), dataAgora.getSeconds(), dataAgora.getMonth()+1, dataAgora.getDate(), dataAgora.getFullYear()) );
            return true;
            
        }else if ( instanceOf(data, Superlogica_Js_Date) ){

            this.setTimestamp(data.timestamp);
            return true;

        }else if ( this.regexTimestamp.test(data) ){
            
            this.setTimestamp(data);
            return true;

        }else if ( this.regexDataMySql.test(data) && !formato ){

            var dataMysql = data.match( this.regexDataMySql );
            if( dataMysql.length == 8 && dataMysql[4] != null )
                formato = 'Y-m-d h:i:s';
            else if( dataMysql[4] == null )
                formato = 'Y-m-d';

        }
        
        if (!formato && data.length <= 10 )
            formato = 'm/d/Y';
        else if ( !formato && data.length > 10 )
            formato = 'm/d/Y h:i:s';
        
        var timestamp = Superlogica_Js_Date._createFromFormat(data, formato);
        
        this._invalid = !timestamp;
        
        this.setTimestamp( timestamp );
        
    },

    /**
     * Seta data na classe
     * @param integer dia
     */
    setDia : function( dia ){
        if ( !isNaN(parseInt(dia)) ){
            /*this._data.setDate( dia );
            this._dateChanged();*/
            this.setTimestamp( Superlogica_Js_Date.mktime( this.getHora(), this.getMinuto(), this.getSegundo(), this.getMes(), dia, this.getAno() ) );
        }
        return this;
    },

    /**
     * Seta data na classe
     * @param integer mes
     */
    setMes : function(mes){
        if ( !isNaN(parseInt(mes)) ){
//            this._data.setMonth( mes );
//            this._dateChanged();
            this.setTimestamp( Superlogica_Js_Date.mktime( this.getHora(), this.getMinuto(), this.getSegundo(), mes, this.getDia(), this.getAno() ) );
        }
        return this;
    },

    /**
     * Seta data na classe
     * @param integer ano
     */
    setAno : function(ano){
        if ( !isNaN(parseInt(ano)) ){
//            this._data.setFullYear( ano );
//            this._dateChanged();
            this.setTimestamp( Superlogica_Js_Date.mktime( this.getHora(), this.getMinuto(), this.getSegundo(), this.getMes(), this.getDia(), ano ) );
        }
        return this;
    },

    /**
     * Seta data na classe
     * @param integer hora
     */
    setHora : function(hora){
        if ( !isNaN(parseInt(hora)) ){
//            this._data.setHours( hora );
//            this._dateChanged();
            this.setTimestamp( Superlogica_Js_Date.mktime( hora, this.getMinuto(), this.getSegundo(), this.getMes(), this.getDia(), this.getAno() ) );
        }
        return this;
    },

    /**
     * Seta data na classe
     * @param integer minuto
     */
    setMinuto : function(minuto){        
        if ( !isNaN(parseInt(minuto)) ){
//            this._data.setMinutes( minuto );
//            this._dateChanged();
            this.setTimestamp( Superlogica_Js_Date.mktime( this.getHora(), minuto, this.getSegundo(), this.getMes(), this.getDia(), this.getAno() ) );
        }
        return this;
    },

    /**
     * Seta data na classe
     * @param integer segundo
     */
    setSegundo : function(segundo){
        if ( !isNaN(parseInt(segundo)) ){
//            this._data.setSeconds( segundo );
//            this._dateChanged();
            this.setTimestamp( Superlogica_Js_Date.mktime( this.getHora(), this.getMinuto(), segundo, this.getMes(), this.getDia(), this.getAno() ) );
        }
        return this;
    },

    /**
     * Retorna o dia do mes de 1-31
     * @return integer
     */
    getDia : function(){
        return parseInt( Superlogica_Js_Date.date( 'd', this.timestamp ), 10 );
        //return this._data.getDate();
    },

    /**
     * Retorna o mes de 0-11
     * @return integer
     */
    getMes : function(){
        return parseInt( Superlogica_Js_Date.date( 'm', this.timestamp ), 10 );
        //return this._data.getMonth();
    },

    /**
     * Retorna o ano com 4 digitos
     * @return integer
     */
    getAno : function(){
        return parseInt( Superlogica_Js_Date.date( 'Y', this.timestamp ) );
        //return this._data.getFullYear();
    },

    /**
     *  Retorna a hora de 0-23
     *  @return integer
     */
    getHora : function(){
        return parseInt( Superlogica_Js_Date.date( 'H', this.timestamp ) );
    },

    /**
     * Retorna os minutos de 0-59
     * @return integer
     */
    getMinuto : function(){
        return parseInt( Superlogica_Js_Date.date( 'i', this.timestamp ) );
    },

    /**
     * Retorna os segundos de 0-59
     * @return integer
     */
    getSegundo : function(){
        return parseInt( Superlogica_Js_Date.date( 's', this.timestamp ) );
    },

    /**
     * Retorna a diferença de dias da data atual para data informada
     * 
     * @param Superlogica_Js_Date date
     * @return integer
     */
    daysBetween : function( date ){

        var dif = date.timestamp - this.timestamp;
        return parseInt( dif / (60*60*24) );
    },
    
    /**
     * Retorna diferença de meses entre 2 datas
     * @param {type} date
     * @returns {unresolved}
     */
    monthsBetween: function(date) {
        var diasEntre = this.daysBetween(date);
        return parseInt(diasEntre / (30.4375));
    },
    
    weeksBetween : function( date ){
        
        var diasEntre = this.daysBetween( date );
        
        if ( diasEntre >= 0){
            
            var diaSemanaThis = parseInt( this.toString("w") );

            var nmSemanas = 0;
            if ( diasEntre > 7 )
                nmSemanas = diasEntre / 7;
            
            if ( diaSemanaThis + diasEntre > 7)
                nmSemanas++;
            
            if (nmSemanas > parseInt( nmSemanas ))
                nmSemanas = parseInt( nmSemanas ) + 1;
            
            return nmSemanas;
        }
    },

    /**
     * Seta informações atraves de um array
     * @param object arrayData
     */
    setFromArray : function( arrayData ){

        this.setDia( arrayData['dia'] );
        this.setMes( arrayData['mes'] );
        this.setAno( arrayData['ano'] );

        this.setHora( arrayData['hora'] );
        this.setMinuto( arrayData['minuto'] );
        this.setSegundo( arrayData['segundo'] );

    },

    /**
     * Seta o timestamp na classe
     * @param integer timestamp
     */
    setTimestamp : function( timestamp ){
        if ( timestamp )
            this.timestamp = timestamp;
    },
    
    /**
     * Altera a data da classe de acordo com a string informada
     * @param string stringTo
     */
    _changeDate : function( stringTo ){
        this.setTimestamp( this.strtotime( stringTo, this.timestamp ) );
    },

    /**
     * Adiciona uma quantidade de dias a data da classe
     * @param quantDias
     */
    adicionarDias : function( quantDias ){
        quantDias = parseInt( quantDias );
        this._changeDate( '+' + quantDias + ' day' );
    },

    /**
     * Adiciona uma quantidade de meses a data da classe
     * @param quantMeses
     */
    adicionarMeses : function( quantMeses ){

        quantMeses = parseInt( quantMeses );
        if (isNaN(quantMeses) ) return false;
        var day = parseInt( this.toString('d') );
        day--;
        this._changeDate( '-' + day+ ' day' );
        this._changeDate( '+' + quantMeses+ ' month' );
        var lastDay = parseInt( this.toString('t') );
        day++;
        day = (lastDay < day) ? lastDay : day;
        day--;

        this._changeDate( '+' + day+ ' day' );
        return true;
    },

    /**
     * Adiciona uma quantidade de anos a data da classe
     * @param quantAnos
     */
    adicionarAnos : function( quantAnos ){
        
        quantAnos = parseInt( quantAnos );
        if (isNaN(quantAnos) ) return false;
        var day = parseInt( this.toString('d') );
        day--;
        this._changeDate( '-' + day+ ' day' );
        this._changeDate( '+' + quantAnos+ ' year' );
        var lastDay = parseInt( this.toString('t') );
        day++;
        day = (lastDay < day) ? lastDay : day;
        day--;

        this._changeDate( '+' + day+ ' day' );
        return true;
    },

    /**
     * Subtrai uma quantidade de dias a data da classe
     * @param quantAnos
     */
    subtrairDias : function( quantDias ){
        quantDias = parseInt( quantDias );
        this._changeDate( '-' + quantDias+ ' day' );
    },

    /**
     * Subtrai uma quantidade de meses a data da classe
     * @param quantAnos
     */
    subtrairMeses : function( quantMeses ){
          this.adicionarMeses(-quantMeses);
    },

    /**
     * Subtrai uma quantidade de anos a data da classe
     * @param quantAnos
     */
    subtrairAnos : function( quantAnos ){
        this.adicionarAnos(-quantAnos);       
    },

    /**
     * Retorna a data no formato de string
     * @param string format
     */
    toString : function(format){
        if ( !format ){
            format = 'd/m/Y';
        }
        
        return Superlogica_Js_Date.date(format, this.timestamp);
    },

    /**
     * Mesma funcionalidado do strototime do PHP
     * ( http://php.net/manual/en/function.strtotime.php )
     */
    strtotime : function (str, now) {
        // http://kevin.vanzonneveld.net
        // +   original by: Caio Ariede (http://caioariede.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: David
        // +   improved by: Caio Ariede (http://caioariede.com)
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Wagner B. Soares
        // +   bugfixed by: Artur Tchernychev
        // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
        // *     example 1: strtotime('+1 day', 1129633200);
        // *     returns 1: 1129719600
        // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
        // *     returns 2: 1130425202
        // *     example 3: strtotime('last month', 1129633200);
        // *     returns 3: 1127041200
        // *     example 4: strtotime('2009-05-04 08:30:00');
        // *     returns 4: 1241418600
        var i, match, s, strTmp = '',
        parse = '';

        strTmp = str;
        strTmp = strTmp.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
        strTmp = strTmp.replace(/[\t\r\n]/g, ''); // unecessary chars
        if (strTmp == 'now') {
            return (new Date()).getTime() / 1000; // Return seconds, not milli-seconds
        } else if (!isNaN(parse = Date.parse(strTmp))) {
            return (parse / 1000);
        } else if (now) {
            now = new Date(now * 1000); // Accept PHP-style seconds
        } else {
            now = new Date();
        }

        strTmp = strTmp.toLowerCase();

        var __is = {
            day: {
                'sun': 0,
                'mon': 1,
                'tue': 2,
                'wed': 3,
                'thu': 4,
                'fri': 5,
                'sat': 6
            },
            mon: {
                'jan': 0,
                'feb': 1,
                'mar': 2,
                'apr': 3,
                'may': 4,
                'jun': 5,
                'jul': 6,
                'aug': 7,
                'sep': 8,
                'oct': 9,
                'nov': 10,
                'dec': 11
            }
        };

        var process = function (m) {
            var ago = (m[2] && m[2] == 'ago');
            var num = (num = m[0] == 'last' ? -1 : 1) * (ago ? -1 : 1);

            switch (m[0]) {
                case 'last':
                case 'next':
                    switch (m[1].substring(0, 3)) {
                        case 'yea':
                            now.setUTCFullYear(now.getUTCFullYear() + num);
                            break;
                        case 'mon':
                            now.setUTCMonth(now.getUTCMonth() + num);
                            break;
                        case 'wee':
                            now.setUTCDate(now.getUTCDate() + (num * 7));
                            break;
                        case 'day':
                            now.setUTCDate(now.getUTCDate() + num);
                            break;
                        case 'hou':
                            now.setUTCHours(now.getUTCHours() + num);
                            break;
                        case 'min':
                            now.setUTCMinutes(now.getUTCMinutes() + num);
                            break;
                        case 'sec':
                            now.setUTCSeconds(now.getUTCSeconds() + num);
                            break;
                        default:
                            var day;
                            if (typeof(day = __is.day[m[1].substring(0, 3)]) != 'undefined') {
                                var diff = day - now.getUTCDay();
                                if (diff == 0) {
                                    diff = 7 * num;
                                } else if (diff > 0) {
                                    if (m[0] == 'last') {
                                        diff -= 7;
                                    }
                                } else {
                                    if (m[0] == 'next') {
                                        diff += 7;
                                    }
                                }
                                now.setUTCDate(now.getUTCDate() + diff);
                            }
                    }
                    break;

                default:
                    if (/\d+/.test(m[0])) {
                        num *= parseInt(m[0], 10);

                        switch (m[1].substring(0, 3)) {
                            case 'yea':
                                now.setUTCFullYear(now.getUTCFullYear() + num);
                                break;
                            case 'mon':
                                now.setUTCMonth(now.getUTCMonth() + num);
                                break;
                            case 'wee':
                                now.setUTCDate(now.getUTCDate() + (num * 7));
                                break;
                            case 'day':
                                now.setUTCDate(now.getUTCDate() + num);
                                break;
                            case 'hou':
                                now.setUTCHours(now.getUTCHours() + num);
                                break;
                            case 'min':
                                now.setUTCMinutes(now.getUTCMinutes() + num);
                                break;
                            case 'sec':
                                now.setUTCSeconds(now.getUTCSeconds() + num);
                                break;
                        }
                    } else {
                        return false;
                    }
                    break;
            }
            return true;
        };

        match = strTmp.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
        if (match != null) {
            if (!match[2]) {
                match[2] = '00:00:00';
            } else if (!match[3]) {
                match[2] += ':00';
            }

            s = match[1].split(/-/g);

            for (i in __is.mon) {
                if (__is.mon[i] == s[1] - 1) {
                    s[1] = i;
                }
            }
            s[0] = parseInt(s[0], 10);

            s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
            return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
        }

        var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';

        match = strTmp.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
        if (match == null) {
            return false;
        }

        for (i = 0; i < match.length; i++) {
            if (!process(match[i].split(' '))) {
                return false;
            }
        }

        return (now.getTime() / 1000);
    },


    /**
     * Compara 2 datas.
     *
     * @param data1 Superlogica_Js_Date data;
     * @param data2 Superogica_Js_Date data;
     * @return true se data1 maior que data2, false se data2 maior que data1, -1 se forem iguais
     */
    comparar : function( data2){
        var data1 = this.timestamp;
        data2 = data2.timestamp;
        if (data1 == data2 ){
            return 0;
        }else if (data1 > data2){
            return 1;
        }else{
            return -1;
        }
    },
    /**
     * Cria opção de selecionar data com 2 calendários
     */
    _criarSelecaoPeriodo : function ( elementoAlvo, dataInicial, dataFinal ){

        var options = {
            "showOtherMonths" : true,
            "selectOtherMonths" : true,
            "changeMonth": true,
            "changeYear": true,
            "formatDate": 'dd-mm-yy',
            'yearRange' : 'c-6:c+2'
        };

        options['defaultDate'] = new Date( dataInicial.toString('m/d/Y h:i:s') );
        var calendarioInicio = new Superlogica_Js_Elemento('<div></div>').datepicker(options).atributo('class','dtInicio');

        options['defaultDate'] = new Date( dataFinal.toString('m/d/Y h:i:s') );
        var calendarioFim = new Superlogica_Js_Elemento('<div></div>').datepicker(options).atributo('class','dtFim');

        elementoAlvo.adicionarHtmlAoFinal( calendarioInicio )
        .adicionarHtmlAoFinal( calendarioFim )
        .atributo('selecionando','periodo');
    },

    /**
     * Cria opção de selecionar data mensal
     */
    _criarSelecaoMensal : function ( elementoAlvo, data ){
        
        var calendarioMensal = new Superlogica_Js_Elemento('<div></div>')
        .datepicker({
            "changeMonth": true,
            "changeYear": true,
            "dateFormat": 'MM yy',
            'yearRange' : 'c-6:c+2',
            'defaultDate' :  new Date( data.toString('m/01/Y') )
        }).atributo('class','calendarioMensal');
        elementoAlvo
        .adicionarHtmlAoFinal( calendarioMensal )
        .atributo('selecionando','mensal');
    },

    /**
     * Cria opção de selecionar data anual
     */
    _criarSelecaoAnual : function ( elementoAlvo ){

        var calendarioAnual = new Superlogica_Js_Elemento('<div></div>')
        .datepicker({
            "changeYear": true,
            "dateFormat": 'yy',
            "stepMonths" : 12,
            'yearRange' : 'c-6:c+2'
        }).atributo('class','calendarioAnual');
        elementoAlvo
        .adicionarHtmlAoFinal( calendarioAnual )
        .atributo('selecionando','anual');
    },

    /**
     * Cria opção de selecionar data anual
     */
    _criarSelecaoDia : function ( elementoAlvo, dataPadrao ){

        var calendarioDia = new Superlogica_Js_Elemento('<div></div>')
        .datepicker({
            "showOtherMonths" : true,
            "selectOtherMonths" : true,
            "changeMonth": true,
            "changeYear": true,
            "formatDate": 'dd-mm-yy',
            'yearRange' : 'c-6:c+2',
            'defaultDate' : new Date( dataPadrao.toString('m/d/Y h:i:s') )
        }).atributo('class','calendarioDia');
        elementoAlvo
        .adicionarHtmlAoFinal( calendarioDia )
        .atributo('selecionando','dia');
    },

    selecionarDia : function (dataPadrao, callback, opcoes){

        if (typeof dataPadrao == "undefined")dataPadrao = new Superlogica_Js_Date();

        this.setOptions(opcoes);
        var botoes = [];
        var elemento = new Superlogica_Js_Elemento('<div class="selecionarDia">\
                        <ul class="selecionarDatasMenuItem"></ul>\
                    <div class="selecionarDatasContainer clearFix" ></div>\
                </div>');

        var containerData = elemento.encontrar('div.selecionarDatasContainer');

        this._criarSelecaoDia(containerData, dataPadrao);

        var botoesPadroes = this._criarBotoesPadroes( containerData, elemento, callback );
        elemento.adicionarHtmlAoFinal( botoesPadroes );

        elemento.dialogo({
            'modal' : true,
            'resizable' : false,
            'width' : 'auto',
            'minHeight' : 0,
            'title' : ( (opcoes!= null) && (opcoes['titulo'] ) ) ? opcoes['titulo'] : ''
        });

    },

    /**
      * Cria o div de selecionar as datas;
      *
      * @param <int> opcao -1: todos 0: Periodo, 1: mensal, 2: anual
      */
    selecionarPeriodo : function (dataInicial, dataFinal, callback, opcoes){        

        if (typeof dataInicial == "undefined"){
            dataInicial = new Superlogica_Js_Date();
            dataInicial.setDia(1);
        }else{
            dataInicial = new Superlogica_Js_Date(dataInicial);
        }        

        if (typeof dataFinal == "undefined"){
            dataFinal = new Superlogica_Js_Date();
            dataFinal.setDia( dataFinal.getUltimoDia() );
        }else{
            dataFinal = new Superlogica_Js_Date(dataFinal);
        }

        this.setOptions(opcoes);
        var botoes = [];
        var elemento = new Superlogica_Js_Elemento('<div class="selecionarDatas">\
                    <div class="selecionarDatasMenu clearFix">\
                        <ul class="selecionarDatasMenuItem"></ul>\
                    </div>\
                    <div class="selecionarDatasContainer clearFix" ><div class="opcaoEscolhida"></div></div>\
                </div>');
        var containerOpcao = elemento.encontrar('div.opcaoEscolhida');
        var containerData = elemento.encontrar('div.selecionarDatasContainer');

        if ( this._opcoes['selecionarPeriodo'] )botoes.push( this._criarBotaoSelecionarPeriodo() );
        if ( this._opcoes['selecionarMensal'] )botoes.push( this._criarBotaoSelecionarMensal() );
        if ( this._opcoes['selecionarAnual'] )botoes.push( this._criarBotaoSelecionarAnual() );

        var menu = elemento.encontrar('.selecionarDatasMenuItem');
        Object.each( botoes, function(botao){
            menu.adicionarHtmlAoFinal( botao );
        }, this);

        var referencia = this;
        menu.bind('click', function(evento){
            evento.preventDefault();
            var linkClicado = new Superlogica_Js_Elemento( evento.target );

            var tipo = linkClicado.atributo('tipo');
            if (typeof tipo == 'undefined') return false;
            var opcaoAtiva =  menu.encontrar('.opcaoAtiva')
            if (opcaoAtiva)opcaoAtiva.removerClasse('opcaoAtiva');
            linkClicado.maisProximo('li').adicionarClasse('opcaoAtiva');
            if ( containerOpcao.eh("[selecionando=" + tipo + "]") ) return false;
            containerOpcao.conteudo('');
            referencia['_criarSelecao'+tipo.capitalize()]( containerOpcao, dataInicial, dataFinal );
        });
        
        if ( ( dataInicial.toString('m/Y') == dataFinal.toString('m/Y') ) && (dataInicial.toString('d') == 1) && (dataFinal.toString('d') == dataFinal.getUltimoDia() ) ){            
            menu.encontrar('a[tipo="mensal"]').simularClique();
        }else if ( ( dataInicial.toString('d/m') == '01/01') && ( dataFinal.toString('d/m') == '31/12') && ( dataInicial.toString('Y') == dataFinal.toString('Y') ) ){            
            menu.encontrar('a[tipo="anual"]').simularClique();
        }else{
            menu.encontrar('li:first a').simularClique();
        }

        var botoesPadroes = this._criarBotoesPadroes( containerOpcao, elemento, callback );
        containerData.adicionarHtmlAoFinal( containerOpcao );
        containerData.adicionarHtmlAoFinal( botoesPadroes );

//        var left = opcoes['left'] ? opcoes['left'] : 'auto';
//        var top = opcoes['top'] ? opcoes['top'] : 'auto'
        elemento.dialogo({
            'modal' : true,
            'resizable' : false,
            'width' : 'auto',
            'minHeight' : 0
//            'position' : [left, top]
        });
    },

    /**
      * Criar os botões aplicar e cancelar
      */
    _criarBotoesPadroes : function ( elementoAlvo, elementoRemover, callback ){
        var btAplicar = new Superlogica_Js_Elemento('<input class="btn btn-primary" type="submit" name="btAplicar" value="Aplicar" >');
        var option = new Superlogica_Js_Elemento('<span> ou </span>');
        var linkCancelar = new Superlogica_Js_Elemento('<a href="javascript:void(0);" class="btCancelar">Cancelar</a>');

        var botoesRodape = new Superlogica_Js_Elemento('<div class="botoesRodape clearFix" />');

        linkCancelar.bind(
            'click',
            function(event){
                elementoRemover.remover();
            }
            );

        btAplicar.bind('click', function(){
            var opcao = elementoAlvo.atributo('selecionando');
            var dtInicio;
            var dtFim;

            if ( opcao.toLowerCase() == 'periodo' ){
                var dataInicial = new Superlogica_Js_Date( new Superlogica_Js_Elemento('.dtInicio').datepicker('getDate') );
                var dataFinal = new Superlogica_Js_Date( new Superlogica_Js_Elemento('.dtFim').datepicker('getDate') )

                if ( dataInicial.comparar( dataFinal )==1 ){
                    alert('Data final não pode ser menor que data inicial');
                    return false;
                }
                dtInicio = dataInicial.toString('m/d/Y');
                dtFim = dataFinal.toString('m/d/Y');
            }else if (opcao.toLowerCase() == 'mensal'){

                var mes = 1 + parseInt( new Superlogica_Js_Form_Elementos(".calendarioMensal .ui-datepicker-month :selected").getValue() );
                var ano = new Superlogica_Js_Form_Elementos(".calendarioMensal .ui-datepicker-year :selected").getValue();
                dtInicio = new Superlogica_Js_Date( mes+"/"+'01/'+ano);
                dtFim = new Superlogica_Js_Date( mes+"/"+dtInicio.getUltimoDia()+'/'+ano).toString('m/d/Y');
                dtInicio = dtInicio.toString('m/d/Y');

            }else if (opcao.toLowerCase() == 'anual' ){

                var ano = new Superlogica_Js_Form_Elementos(".calendarioAnual .ui-datepicker-year :selected").getValue();
                dtInicio = new Superlogica_Js_Date( '01/01/'+ano).toString('m/d/Y');
                dtFim = new Superlogica_Js_Date( "12/31/"+ano).toString('m/d/Y');
            }else{
                dtInicio = new Superlogica_Js_Date( new Superlogica_Js_Elemento('.calendarioDia').datepicker('getDate') ).toString('m/d/Y');
            }

            if ( typeof callback == 'function'){                
                if ( callback( dtInicio, dtFim ) == true){
                    elementoRemover.remover();
                }
            }

        });

        botoesRodape.adicionarHtmlAoFinal( btAplicar );
        botoesRodape.adicionarHtmlAoFinal( option );
        botoesRodape.adicionarHtmlAoFinal( linkCancelar );

        return botoesRodape;
    },
    /**
      * Cria uma opção para selecionar datas por período
      */
    _criarBotaoSelecionarPeriodo : function(){
        return new Superlogica_Js_Elemento('<li><a href="javascript:void(0);" tipo="periodo" class="selecionarPeriodo">Periodo</a></li>');
    },
    /**
      * Cria uma opção para selecionar datas mensal
      */
    _criarBotaoSelecionarMensal : function(){
        return new Superlogica_Js_Elemento('<li><a href="javascript:void(0);" tipo="mensal" class="selecionarMensal">Mensal</a></li>');
    },

    /**
      * Cria uma opção para selecionar datas anual
      */
    _criarBotaoSelecionarAnual : function(){
        return new Superlogica_Js_Elemento('<li><a href="javascript:void(0);" tipo="anual" class="selecionarAnual">Anual</a></li>');
    },

    /**
      * Seta as opções para a criação do form de seleção de datas
      *
      * @param object opcoes
      */
    setOptions : function( opcoes ){
        this._opcoes = Object.append( this._opcoes, typeof opcoes == 'object' ? opcoes : {} );
    },

    /**
      * Verifica se a data está inválida
      * @return boolean
      */
    /*isValid : function(){
        if ( ( !this.checkdate(this.getMes(), this.getDia(), this.getAno()) ) || ( (!this.getAno()) || (!this.getMes()) || (!this.getDia()) || (this._invalid) ) )
            return false;
        return true;
    },*/

    checkdate :function(m, d, y) {
        // Returns true(1) if it is a valid date in gregorian calendar
        //
        // version: 1103.1210
        // discuss at: http://phpjs.org/functions/checkdate    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Pyerre
        // +   improved by: Theriault
        // *     example 1: checkdate(12, 31, 2000);
        // *     returns 1: true    // *     example 2: checkdate(2, 29, 2001);
        // *     returns 2: false
        // *     example 3: checkdate(3, 31, 2008);
        // *     returns 3: true
        // *     example 4: checkdate(1, 390, 2000);    // *     returns 4: false
        return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
    },

    /**
      * Retorna o ultimo dia do mes instanciado
      * @return integer
      */
    getUltimoDia : function(){
        return ( new Date(  ( new Date( this.getAno(), this.getMes() ,1 )  )-1)).getDate();
    },
    
    /**
     * Retorna um array com a diferença entre a data da instancia a e a data informada
     * 
     * @param type $dateTo
     * @return type 
     */
    diff : function ($totime, $retornarMelhorFormato, $posfixo ) {
        
        if ( typeof $retornarMelhorFormato == 'undefined' ){
            $retornarMelhorFormato = true;
        }
        
        var $fromtime = this.timestamp;
        
        if ( instanceOf($totime, Superlogica_Js_Date) ){
            $totime = $totime.timestamp;
        }else if ( parseInt($totime,10) === 0 && typeof $totime == 'string'){
            $totime = new Superlogica_Js_Date($totime).timestamp;
        }
        
        if ( !$totime )
            $totime = new Superlogica_Js_Date().timestamp;
        
        // Caso a data informada como parametro seja maior do que a data instanciada então remove o sufixo 'atrás'
        if( typeof $posfixo == 'undefined' && $fromtime < $totime)
            $posfixo = '';
        
        if ($fromtime > $totime) {
            var $tmp = $totime;
            $totime = $fromtime;
            $fromtime = $tmp;
        }


        var $dt1 = new Superlogica_Js_Date();        
        $dt1.setTimestamp( $fromtime );        
        
        var $dt2 = new Superlogica_Js_Date();
        $dt2.setTimestamp( $totime );

        var $diffAnos = $dt2.toString('Y') - $dt1.toString('Y');
        
        var $diffMes = parseInt($dt2.toString('m'),10) - parseInt($dt1.toString('m'),10);
        if ($diffMes < 0){
            $diffAnos--;
            $diffMes= 12 + $diffMes;
        }
        
        var $difDias = parseInt( $dt2.toString('d'), 10 ) - parseInt( $dt1.toString('d'), 10 );        
        if ($difDias < 0){
            if ($diffMes==0){
                $diffAnos--; 
                $diffMes= 12;
            }
            $diffMes--;            
        }
        
        $dt1.adicionarAnos( $diffAnos );
        $dt1.adicionarMeses( $diffMes );
        
        $difDias= $dt1.daysBetween($dt2);        
        $dt1.adicionarDias($difDias);
        
        
        var $difSegundos= $dt2.timestamp - $dt1.timestamp;
        
        
        if ($difSegundos < 0){
            
           $difSegundos= 86400 + $difSegundos;
           $difSegundos= Math.abs($difSegundos);
           
           if ($diffAnos > 0){
              $diffAnos--;
           }
           
           if ($diffMes == 0){
              $diffMes= 12;
           }
           
           $diffMes--;
           
           if ($difDias==0){
               $difDias=31;
           }
           
           $difDias--;
        }        
        
        var $difHoras= 0;
        
        if ($difSegundos >= (60*60)){
            $difHoras=  parseInt($difSegundos / (60 * 60));
            $difSegundos=  $difSegundos % (60 * 60);
        }
        
        var $difMinutos= 0;
        
        if ($difSegundos >= 60){
            $difMinutos=   parseInt($difSegundos / 60);
            $difSegundos=   $difSegundos % 60;
        }       
        
        var $ret = {};
        $ret['meses'] = $diffMes;
        $ret['anos'] = $diffAnos;
        $ret['dias'] = $difDias;               
        $ret['horas'] = $difHoras;        
        $ret['minutos'] =$difMinutos;
        $ret['segundos'] =$difSegundos;

        return $retornarMelhorFormato ? this.diffFormat( $ret, $posfixo ) : $ret;
    },
    
    /**
     * Formata o array da diferença entre as duas datas
     * 
     * @param array $diff_data
     * @param string $format
     * @return string
     */
    diffFormat : function ( $diff_data, $posfixo ){
        if( typeof $posfixo == 'undefined')
            $posfixo = ' atrás';
        if(!$diff_data)
            return false;

        var $dateValue = '';
        var $stringDateValue = '';
        var $stringDateValueSufix = 's';
        
        if ($diff_data['anos'] > 0) {
            $dateValue = $diff_data['anos'];
            $stringDateValue = ' ano';
        } else if ($diff_data['meses'] > 0) {
            $dateValue = $diff_data['meses'];
            $stringDateValueSufix = 'es';
            $stringDateValue = $dateValue == 1 ? ' mês' : ' mes';
        } else if ($diff_data['dias'] > 0) {
            $dateValue = $diff_data['dias'];
            $stringDateValue = ' dia';
        } else if ($diff_data['horas'] > 0) {
            $dateValue = $diff_data['horas'];
            $stringDateValue = ' hora';
        } else if ($diff_data['minutos'] > 0) {
            $dateValue = $diff_data['minutos'];
            $stringDateValue = ' minuto';
        } else if ($diff_data['segundos'] > 0) {
            $dateValue = $diff_data['segundos'];
            $stringDateValue = ' segundo';
        }
        
        $stringDateValue = $stringDateValue + ( $dateValue == 1 ? '' : $stringDateValueSufix );
        
        return (!$dateValue) ? ('Poucos segundos'+$posfixo) : ($dateValue+ $stringDateValue +$posfixo);
    }
   
});

/**
 * Elementos que serão atualizados dinamicamente
 */
Superlogica_Js_Date._elementosDinamicos = [];

/**
 * Armazena a referencia ao intervalo iniciado para atualização das datas
 */
Superlogica_Js_Date._intervalRecarregarData = null;

/**
 * Inicia o intervalo de carregamento da data
 */
Superlogica_Js_Date._initRecarregarDatas = function(){
    
    if ( Superlogica_Js_Date._intervalRecarregarData !== null ) return true;
    
    var referencia = this;
    Superlogica_Js_Date._intervalRecarregarData = setInterval(function(){
        referencia._recarregarDatas.apply(referencia,[]);
    }, 1000 * 60);

};

/**
 * Adiciona um elemento ao conjunto de elementos dinamicos
 * 
 * @param {Superlogica_Js_Elemento} novoElemento
 * @return boolean
 */
Superlogica_Js_Date.adicionarElementoDinamico = function( novoElemento ){
    var jaAdicionado = false;
    Object.each( Superlogica_Js_Date._elementosDinamicos, function (elemento ){
        if ( elemento === novoElemento )
            jaAdicionado = true;
        return !jaAdicionado;
    });
    
    if ( !jaAdicionado ){
        Superlogica_Js_Date._elementosDinamicos.push(novoElemento);
        Superlogica_Js_Date._initRecarregarDatas();
    }
    
    return true;
};

/**
 * Função estatica utilizada para recarregar o conteudo 
 * dos elemento setados com a data atualizada
 *
 */
Superlogica_Js_Date._recarregarDatas = function(){
        
    Object.each(Superlogica_Js_Date._elementosDinamicos, function(elemento, chave){
        var formato = elemento.atributo('formato') ? elemento.atributo('formato') : null;
        
        var data = new Superlogica_Js_Date(
            elemento.atributo('data'),
            formato
        );
        
        var arrDiff = data.diff( null, false );
        
        if ( arrDiff['dias'] >= 1 ){
            delete Superlogica_Js_Date._elementosDinamicos[chave];
            return true;
        }
        elemento.conteudo( data.diffFormat( arrDiff ) );

    });

};

/**
 * Verifica se a data informada é uma data válida
 * 
 * @param {String} data
 * @param {String} [formato]
 * @returns {Boolean}
 */
Superlogica_Js_Date.isDate = function( data, formato ){
    if (!data) return false;

//    if ( !formato )
//        formato = 'm/d/Y';
    
    if (!formato && data.length <= 10 )
        formato = 'm/d/Y';
    else if ( !formato && data.length > 10 )
        formato = 'm/d/Y H:i:s';    
    
    var timestamp = Superlogica_Js_Date._createFromFormat( data, formato );
    
    if ( !timestamp ) return false;
    return Superlogica_Js_Date.date(formato, timestamp) == data;
    
};

/**
* Transforma a data em array de acordo com o formato informado
* 
* @param string data
* @param string formato
* @return array
*/
Superlogica_Js_Date._createFromFormat = function( data, formato ){

    var arrDataDefault = {
        "h" : 0,
        "i" : 0,
        "s" : 0,
        "d" : 1,
        "m" : 1,
        "y" : 1970
    };

    var arrFormat = formato.replace(/ |\/|:|-/g,'-').split('-');
    var arrData = data.replace(/ |\/|:|-/g,'-').split('-');

    Object.each( arrFormat, function(item, chave){
        arrDataDefault[ arrFormat[chave].toLowerCase() ] = arrData[chave.toLowerCase()];
    }, this);    
    
    try{
        var timestamp = Superlogica_Js_Date.mktime( arrDataDefault['h'], arrDataDefault['i'], arrDataDefault['s'], arrDataDefault['m'], arrDataDefault['d'], arrDataDefault['y']);
    }catch(e){
        return null;
    }    

    return  !timestamp ? null : timestamp ;
};

/**
 * Função utilizada para remover zeros a mais no input informado
 * Utilizado na função mktime
 */ 
Superlogica_Js_Date.stripLeadingZeroes = function(input) {
    if((input.length > 1) && (input.substr(0,1) == "0"))
        return input.substr(1);
    else
        return input;
}
/**
 * Responsavel por converter data em timestamp
 */
Superlogica_Js_Date.mktime = function() {
    
    arguments[5] = parseInt( arguments[5] );
    // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
    arguments[5] += (arguments[5] >= 0 ? (arguments[5] <= 69 ? 2e3 : (arguments[5] <= 100 ? 1900 : 0)) : 0);
    
    var dateUTC = Date.UTC(
        arguments[5],
        ( Superlogica_Js_Date.stripLeadingZeroes(arguments[3])-1),
        Superlogica_Js_Date.stripLeadingZeroes(arguments[4]),
        Superlogica_Js_Date.stripLeadingZeroes( arguments[0] ),
        Superlogica_Js_Date.stripLeadingZeroes( arguments[1] ),
        Superlogica_Js_Date.stripLeadingZeroes( arguments[2] )
    );
          
    var humDate = new Date(dateUTC);
    return (humDate.getTime()/1000.0);
    
};

Superlogica_Js_Date.getDayOfWeek = function(day, abreviado) {
    var arDiasSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira','Quinta-Feira' ,'Sexta-Feira', 'Sabado'];
    var arDiasSemanaAbreviado = ['Dom', 'Seg', 'Ter', 'Quar','Quin' ,'Sex', 'Sab'];
    
    	
    return abreviado ? arDiasSemanaAbreviado[day] : arDiasSemana[day];
    
};

/**
 * Executa formatação no timestamp informado
 * @param string format Formato de saida da data (Padrão PHP date() )
 * @param integer timestamp Timestamp a ser formatado
 */
Superlogica_Js_Date.date = function (format, timestamp) {
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +      parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: MeEtc (http://yass.meetcweb.com)
    // +   improved by: Brad Touesnard
    // +   improved by: Tim Wiel
    // +   improved by: Bryan Elliott
    //
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: David Randall
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +  derived from: gettimeofday
    // +      input by: majak
    // +   bugfixed by: majak
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alex
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Thomas Beaucourt (http://www.webapp.fr)
    // +   improved by: JT
    // +   improved by: Theriault
    // +   improved by: Rafa? Kukawski (http://blog.kukawski.pl)
    // %        note 1: Uses global: php_js to store the default timezone
    // %        note 2: Although the function potentially allows timezone info (see notes), it currently does not set
    // %        note 2: per a timezone specified by date_default_timezone_set(). Implementers might use
    // %        note 2: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    // %        note 2: in order to adjust the dates in this function (or our other date functions!) accordingly
    // *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    // *     returns 1: '09:09:40 m is month'
    // *     example 2: date('F j, Y, g:i a', 1062462400);
    // *     returns 2: 'September 2, 2003, 2:26 am'
    // *     example 3: date('Y W o', 1062462400);
    // *     returns 3: '2003 36 2003'
    // *     example 4: x = date('Y m d', (new Date()).getTime()/1000);
    // *     example 4: (x+'').length == 10 // 2009 01 09
    // *     returns 4: true
    // *     example 5: date('W', 1104534000);
    // *     returns 5: '53'
    // *     example 6: date('B t', 1104534000);
    // *     returns 6: '999 31'
    // *     example 7: date('W U', 1293750000.82); // 2010-12-31
    // *     returns 7: '52 1293750000'
    // *     example 8: date('W', 1293836400); // 2011-01-01
    // *     returns 8: '52'
    // *     example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    // *     returns 9: '52 2011-01-02'
    var that = this,
    jsdate, f, formatChr = /\\?([a-z])/gi, formatChrCb,
    // Keep this here (works, but for code commented-out
    // below for file size reasons)
    //, tal= [],
    _pad = function (n, c) {
        if ((n = n + "").length < c) {
            return new Array((++c) - n.length).join("0") + n;
        } else {
            return n;
        }
    },
    txt_words = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab",
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
    "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    txt_ordin = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    };
    formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    f = {
        // Day
        d: function () { // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () { // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function () { // Day of month; 1..31
            return jsdate.getUTCDate();
        },
        l: function () { // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () { // Ordinal suffix for day of month; st, nd, rd, th
            return txt_ordin[f.j()] || 'th';
        },
        w: function () { // Day of week; 0[Sun]..6[Sat]
            return jsdate.getUTCDay();
        },
        z: function () { // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j()),
            b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5) + 1;
        },

        // Week
        W: function () { // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
            b = new Date(a.getUTCFullYear(), 0, 4);
            return 1 + Math.round((a - b) / 864e5 / 7);
        },

        // Month
        F: function () { // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () { // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () { // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function () { // Month; 1...12
            return jsdate.getUTCMonth() + 1;
        },
        t: function () { // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getUTCDate();
        },

        // Year
        L: function () { // Is leap year?; 0 or 1
            return new Date(f.Y(), 1, 29).getUTCMonth() === 1 | 0;
        },
        o: function () { // ISO-8601 year
            var n = f.n(), W = f.W(), Y = f.Y();
            return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
        },
        Y: function () { // Full year; e.g. 1980...2010
            return jsdate.getUTCFullYear();
        },
        y: function () { // Last two digits of year; 00...99
            return (f.Y() + "").slice(-2);
        },

        // Time
        a: function () { // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function () { // AM or PM
            return f.a().toUpperCase();
        },
        B: function () { // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2, // Hours
            i = jsdate.getUTCMinutes() * 60, // Minutes
            s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () { // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () { // 24-Hours; 0..23
            return jsdate.getUTCHours();
        },
        h: function () { // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () { // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () { // Minutes w/leading 0; 00..59
            return _pad(jsdate.getUTCMinutes(), 2);
        },
        s: function () { // Seconds w/leading 0; 00..59
            return _pad(jsdate.getUTCSeconds(), 2);
        },
        u: function () { // Microseconds; 000000-999000
            return _pad(jsdate.getUTCMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return this.date_default_timezone_get();
    */
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () { // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0), // Jan 1
            c = Date.UTC(f.Y(), 0), // Jan 1 UTC
            b = new Date(f.Y(), 6), // Jul 1
            d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return 0 + ((a - c) !== (b - d));
        },
        O: function () { // Difference to GMT in hour format; e.g. +0200
            var a = jsdate.getTimezoneOffset();
            return (a > 0 ? "-" : "+") + _pad(Math.abs(a / 60 * 100), 4);
        },
        P: function () { // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
            return 'UTC';
        },
        Z: function () { // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () { // ISO-8601 date.
            return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () { // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () { // Seconds since UNIX epoch
            return jsdate.getUTCTime() / 1000 | 0;
        }
    };    
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (function(){
            if ( (typeof timestamp === 'undefined') ){                
                return new Date();
            }else if ( timestamp instanceof Date ){
                return new Date(timestamp);
            }else {
                var dateNow = new Date();
                dateNow.setTime(timestamp * 1000);
                return dateNow;
            }
        }());
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
};