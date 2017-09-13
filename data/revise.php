<?php
  header('Content-Type:application/json;charset=UTF-8');
  @$pid = $_REQUEST['pid']or die('{"msg":"pid required"}');
  @$name = $_REQUEST['r-name'] ;
  @$spec = $_REQUEST['r-spec'] ;
  @$unit = $_REQUEST['r-unit'] ;
  @$breed = $_REQUEST['r-breed'] ;
  require('zh_init.php');
  if($pid&&$name&&$spec&&$unit&&$breed){
     $sql = "UPDATE zh_product SET name='$name',spec='$spec',unit='$unit',breed='$breed' WHERE pid='$pid'";
     $result = mysqli_query($conn,$sql);
     if($result===false){
        echo '{msg:SQL ERROR2}';
     }else{
        echo '{"msg":"succ"}';
     }
  }else if($pid){
    $sql = "SELECT * FROM zh_product WHERE pid='$pid'";
    $result = mysqli_query($conn,$sql);
    if($result===false){
        echo '{msg:SQL ERROR1}';
    }else{
        $row = mysqli_fetch_assoc($result);
        echo json_encode($row);
    }
  }
?>