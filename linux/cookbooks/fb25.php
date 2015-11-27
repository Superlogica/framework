<?php

function fb25_init(){
    //http://www.slideshare.net/mindthebird/firebird-on-linux
    //http://www.ibphoenix.com/resources/documents/search/doc_26
    
       $fb_ver = "2.5" ;
       $classic = "classic";
    //   exec_script("sudo add-apt-repository ppa:mapopa
    //            sudo apt-get update");

	exec_script("
		sudo sysctl -w net.ipv4.tcp_keepalive_time=60 net.ipv4.tcp_keepalive_probes=3 net.ipv4.tcp_keepalive_intvl=10
		sudo apt-get -y -q install firebird$fb_ver-super$classic subversion git-core
                sudo cp {$conf['basedir']}/firebird/*.so /usr/lib/firebird/$fb_ver/UDF
                sudo dpkg-reconfigure firebird$fb_ver-super$classic");
        //time_zone();         
//	exec("sudo fdisk /dev/sdc << EOF\nn\np\n1\n\n\nw\nEOF");
////        exec_script("sudo mkfs -t ext3 /dev/sdc1
//             
//         if (is_file("/dev/sdc1")){
//           exec_script("      
//                sudo sed '/sdc/d' /etc/fstab > /tmp/fstab.tmp; sudo mv /tmp/fstab.tmp /etc/fstab 
//                echo '/dev/sdc1 /home/cloud-db ext3 defaults 0 0' | sudo tee -a /etc/fstab");            
//         }  
//         
//         if (is_file("/dev/xvda1")){
//           exec_script("      
//                sudo sed '/xvd/d' /etc/fstab > /tmp/fstab.tmp; sudo mv /tmp/fstab.tmp /etc/fstab 
//                echo '/dev/xvda1 /home/cloud-db ext3 defaults 0 0' | sudo tee -a /etc/fstab");            
//         }                 
                

          
       if(PHP_INT_SIZE == 8){
           put_template("firebird/tbudf-64x.so", "/usr/lib/firebird/$fb_ver/UDF/tbudf.so");
       }else{
            put_template("firebird/tbudf.so", "/usr/lib/firebird/$fb_ver/UDF/tbudf.so");       
       }
       
       
          exec_script("      
                sudo mkdir /home/cloud-db
                sudo mount /home/cloud-db
		sudo chmod 444 /etc/init.d/postfix	
		sudo chown firebird.firebird /usr/lib/firebird/$fb_ver/UDF/*.so
                sudo ln -s /usr/lib/libfbclient.so.2.5.0 /usr/lib/libfbclient.so    
	");

exec_script("
         sudo ufw allow 3050
");            
          
        firebird_tunning(); 
        firebird_restart();
 
}


