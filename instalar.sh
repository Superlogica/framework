sudo mkdir Superlogica; sudo chmod -R 777 Superlogica; sudo mkdir Superlogica/vagrant; sudo chmod -R 777 Superlogica/vagrant; sudo mkdir Superlogica/sdk; sudo chmod -R 777 Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://files.vagrantup.com/lucid32.box;
vagrant init desenv http://files.vagrantup.com/lucid32.box
sudo rm -rf Vagrantfile;
sudo curl https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile -o Vagrantfile
sudo chmod 777 Vagrantfile
echo "config.vm.synced_folder '${PWD}/../sdk' , '/home/apps'" >> Vagrantfile;
echo "config.vm.provision 'shell', inline: 'cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/cloud-apps; sudo bash cloud-apps --no-check-certificate;'" >> Vagrantfile;
echo 'end' >> Vagrantfile
vagrant plugin install vagrant-vbguest;
vagrant up  
sudo mkdir ${PWD}/../sdk/public/scripts/min; sudo chmod -R 777 ${PWD}/../sdk/public/scripts/min; 
sudo mkdir ${PWD}/../sdk/session; sudo chmod -R 777 ${PWD}/../sdk/session;
sudo chmod -R 777 ${PWD}/../sdk;