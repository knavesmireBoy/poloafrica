<?php
include_once 'LandscapeCropper.php';
include_once 'PortraitCropper.php';
	class CropperFactory
	{
		public $cropper;
        
        public function __construct($width, $height, $ratio){
            if(greaterThan($width, $height)){
              $this->cropper = new LandscapeCropper($width, $height, $ratio);
            }
            else {
            $this->cropper = new PortraitCropper($width, $height, $ratio);
            }
        }
	}
