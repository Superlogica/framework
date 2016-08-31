<?php 
/*
Autor : Emerson Silva - 05/08/2016
Funcao : Criar usuarios em servidor e habilitar chave publica no servidor
Teste e revisao : Jean Rodrigues
*/
function usuario_init($login,$grupo="usuarios",$acao=null){
// Valida os parametros recebidos
$login = strtolower($login);
// Nao inverter ordem da acao e grupo abaixo	
$acao = ($grupo == "force") ? "force"  :strtolower($acao);
$grupo = ($grupo == "force") ? "usuarios" :  strtolower($grupo);
$parametro_invalido = (($acao != null) and ($acao != 'force'));
    if ($parametro_invalido or ($login == 'force')) {
        echo "\nParâmetro inválido ou login de usuário com formato errado/faltante !\n\n";
	exit(3);
	}
    // Gera o help
    if ($login == 'help'){
        echo "\n\n======> Bem-vindo ao HELP do cookbook usuarios ! <======\n
              \nA estrutura do cookbook é : sudo cloud-init usuario login <grupo> <modo>
              \nExemplo : sudo cloud-init usuario emerson
	      \nExemplo 2(forcando a criacao de um usuario)  : sudo cloud-init usuario emerson force
	      \nExemplo 3 (Gerando um usuario para o grupo suporte) : sudo cloud-init usuario emerson suporte
	      \nExemplo 4 (forcando a criacao de um usuario para o grupo suporte)  : sudo cloud-init usuario emerson suporte force
          \nExemplo 5 (Excluindo um usuario em definitivo)  : sudo cloud-init usuario emerson excluir 
	      \nTodos usuarios serao gerados com letras minusculas
	      \nNota:Somente usuarios com login formado por letras sem acentos , numeros ,'.' ,'-','_' sendo que \nesses caracteres não podem iniciar ou terminar o login . Outros caracteres não são aceitos!\n\nO login deve iniciar com letra e ter no minimo 3 digito para validação.\n\nGrupo de usuario padrao : usuarios
	      \nExemplos corretos : emerson.silva ou anderson\nExemplos incorretos : _emerson ou anderson@ ou emerson silva
	      \nAcao : Ira gerar um novo usuario somente se ele for novo e se existir uma chavepublica gerada pelo cookbook chavepublica.\nUse o modo FORCE para forçar o processo \n\n";
	return;
	}
// Insere apenas um usuario
processa_usuario($login,$grupo,$acao);
}// Encerra a funcao usuario_init
// Traz o arquivo do servidor externo para o local 
function captura_chave($caminho,$login){
	@exec_script("sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/publickeys/$login.pub --no-check-certificate;");
    sleep(1);				
	put_template("publickeys/$login.pub","/home/$login/.ssh/$login.pub");  
  if (file_exists($caminho."$login.pub")){
    @exec_script("sudo cat /home/$login/.ssh/$login.pub >> /home/$login/.ssh/authorized_keys;
	sudo chmod 500 /home/$login/.ssh/ -R ;
    sudo chown -R $login:$grupo /home/$login/.ssh/ ;");
	echo "\nArquivo gravado com sucesso no servidor\n\n";
	@unlink("$login.pub");
	}else{
        echo "\nNão tem arquivo no servidor ou rede instavel.Procure o suporte\n\n";
	}	
} // Encerra a funcao captura_chave
// Funcao para processamento dos usuarios
function processa_usuario($login,$grupo,$acao,$todos=false){
// Valida usuario logado
if (posix_getlogin() == $login){
	echo "\nUsuario logado - processo não permitido\n\n";
	exit(3);
}
// Excluir usuario do servidor especificando o grupo ou n�o como parametro 
if ((strtolower($grupo)=='excluir') or (strtolower($acao)=='excluir')) {
	exec_script("sudo userdel -r $login;");
	exit(3);
} 
// Validacao do grupo usuarios . Funções PHP só traz dados do usuario corrente.
@exec_script("sudo cp /etc/group ./;sudo chmod +x group;"); // Traz grupo para pasta local. Depois sera apagado.
$grupos_server = file("group");
    foreach($grupos_server as $chave=>$valor){
        $grupos_tratados[$chave] = explode(":",$valor)[0]; //Explode devolve Array de string
	}
    @unlink("group"); // Apaga group de pasta local
    // Adiciona o grupo caso o mesmo n�o exista
    if (!in_array($grupo,$grupos_tratados)){
        @exec_script("sudo groupadd $grupo;");
	}
    //Valida primeiro caracter do login
    if (!(bool)preg_match("/[a-z]/",substr($login,0,1))){
       echo "\nCaracter invalido no inicio, use somente letras sem acentua��o\n\n";
	   exit(3); 
	}
    //Valida se tem caracteres invalidos no meio do login
    if ((bool)preg_match("/[ç:;?+=!@#$%&*><éáíóúÁÉÍÓÚ]/",$login)){
       echo "\nCaracter invalido no meio do login\n\n";
	   exit(3); 
	}
    // Valida se login segue modelo de formatacao
    if (!(bool)preg_match("/[a-z]{3,}[0-9\-_]?(\.{0,1}?)/",$login)){
       echo "\nRegra de formação do login inconsistente !\n\n";
	   exit(3);
	}
// Verifica se pasta .ssh  existe no servidor local
$caminho = "/home/$login/.ssh/";
//Administra o parametro force para evitar erro
    if ((file_exists($caminho) and ($acao == 'force'))) {
       @unlink($caminho."$login.pub");
	   @unlink($caminho."authorized_keys");
	   captura_chave($caminho,$login);
	}
// Se nao ha usuário , criamos um novo no Linux e sua pasta .ssh		
    if (!file_exists($caminho)){
       exec_script("sudo useradd -g $grupo -s /bin/bash -m $login;");
	   sleep(1);
	   exec_script("sudo mkdir -m 500 $caminho");
	   echo "\nForam criadas as pastas necessarias ao processo\n\n";
	   @unlink("$login.pub");
	   captura_chave($caminho,$login);
	}
} // Final da processa_usuario
