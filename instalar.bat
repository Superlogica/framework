(new-object System.Net.WebClient).DownloadFile("https://github.com/Superlogica/framework/archive/master.zip","/Superlogica/kit.zip"); unzip kit.zip;
cd Superlogica;
ren framework-master sdk;
robocopy sdk/vagrant/* vagrant /e;
cd vagrant; vagrant box add desenv http://goo.gl/Y4aRr; vagrant init desenv http://goo.gl/Y4aRr; 
vagrant up;  
vagrant ssh;
