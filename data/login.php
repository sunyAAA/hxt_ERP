<?php
header('Content-Type:application/json;charset=UTF-8');
@$n = $_REQUEST['uname'] or die('{"msg":"uname required"}');
@$p = $_REQUEST['upwd'] or die('{"msg":"upwd required"}');
require('zh_init.php');
$sql = "SELECT * FROM zh_user WHERE uname='$n' AND upwd='$p'";
$result = mysqli_query($conn,$sql);
$row = mysqli_num_rows($result);
if($row===0){
    echo '{"msg":"erro"}';
}else{
    echo '{"msg":"succ"}';
}
?>