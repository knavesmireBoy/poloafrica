<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/classes/Checker.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/classes/Utility.php';

function buildMessage($k, $v, $flag)
{
    $ret = $flag ? "" : "\r\n\r\n";//!MUST BE DOUBLE QUOTES!
    $str = ucfirst($k) . ': ' . $v;
    return $str . $ret;
}


$host = 'north.wolds@btinternet.com';
//$host = 'info@poloafrica.com';
$to = 'andrewsykes@btinternet.com';
$expected = array(
    'name',
    'email',
    'msg',
    'phone',
    'addr1',
    'addr2',
    'addr3',
    'addr4',
    'postcode',
    'country',
    'comments'
);
$text = "Use this area for comments or questions";
$post_text = 'Please enter your message';
$state = '';
$fieldset = 'Poloafrica contact form';
$item = 'item';
$echo = function ()
{
};
$suspect = false;
$suspect_pattern = '/to:|cc:|bcc:|content-type:|mime-version:|multipart-mixed:|content-transfer-encoding:/i';
$pairs = array(
    'phone' => 'email'
);
$empty = new Checker('this is a required field', new Negator(new Empti()));
$subtext = substr($text, 0, 13);
$subpost_text = substr($post_text, 0, 13);
$isNum = new Checker('please supply a phone number', new PhoneNumber());
$isEmail = new Checker('please supply an email address', new isEmail());
$isName = new Checker('please supply name in the expected format: "FirstName Middle/LastName LastName"', new isName());
$comment = new Checker($post_text, new Negator(new Match("/^$subtext/")));
$postcomment = new Checker($post_text, new Negator(new Match("/^$subpost_text/")));
$required = array(/*
    'name' => preconditions($empty, $isName) ,
    'email' => preconditions($empty, $isEmail) ,
    'comments' => preconditions($empty, $comment, $postcomment)*/
);

if (!empty($_POST))
{
    $message = '';
    $missing = array();
    //genuine values trimmed, suspect values ('To:') /etc replaced with a single space /^\s$/
    //input type of image button returning x and y values in form submission BUT NOT WITH AJAX
    //$data = array_map('spam_scrubber', array_slice($_POST, 0, count($_POST) - 2));
    $data = array_map('spam_scrubber', $_POST);
    $suspect = !empty(array_filter($data, 'single_space'));
    //honeypot
    if (!$suspect && $_POST['url'])
    {
        $suspect = true;
    }
    if (!$suspect)
    {
        foreach ($data as $k => $v)
        {
            if (isset($required[$k]))
            {
                $res = $required[$k]('identity', $v);
                //$res will be a string if valid, or an array of issues
                if (is_array($res))
                {
                    $missing[$k] = $res;
                    $k = null;
                }
            }
            if (in_array($k, $expected))
            {
                //sets vars used below, $email, $comments
                ${$k} = trim($v);
                $message .= buildMessage($k, $v, $k === 'comments');
            }
        } //each
        
    }
    if (empty($missing))
    {
        $message = wordwrap($message, 70);
        $headers = "From: $host";
        $headers .= "\r\nContent-Type: text/plain; charset=utf-8";
        $headers .= "\r\nReply-To: $email";
        //$mailsent = mail($host, 'Website Enquiry', $message, $headers);
        $mailsent = true;
        
        if ($mailsent)
        {
            unset($missing);
?>
            <div id="response">
                <figure class="dogs bottom"><img alt="" src="../images/resource/dog_gone.jpg"></figure>
                <figure class="dogs top"><img alt="" src="../images/resource/016.jpg" ></figure>
                <div><h1>Thankyou for your enquiry</h1>
                    <p>An email has been sent to <a href="mailto:<?php htmlout($email); ?>"><em><?php htmlout($email); ?></em></a></p>
                    <p><em>Here is your message</em>:</p>
                    <p class="msg"><?php htmlout($comments); ?></p>
                </div>
                <figure class="bottom cat"><img alt="cat" src="../images/resource/cat_real_gone.jpg" ></figure>
                <figure class="top cat"><img alt="cat" src="../images/resource/cat_gone.jpg"></figure>
            </div>
            <?php
        } //sent
        else
        { ?>
                <div id="response">
                    <h1 class="warning">Sorry, There was a problem sending your message. PLease try again later.</h1></div>
            <?php
        } //not sent
        
    } //ok
    else
    {
        $item = count($missing) > 1 ? 'items' : 'item';
        $fieldset = "Please complete the missing $item indicated";
        $state = 'warning';
        $echo = flushMsg($missing, $data);
        //https://stackoverflow.com/questions/24403817/html5-required-attribute-one-of-two-fields
        include 'form.html.php'; //sticky
        
    }
} //posted
else if (!isset($missing))
{ //not yet posted
    $item = null; //used as a flag to supply default text to textarea
    include 'form.html.php'; //new
    
}