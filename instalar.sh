sudo mkdir Superlogica; sudo chmod -R 777 Superlogica; sudo mkdir Superlogica/vagrant; sudo chmod -R 777 Superlogica/vagrant; sudo mkdir Superlogica/sdk; sudo chmod -R 777 Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://files.vagrantup.com/lucid32.box;
vagrant init desenv http://files.vagrantup.com/lucid32.box
sudo curl https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile -o Vagrantfile
echo "config.vm.synced_folder '${PWD}/../sdk' , '/home/apps'" >> Vagrantfile;
echo 'end' >> Vagrantfile
vagrant up  
vagrant plugin install vagrant-vbguest;
vagrant ssh default -c "sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;"
vagrant reload
vagrant ssh default -c 'cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/getkit.sh; sudo bash getkit.sh $1;
