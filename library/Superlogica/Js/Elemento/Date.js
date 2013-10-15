var Superlogica_Js_Elemento_Date = new Class({
   
   /**
    * Classe principal com todos metodos principais para manipulacao de elementos
    * @var Superlogica_Js_Elemento
    */
   Extends : Superlogica_Js_Elemento,
   
   /**
     * Comportamento utilizado para atualizar a data do elemento dinamicamente
     */
    __atualizarData : function(){
        Superlogica_Js_Date.adicionarElementoDinamico(this);
    }
   
});