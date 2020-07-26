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

    if(isset($ratio)) {
        $o = new CropperFactory($width, $height, $ratio);
        $cropper = $o->cropper;
        $cropper->crop();
        $src_x = $cropper->src_x;
        $src_y = $cropper->src_y;
        $width = $cropper->width;
        $height = $cropper->height;
    }
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


function buildIMG2($source_image, $filepath, $quality = 100, $output_width = 0, $ratio = 1)
{
    $client = new ImageClient();
    $handler = $client->getHandler();
    list($width, $height) = getimagesize($source_image);    
    $src_x = 0;
    $src_y = 0;
 if (isset($ratio))
 {
        $orient = greaterThan($width, $height) ? 'lscp' : 'ptrt';
        if ($orient === 'lscp')
        {
            $res = $width / $height;
            //w too big crop sides
            if (greaterThan($res, $ratio))
            {
                $newWidth = $height * $ratio;
                //$newWidth = $multByRatio($height);
                $src_x = ($width - $newWidth) / 2;
                //$src_x = $divBy2($fromWidth($newWidth);
                $width = $newWidth;
            }
            //h too big crop top/bottom
            if (lesserThan($res, $ratio))
            {
                $newHeight = $width / $ratio;
                $src_y = ($height - $newHeight) / 2;
                $height = $newHeight;
            }
        }
        else
        {
            $res = $height / $width;
            //h too big crop top/bottom
            if (greaterThan($res, $ratio))
            {
                $newHeight = $width * $ratio;
                $src_y = ($height - $newHeight) / 2;
                $height = $newHeight;
            }
            //w too big crop sides
            if (lesserThan($res, $ratio))
            {
                $newWidth = $height / $ratio;
                $src_x = ($width - $newWidth) / 2;
                $width = $newWidth;
            }
        }
    }
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