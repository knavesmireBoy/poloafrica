<?php
	class LandscapeCropper
	{
        public $width;
        public $height;
        public $src_x = 0;
        public $src_y = 0;
        protected $ratio;
        
		public function __construct($width, $height, $ratio){
            $this->width = $width;
            $this->height = $height;
            $this->ratio = $ratio;
	}
        public function crop(){
            $res = $this->width / $this->height;
            //w too big crop sides
            if (greaterThan($res, $this->ratio))
            {
                $newWidth = $this->height * $this->ratio;
                $this->src_x = ($this->width - $newWidth) / 2;
                $this->width = $newWidth;
            }
            //h too big crop top/bottom
            if (lesserThan($res, $this->ratio))
            {
                $newHeight = $this->width / $this->ratio;
                $this->src_y = ($this->height - $newHeight) / 2;
                $this->height = $newHeight;
            }
        }
    }
