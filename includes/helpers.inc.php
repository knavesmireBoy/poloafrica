<?php
include '../Classes/ImageClient.php';
include '../Classes/CropperFactory.php';

function buildIMG($source_image, $filepath, $quality = 100, $output_width = 0, $ratio = 1)
{
    $client = new ImageClient();
    $handler = $client->getHandler();
    list($width, $height) = getimagesize($source_image);    
    $src_x = 0;
    $src_y = 0;
    $cropper = null;
//a default implementation cropping from center of pic
    if(isset($ratio)) {
        $o = new CropperFactory($width, $height, $ratio);
        $cropper = $o->cropper;
        $cropper->crop();
        $src_x = $cropper->src_x;
        $src_y = $cropper->src_y;
        $width = $cropper->width;
        $height = $cropper->height;
    }
    //creates $resource
    $handler->handleRequest($source_image, $filepath, $quality);
    
    $newHeight = $height;
    $newWidth = $width;
    
    if(isset($output_width) && $output_width !== 0){
        $newHeight = intval(($height / $width) * $output_width);
        $newWidth = $output_width;
    }
    //Copy and resize the image to create the thumbnail
    $newResource = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($newResource, $handler->getResource(), 0, 0, $src_x, $src_y, $newWidth, $newHeight, $width, $height);
    $handler->output($newResource);
}

function buildMsg($prop){
    return function() use($prop){
        return "Please enter your $prop";
    };
}

function flushMsg1($missing, $data){
    return function($k, $flag = false) use($missing, $data){
       $output = isset($missing[$k]) ? $missing[$k]() : null;
        if(isset($output)){
            echo $flag ? $output : ' class="warning"';
        }
        else if(isset($data[$k])){
            echo $data[$k];
        }
    };
}


function preconditionsHI() {
    $checkers = func_get_args();
    return function ($strategy, $arg) use($checkers){
        try {
        $errors = array_reduce(array_map(
            function($checker) use($strategy, $arg){
                return $checker->validate($arg) ? array() : array($checker->message);
            }, $checkers), 'array_merge', array());
        if (!empty($errors)) {
            throw new Exception(implode($errors, ", "));
        }
        }
        catch(Exception $e){
           echo $e;
        }
        return $strategy->algorithm($arg);
    };
}

