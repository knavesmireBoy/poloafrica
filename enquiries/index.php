<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/classes/Checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/classes/Utility.php';
include_once '../myconfig.php';

function buildMessage($k, $v, $flag){
    $ret = $flag ? '' : '\r\n\r\n';
    $str = ucfirst($k) . ': ' . $v;
    $msg = "Here is your message: \r\n\r\n";
    if($flag){
        $str .= $msg;
    }
    return $str . $ret;
}
    
$host = 'north.wolds@btinternet.com';
//$host = 'info@poloafrica.com';
$to = 'andrewsykes@btinternet.com';
$expected = array('name', 'email', 'msg', 'phone', 'addr1', 'addr2', 'addr3', 'addr4', 'postcode', 'country', 'comments');
$text = "Use this area for comments or questions";
$post_text = 'Please enter your message';
$state = '';
$fieldset = 'Poloafrica contact form';
//$pussy = "../images/resource/cat.jpg";
$item = 'item';
$echo = function(){};
$suspect = false;
$suspect_pattern = '/to:|cc:|bcc:|content-type:|mime-version:|multipart-mixed:|content-transfer-encoding:/i';
$pairs = array('phone' => 'email');
$empty = new Checker('this is a required field', new Negator(new Empti()));
//$comment = new Checker('Please enter your message', new Negator(new Equality($text)));
$subtext = substr($text, 0, 13);
$subpost_text = substr($post_text, 0, 13);
$isNum = new Checker('please supply a phone number', new PhoneNumber());
$isEmail = new Checker('please supply an email address', new isEmail());
$isName = new Checker('please supply name in the expected format: "FirstName Middle/LastName LastName"', new isName());
$comment = new Checker($post_text, new Negator(new Match("/^$subtext/")));
$postcomment = new Checker($post_text, new Negator(new Match("/^$subpost_text/")));
$required = array('name' => preconditions($empty, $isName), 'email'=>preconditions($empty, $isEmail)/*, 'comments' => preconditions($empty, $comment, $postcomment), 'phone' => preconditions($empty, $isNum)*/);

$results = ['page_title' => 'Enquiries'];
$style = 'enquiries';
include "../templates/header.php";
?>
<?php
$articles = ArticleFactory::getListByPage("enquiries");
$count = 2;
include "../templates/nav.php"
?>
<main class="override">
<section id="intro">
<input class="read-more-state" id="post1" type="checkbox">
<label class="read-more-trigger" for="post1"></label>
<?php

$article = $articles['Donations and sponsorship'];
$imagePaths = $article->getFilePath();
foreach($imagePaths as $image) : ?>
    <img id="<?php htmlout($image['dom_id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
    <?php endforeach;
        include '../templates/article_enq.php';
        $article = $articles['Holiday rates'];
        $count += 1;
        include '../templates/article_enq.php';
         $article = $articles['Contact us'];
        $count += 1;
        include '../templates/article_enq.php'
        ?>
        </section>
    <section id="post">
        <input class="read-more-state" id="post4" type="checkbox">
        <label class="read-more-trigger" for="post4"></label>
        <article id="contactarea" class="alt">
            <h3><a href="#" id="contact_form">Poloafrica contact form</a></h3>
            
            <?php
            if(!empty($_POST)){
                $message = ''; 
                $missing = array();
                //genuine values trimmed, suspect values ('To:') /etc replaced with a single space /^\s$/
                //input type of image buttons returning x and y values in form submission
                $data = array_map('spam_scrubber', array_slice($_POST, 0, count($_POST)-2));
                $suspect = !empty(array_filter($data, 'single_space'));
                //honeypot
                if(!$suspect && $_POST['url']){
                    $suspect = true;
                    
                }
                if(!$suspect){
                    foreach ($data as $k => $v) {
                        if(isset($required[$k])){
                            $res = $required[$k]('identity', $v);
                            //$res will be a string if valid, or an array of issues
                            if(is_array($res)){
                                $missing[$k] = $res;
                                $k = null;
                            }
                        }
                       if(in_array($k, $expected)){
                            ${$k} = trim($v);
                            $message .= buildMessage($k, $v, $k === 'comments');
                        }
                    }//each
                }
                var_dump($email);
                    //if submit button hit without ANYTHING being entered
                if(empty($missing)) { 
                    $message = wordwrap($message, 70);
                    $headers = "From: $host";
                    $headers .= 'Content-Type: text/plain; charset=utf-8';
                    $headers .= "\r\nReply-To: {$data['email']}";
                    $mailsent = mail($host, 'Website Enquiry', $message, $headers);
                    if($mailsent) { 
                        unset($missing);
            ?>
            <div id="response">
                <img alt="" id="dogs" name="dogs" src="../images/resource/016.jpg">
                <div><h1>Thankyou for your enquiry</h1>
                    <p>An email has been sent to <a href="mailto:<?php htmlout($email);?>"><?php htmlout($email); ?></a></p>
                    <p><em>Here is your message</em>:</p>
                    <p class="msg"><?php htmlout($comments); ?></p>
                </div>
                <img alt="cat" src="../images/resource/cat_gone.jpg" id="cat">
            </div>
            <?php }//sent
                else { ?>
                <div id="response">
                    <h1 class="warning">Sorry, There was a problem sending your message. PLease try again later.</h1></div>
            <?php }//not sent
            }//ok
            else {
                $item = count($missing) > 1 ? 'items' : 'item';
                $fieldset = "Please complete the missing $item indicated";
                $state = 'warning';
                $echo = flushMsg($missing, $data);
                //https://stackoverflow.com/questions/24403817/html5-required-attribute-one-of-two-fields
                include 'form.html.php';//sticky
            }
        }//posted
    else if(!isset($missing)){//not yet posted
        $item = null;//used as a flag to supply default text to textarea
        include 'form.html.php';//new
    }
            ?>
        </article>
    </section>
    <?php
    $article = $articles['Directions'];
    $count = 5;
    include '../templates/article.php';
    ?>
</main>
<?php 
include "../templates/footer.php";
//echo "<script src='../js/enq.js'></script></body></html>";