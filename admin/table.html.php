<div id="pagelist"><table>
    <tr>
        <th>Publication Date</th>
          <th>Article</th>
        </tr>
<?php foreach ($articles as $article) { ?>
        <tr>
            <td><?php htmlout(date('j M Y', $article['pubDate'])); ?></td>
          <td>
              <?php $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : ''; ?>
            <a href="?action=editArticle&amp;articleId=<?php htmlout($article['id']); ?>&amp;page=<?php htmlout($page)?>"><?php htmlout($article['title']); ?></a>
          </td>
        </tr>
<?php } ?>
    </table>
    </div>