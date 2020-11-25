<?php
include '../Classes/ImageClient.php';
include '../Classes/CropperFactory.php';
//https://www.php.net/manual/en/function.getimagesize.php
// Retrieve JPEG width and height without downloading/reading entire image.
function getjpegsize($img_loc) {
    $handle = fopen($img_loc, "rb") or die("Invalid file stream.");
    $new_block = NULL;
    if(!feof($handle)) {
        $new_block = fread($handle, 32);
        $i = 0;
        if($new_block[$i]=="\xFF" && $new_block[$i+1]=="\xD8" && $new_block[$i+2]=="\xFF" && $new_block[$i+3]=="\xE0") {
            $i += 4;
            if($new_block[$i+2]=="\x4A" && $new_block[$i+3]=="\x46" && $new_block[$i+4]=="\x49" && $new_block[$i+5]=="\x46" && $new_block[$i+6]=="\x00") {
                // Read block size and skip ahead to begin cycling through blocks in search of SOF marker
                $block_size = unpack("H*", $new_block[$i] . $new_block[$i+1]);
                $block_size = hexdec($block_size[1]);
                while(!feof($handle)) {
                    $i += $block_size;
                    $new_block .= fread($handle, $block_size);
                    if($new_block[$i]=="\xFF") {
                        // New block detected, check for SOF marker
                        $sof_marker = array("\xC0", "\xC1", "\xC2", "\xC3", "\xC5", "\xC6", "\xC7", "\xC8", "\xC9", "\xCA", "\xCB", "\xCD", "\xCE", "\xCF");
                        if(in_array($new_block[$i+1], $sof_marker)) {
                            // SOF marker detected. Width and height information is contained in bytes 4-7 after this byte.
                            $size_data = $new_block[$i+2] . $new_block[$i+3] . $new_block[$i+4] . $new_block[$i+5] . $new_block[$i+6] . $new_block[$i+7] . $new_block[$i+8];
                            $unpacked = unpack("H*", $size_data);
                            $unpacked = $unpacked[1];
                            $height = hexdec($unpacked[6] . $unpacked[7] . $unpacked[8] . $unpacked[9]);
                            $width = hexdec($unpacked[10] . $unpacked[11] . $unpacked[12] . $unpacked[13]);
                            return array($width, $height);
                        } else {
                            // Skip block marker and read block size
                            $i += 2;
                            $block_size = unpack("H*", $new_block[$i] . $new_block[$i+1]);
                            $block_size = hexdec($block_size[1]);
                        }
                    } else {
                        return FALSE;
                    }
                }
            }
        }
    }
    return FALSE;
}

// Retrieve PNG width and height without downloading/reading entire image.
function getpngsize( $img_loc ) {
    $handle = fopen( $img_loc, "rb" ) or die( "Invalid file stream." );

    if ( ! feof( $handle ) ) {
        $new_block = fread( $handle, 24 );
        if ( $new_block[0] == "\x89" &&
            $new_block[1] == "\x50" &&
            $new_block[2] == "\x4E" &&
            $new_block[3] == "\x47" &&
            $new_block[4] == "\x0D" &&
            $new_block[5] == "\x0A" &&
            $new_block[6] == "\x1A" &&
            $new_block[7] == "\x0A" ) {
                if ( $new_block[12] . $new_block[13] . $new_block[14] . $new_block[15] === "\x49\x48\x44\x52" ) {
                    $width  = unpack( 'H*', $new_block[16] . $new_block[17] . $new_block[18] . $new_block[19] );
                    $width  = hexdec( $width[1] );
                    $height = unpack( 'H*', $new_block[20] . $new_block[21] . $new_block[22] . $new_block[23] );
                    $height  = hexdec( $height[1] );

                    return array( $width, $height );
                }
            }
        }

    return false;
}

function buildIMG($source_image, $filepath, $ratio, $offset = 0.5, $output_max = 0, $quality = 100)
{
    $client = new ImageClient();
    $handler = $client->getHandler();
    $type = strtolower(substr(strrchr($source_image,"."), 1));
    
   if($type === 'jpg'){
       list($width, $height) = getjpegsize($source_image);    
   }
    elseif($type === 'png'){
       list($width, $height) = getpngsize($source_image);    
   }
    else {
        list($width, $height) = getimagesize($source_image);    
    }
    
    $portrait = $height > $width ? true : false;
    $src_x = 0;
    $src_y = 0;
    $cropper = null;
    if(!$ratio){
    $ratio = $portrait ? ($height / $width) : ($width / $height);
    }
/*a default implementation cropping from center of pic*/
    if(isset($ratio)) {
        $o = new CropperFactory($width, $height, $ratio, $offset, $portrait);
        $cropper = $o->cropper;
        $cropper->crop();
        $src_x = $cropper->src_x;
        $src_y = $cropper->src_y;
        $width = $cropper->width;
        $height = $cropper->height;
    }
    
    //exit(var_dump(array($w,$h, $output_max)));
    //creates $resource
    $handler->handleRequest($source_image, $filepath, $quality);
    
    $newHeight = $height;
    $newWidth = $width;
    
    if($portrait){
        if(isset($output_max) && $output_max !== 0 && $output_max < $newHeight){
        $newWidth = intval(($width / $height) * $output_max);
        $newHeight = $output_max;
    }
    }
    else if(isset($output_max) && $output_max !== 0 && $output_max < $newWidth){
        $newHeight = intval(($height / $width) * $output_max);
        $newWidth = $output_max;
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

