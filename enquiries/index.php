<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
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
        
        </section><section id="post">
        <input class="read-more-state" id="post4" type="checkbox">
        <label class="read-more-trigger" for="post4"></label>
       <article id="contactarea" class="alt">
           <?php if(!isset($_POST['email'])) { ?>
           <h3><a href="#" id="contact_form">Poloafrica contact form</a></h3>
           <!--<form action="http://www.poloafrica.com/cgi-bin/nmsfmpa.pl" id="contactform" method="post" name="contactform">-->
           <!-- The form is the ONLY 'article' that remains HARDCODED-->
           <form action="?" method="post" id="poloafricacontactform">
				<fieldset>
					<legend>&nbsp;Poloafrica contact form&nbsp;</legend>
						<label for="name">name</label><input id="name" tabindex="1" type="text" name="name" required pattern ="\S+\s\S{2,}">
                        <label for="phone">phone</label><input id="phone" tabindex="2" type="tel" name="phone" pattern ="\d{7,}">
                        <label for="email">email</label><input id="email" type="email" name="email" tabindex="3" required><label for="addr1">address</label><input id="addr1"  name="addr1"  tabindex="4" type="text"><label for="addr2">address</label><input id="addr2" name="addr2" tabindex="5" type="text"><label for="addr3">address</label><input id="addr3" name="addr3" tabindex="6" type="text"><label for="country">country</label><input id="country" name="country" tabindex="7" type="text">
                    <label for="postcode">postcode</label><input id="postcode" name="postcode" tabindex="8" type="text">
				</fieldset>
               <fieldset>
                   <textarea id="msg" name="msg" tabindex="9">Use this area for comments or questions</textarea><input type="image" alt="" src="../images/resource/dogsform.gif" tabindex="10" name="dogs" id="dogs">
                   <input type="submit" value="submit">
              </fieldset>
            </form><figure><img alt="cat" src="../images/resource/cat.jpg" id="cat"></figure>
           <?php }
           else {
               include "response.php";
           } ?>
                </article>
        </section>
        <?php
            $article = $articles['Directions'];
                $count = 5;
                include '../templates/article.php';
         ?>
        </main>
<?php echo '</div>'; include "../templates/footer.php";
echo "<script src='../js/enq.js'></script></body></html>";