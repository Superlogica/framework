<?php

class Forms_Fornecedores_Post extends Forms_Fornecedores_Put{

    public function init(){

        parent::init();        
       
        /** Superlogica_Location é a classe que monta uma url
         *      setController - nome do controller
         *      setAction - nome do action
         *      viaProxy - nome do action* 
         **/
        $location = new Superlogica_Location();
        $location->setController('fornecedores')
                 ->setAction('post')
                 ->viaProxy();    
        
        
        $this->addAttribs(array(
            'action' => $location->toString(),
            'method' => 'post'
        ));        

        $this->removeAttrib('aposSubmeter');       
        $this->addElement( new Zend_Form_Element_Hidden('ID_FAVORECIDO_FAV') );

    }

}