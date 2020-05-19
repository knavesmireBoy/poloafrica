<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8"><!-- IE compatibility mode issue -->
	<meta content="IE=edge" http-equiv="X-UA-Compatible">
	<meta content="width=device-width, initial-scale=1" name="viewport">
	<title>Enquiries</title>
	<link href="../css/standard.css" media="screen" rel="stylesheet">
	<link href="../css/enq.css" media="screen" rel="stylesheet">
	<link href="../css/myenq.css" media="screen" rel="stylesheet">
    <link href="../css/print.css" media="print" rel="stylesheet">
     	<script>
	document.cookie='resolution='+Math.max(screen.width,screen.height)+'; path=/'; 
	</script>
	<script src="../js/modernizr.js"></script>

    <!--[if (gte IE 6)&(lte IE 8)]>
<script src="../js/jquery.js"></script>
  <script src="../js/selectivizr.js"></script>
<link href="../css/hacks.css" media="screen" rel="stylesheet">
<![endif]-->
</head>
<body id="enquiries">
    <div id="wrap">
     <header>
                <a href=".">
			<h1>POLOAFRICA<img src="../images/logo_alt.png"></h1></a>
                <nav id="main_nav">
                       <label class="menu" for="menu-toggle"></label>
                <input id="menu-toggle" type="checkbox">
			<ul id="nav">
				<li><a href="..">home</a></li>				
				<li><a href="../trust">the trust</a></li>
				<li><a href="../scholars">the scholars</a></li>				
				<li><a href="../place">the place</a></li>				
				<li><a href="../stay">your stay</a></li>		
				<li><a href="../polo">polo</a></li>
				<li><a href="../medley">medley</a></li>					
				<li><a href=".">enquiries</a>
                <ul><li><a href="#donations">donations and sponsorship</a></li>
                    <li><a href="#rates">holiday rates</a></li>
                    <li><a href="#contact">contact us</a></li>
                    <li><a href="#contactform">contact form</a></li>
                    <li><a href="#directions">directions</a></li>
							</ul></li>					
				<li><a href="../photos" target="_top">photos</a></li>
			</ul></nav></header>
        	<h2>
				<span>enquiries</span>
			</h2>
	<main class="override">
		<article id=intro>
            <input class="read-more-state" id="post1" type="checkbox">
            <label class="read-more-trigger" for="post1"></label>
            <img src="../images/TruckGrooms_sh.jpg" alt="grooms on truck" id="grooms">
            <section>
			 <a href="#" id="donations"><h3>Donations and sponsorship</h3></a>
			<p>Poloafrica continually seeks support from those that believe in our mission. If you would like to donate, or if you are interested in sponsorship opportunities, then we would like to hear from you. See <a href="#contactform">contact us</a> below.
			</p>
            </section>
            <input class="read-more-state" id="post2" type="checkbox">
            <label class="read-more-trigger" for="post2"></label>
			 <section><a href="#" id="rates"><h3>Holiday rates</h3></a>
			<p>The cost of your visit to Uitgedacht Farm will depend on the nature of the programme you desire, please <a href="#contactform">contact us</a> to discuss your holiday. If you decide to holiday with us, know that you are helping to enable a life enriching effort. Explore this site to find out more about the Trust.
			</p></section>
            <input class="read-more-state" id="post3" type="checkbox">
            <label class="read-more-trigger" for="post3"></label>
             <section><a href="#contactform" id="contact"><h3>Contact us</h3></a>
                 
			<p>If you wish to find out more about the Poloafrica Development Trust and how to support it, or if you wish to enquire about visiting us, please either email, call or write to us or fill out the contact form below. Any information submitted will be treated with utmost confidentiality.</p>
               <div id="cath">
                   <img src='../images/cath.jpg'>
            <address><p>
			Uitgedacht Farm<br>
			PO Box 1315<br>
			Ficksburg 9730<br>
			South Africa<br>
            </p>
                   
            <p>
			<b>tel: </b>(+27) 84 290 0000<br>
            <b>email: </b><a id="mail" href="mailto:info@poloafrica.com">info@poloafrica.com</a>
                </p></address>
                 </div>  
           
                 
            </section>
        </article>
          
            <article>
        <input class="read-more-state" id="post4" type="checkbox">
        <label class="read-more-trigger" for="post4"></label>
       <section id="contactarea" class="alt">
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
                </section>
        
        </article>
        <article>
        <input class="read-more-state" id="post5" type="checkbox">
            <label class="read-more-trigger" for="post5"></label>
            <section><a href="#" id="directions"><h3>Directions</h3></a>
               <p>Please download these files for detailed directions by road from <a href="../pdf/Directions from BLOEMFONTEIN_v3.pdf" target="_blank">Bloemfontein</a>, <a href="../pdf/Directions from DURBAN and PIETERMARITZBURG_v3.pdf" target="_blank">Durban</a>, <a href="../pdf/Directions from DURBAN and PIETERMARITZBURG_v3.pdf" target="_blank">Pietermaritzburg</a> or <a href="../pdf/Directions from JOBURG_v3.pdf" target="_blank">Johannesburg</a>.  A reminder for those that already know the farm, we have restored the old road leading down the mountain on the eastern side of the polo field. This cuts out 25 minutes of the journey from Natal or Joburg. This top road is explained in the directions. The GPS coordinates for the farm are lat -28.768, lon 28.008 (28 46 05S, 28 00 30E). <a href="https://www.google.com/maps/place/-28.768,28.008/@-28.768,28.008,7z" target="_blank">[Google Map]</a></p>
            </section>
                </article>
        </main></div>
    <footer>
        <div id="footer_girl">
			<a href="#"><img src="../images/footer_girl.png"></a>
            <a href="."><b>tel: </b>(+27) 84 290 0000</a>
            <a href="mailto:info@poloafrica.com"><b>email: </b>info@poloafrica.com</a>
		</div>
        <div id="fb">
            <a href="https://www.instagram.com/poloafrica/" id="InstagramIcon" target="_blank"><img alt="Instagram icon" src="../images/instagram_drop.png"></a> <a href="https://www.facebook.com/Poloafrica-Development-Trust-301491696614583/" id="FacebookBadge" target="_blank"><img alt="Facebook badge" src="../images/like-us-on-facebook-png-black-1.png"></a>
        </div>
        <a href="mailto:photos@mwinsight.com">photos by <b>mark ward</b></a>
    </footer>
    <script src="../js/viewportSize.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/ajax.js"></script>
    <script src="../js/global.js"></script>
    
        <script>        
        var utils = poloAF.Util,
    	ptL = _.partial,
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
    	prepareAjax = function() {
    		var xhr = poloAF.Hijax();
    		xhr.setContainer(document.forms[0]);
    		xhr.setCanvas(utils.$('contactarea'));
    		xhr.setUrl("response.php");
    		xhr.setLoading(function() {
    			displayLoading(utils.$('contactarea')).render();
    		});
    		xhr.setCallback(function() {
    			utils.fadeUp(utils.$('contactarea'), 255, 255, 204);
    		});
    		xhr.captureData();
    	};
            window.onload = prepareAjax;
                            
    </script>
       <script>


    </script>
</body>
</html>