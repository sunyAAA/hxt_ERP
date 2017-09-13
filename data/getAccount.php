<?php
header('Content-Type:application/json;charset=UTF-8');
@$year = $_REQUEST['accYear'] or time('Y');
@$month = $_REQUEST['accMonth'] or time('m');
@$limit = $_REQUEST['accLimit'] or 0;
require('zh_init.php');
if($limit==='all'){
    $count = 99999;
    $limitStart = 0;
}else{
  $count = 200;
  $limitStart = intval($limit)*$count;
}
$start = strtotime($year.'-'.$month.'-1')*1000;
$end = strtotime($year.'-'.($month+1).'-1')*1000-86400;
$sql = "SELECT orderId,aTime,aType,pid,name,unit,spec,depot,aCount FROM zh_product,account WHERE pid=productId and aTime>$start and aTime<$end ORDER BY aTime DESC LIMIT $limitStart,$count";
$result = mysqli_query($conn,$sql);
if($result===false){
    die('{"msg":"SQL error1"}');
}else{
    $list = mysqli_fetch_all($result,1);
    echo json_encode($list);
}
?>