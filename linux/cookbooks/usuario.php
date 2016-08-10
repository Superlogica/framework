<?php 
/*
Autor : Emerson Silva - 05/08/2016
Funcao : Criar usuarios em servidor e habilitar chave publica no servidor
Teste e revisao : Jean Rodrigues
*/

function usuario_init(){
	// Valida os parametros recebidos
	$parametro[0] = !empty($GLOBALS['argv'][2]) ? $GLOBALS['argv'][2]  : null ;
	$parametro[1] = !empty($GLOBALS['argv'][3]) ? $GLOBALS['argv'][3] : null;
	(($parametro[1] != null) and (strtoupper($parametro[1])) != "FORCE") ? $parametro_invalido = 1 : $parametro_invalido = 0;
	if (($parametro_invalido == 1)or($parametro == null)) {
		echo "\nParâmetro inválido ou login de usuário com formato errado/faltante !\n\n";
		exit(3);
	}
	// Gera o help
	if (strtoupper($parametro[0]) == 'HELP'){
		echo "\n\n======> Bem-vindo ao HELP do cookbook usuarios ! <======\n
		      \nA estrutura do cookbook é : sudo cloud-init usuario\n
		      \nExemplo : sudo cloud-init emerson\n
		      \nTodos usuarios serao gerados com letras minusculas\n
		      \nNota:Somente usuarios com login formado por letras sem acentos , numeros ,'.' ,'-','_' sendo que \nesses caracteres não podem iniciar ou terminar o login . Outros caracteres não são aceitos!\nO login deve iniciar com letra e ter no minimo 3 digito para validação.\n
		      \nExemplos corretos : emerson.silva ou anderson\nExemplos incorretos : _emerson ou anderson@ ou emerson silva\n		
		      \nAcao : Ira gerar um novo usuario somente se ele for novo e se existir uma chavepublica gerada pelo cookbook chavepublica.\n\n";
	}else{
		// Validacao do usuario
		//Validacao da composicao do login e seus caracteres
		$login = strtolower($parametro[0]);
		if (preg_match("/[a-z]/",substr($login,0,1)) != 1){
			echo "\nO primeiro caracter precisa ser uma letra válida\n\n";
			exit(3); 

		}
		if (preg_match("/[ç:;?+=!@#$%&*><éáíóúÁÉÍÓÚ]/",$login) == 1){
			echo "\nCaracter inválido no login.\n\n";
			exit(3); 
		}
		if (preg_match("/[a-z]{3,}[0-9\-_]?(\.{0,1}?)/",$login) == 0){
			echo "\nRegra de formação do login inconsistente !\n\n";
			exit(3);
		}
		// Verifica se pasta existe no servidor local
		$caminho = "/home/$login/.ssh/";
		file_exists($caminho) ? $pasta_local_existe = 1 : $pasta_local_existe = 0;
		// Verifica se existe a chave publica
		if ($pasta_local_existe == 1) {
		file_exists($caminho."$login.pub") ? $chave_local_existe = 1 : $chave_local_existe = 0;
			if ($chave_local_existe == 0){
				if (file_exists("$login.pub")){
				unlink("$login.pub");
				}
				captura_chave($caminho,$login);
			}else{
				if (strtoupper($parametro[1]) == "FORCE"){			
				if (file_exists($caminho."$login.pub")){
				unlink($caminho."$login.pub");
				}
				if (file_exists($caminho."authorized_keys")){
				unlink($caminho."authorized_keys");
				}
				captura_chave($caminho,$login);
				}else{
					echo "\nUsuario já possui chave publica cadastrada . Use o metodo FORCE caso deseje renovar\n\n";
					exit(3);
				}
			}	
		}
		else{ // Processamento se pasta local não existir
			exec_script("sudo useradd -g usuarios -s /bin/bash -m $login;");
			sleep(1);
			exec_script("sudo mkdir -m 0700 $caminho");
			echo "\nForam criadas as pastas necessarias ao processo\n\n";
			if (file_exists($caminho)){
				if(file_exists("$login.pub")){
				unlink("$login.pub");
				}
				captura_chave($caminho,$login);
			}
		}
	}
}// Encerra a funcao usuario_init
// Traz o arquivo do servidor externo para o local 
function captura_chave($caminho,$login){
	exec_script("yes 2>/dev/null | smbclient //SLNAS2/chaves -c 'get $login.pub'");
	sleep(1);				
	exec_script("cp $login.pub /home/$login/.ssh/$login.pub;
	sudo cat /home/$login/.ssh/$login.pub >> /home/$login/.ssh/authorized_keys;
	sudo chmod +x /home/$login/.ssh/ -R ;");
	if (file_exists($caminho."$login.pub")){
		echo "\nArquivo gravado com sucesso no servidor\n\n";
		unlink("$login.pub");
	}
} // Encerra a funcao captura_chave
