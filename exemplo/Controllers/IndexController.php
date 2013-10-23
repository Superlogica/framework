<?php

class IndexController extends Superlogica_Controller_Action {

    public function indexAction(){
        
        $params = $this->_request->getParam('todos'); // Pega todos parametros        
        $api = $this->_api; // Instancia da API já logada
                
        $pesquisa = $params[0]['pesquisa'];
        $api->action('fornecedores/index', array('pesquisa' => $pesquisa)); //Faz uma requisição no financeiro, controller fornecedores e action index
              
        $response = $api->getData(-1); /*Obtem resposta do financeiro. Paramentos: -1 para pegar todos as linhas do array
                                                                                    0 para pegar primeira linha*/
        
       
        /*Função padrão para resposta, renderiza os dados no formato JSON*/
        Superlogica_Response::multipleResponse($response);
    }
}
