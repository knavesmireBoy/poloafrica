<?php
$insert_action = "to place this article before another article enter the first three characters of the target article title. ";
$mypage = '';
 function getTextAreaHeight($str){
     return strtolower($str) == 'photos' ? '5em' : '30em';
    }
 function getDisplayLimit($str){
     return strtolower($str) == 'photos' ? 8 : 5;
    }
?>
<script>
    //onsubmit="closeKeepAlive()"
      // Prevents file upload hangs in Mac Safari
      // Inspired by http://airbladesoftware.com/notes/note-to-self-prevent-uploads-hanging-in-safari
      function closeKeepAlive() {
        if ( /AppleWebKit|MSIE/.test(navigator.userAgent)) {
          var xhr = new XMLHttpRequest();
          xhr.open( "GET", "/ping/close", false );
          xhr.send();
        }
      }
   </script>
<script src="../js/markup.js"></script>
<?php $results['heading'] = 'Edit Article';
include "admin.html.php"; ?>

      <form action="?action=<?php echo $results['formAction']?>" method="post" enctype="multipart/form-data" class="content">
        <input type="hidden" name="articleId" id="articleId" value="<?php echo $results['article']->id ?>"/>
          <?php if ( isset( $results['errorMessage'] ) ) { ?>
          <div class="errorMessage"><?php echo $results['errorMessage']; ?></div>
          <?php } 

             if (isset($remove)) { ?>
            <div class='buttons'> <?php echo $remove . "<strong>{$results['article']->title}</strong>?";?>
                <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
                <input type="hidden" name="page" value="<?php htmlout($results['article']->page); ?>">
                <input type="submit" name="action" value="Confirm">
                <input type="submit" id="abort" name="abort" value="Abort"></div>
            <?php } ?>
          
        <ul id="editList">
          <li>
            <label for="title">title</label>
            <input type="text" name="title" id="title" placeholder="Name of the article" required autofocus maxlength="255" value="<?php htmlout($results['article']->title)?>">
          </li>
          <li>
            <label for="summary">summary</label>
            <textarea name="summary" id="summary" placeholder="Brief description of the article" maxlength="1000" style="height: 5em;"><?php htmlout($results['article']->summary);?></textarea>
          </li>
          <li>
            <label for="content">content</label>
              <textarea name="content" id="content" placeholder="The HTML content of the article" maxlength="200000" style="height:<?php htmlout(getTextAreaHeight($results['article']->title)); ?>"><?php htmlout($results['article']->content);?></textarea>
          </li>
            <fieldset class="neue">
          <li id="datepage">
            <label for="pubDate">publication date</label>
              <?php 
              $now = new DateTime();
              ?>
            <input type="date" name="pubDate" id="pubDate" placeholder="YYYY-MM-DD" required maxlength="10" value="<?php echo date("Y-m-d", $now->getTimestamp());?>">
              <label for="page">page</label>
              <?php if(!empty($_REQUEST['page'])) {  $mypage = strtolower(html($_REQUEST['page'])); }
              else if(!empty($results['article']->page)) {  $mypage = strtolower($results['article']->page); }
              /*strtolower(htmlout($results['article']->page));*/?>
              <input name="page" id="page" placeholder="pagename" required maxlength="20" value="<?php echo $mypage; ?>">
              <label for="attr_id">identity</label>
              <input name="attr_id" id="attr_id" maxlength="20" value="<?php htmlout($results['article']->attrID); ?>">
            </li>
            </fieldset>            
            <?php if ($results['article']):
            $attributes = $results['article']->getFilePath(true);
            //exit(var_dump($attributes));
            //could be empty set
            if(isset($attributes[0])):
            $limit = getDisplayLimit($results['article']->title);
            $paginator = new PhotoPaginator($limit, count($attributes));
            $i = isset($_REQUEST['s']) ? $_REQUEST['s'] :  0;
            $paginator->setStart($i);
            //use the minimum of total count dataset OR display limit
            $end = min($i+$limit, count($attributes));
            echo "<li class='asset {$results['article']->page}'>";
            for($i; $i < $end; $i++):
            $attribute = $attributes[$i];
            echo '<figure>';
            include "../templates/attributes_route.php";
            include "../templates/attributes_edit.php";
            echo '</figure>';
            //endforeach;
            endfor;
            echo '</li>';
            $paginator->doNav();
            endif;//$attributes[0]
            endif;//$results['article']
            ?>
            <fieldset class="neue"><legend>add asset...</legend>
          <li>
            <label for="image">upload</label>
            <input type="file" name="asset" id="asset" placeholder="Choose an asset to upload" accept="image/*, video/*,.pdf">
          </li>
            <?php 
            include "../templates/attributes.php";
                ?>
            </fieldset>
          </ul>
          <?php if(!isset($remove)) { ?>
                    <fieldset class="buttons">
                        <input type="submit" name="saveChanges" value="Save Changes">
            <?php if ($results['article']->id) { ?>
            <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
            <input type="submit" name="action" value="Delete Article">
            <?php } ?>
            <input type="submit" name="cancel" formnovalidate value="Cancel">
              <?php
                    if(isset($mypage)){
                        echo '<label for="insert">INSERT BEFORE:</label>';
                    $rows = ArticleFactory::getTitles($mypage, true);
                    echo "<select name='insert' id='insert'><option value=''>$default_placement</option>";
                    foreach($rows as $k => $v){
                        echo "<option value='$k'>$v</option>";
                    }
                    echo '<option value="*">insert at end</option></select>'
                  ?>
                    
              <?php }
                   } ?>
        </fieldset>
      </form>
<script>
    var asset = document.querySelector('.asset');
    if(asset){
        asset.addEventListener('change',  function(e){
        if(e.target.type === 'checkbox' && e.target.name === 'editAsset[]'){
            e.target.parentNode.classList.toggle('edit');
        }
        });
    }
</script>
<a href=".">Article List</a>