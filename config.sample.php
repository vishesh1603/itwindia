<?php
// Copy to config.php (never commit it). Set 'smtp' to null to use PHP mail().
return [
  'to'   => 'info@itwindia.com',
  'smtp' => ['host'=>'mail.itwindia.com','port'=>465,'user'=>'no-reply@itwindia.com','pass'=>'CHANGE_ME'],
];
