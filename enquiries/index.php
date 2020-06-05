<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Enquiries'];
$style = 'enquiries';
include "../templates/header.php";
?>
<?php
$articles = Article::getListByPage("enquiries");
$count = 1;
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
         include '../templates/article_sans.php';
        $article = $articles['Holiday rates'];
        $count += 1;
        include '../templates/article_alt.php';
            $article = $articles['Contact us'];
        $count += 1;
        include '../templates/article_alt.php'
        ?>
        
        </section><section id="post">
        <input class="read-more-state" id="post4" type="checkbox">
        <label class="read-more-trigger" for="post4"></label>
       <article id="contactarea" class="alt">
           <?php if(!isset($_POST['email'])) { ?>
           <a href="#" id="contact_form"><h3>Poloafrica contact form</h3></a>
           <!--<form action="http://www.poloafrica.com/cgi-bin/nmsfmpa.pl" id="contactform" method="post" name="contactform">-->
           <form action="?" method="post" id="contactform"  name="contactform" >
				<fieldset>
					<legend>&nbsp;Poloafrica contact form&nbsp;</legend>
						<label for="name">name</label><input id="name" tabindex="1" type="text" name="name" required pattern ="\S+\s\S{2,}">
                        <label for="phone">phone</label><input id="phone" tabindex="2" type="tel" name="phone" pattern ="\d{7,}">
                        <label for="email">email</label><input id="email" type="email" name="email" tabindex="3" required><label for="addr1">address</label><input id="addr1"  name="addr1"  tabindex="4" type="text"><label for="addr2">address</label><input id="addr2" name="addr2" tabindex="5" type="text"><label for="addr3">address</label><input id="addr3" name="addr3" tabindex="6" type="text"><label for="country">country</label><input id="country" name="country" tabindex="7" type="text">
                    <label for="postcode">postcode</label><input id="postcode" name="postcode" tabindex="8" type="text">
				</fieldset>
               <fieldset>
                   <textarea id="msg" name="msg" tabindex="9">Use this area for comments or questions</textarea><input alt="" src="../images/dogsform.gif" tabindex="10" type="image" name="dogs" id="dogs">
               <input type="submit"></fieldset>
            </form><figure><img alt="cat" src="../images/cat.jpg" id="cat"></figure>
           <?php }
           else { include "response.php"; } ?>
                </article>
        </section>
        <?php
            $article = $articles['Directions'];
                $count = 5;
                include '../templates/article.php';
         ?>
       
        </main></div>
<?php include "../templates/footer.php" ?>
    <script src="../js/viewportSize.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/ajax.js"></script>
    <script src="../js/global.js"></script>
    
        <script>        
        var utils = poloAF.Util,
    	ptL = _.partial,
            clicker = ptL(utils.addHandler, 'click'),
            
    	makeElement = utils.machElement,
    	anCr = utils.append(),
    	setAttrs = utils.setAttributes,
    	klasAdd = utils.addClass,
    	displayLoading = function(ancor, conf) {
    		return makeElement(ptL(klasAdd, 'loading'), ptL(setAttrs, {
    			alt: 'loading',
    			src: "../images/progressbar.gif"
    		}), anCr(ancor), utils.always('img'));
    	},
            myform = document.forms[0],
            legend = utils.getByTag('legend', myform)[0],
    	prepareAjax = function() {
    		var xhr = poloAF.Hijax();
    		xhr.setContainer(myform);
    		xhr.setCanvas(utils.$('post'));
    		xhr.setUrl("response.php");
    		xhr.setLoading(function() {
    			displayLoading(utils.$('post')).render();
    		});
    		xhr.setCallback(function() {
    			utils.fadeUp(utils.$('post'), 255, 255, 204);
    		});
    		xhr.captureData();
    	},
            relocate = function(e){
                if(e.target.nodeName.toLowerCase() === 'legend'){
                    window.location.assign("../admin");
                }
            };
            window.onload = prepareAjax;            
            utils.addEvent(clicker, relocate)(myform);
                            
    </script>
       <script>


    </script>
</body>
</html>