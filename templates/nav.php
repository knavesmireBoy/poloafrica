<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
    
    function concatt($nm){
        return function($a, $i) use($nm) {
        return ucfirst($nm[$i]) . ' ' . ucfirst($a);
    };
    }

function whitelist($wl){
  return function($str) use ($wl){
      for($i=0; $i < count($wl); $i++){
          if(stristr($wl[$i], $str)){
              return $wl[$i];
          }
      }
      return ucfirst($str);
  };  
}
$whitey = array_map(concatt(array('your', 'the', 'the', 'the')), array('stay', 'trust', 'scholars', 'place'), array(0,1,2,3));

function F($style, $deco){
    $pp = array_reverse(Article::getPages($style));
    $titles = Article::getTitles($style);
    foreach($pp as $p){
        if($p['page'] === $style){
            $tt = strtolower($deco($style));
            echo "<li><a href='.'>$tt</a><ul>";
        foreach ($titles as $t){
            $tt = strtolower($t['title']);
            $id = '#' . str_replace(' ', '', $tt);
            $id = str_replace('the', '', $id);
            $title = $deco($t['title']);
            echo "<li><a href='$id'>$tt</a></li>";
        }
            echo '</ul></li> ';
        }
        else {
            $page = $p['page'];
            $mypage = strtolower($deco($page));
            echo "<li><a href='../$page'>$mypage</a></li>\n";
        }
    }
}
?>
<body id="<?php htmlout($style); ?>">
	<div id="wrap">
         <header>
             <a href=".">
			<h1>POLOAFRICA<img src="../images/logo_alt.png"></h1></a>
             <nav id="main_nav">
                 <label class="menu" for="menu-toggle"></label>
                 <input id="menu-toggle" type="checkbox">
                 <ul id="nav">
                     <?php F($style, whitelist($whitey)); ?>
                 </ul>
             </nav></header>
        <h2><span><?php htmlout($style); ?></span></h2>