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
	      \nTodos usuarios serao gerados com letras minusculas
	      \nNota:Somente usuarios com login formado por letras sem acentos , numeros ,'.' ,'-','_' sendo que \nesses caracteres não podem iniciar ou terminar o login . Outros caracteres não são aceitos!\n\nO login deve iniciar com letra e ter no minimo 3 digito para validação.\n\nGrupo de usuario padrao : usuarios
	      \nExemplos corretos : emerson.silva ou anderson\nExemplos incorretos : _emerson ou anderson@ ou emerson silva
	      \nAcao : Ira gerar um novo usuario somente se ele for novo e se existir uma chavepublica gerada pelo cookbook chavepublica.\nUse o modo FORCE para forçar o processo \n\n";
	return;
	}
	//Gera a lista de todos usuarios para ser gerados de uma vez	
    if ($login == "all"){
        @exec_script("sudo rm -rf outline;yes 2>/dev/null | smbclient //SLNAS2/chaves -c 'get outline';");
        $conteudo = @file("outline");
        foreach ($conteudo as $linha){
            //Insere todos usuarios presentes no outline
        processa_usuario((trim(explode(";",base64_decode($linha))[0])),(trim(explode(";",base64_decode($linha))[1])),$acao,true);
        }
    @exec_script("sudo rm -rf outline ;");
    return;
}
// Insere apenas um usuario
processa_usuario($login,$grupo,$acao);
}// Encerra a funcao usuario_init
// Traz o arquivo do servidor externo para o local 
function captura_chave($caminho,$login){
	@exec_script("sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/publickeys/$login.pub --no-check-certificate;");
    sleep(1);				
    @exec_script("cp $login.pub /home/$login/.ssh/$login.pub;");
    if (file_exists($caminho."$login.pub")){
        @exec_script("sudo cat /home/$login/.ssh/$login.pub >> /home/$login/.ssh/authorized_keys;
	sudo chmod +x /home/$login/.ssh/ -R ;");
	echo "\nArquivo gravado com sucesso no servidor\n\n";
	@unlink("$login.pub");
	}else{
            echo "\nNão tem arquivo no servidor ou rede instavel.Procure o suporte\n\n";
	}	
} // Encerra a funcao captura_chave
// Funcao para processamento dos usuarios
function processa_usuario($login,$grupo,$acao,$todos=false){
// Validacao do grupo usuarios . Funções PHP só traz dados do usuario corrente.
@exec_script("sudo cp /etc/group ./;sudo chmod +x group;"); // Traz grupo para pasta local
$grupos_server = file("group");
    foreach($grupos_server as $chave=>$valor){
        $grupos_tratados[$chave] = explode(":",$valor)[0]; //Explode devolve Array de string
	}
@unlink("group"); // Apaga group de pasta local
    if (!in_array($grupo,$grupos_tratados)){
        echo "\nGrupo $grupo não existe neste servidor.Tente novamente ou contate o suporte !\n\n";
	exit(3);
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
	exec_script("sudo mkdir -m 444 $caminho");
	echo "\nForam criadas as pastas necessarias ao processo\n\n";
	@unlink("$login.pub");
	captura_chave($caminho,$login);
	}
//Gerar acrescenta novo usuario / grupo no arquivo de backup
    if (!$todos){
        @exec_script("sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/publickeys/outline --no-check-certificate;");
	$conteudo = @file("outline");
	if (!@in_array(trim("$login;$grupo"),@array_map('trim',$conteudo))){
            @file_put_contents("outline",base64_encode(trim("$login;$grupo"))."\n",FILE_APPEND);
            exec_script("sudo yes 2>/dev/null | smbclient //SLNAS2/chaves -c 'put outline';");
            sleep(1);
            exec_script("sudo rm -rf outline;");					
        }   
    }
} // Final da processa_usuario
