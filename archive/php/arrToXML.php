<?php

function dirToArr($path='.', $arr=[]){
    if($handle = opendir($path)){
      while(false !== ($entry = readdir($handle)))
        if ($entry != "." && $entry != "..")

        /* */ if(is_dir($path.'/'.$entry))
        /* */   $arr[$entry] = dirToArr($path.'/'.$entry);
        /* */ else
        /* */   $arr[$entry]='file';

      closedir($handle);
    }
    return $arr;
}



function arrToXML($arr=[]){
    $xml = new SimpleXMLElement('<xml version="1.0" encoding="utf-8"></xml>');

    function process($arr, $markup){
      foreach($arr as $k => $v){

        /* */ if(gettype($v) == 'array'){
        /* */   $m = $markup->addChild($k);
        /* */   process($v, $m);
        /* */ } else
        /* */   $markup->addChild('file', $k);

      }
      return $markup;
    }
    return process($arr, $xml);
}


$arr = dirToArr();
$xml = arrToXML($arr);

Header('Content-type: text/xml');
print($xml->asXML());