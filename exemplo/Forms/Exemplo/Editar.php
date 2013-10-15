<?php

class Forms_Exemplo_Editar extends Superlogica_Form {
    
    public function init(){
        
        $nome = new Zend_Form_Element_Text('nome',array(
            'label' => 'Nome'
        ));
        $this->addElement($nome);
    }
    
}