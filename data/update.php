<?php
header('Content-Type:application/json;charset=UTF-8');
@$orderId = $_REQUEST['orderId'] or die('{"msg":"orderId required"}');
@$cid = $_REQUEST['cid'] or die('{"msg":"cid required"}');
@$count = $_REQUEST['count'] or die('{"msg":"count required"}');
$time = time()*1000;
require('zh_init.php');
$sql = "UPDATE p_count SET count = count - '$count',mdate='$time' WHERE cid='$cid'";
$result = mysqli_query($conn,$sql);
if($result===false){
        die('{"msg":"SQL error2"}');
    }else{
        $sql = "SELECT productId,depot FROM p_count WHERE cid='$cid'";
        $result = mysqli_query($conn,$sql);
        $row = mysqli_fetch_row($result);
        $pid = $row[0];
        $depot = $row[1];
//        var_dump($pid,$depot);
        $sql = "INSERT INTO account VALUES(null,'$orderId','$pid','出库','$count','$depot','$time')";
        $result = mysqli_query($conn,$sql);
        if($result===false){
            die('{"msg":"SQL error3"}');
        }
        echo '{"code":"update","msg":"succ"}';
    }
?>
