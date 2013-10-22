<?php

class Forms_Fornecedores_Put extends Superlogica_Form {
    
    public function init(){        
       
        /** Superlogica_Location é a classe que monta uma url
         *      setController - nome do controller
         *      setAction - nome do action
         *      viaProxy - nome do action* 
         **/
        $location = new Superlogica_Location();
        $location->setController('fornecedores')
                 ->setAction('put')
                 ->viaProxy();    
        
        
        $this->addAttribs(array(
            'action' => $location->toString(),
            'method' => 'post',
            'aposSubmeter' => 'recarregarGrids' /*Função será executada após o form ser submetido. A função está escrita no js
                                                  disponivel em ../views/scripts/js/ o arquivo deve ter o nome do controler     
                                                */
        ));
        
        
        $nome = new Zend_Form_Element_Text('ST_NOME_FAV', array('label' => 'Nome'));                                                                      
        
        $telefone = new Zend_Form_Element_Text('ST_TELEFONE_FAV',array('label' => 'Telefone',
                                                                       'quebraDeLinha' => true,
                                                                       'size' => 21));        
        
        $this->addElements(
                array(
                    $nome,                   
                    $telefone                  
                )
        );            
    }
    
}