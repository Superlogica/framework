mkdir Superlogica; mkdir Superlogica/vagrant; mkdir Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://files.vagrantup.com/lucid32.box
vagrant init desenv http://files.vagrantup.com/lucid32.box
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
$sharedFolder = "$pwd/../sdk";
Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder '$sharedFolder' , '/home/apps'";
Add-Content "$pwd/Vagrantfile" "cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/getkit.sh; sudo bash getkit.sh $args[1];"
Add-Content "$pwd/Vagrantfile" 'end'
vagrant plugin install vagrant-vbguest;
vagrant up