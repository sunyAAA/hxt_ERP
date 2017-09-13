<?php
header('Content-Type:application/json;charset=UTF-8');
@$year = $_REQUEST['accYear'] or time('Y');
@$month = $_REQUEST['accMonth'] or time('m');
$start = strtotime($year.'-'.$month.'-1')*1000;
$end = strtotime($year.'-'.($month+1).'-1')*1000-86400;
require('zh_init.php');
$sql = "SELECT COUNT(*) FROM account WHERE aTime>$start and aTime<$end";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
echo json_encode($row);
?>