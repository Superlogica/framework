<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Helpers_Feriados {

    /**
     * Singleton instance
     *
     * @var $_instance
     */
    private static $_instance = null;
    /**
     * Datas 
     *
     * @var $_data
     */
    private static $_data = null;

    /**
     * Singleton pattern implementation makes "new" unavailable
     *
     * @return void
     */
    protected function __construct() {
        
    }

    /**
     * Returns an instance of this class
     * Singleton pattern implementation
     * @return Shared_Helpers_Feriados
     */
    private static function getInstance() {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Obtem todos os feriados nacionais ou em uma certa cidade, com carga tardia
     * @param $dtFeriado objeto data.
     * @param $cidade String com nome da cidade .
     * @return array com todos os feriados
     * 
     * 
     * 

     */
    public static function isFeriado($dtFeriado, $cidade) {

//        $strDate = $dtFeriado->toString('m/d/Y');
//        $self = self::getInstance();
//        $result = $self->_data[$cidade][$strDate];
//        if (!is_array($result)) {
//
//            $feriados = new Shared_Models_Feriados();
//
//            $arFeriados = $feriados
//                    ->comDataEm($strDate)
//                    ->naCidade($cidade)
//                    ->encontrar()
//                    ->toArray();
//
//            $self->_data[$cidade][$strDate] = $arFeriados;
//            $result = $self->_data[$cidade][$strDate];
//        }
//        $result = ( count($result) > 0 );


        return false;
    }

}

?>
