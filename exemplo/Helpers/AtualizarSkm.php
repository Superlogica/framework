<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Helpers_AtualizarSkm {
    
     /**
     * Executa antes de atualizar o skm para versão X
     * Caso de algum erro durante esse processo o skm é interompido 
     * e não é atualizado para a versão
     */
    public function antesAtualizarVersao6() {
    }
    
    /**
     * Executa ao atualizar o skm para versão X
     * Script executado depois que a versao X foi processada
     * caso de algum erro e o skm rodado for um CREATE,DROP,ALTER
     * não da roolback.
     * O skm é interrompido e não é atualizado para versão X;
     */
    public function aoAtualizarVersao6() {

    }
    public function aoAtualizarVersao7() {

    }
    public function aoAtualizarVersao8() {

    }

}

