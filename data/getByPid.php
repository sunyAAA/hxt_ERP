<?php
header('Content-Type:application/json;charset=UTF-8');
@$pid = $_REQUEST['pid'] or die('{"msg":"pid required"}');
require('zh_init.php');
$sql = "SELECT pid,name,count,unit,inTime,depot,cid FROM p_count,zh_product WHERE productId='$pid' ORDER BY cid ASC";
$result = mysqli_query($conn,$sql);
$list= mysqli_fetch_all($result,1);
echo json_encode($list);
?>