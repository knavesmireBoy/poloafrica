<?php
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
      <div id="adminHeader">
        <h2>Poloafrica Admin</h2>
        <p>You are logged in with email: <b><?php htmlout( $_SESSION['email']) ?></b>. <a href="?action=logout"?>Log out</a></p>
      </div>
      <h3><?php echo $results['pageTitle']?></h3>

      <form action="?action=<?php echo $results['formAction']?>" method="post" enctype="multipart/form-data" class="content">
        <input type="hidden" name="articleId" id="articleId" value="<?php echo $results['article']->id ?>"/>

<?php if ( isset( $results['errorMessage'] ) ) { ?>
        <div class="errorMessage"><?php echo $results['errorMessage']; ?></div>
<?php } ?>

        <ul id="editList">
          <li>
            <label for="title">Article Title</label>
            <input type="text" name="title" id="title" placeholder="Name of the article" required autofocus maxlength="255" value="<?php htmlout($results['article']->title)?>" />
          </li>
          <li>
            <label for="summary">Article Summary</label>
            <textarea name="summary" id="summary" placeholder="Brief description of the article" maxlength="1000" style="height: 5em;"><?php htmlout($results['article']->summary);?></textarea>
          </li>
          <li>
            <label for="content">Article Content</label>
              <textarea name="content" id="content" placeholder="The HTML content of the article" maxlength="200000" style="height: <?php htmlout(getTextAreaHeight($results['article']->title)); ?>"><?php htmlout($results['article']->content);?>
              </textarea>
          </li>
          <li id="datepage">
            <label for="pubDate">Publication Date</label>
              <?php 
              $now = new DateTime();
              ?>
            <input type="date" name="pubDate" id="pubDate" placeholder="YYYY-MM-DD" required maxlength="10" value="<?php echo date( "Y-m-d", $now->getTimestamp()) ;?>" />
              <label for="page">Page</label>
              <input name="page" id="page" placeholder="pagename" required maxlength="20" value="<?php strtolower(htmlout($results['article']->page)); ?>">
              <label for="attr_id">Article DOM ID</label>
            <input name="attr_id" id="attr_id" maxlength="20" value="<?php htmlout($results['article']->attrID); ?>">
          </li>
            <?php if ($results['article']):
            $attributes = $results['article']->getFilePath(true);
            
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
            <div id="neue">
          <li>
            <label for="image">Add New Asset</label>
            <input type="file" name="asset" id="asset" placeholder="Choose an asset to upload" accept="image/*, video/*,.pdf">
          </li>
            <?php 
            include "../templates/attributes.php";
                ?>
            </div>
          </ul>
        <div class="buttons">
          <input type="submit" name="saveChanges" value="Save Changes">
            <?php if (isset($remove)) {
            echo "<p>$remove <strong>{$results['article']->title}</strong> ?</p>"; ?>
            <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
            <input type="submit" name="action" value="Confirm">
            <?php } 
            elseif ( $results['article']->id ) { ?>
            <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
            <input type="submit" name="action" value="Delete Article">
            <?php } ?>
            <input type="submit" formnovalidate name="cancel" value="Cancel">
        </div>
      </form>
<a href="..">Home</a>
<script src="../js/markup.js"></script>