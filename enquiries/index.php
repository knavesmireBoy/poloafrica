<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once '../myconfig.php';

$results = ['page_title' => 'Enquiries'];
$style = 'enquiries';
include "../templates/header.php";
$articles = ArticleFactory::getListByPage("enquiries");
$count = 2;
include "../templates/nav.php"
?>
<main class="override">
<section id="intro">
<input class="read-more-state" id="post1" type="checkbox">
<label class="read-more-trigger" for="post1"></label>
<?php
$article = $articles['Donations and sponsorship'];
$imagePaths = $article->getFilePath();
foreach($imagePaths as $image) : ?>
    <img id="<?php htmlout($image['dom_id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
    <?php endforeach;
        include '../templates/article_enq.php';
        $article = $articles['Holiday rates'];
        $count += 1;
        include '../templates/article_enq.php';
         $article = $articles['Contact us'];
        $count += 1;
        include '../templates/article_enq.php'
        ?>
        </section>
    <section id="post">
        <input class="read-more-state" id="post4" type="checkbox">
        <label class="read-more-trigger" for="post4"></label>
        <article id="contactarea" class="alt">
            <h3><a href="#" id="contact_form">Poloafrica contact form</a></h3>
            <?php include 'action.php'; ?>
        </article>
    </section>
    <?php
    $article = $articles['Directions'];
    $count = 5;
    include '../templates/article.php';
    ?>
</main>
<?php 
include "../templates/footer.php";
echo "<script src='../js/enquiries.js'></script></body></html>";
//echo "</body></html>";