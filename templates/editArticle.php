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
            <textarea name="summary" id="summary" placeholder="Brief description of the article" maxlength="1000" style="height: 5em;"><?php echo htmlspecialchars( $results['article']->summary )?></textarea>
          </li>

          <li>
            <label for="content">Article Content</label>
            <textarea name="content" id="content" placeholder="The HTML content of the article" required maxlength="100000" style="height: 30em;"><?php echo htmlspecialchars( $results['article']->content )?></textarea>
          </li>

          <li>
            <label for="pubDate">Publication Date</label>
            <input type="date" name="pubDate" id="pubDate" placeholder="YYYY-MM-DD" required maxlength="10" value="<?php echo $results['article']->pubDate ? date( "Y-m-d", $results['article']->pubDate ) : "" ?>" />
          </li>

          <?php if ( $results['article']): 
                   $imagePaths = $results['article']->getImagePath();
                       foreach($imagePaths as $imagepath) : ?>
          <li class="articleImage">
            <img  src="<?php echo $imagepath['src'] ?>" alt="Article Image" title=""/>
              <!--<label><?php $path = Article::getFileName($imagepath['src']); echo $path?></label>-->
              <input type="checkbox" title= "Delete Image" name="deleteImages[]" id="<?php echo explode('.', $path)[0]; ?>" value="<?php echo explode('.', $path)[0]; ?>"/>
          </li>
          <?php endforeach; endif; ?>
          <li>
            <label for="image">New Image</label>
            <input type="file" name="image" id="image" placeholder="Choose an image to upload" maxlength="255" />
          </li>

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