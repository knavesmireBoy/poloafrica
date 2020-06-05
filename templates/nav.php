<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
    
    function doConcat($first){
        return function($second, $i) use($first) {
        return ucfirst($first[$i]) . ' ' . ucfirst($second);
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

function outputWhen($output, $lookup){
    $t = strtolower($output['title']);
    if(isset($lookup[$t])){
       if(!empty($lookup[$t])){
           $output['title'] = $lookup[$t];
           $output['id'] = '#' . str_replace(' ', '', $lookup[$t]);
           return $output;
       }
          return false;
    }
       return $output;
}

function prepareHeading($title, $deco){
   $lookup = array('home' => 'Polo In Africa'); 
    return isset($lookup[strtolower($title)]) ? $lookup[strtolower($title)] : $deco($title);
}

$whitey = array_map(doConcat(array('your', 'the', 'the', 'the')), array('stay', 'trust', 'scholars', 'place'), array(0,1,2,3));

function performOutput($title, $deco, $flag = false){
    $token = $flag ? '#' : '';
    $id = str_replace('the', '', $token . str_replace(' ', '', strtolower($title)));
    return array( 'id' => $id, 'title' => strtolower($deco($title)));
}

function prepareNav($style, $deco){
    //prepared pages in reverse order (ie order entered into db), fix ?
    $pp = array_reverse(Article::getPages());
    $titles = Article::getTitles($style);
    $tv = array('beautiful news' => 'tv coverage', 'news24' => '', 'sport1' => '');

    foreach($pp as $p){
        if($p === $style){
            //if $style (ie: stay) is found in lookup array return decorated title
            $output = performOutput($p, $deco);
            echo '<li><a href=".">' . $output['title'] . '</a><ul>';
        foreach ($titles as $t){
            //tv articles get represented by one subnav heading
            $output = outputWhen(performOutput($t['title'], $deco, true), $tv);
            if($output){
                echo '<li><a href="' . $output['id'] . '">' . $output['title'] . '</a></li>';
            }
        }
            echo '</ul></li>';
        }
        else {
            $output = performOutput($p, $deco);
            echo '<li><a href="../' . $output['id'] . '">' . $output['title'] . '</a></li>';
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
                     <?php prepareNav($style, whitelist($whitey)); ?>
                 </ul>
             </nav></header>
        <h2><span><?php 
            //run heading through a lookup check
            htmlout(prepareHeading($style, whitelist($whitey)));
            ?></span></h2>