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
     <script src="../js/viewportSize.js"></script>
    <script src="../js/shims.js"></script>
<script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/markup.js"></script>
<?php 
include "admin.html.php"; ?>

      <form action="?action=<?php echo $results['formAction']?>" method="post" enctype="multipart/form-data" class="content">
          <?php if ( isset( $results['errorMessage'] ) ) { ?>
          <div class="errorMessage"><?php echo $results['errorMessage']; ?></div>
          <?php } 

             if (isset($remove)) { ?>
            <div class='buttons'> <?php echo '<p>' .$remove . "<strong>{$results['article']->title}</strong>" . '?</p>';?>
                <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
                <input type="hidden" name="page" value="<?php htmlout($results['article']->page); ?>">
                <input type="submit" name="action" value="Confirm">
                <input type="submit" id="abort" name="abort" value="Abort"></div>
            <?php } ?>
          
        <ul id="editList">
          <li>
              <!-- default layout tool is inner-block so ensure no space between input and label, where poss-->
            <label for="title">title</label><input type="text" name="title" id="title" placeholder="Name of the article" required autofocus maxlength="255" value="<?php htmlout($results['article']->title)?>">
          </li>
          <li>
            <label for="summary">summary</label><textarea name="summary" id="summary" placeholder="Brief description of the article" maxlength="1000" style="height: 5em;"><?php htmlout($results['article']->summary);?></textarea>
          </li>
            <?php
            if($results['article']->page !== 'photos'): ?>
          <li class="edit-content">
            <label for="content">content</label><textarea name="content" id="content" placeholder="The HTML content of the article" maxlength="200000" style="height:<?php htmlout(getTextAreaHeight($results['article']->title)); ?>"><?php htmlout($results['article']->content);?></textarea>
          </li>
            <?php endif; ?>
            <li id="details" class="mock"><ul><li class="mocklabel">details</li><li class="neue">
              <label for="attr_id">id</label>
                <input name="attr_id" id="attr_id" maxlength="20" value="<?php htmlout($results['article']->attrID); ?>">
               <label for="page">page</label>
              <?php if(!empty($_REQUEST['page'])) {  $mypage = strtolower(html($_REQUEST['page'])); }
              else if(!empty($results['article']->page)) {  $mypage = strtolower($results['article']->page); }
              /*strtolower(htmlout($results['article']->page));*/?>
                <input name="page" id="page" placeholder="archive"  required maxlength="15" value="<?php echo $mypage; ?>">
            <label for="pubDate">published</label><?php $now = new DateTime();?>
                <input type="date" name="pubDate" id="pubDate" placeholder="YYYY-MM-DD" required maxlength="10" value="<?php echo date("Y-m-d", $now->getTimestamp());?>">
                <?php
                    if(isset($mypage)){ ?>
                <label for="insert">placement</label>
                  <?php 
                        $rows = ArticleFactory::getTitles($mypage, true);
                    echo "<select name='insert' id='insert'><option value=''>insert before</option>";
                    foreach($rows as $k => $v){
                        //exclude present title from dropdown list, nice
                       if($v != strtolower($results['article']->title)) {
                           echo "<option value='$k'>$v</option>";
                       }
                    }
                    echo '<option value="*">insert at end</option></select>';
                    } ?>
                
            </li></ul></li>            
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
            $end = min($i+$limit, count($attributes)); ?>
            <li class="mock"><ul><li class="mocklabel">assets</li><li class="asset">
                <?php
            for($i; $i < $end; $i++):
            $attribute = $attributes[$i];
            echo '<figure>';
            include "../templates/attributes_route.php";
            include "../templates/attributes_edit.php";
            echo '</figure>';
            //endforeach;
            endfor;
            echo '</li></ul></li>';
            $paginator->doNav();
            endif;//$attributes[0]
            endif;//$results['article']
            ?>
                <li class="mock"><ul><li class="mocklabel">uploads</li><li class="neue">
                    <input type="file" name="asset" id="asset" placeholder="Choose an asset to upload" accept="image/*, video/*,.pdf">
            <?php 
            include "../templates/attributes.php";
                ?></li></ul></li></ul>
          <?php if(!isset($remove)) { ?>
                    <fieldset class="buttons">
                        <input type="submit" name="saveChanges" value="Save Changes">
            <?php if ($results['article']->id) { ?>
            <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
            <input type="submit" name="action" value="Delete Article">
            <?php } ?>
            <input type="submit" name="cancel" formnovalidate value="Cancel">
                        <?php  }//if $remove ?>
        </fieldset>
            <input type="hidden" name="articleId" id="articleId" value="<?php echo $results['article']->id ?>">
            </form>
<script>
    var asset = document.querySelector('.asset');
    if(asset){
        asset.addEventListener('change',  function(e){
        if(e.target.type === 'checkbox' && e.target.name === 'editAsset[]'){
            e.target.parentNode.classList.toggle('edit');
        }
            if(e.target.type === 'checkbox' && e.target.name === 'deleteAsset[]'){
            e.target.parentNode.classList.toggle('del');
        }
        });
    }
</script>
<nav><a href="?page=<?php echo $mypage; ?>" title="Back to Article List" class="icon"><img src="../images/resource/icon_list.png"></a></nav>