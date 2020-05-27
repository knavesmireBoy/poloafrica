<script>
      // Prevents file upload hangs in Mac Safari
      // Inspired by http://airbladesoftware.com/notes/note-to-self-prevent-uploads-hanging-in-safari

      function closeKeepAlive() {
        if ( /AppleWebKit|MSIE/.test( navigator.userAgent) ) {
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

      <form action="?action=<?php echo $results['formAction']?>" method="post" enctype="multipart/form-data" onsubmit="closeKeepAlive()" class="content">
        <input type="hidden" name="articleId" value="<?php echo $results['article']->id ?>"/>

<?php if ( isset( $results['errorMessage'] ) ) { ?>
        <div class="errorMessage"><?php echo $results['errorMessage'] ?></div>
<?php } ?>

        <ul id="editList">
          <li>
            <label for="title">Article Title</label>
            <input type="text" name="title" id="title" placeholder="Name of the article" required autofocus maxlength="255" value="<?php echo htmlspecialchars( $results['article']->title )?>" />
          </li>

          <li>
            <label for="summary">Article Summary</label>
            <textarea name="summary" id="summary" placeholder="Brief description of the article" maxlength="1000" style="height: 5em;"><?php htmlout($results['article']->summary);?></textarea>
          </li>
            <li>
            <label for="attr_id">Article ID</label>
            <input name="attr_id" id="attr_id" maxlength="10" value="<?php htmlout($results['article']->attrID); ?>">
          </li>
          <li>
            <label for="content">Article Content</label>
            <textarea name="content" id="content" placeholder="The HTML content of the article" required maxlength="100000" style="height: 30em;"><?php htmlout($results['article']->content);?></textarea>
          </li>
          <li id="datepage">
            <label for="pubDate">Publication Date</label>
            <input type="date" name="pubDate" id="pubDate" placeholder="YYYY-MM-DD" required maxlength="10" value="<?php echo $results['article']->pubDate ? date( "Y-m-d", $results['article']->pubDate ) : "" ?>" />
              <label for="page">Page</label>
              <input name="page" id="page" placeholder="pagename" required maxlength="20" value="<?php strtolower(htmlout($results['article']->page)); ?>">
          </li>
          <?php if ($results['article']): 
                   $filepaths = $results['article']->getFilePath();
                   foreach($filepaths as $filepath) : ?>
            <li class="asset">
              <?php
              if(isset($filepath['src'])){
              $path = Article::getFileName($filepath['src']);
              $name = explode('.', $path)[0];
              ?>
            <img src="<?php htmlout($filepath['src']); ?>" alt="<?php htmlout($filepath['alt']); ?>" id="<?php htmlout($filepath['dom_id']); ?>"/>
                <?php }
                else {
                    $path = Article::getFileName($filepath['path']);
                    $name = explode('.', $path)[0];
                }
                ?>
                <span title="<?php htmlout($filepath['alt']); ?>"><?php htmlout($path); ?></span>
                <input type="checkbox" title= "Delete Asset" name="deleteAsset[]" id="<?php htmlout($filepath['id']); ?>" value="<?php htmlout($filepath['id']); ?>"/>
          </li>
            <?php include "../templates/attributes.php";
            endforeach; endif; ?>
            <div id="neue">
          <li>
            <label for="image">New Asset</label>
            <input type="file" name="asset" id="asset" placeholder="Choose an asset to upload" accept="image/*, video/*,.pdf">
          </li>
            <?php 
            if ($results['article']){
            if(!$results['article']->getFilePath()){
            $filepath = array('alt' => '', 'dom_id' => '');
            include "../templates/attributes.php";
            }
            }
            ?>
</div>
        </ul>

        <div class="buttons">
          <input type="submit" name="saveChanges" value="Save Changes">
            <?php if ( $results['article']->id ) { ?>
            <input type="hidden" name="articleId" value="<?php htmlout($results['article']->id); ?>">
            <input type="submit" name="action" value="Delete Article">
            <?php } ?>
            <input type="submit" formnovalidate name="cancel" value="Cancel">
        </div>
      </form>
<a href="..">Home</a>