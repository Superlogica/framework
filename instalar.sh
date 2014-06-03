sudo mkdir Superlogica;
sudo curl https://github.com/Superlogica/framework/archive/master.zip -o /Superlogica/kit.zip
PWD = pwd;
cd Superlogica
sudo mv framework-master sdk
sudo cp -r /sdk/vagrant/* /vagrant
cd vagrant; ls;
vagrant box add desenv http://goo.gl/Y4aRr;
vagrant init desenv http://goo.gl/Y4aRr
cp PWD/templates/Vagrantfile PWD/Vagrantfile
FILE_PATH_EX = PWD/Vagrantfile;
SHARED_FOLDER = PWD/Superlogica/+"sdk";
"config.vm.synced_folder 'SHARED_FOLDER' , '/home/apps'" >> FILE_PATH_EX;
'end' >> FILE_PATH_EX
vagrant up  
vagrant plugin install vagrant-vbguest;
vagrant ssh default -c "sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;"
vagrant reload
vagrant ssh default -c 'sudo ./cloud-apps'