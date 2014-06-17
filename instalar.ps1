mkdir Superlogica; mkdir Superlogica/vagrant; mkdir Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://files.vagrantup.com/lucid32.box
vagrant init desenv http://files.vagrantup.com/lucid32.box
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
$sharedFolder = "$pwd/../sdk";
Add-Content "$pwd/Vagrantfile" "config.vm.provision 'shell', inline: 'sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant plugin install vagrant-vbguest;
vagrant provision
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
If ($args[0] = 'cloud-apps'){
	$sharedFolder = "$pwd/../sdk";
	Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder '$sharedFolder' , '/home/apps'";
} 
Else 
{
	Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder 'C:/git/cloud' , '/home/cloud'";
}
Add-Content "$pwd/Vagrantfile" "config.vm.provision 'shell', inline: 'cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/$args[0] --no-check-certificate; sudo bash $args[0];'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant up
mkdir $pwd/../sdk/public/scripts/min;
mkdir $pwd/../sdk/session;