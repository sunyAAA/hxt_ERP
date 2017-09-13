<?php
header('Content-Type:application/json;charset=UTF-8');
@$orderId = $_REQUEST['in-orderId'] or die('{"msg":"orderId required"}');
@$pid = $_REQUEST['in-pid'] or die('{"msg":"pid required"}');
@$name = $_REQUEST['in-name'] or die('{"msg":"name required"}');
@$spec = $_REQUEST['in-spec'] or die('{"msg":"spec required"}');
@$breed = $_REQUEST['in-breed']or $breed = $name;
@$count = $_REQUEST['in-count'] or die('{"msg":"count required"}');
@$depot = $_REQUEST['in-depot'] or die('{"msg":"depot required"}');
@$unit = $_REQUEST['in-unit'] or die('{"msg":"unit required"}');
@$year = $_REQUEST['in-year'] or die('{"msg":"year required"}');
@$month = $_REQUEST['in-month'] or die('{"msg":"month required"}');
@$day = $_REQUEST['in-day'] or die('{"msg":"day required"}');
$inTime = strtotime($year.'-'.$month.'-'.$day)*1000;
$time = time()*1000;
require('zh_init.php');
$sql = "SELECT * FROM zh_product WHERE pid = '$pid'";
$result = mysqli_query($conn,$sql);
if(mysqli_num_rows($result)===0){
    $sql  = "INSERT INTO zh_product VALUES('$pid','$name','$spec','$unit','$breed')";
    $result = mysqli_query($conn,$sql);
    if($result===false){
        die('{"msg":"SQL error1"}');
    }else{
        $sql = "INSERT INTO p_count VALUES(null,'$pid','$inTime','0','$depot','$count')";
        $result = mysqli_query($conn,$sql);
        if($result===false){
            die('{"msg":"SQL error1"}');
        }else{
            echo '{"code":"add","msg":"succ"}';
        }
    }
}else{
    $sql = "INSERT INTO p_count VALUES(null,'$pid','$inTime','0','$depot','$count')";
    $result = mysqli_query($conn,$sql);
    if($result===false){
        die('{"msg":"SQL error2"}');
    }else{
        echo '{"code":"update","msg":"succ"}';
    }
};
$sql = "INSERT INTO account VALUES(null,'$orderId','$pid','入库','$count','$depot','$time')";
$result = mysqli_query($conn,$sql);
if($result===false){
    die('{"msg":"SQL error3"}');
}
?>