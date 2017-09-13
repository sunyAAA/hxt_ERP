<?php
header('Content-Type:application/json;charset=UTF-8');
@$pid = $_REQUEST['in-pid'];
require('zh_init.php');
if($pid){
    $sql = "SELECT name,spec,unit,breed FROM zh_product WHERE pid='$pid'";
    $result = mysqli_query($conn,$sql);
    $list = mysqli_fetch_assoc($result);
    echo json_encode($list);
}else if(is_null($pid)){
    $sql = "SELECT pid,name,spec,unit,inTime,mdate,breed,depot,count,cid FROM zh_product,p_count WHERE pid=productId ORDER BY pid,inTime ASC";
    $result = mysqli_query($conn,$sql);
    //    var_dump($result);
    $list = mysqli_fetch_all($result,1);
    echo json_encode($list);
}

?>