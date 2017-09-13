<?php
header('Content-Type:application/json;charset=UTF-8');
@$pid = $_REQUEST['pid'];
require('zh_init.php');
if($pid){
    $sql ="SELECT sum(count) FROM p_count WHERE productId='$pid'";
    $result = mysqli_query($conn,$sql);
    $row = mysqli_fetch_row($result);
    echo json_encode($row);
}else if(is_null($pid)){
    $sql = "select pid,name,spec,sum(count),unit,depot,breed from zh_product,p_count where productId=pid group by depot,productId";
    $result = mysqli_query($conn,$sql);
    $list = mysqli_fetch_all($result);
    echo json_encode($list);
}

?>