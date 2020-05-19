<?php 
function IsInjected($str){
               $injections = array('(\n+)',
                                   '(\r+)',
                                   '(\t+)',
                                   '(%0A+)',
                                   '(%0D+)',
                                   '(%08+)',
                                   '(%09+)'
                                  );
               $inject = join('|', $injections);
               $inject = "/$inject/i";
               if(preg_match($inject,$str)){
                   return true;
               }
               else {
                   return false;
               }
           }
               
           $name = $_POST['name'];
           $email = $_POST['email'];
           $message = $_POST['msg'];
               /*
        $phone = $_POST['phone'];
           $addr1 = $_POST['addr1'];
           $addr2 = $_POST['addr2'];
           $addr3 = $_POST['addr3'];
           $country = $_POST['country'];
           $postcode = $_POST['postcode'];
           */
           
           $to = 'andrewsykes@btinternet.com';
           $body = "You have received a new message from the user $name.\n".
                            "Here is the message:\n $message";
               if(IsInjected($email)){
                   echo "Bad email value!";
                   exit();
               }
               
$message = wordwrap($body, 70, "\r\n");
$headers = 'From: info@poloafrica.com' . "\r\n" .
'Reply-To: info@poloafrica.com' . "\r\n" .
'X-Mailer: PHP/' . phpversion();
           
           if (!@mail('north.wolds@btinternet.com', 'PoloAfrica Enquiry',  $message, $headers)){
               exit('<p>Email could not be sent.</p>');  
           }
?>
<section><?php

               foreach($_POST as $post){
                   echo "<p>$post</p>\r\n";
               }
    ?></section>
           