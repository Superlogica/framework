describe("Date", function() {
    //Url para rodar os testes
    //localhost:3059/clients/financeiro/teste/js
    it("Deveria formatar a data m/d/Y em d/m/Y.", function() {
        var date = new Superlogica_Js_Date('02/26/2010');
        expect( '26/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria formatar a data m-d-Y em d/m/Y.", function() {
        var date = new Superlogica_Js_Date('02-26-2010', "m-d-Y" );
        expect( '26/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria formatar a data d-m-Y em d/m/Y.", function() {
        var date = new Superlogica_Js_Date('26-02-2010', "d-m-Y" );
        expect( '26/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria formatar a data no padrão timestamp MySql ( Y-m-d H:i:s ) para o padrão Brasileiro ( d/m/Y h:i:s ).", function() {
        var date = new Superlogica_Js_Date('2010-02-01 11:02:12' );
        expect( '01/02/2010 11:02:12' ).toEqual( date.toString('d/m/Y h:i:s') );
    });

    it("Deveria formatar a data no padrão date MySql ( Y-m-d ) para o padrão Brasileiro ( d/m/Y ).", function() {
        var date = new Superlogica_Js_Date( '2010-02-01' );
        expect( '01/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria formatar data do padrão americano ( m/d/Y ) para o padrão Brasileiro ( d/m/Y ).", function() {
        var date = new Superlogica_Js_Date('02/26/2010' );
        expect( '26/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria converter corretamente mesmo com mês passado sem o prefixo '0' ( '2' ao invés de '02' )", function() {
        var date = new Superlogica_Js_Date('2/26/2010' );
        expect( '26/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria converter corretamente mesmo com dia passado sem o prefixo '0' ( '1' ao invés de '01' )", function() {
        var date = new Superlogica_Js_Date('02/1/2010' );
        expect( '01/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria converter corretamente mesmo com ano passado sem o prefixo '20' ( '10' ao invés de '2010' )", function() {
        var date = new Superlogica_Js_Date( '02/01/10' );
        expect( '01/02/2010' ).toEqual( date.toString( 'd/m/Y' ) );
    });

    it("Deveria converter corretamente mesmo com ano, mês e dia passados sem os prefixos.", function() {
        var date = new Superlogica_Js_Date( '2/1/10' );
        expect( '01/02/2010' ).toEqual( date.toString( 'd/m/Y' ) );
    });

    it("Deveria converter corretamente mesmo com hora passado sem o prefixo '0' ( '1' ao invés de '01' )", function() {
        var date = new Superlogica_Js_Date('02/01/2010 1:12:13', 'm/d/Y h:i:s' );
        expect( '01/02/2010 01:12:13' ).toEqual( date.toString('d/m/Y H:i:s') );
    });

    it("Deveria converter hora padrão brasileiro para padrão americano. ( 15h (BR) = 3h (USA) )", function() {
        var date = new Superlogica_Js_Date('02/01/2010 15:12:13', 'm/d/Y h:i:s' );
        expect( '01/02/2010 03:12:13' ).toEqual( date.toString('d/m/Y h:i:s') );
    });

    it("Deveria retornar o último dia da data informada", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        expect( 28 ).toEqual( date.getUltimoDia() );
    });

    it("Deveria adicionar uma quantidade correta de dias a data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        date.adicionarDias( 3 );
        expect( '05/02/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria adicionar uma quantidade correta de meses a data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        date.adicionarMeses( 3 );
        expect( '02/05/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria adicionar uma quantidade correta de anos a data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        date.adicionarAnos( 3 );
        expect( '02/02/2013' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria subtrair a quantidade correta de anos da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        date.subtrairAnos( 3 );
        expect( '02/02/2007' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria subtrair a quantidade correta de dias da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        date.subtrairDias( 3 );
        expect( '30/01/2010' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria subtrair a quantidade correta de meses da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        date.subtrairMeses( 3 );
        expect( '02/11/2009' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar o dia da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        expect( 2 ).toEqual( date.getDia() );
    });

    it("Deveria retornar o mes da data informada.", function() {
        var date = new Superlogica_Js_Date('05/02/2010'); // m/d/Y
        expect( 5 ).toEqual( date.getMes() );
    });

    it("Deveria retornar o ano da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        expect( 2010 ).toEqual( date.getAno() );
    });

    it("Deveria retornar o hora da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 11:53:23'); // m/d/Y h:i:s
        expect( 11 ).toEqual( date.getHora() );
    });

    it("Deveria retornar o minuto da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 11:53:23'); // m/d/Y h:i:s
        expect( 53 ).toEqual( date.getMinuto() );
    });

    it("Deveria retornar o segundo da data informada.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 11:53:23'); // m/d/Y h:i:s
        expect( 23 ).toEqual( date.getSegundo() );
    });

    it("Deveria retornar verdadeiro pois data informada é maior.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y h:i:s
        expect( -1 ).toEqual( date.comparar( new Superlogica_Js_Date('03/02/2010') ) );
    });

    it("Deveria retornar falso pois data informada é menor.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y h:i:s
        expect( 1 ).toEqual( date.comparar( new Superlogica_Js_Date('01/02/2010') ) );
    });

    it("Deveria retornar -1 pois as datas são iguais.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y h:i:s
        expect( 0 ).toEqual( date.comparar( new Superlogica_Js_Date('02/02/2010') ) );
    });

    it("Deveria retornar false pois data passado é inválida.", function() {
        expect( false ).toEqual( Superlogica_Js_Date.isDate( '15/03/2011' ) );
    });

    it("Deveria retornar true pois data passado é válida.", function() {
        expect( true ).toEqual( Superlogica_Js_Date.isDate( '02/20/1902' ) );
    });

    it("Deveria retornar o timestamp correto.", function() {
        var date = new Superlogica_Js_Date('22/03/2011 11:33:07', 'd/m/Y h:i:s');
        expect( 1300793587 ).toEqual( date.timestamp );
    });

    it("Deveria setar o dia corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        expect( '03/02/2010' ).toEqual( date.setDia('03').toString() ); // Retorno no formato d/m/Y
    });

    it("Deveria setar o mes corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        expect( '02/03/2010' ).toEqual( date.setMes('03').toString() ); // Retorno no formato d/m/Y
    });

    it("Deveria setar o ano corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010'); // m/d/Y
        expect( '02/02/2011' ).toEqual( date.setAno('2011').toString() ); // Retorno no formato d/m/Y
    });

    it("Deveria setar o hora corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 12:55:39'); // m/d/Y h:i:s
        expect( '02/02/2010 18:55:39' ).toEqual( date.setHora('18').toString('m/d/Y H:i:s') ); // Retorno no formato d/m/Y
    });

    it("Deveria setar o minuto corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 12:55:39'); // m/d/Y h:i:s
        expect( '02/02/2010 12:33:39' ).toEqual( date.setMinuto('33').toString('m/d/Y H:i:s') ); // Retorno no formato d/m/Y
    });

    it("Deveria setar o segundos corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 12:55:39'); // m/d/Y h:i:s
        expect( '02/02/2010 12:55:13' ).toEqual( date.setSegundo('13').toString('m/d/Y H:i:s') ); // Retorno no formato d/m/Y
    });

    it("Deveria setar o minutos e, quando ultrapassar, alterar a hora corretamente.", function() {
        var date = new Superlogica_Js_Date('02/02/2010 12:55:39'); // m/d/Y h:i:s
        expect( '02/02/2010 13:01:39' ).toEqual( date.setMinuto('61').toString('m/d/Y H:i:s') ); // Retorno no formato d/m/Y
    });

    it("Deveria incrementar um mes, o mês informada tem 31 dias, incrementando 1 mês deveria ir para o dia 30 do mês seguinte", function(){
        var date = new Superlogica_Js_Date("31/10/2011", "d/m/Y");
        date.adicionarMeses(1);
        expect("30/11/2011").toEqual( date.toString("d/m/Y") );
    });

    it("Incrementando um ano bissexto, dia 29/02/2012 deveria retornar 28/02/2013", function(){
       var date = new Superlogica_Js_Date("29/02/2012", "d/m/Y");
       date.adicionarAnos(1);
       expect("28/02/2013").toEqual( date.toString("d/m/Y") );
    });
    
    
    it("Diferença entre datas, '02/29/2012 00:00:00' e '02/28/2013 00:00:00' deveria retornar 11 meses atrás", function(){
        var date1 = new Superlogica_Js_Date("02/29/2012 00:00:00", "m/d/Y H:i:s");
        expect('11 meses').toEqual( date1.diff(new Superlogica_Js_Date('02/27/2013 00:00:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/29/2012 00:00:00' e '02/28/2013 00:00:00' deveria retornar {'anos':0,'dias':30,'meses':11,'horas':0,'minutos':0,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("02/29/2012 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/28/2013 00:00:00', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':30,'meses':11,'horas':0,'minutos':0,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '02/28/2011 00:00:00' e '02/29/2012 00:00:00' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("02/28/2011 00:00:00", "m/d/Y H:i:s");
        expect('1 ano').toEqual( date1.diff(new Superlogica_Js_Date('02/29/2012 00:00:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/28/2011 00:00:00' e '02/29/2012 00:00:00' deveria retornar {'anos':1,'dias':1,'meses':0,'horas':0,'minutos':0,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("02/28/2011 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/29/2012 00:00:00', 'm/d/Y H:i:s'),false);
        expect({'anos':1,'dias':1,'meses':0,'horas':0,'minutos':0,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '01/01/2012 00:00:00' e '01/01/2012 10:00:00' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("01/01/2012 00:00:00", "m/d/Y H:i:s");
        expect('10 horas').toEqual( date1.diff(new Superlogica_Js_Date('01/01/2012 10:00:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '01/01/2012 00:00:00' e '01/01/2012 10:00:00' deveria retornar {'anos':0,'dias':0,'meses':0,'horas':10,'minutos':0,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("01/01/2012 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('01/01/2012 10:00:00', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':0,'meses':0,'horas':10,'minutos':0,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '02/28/2011 00:00:00' e '02/28/2011 10:00:00' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("02/28/2011 00:00:00", "m/d/Y H:i:s");
        expect('10 horas').toEqual( date1.diff(new Superlogica_Js_Date('02/28/2011 10:00:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/28/2011 00:00:00' e '02/28/2011 10:00:00' deveria retornar {'anos':0,'dias':0,'meses':0,'horas':10,'minutos':0,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("02/28/2011 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/28/2011 10:00:00', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':0,'meses':0,'horas':10,'minutos':0,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '02/28/2012 00:00:00' e '02/29/2012 10:00:00' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("02/28/2012 00:00:00", "m/d/Y H:i:s");
        expect('1 dia').toEqual( date1.diff(new Superlogica_Js_Date('02/29/2012 10:00:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/28/2012 00:00:00' e '02/29/2012 10:00:00' deveria retornar {'anos':0,'dias':1,'meses':0,'horas':10,'minutos':0,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("02/28/2012 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/29/2012 10:00:00', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':1,'meses':0,'horas':10,'minutos':0,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '02/29/2012 00:00:00' e '02/29/2012 10:00:00' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("02/29/2012 00:00:00", "m/d/Y H:i:s");
        expect('10 horas').toEqual( date1.diff(new Superlogica_Js_Date('02/29/2012 10:00:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/29/2012 00:00:00' e '02/29/2012 10:00:00' deveria retornar {'anos':0,'dias':0,'meses':0,'horas':10,'minutos':0,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("02/29/2012 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/29/2012 10:00:00', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':0,'meses':0,'horas':10,'minutos':0,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '02/28/2011 00:00:00' e '02/28/2011 00:10:00' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("02/28/2011 00:00:00", "m/d/Y H:i:s");
        expect('10 minutos').toEqual( date1.diff(new Superlogica_Js_Date('02/28/2011 00:10:00', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/28/2011 00:00:00' e '02/28/2011 00:10:00' deveria retornar {'anos':0,'dias':0,'meses':0,'horas':0,'minutos':10,'segundos':0}", function(){
        var date1 = new Superlogica_Js_Date("02/28/2011 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/28/2011 00:10:00', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':0,'meses':0,'horas':0,'minutos':10,'segundos':0}).toEqual( result );
    });
    
    it("Diferença entre datas, '02/29/2012 00:00:00' e '02/29/2012 00:00:20' deveria retornar 1 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("02/29/2012 00:00:00", "m/d/Y H:i:s");
        expect('20 segundos').toEqual( date1.diff(new Superlogica_Js_Date('02/29/2012 00:00:20', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '02/29/2012 00:00:00' e '02/29/2012 00:00:20' deveria retornar {'anos':0,'dias':0,'meses':0,'horas':0,'minutos':0,'segundos':20}", function(){
        var date1 = new Superlogica_Js_Date("02/29/2012 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/29/2012 00:00:20', 'm/d/Y H:i:s'),false);
        expect({'anos':0,'dias':0,'meses':0,'horas':0,'minutos':0,'segundos':20}).toEqual( result );
    });
    
    it("Diferença entre datas, '01/01/2011 00:00:00' e '02/28/1990 00:00:20' deveria retornar 20 anos atrás", function(){
        var date1 = new Superlogica_Js_Date("01/01/2011 00:00:00", "m/d/Y H:i:s");
        expect('20 anos atrás').toEqual( date1.diff(new Superlogica_Js_Date('02/28/1990 00:00:20', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '01/01/2011 00:00:00' e '02/28/1990 00:00:20' deveria retornar {'anos':20,'dias':1,'meses':10,'horas':22,'minutos':59,'segundos':40}", function(){
        var date1 = new Superlogica_Js_Date("01/01/2011 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/28/1990 00:00:20', 'm/d/Y H:i:s'),false);
        expect({'anos':20,'dias':3,'meses':10,'horas':23,'minutos':59,'segundos':40}).toEqual( result );
    });
    
    it("Diferença entre datas, '01/01/2012 00:00:00' e '02/28/1990 00:00:20' deveria retornar 21 ano atrás", function(){
        var date1 = new Superlogica_Js_Date("01/01/2012 00:00:00", "m/d/Y H:i:s");
        expect('21 anos atrás').toEqual( date1.diff(new Superlogica_Js_Date('02/28/1990 00:00:20', 'm/d/Y H:i:s')) );
    });
    
    it("Diferença entre datas, '01/01/2012 00:00:00' e '02/28/1990 00:00:20' deveria retornar {'anos':21,'dias':1,'meses':10,'horas':22,'minutos':59,'segundos':40}", function(){
        var date1 = new Superlogica_Js_Date("01/01/2012 00:00:00", "m/d/Y H:i:s");
        var result = date1.diff(new Superlogica_Js_Date('02/28/1990 00:00:20', 'm/d/Y H:i:s'),false);
        expect({'anos':21,'dias':3,'meses':10,'horas':23,'minutos':59,'segundos':40}).toEqual( result );
    });

    //Isso ainda não funciona mas deve ser feito, criado por Ademilson em 04/05/2012 14:20
    it("Deveria retornar 2 meses de diferença entre 02/05/2012 e 04/05/2012", function(){

        var data1 = new Superlogica_Js_Date("02/05/2012", 'm/d/Y');
        var data2 = new Superlogica_Js_Date("04/05/2012", 'm/d/Y');
        var result = data1.diff(data2);
        expect('2 meses').toEqual( result );
    });

    it("Deveria retornar a data corretamente ao criar uma data 2 dias antes do horário de verão", function() {
        var date = new Superlogica_Js_Date('10/19/2012');
        expect( '19/10/2012' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data 1 dia antes do horário de verão", function() {
        var date = new Superlogica_Js_Date('10/20/2012');
        expect( '20/10/2012' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data no horário de verão", function() {
        var date = new Superlogica_Js_Date('10/21/2012');
        expect( '21/10/2012' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data no meio do horário de verão", function() {
        var date = new Superlogica_Js_Date('12/21/2012');
        expect( '21/12/2012' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data 2 dias antes de acabar o horário de verão", function() {
        var date = new Superlogica_Js_Date('02/22/2013');
        expect( '22/02/2013' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data 1 dia antes de acabar o horário de verão", function() {
        var date = new Superlogica_Js_Date('02/23/2013');
        expect( '23/02/2013' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data no dia que acaba o horário de verão", function() {
        var date = new Superlogica_Js_Date('02/24/2013');
        expect( '24/02/2013' ).toEqual( date.toString('d/m/Y') );
    });

    it("Deveria retornar a data corretamente ao criar uma data 1 dia após acabar o horário de verão", function() {
        var date = new Superlogica_Js_Date('02/25/2013');
        expect( '25/02/2013' ).toEqual( date.toString('d/m/Y') );
    });
    it("Deveria retornar a diferença de dias entre 2 datas corretamente, mesmo 1 estando em horário de verão e outra não.", function() {

        var dtAtual = new Superlogica_Js_Date('26/02/2013 09:32:30', 'd/m/Y h:i:s');
        var dt2 = new Superlogica_Js_Date('14/02/2013 09:42:25', 'd/m/Y h:i:s');
        expect( '11 dias atrás' ).toEqual( dtAtual.diff( dt2 ) );
    });
    
    it("Deveria retornar a diferença de dias entre 2 datas corretamente, mesmo 1 estando fora do horário de verão outra dentro do horário de verão.", function() {
        var dtAtual = new Superlogica_Js_Date('20/10/2013 10:00:00', 'd/m/Y h:i:s');
        var dt2 = new Superlogica_Js_Date('22/10/2013 10:00:00', 'd/m/Y h:i:s');
        expect( '2 dias' ).toEqual( dtAtual.diff( dt2 ) );
    });

    it("Deveria retornar o timestamp de datas abaixo de 1970 ( timestamp negativos ).", function() {
        expect( -3591338679 ).toEqual( new Superlogica_Js_Date( '12/03/1856 13:55:21', "d/m/Y h:i:s" ).timestamp );
    });

    it("Deveria retornar a data de hoje ( " + new Date().getDate()+'/'+ new Date().getMonth() + '/' + new Date().getFullYear() + ' '  + ' ' + new Date().getHours() + ':'+new Date().getMinutes()+":"+new Date().getSeconds() + ' )' , function() {
        var date = new Date();
        var mes = date.getMonth()+1;
            mes = mes < 9 ? '0'+mes : mes;
        var horas = date.getHours();
            horas = horas < 9 ? '0'+horas : horas;
            
        var minuto = date.getMinutes();
            minuto = minuto < 9 ? '0'+minuto : minuto;
            
        var seconds = date.getSeconds();
            seconds = seconds< 9 ? '0'+seconds: seconds;
        
        var dia = date.getDate();
            dia= dia< 9 ? '0'+dia: dia;
            
        var dtString = dia+'/'+ mes + '/' + date.getFullYear() + ' ' + horas + ':' + minuto + ":" + seconds;
        expect( dtString ).toEqual( new Superlogica_Js_Date().toString('d/m/Y H:i:s') );        
    });
        
    it("Deveria retornar o diff correto de timestamp negativos.", function() {
        var dtAtual = new Superlogica_Js_Date('26/02/1800 09:32:30', 'd/m/Y h:i:s');
        var dt2 = new Superlogica_Js_Date('14/02/1800 09:42:25', 'd/m/Y h:i:s');
        expect( '11 dias atrás' ).toEqual( dtAtual.diff( dt2 ) );        
    });
    
});