<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';

$decorate = prefixer('the ', array('trust', 'scholars', 'place'));
function F($str){
    $pp = Article::getPages($style);
    $titles = Article::getTitles($style);
    foreach($pp as $p){
    
    if($p === $style){
        echo "<li><a href='.'>$style</a><ul>";
        foreach ($titles as $t){
            $id = '#' . strip($t);
            $title = $decorate($t);
            echo "<li><a href='$id'>$title</a></li>";
        }
        echo '</ul></li> ';
    }
        else {
            echo "<li><a href='../$t'>$t</a></li>";
        }
}
}
?><nav id="main_nav">
                    <label class="menu" for="menu-toggle"></label>
                    <input id="menu-toggle" type="checkbox">
                    <ul id="nav">
						<li><a href="..">home</a></li>
						<li><a href="../trust">the trust</a></li>
						<li><a href="../scholars">the scholars</a></li>
						<li><a href="../place">the place</a></li>						
						<li><a href="../stay">your stay</a></li>						
						<li><a href=".">polo</a>
								<ul>
								<li><a href="#facilities">facilities</a></li>
								<li><a href="#ponies">ponies</a></li>
								<li><a href="#team">our team</a></li>
								<li><a href="#poloday">your polo day</a></li>								
								</ul>
								</li>
						<li><a href="../medley">medley</a></li>
						<li><a href="../enquiries">enquiries</a></li>
						<li><a href="../photos">photos</a></li>
			</ul>
                    </nav>