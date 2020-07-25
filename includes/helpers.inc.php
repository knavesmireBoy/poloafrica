<?php

function html($text)
{
return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }

function htmlout($text)
{
  echo html($text);
}

function markdown2html($text) {
    
$text = html($text);
  // strong emphasis
$text = preg_replace('/__(.+?)__/s', '<strong>$1</strong>', $text);
$text = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $text);
// emphasis
$text = preg_replace('/_([^_]+)_/', '<em>$1</em>', $text); $text = preg_replace('/\*([^\*]+)\*/', '<em>$1</em>', $text);
// Convert Windows (\r\n) to Unix (\n) $text = str_replace("\r\n", "\n", $text); // Convert Macintosh (\r) to Unix (\n) $text = str_replace("\r", "\n", $text);
// Paragraphs
$text = '<p>' . str_replace("\n\n", '</p><p>', $text) . '</p>'; // Line breaks
$text = str_replace("\n", '<br>', $text);
// [linked text](link URL)
    $text = preg_replace(
'/\[([^\]]+)]\(([-a-z0-9._~:\/?#@!$&\'()*+,;=%]+)\)/i', '<a href="$2">$1</a>', $text);
  return $text;
}

function markdownout($text)
{
  echo markdown2html($text);
}

function doQuery($pdo, $sql, $msg){
       try {
        return $pdo->query($sql);
       }
    catch(PDOException $e){
        $error = $msg . ' ' . $e->getMessage();
        include '../templates/error.html.php';
        exit();
    } 
}

function doPreparedQuery($st, $msg){
       try {
       return $st->execute();
    }
    catch(PDOException $e){
        $error = $msg . ' ' . $e->getMessage();
        header("Location: ?error=$error");
        exit();
    } 
}

function doPreparedQueryArray($st, $msg, $placeholders){
       try {
       return $st->execute($placeholders);
    }
    catch(PDOException $e){
        $error = $msg . ' ' . $e->getMessage();
        include '../../templates/error.html.php';
        exit();
    } 
}

function prepSQL($pdo, $sql){
    return $pdo->prepare($sql);
}

function isInt($arg){
    $int = (int)$arg;
    return is_int($int) && $int;
}

function makeQuery($conn, $sql, $msg){
       if($conn instanceof PDO){
           $class = 'selector';
       }
    else {
        $msg = null;
         $class = 'affector';
    }
        $class = ucfirst($class);
        require_once "../klass/$class.php";
        $q = new $class();
        return $q->makeQuery($conn, $sql, $msg);
}

function removeSpace($str){
    return strtolower(preg_replace('/\s+/', '', $str));
}