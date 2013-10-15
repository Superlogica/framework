<?php

class IndexController extends Superlogica_Controller_Action {

    public function indexAction(){
        
        $params = $this->_request->getParam('todos'); // Pega todos parametros        
        $api = $this->_api; // Instancia da API já logada
        
        print_r( $api->action('fornecedores/index'));
                
        Superlogica_Response::multipleResponse(array(
            array( 'status' => 500, 'msg' => 'Erro' ),
            array( 'status' => 200, 'msg' => 'sucesso' ),
        ));
    }
}
