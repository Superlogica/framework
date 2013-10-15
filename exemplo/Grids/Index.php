<?php

class Grids_Index extends Superlogica_Js_Grid {    
    
    // Array de botoes do Grid
    protected $_botoes = array(
        array(
            'acao' => 'editar',
            'form' => 'Forms_Exemplo_Editar',
            'titulo' => 'Exemplo de form',
            'img' => 'post.png',
            'tipo' => 'abaixo',
        )
    );
    
    protected $_colunas = array(
        'primeira' => array(
            'label' => 'Coluna principal',
            'template' => 'Este é o {valor}',
            'tamanho' => '100%'
        )
    );
    
}