<?php
	date_default_timezone_set('UTC');
	if(isset($_GET['since'])) $since = $_GET['since'];
	else $since = FALSE;
	$table = date("Y_z",strtotime("+1 days"))."_gphone_095_v1";
	// $table = "2011_315_gphone_095_v1";
	if(!$con = new mysqli('gphone-95','php_daemon','password','gmonitor')) die(mysqli_connect_error());
	// echo "using table: ".$table;
	$sql = "SELECT `rawgravity`,CONCAT_WS(':',LPAD(CAST(`hour`AS CHAR),2,'0'),LPAD(CAST(`minute` AS CHAR),2,'0'),LPAD(CAST(`second` AS CHAR),2,'0')) AS `s_time`,(`hour`*3600+`minute`*60+`second`) AS `i_time` FROM `gmonitor`.`$table` ORDER BY `i_time` DESC LIMIT 120";
	if($since)
		$sql = "SELECT * FROM (".$sql.") AS `t` WHERE `t`.`i_time` > ".$con->real_escape_string($since);

  if(!$res = $con->query($sql)) die("alert('".$con->error.");");
	if($res->num_rows == 0) die("");
	// echo "<br/>found {$res->num_rows} rows<br/>";
	while($row = $res->fetch_array()){
			$data[0][] = $row[0];
			$data[1][] = $row[1];
			$data[2][] = $row[2];
	}
	// $s_time_max = $data[1][array_search(max($data[2]), $data[2])];
	// $s_time_min = $data[1][array_search(min($data[2]), $data[2])];
	if($since || count($data[0]) < 120){
		$prefix = "addTo_";
		$suffix = "self.updateData();";
	} else {
		$prefix = "";
		$suffix = "";
	}
	
	$output = "data.{$prefix}x = new Array(".array_pop($data[2]);
	while($val = array_pop($data[2])){
		$output .= ", ".$val;
	}
	$output .= ");\ndata.{$prefix}y = new Array(".array_pop($data[0]);
	while($val = array_pop($data[0])){
		$output .= ", ".$val;
	}
	$output .= ");\ndata.{$prefix}t = new Array('".array_pop($data[1]);
	while($val = array_pop($data[1])){
		$output .= "', '".$val;
	}
	$output .= "');\n{$suffix}";
	// $output .= "data.s_time_max = '$s_time_max';\ndata.s_time_min = '$s_time_min';";
	
	// header('Content-type: application/javascript');
	// echo "<pre>";
	echo($output);
?>
