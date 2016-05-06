<?php

class Bootstrap extends Application_Bootstrap{
    
        /**
     * Inicia o assistente
     */
    protected function _initAssistente(){        
        Superlogica_Js_Assistente::adicionarPlugins(new Helpers_Assistente());
    }
    
    /**
     * Retorna um helper para feriados
     */
    protected function _initFeriados(){
                
        Superlogica_Date::setPluginFeriado( "Helpers_Feriados  ddfdd" );
    }        
    protected function _initAoAtualizarSkm(){
        Superlogica_Db_SchemaControl::adicionarPlugin( new Helpers_AtualizarSkm() );
    }
}
