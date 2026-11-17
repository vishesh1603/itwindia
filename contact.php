<?php
// Contact form handler. Copy config.sample.php to config.php and fill it in.
header('Content-Type: application/json');
$cfg = file_exists(__DIR__.'/config.php') ? require __DIR__.'/config.php' : ['to'=>'info@itwindia.com','smtp'=>null];
function out($ok,$m){echo json_encode(['ok'=>$ok,'message'=>$m]);exit;}
if($_SERVER['REQUEST_METHOD']!=='POST') out(false,'Invalid request.');
if(!empty($_POST['website'])) out(true,'Thank you. We will be in touch.'); // honeypot
$clean=function($k,$l){return substr(trim(preg_replace('/[\r\n]+/',' ',$_POST[$k]??'')),0,$l);};
$name=$clean('name',100);$co=$clean('company',120);$email=$clean('email',150);$ph=$clean('phone',30);
$msg=substr(trim($_POST['message']??''),0,3000);
if($name===''||$msg===''||!filter_var($email,FILTER_VALIDATE_EMAIL)) out(false,'Please fill in your name, a valid email and a message.');
$subject='Website enquiry from '.$name;
$body="Name: $name\nCompany: $co\nEmail: $email\nPhone: $ph\n\n$msg";
if(!empty($cfg['smtp']) && file_exists(__DIR__.'/vendor/autoload.php')){
  require __DIR__.'/vendor/autoload.php'; // composer require phpmailer/phpmailer
  $s=$cfg['smtp'];$mail=new PHPMailer\PHPMailer\PHPMailer(true);
  try{$mail->isSMTP();$mail->Host=$s['host'];$mail->SMTPAuth=true;$mail->Username=$s['user'];$mail->Password=$s['pass'];
    $mail->SMTPSecure='ssl';$mail->Port=$s['port']??465;$mail->setFrom($s['user'],'ITW India Website');
    $mail->addReplyTo($email,$name);$mail->addAddress($cfg['to']);$mail->Subject=$subject;$mail->Body=$body;$mail->send();
    out(true,'Thank you. We will be in touch.');}
  catch(Exception $e){out(false,'Could not send right now. Please email us directly.');}
}
$h="From: no-reply@itwindia.com\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
if(mail($cfg['to'],$subject,$body,$h)) out(true,'Thank you. We will be in touch.');
out(false,'Could not send right now. Please email us directly.');
