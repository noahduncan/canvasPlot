<?php
	$table = date("Y_z",strtotime("+2 days"))."_gphone_095_v1";
	// $table = "2011_315_gphone_095_v1";
	if(!$con = new mysqli('gphone-95','php_daemon','password','gmonitor')) die(mysqli_connect_error());
	// echo "using table: ".$table;
	$sql = "SELECT `rawgravity`,CONCAT_WS(':',LPAD(CAST(`hour`AS CHAR),2,'0'),LPAD(CAST(`minute` AS CHAR),2,'0'),LPAD(CAST(`second` AS CHAR),2,'0')) AS `s_time`,(`hour`*3600+`minute`*60+`second`) AS `i_time` FROM `gmonitor`.`$table` ORDER BY `i_time` DESC LIMIT 120";
  if(!$res = $con->query($sql)) die($res->mysql_error());
	// echo "<br/>found {$res->num_rows} rows<br/>";
	while($row = $res->fetch_array()){
			$data[0][] = $row[0];
			$data[1][] = $row[1];
			$data[2][] = $row[2];
	}
	$s_time_max = $data[1][array_search(max($data[2]), $data[2])];
	$s_time_min = $data[1][array_search(min($data[2]), $data[2])];
	
	$output = "data.x = new Array(".array_pop($data[2]);
	while($val = array_pop($data[2])){
		$output .= ", ".$val;
	}
	$output .= ");\ndata.y = new Array(".array_pop($data[0]);
	while($val = array_pop($data[0])){
		$output .= ", ".$val;
	}
	$output .= ");\ndata.s_time_max = '$s_time_max';\ndata.s_time_min = '$s_time_min';";
	
	// header('Content-type: application/javascript');
	echo($output);
?>
