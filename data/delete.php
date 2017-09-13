<?php
header('Content-Type:application/json;charset=UTF-8');
@$cid = $_REQUEST['cid'] or die('{"msg":"cid required"}');
require('zh_init.php');
$sql = "DELETE FROM p_count WHERE cid='$cid'";
$result = mysqli_query($conn,$sql);
if($result===true){
    echo '{"msg":"succ"}';
}
?>