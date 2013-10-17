
var Superlogica_Js_Debug = new Class({


   Extends: Superlogica_Js_Elemento,

    /**
    *  Tempo da ultima marca
    *
    * @var array
    *
    */  
    time_last_mark : null,

   /**
    *  Marcas a serem depuradas
    *
    * @var array
    *
    */
   marks : [],


   /**
    *  Contadores
    *
    * @var array
    *
    */
    contadores: [],


   /**
    *  Exibe o conteúdo de uma variavel
    *
    * @param variavel
    *
    */
    print_r: function( variavel ){
        alert(new Superlogica_Js_Json(variavel).encode());
        return this;
    },


   /**
    *  Cria uma marcação para depuração
    *
    * @param variavel
    *
    */
    
    mark: function(mensagem, variavel){
                if (this.time_last_mark == null) this.time_last_mark = this._getTimeStamp();
		var mark = {'msg': mensagem,
			     'data' : new Superlogica_Js_Json(variavel).encode(),
        		     'time_last_mark' : this._getTimeStamp() - this.time_last_mark };
		this.marks.append([mark]);
                this.adicionarHtmlDepois('<pre>'+new Superlogica_Js_Json(mark).encode()+'</pre>');
		this.time_last_mark = this._getTimeStamp();

    },


    _getTimeStamp: function(){
        return new Superlogica_Js_Date().timestamp;
    },


	/**
	 * Inicia um contador
	 *
	 * @param string tag nome do contador
	 * @return void
	 */
	contadorPlay:  function (tag){
		if (!this.contadores.contains(tag)){
			this.contadores[tag] = {'total_time' : 0, 'total_memory' : 0, 'last_mark': NULL, 'count':'1'};
		}
		this.contadores[tag]['last_mark'] = this._getTimeStamp;
		this.contadores[tag]['contador'] = this.contadores[tag]['contador'] + 1;
	},

	/**
	 * Pausa um contador
	 *
	 * @param string tag nome do contador
	 * @return void
	 */
	contadorPause:  function (tag){
		if (!this.contadores.contains(tag)){
			throw "Contador $tag não inicializado.";
		}
		if (this.contadores[tag]['last_mark']=== NULL){
			throw "Contador $tag já estava pausada.";
		}
		this.contadores[tag]['total_time']+= this._getTimeStamp - this.contadores[tag]['last_mark'];
		this.contadores[tag]['last_mark'] = NULL;
                this.adicionarHtmlDepois('<h3>'+tag +' '+ this.contadores[tag]['contador'] +'</h3><pre>'+new Superlogica_Js_Json(this.contadores[tag]).encode()+'</pre>');

	}




        


});






