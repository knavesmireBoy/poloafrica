<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/classes/Checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/classes/Utility.php';
include_once '../myconfig.php';

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
    
$host = 'north.wolds@btinternet.com';
//$host = 'info@poloafrica.com';
$to = 'andrewsykes@btinternet.com';
$expected = array('name', 'email', 'msg', 'phone', 'addr1', 'addr2', 'addr3', 'addr4', 'postcode', 'country');
$missing = array();
$state = '';
$fieldset = 'Poloafrica contact form';
$item = 'item';
$echo = function(){};
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
            <?php if(empty($_POST)) {
            $item = null;
            include 'form.html.php';
        }
    elseif(!empty($_POST)){
        $data = array_map('spam_scrubber', $_POST);
        //$data = $_POST;
        $empty = new Checker('this is a required field', new Negator(new Empti()));
        $isNum = new Checker('must contain number', new Number());
        $isEmail = new Checker('format must match an email address', new isEmail());
        $isName = new Checker('please supply name in the expected format: "FirstName Middle/LastName LastName"', new isName());
        $required = array('name' => preconditions($empty, $isName), 'phone' => preconditions($empty, $isNum), 'email'=>preconditions($empty, $isEmail));
         //input type of image buttons returning x and y values in form submission
        $data = array_slice($data, 0, count($data)-2);
        
        foreach ($data as $k => $v){
            if(isset($required[$k])){
                $res = $required[$k]('identity', $v);
                //$res will be a string if valid, or an array of issues
                if(is_array($res)){
                    $missing[$k] = $res;
                    $k = null;
                }
            }
            if (in_array($k, $expected)){
                ${$k} = $k;
            }
        }
        
        if(empty($missing)) { ?>
            <div id="response">
                <img alt="" id="dogs" name="dogs" src="../images/resource/016.jpg">
                <div><h4>Thankyou for your enquiry, an email has been sent to <?php htmlout($data['email']); ?></h4><p>
                    <?php htmlout($data['msg']); ?>
            </p></div>
            <img alt="cat" src="../images/resource/cat.jpg" id="cat">
            </div>
            <?php }//empty
        else {
            $item = count($missing) > 1 ? 'items' : 'item';
            $fieldset = "Please complete the missing $item indicated";
            $state = 'warning';
            $echo = flushMsg($missing, $data);
            //https://stackoverflow.com/questions/24403817/html5-required-attribute-one-of-two-fields
            include 'form.html.php';
        }
    }//posted
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