

<!doctype html>
<html lang="en">
<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <link rel="icon" type="image/x-icon" href="https://assets.edlin.app/favicon/favicon.ico">

  <link rel="stylesheet" href="https://assets.edlin.app/bootstrap/v5.3/bootstrap.css">

  <script src="https://www.paypal.com/sdk/js?client-id={{config('paypal.client_id')}}&currency=USD&intent=capture"></script>

  <!-- Title -->
  <title>PayPal Laravel</title>
</head>
<body>
<div class="container text-center">
  <div class="row mt-5">
    <div class="col-12">
      <div class="row mt-3" id="paypal-success" style="display: none;">
        <div class="col-12 col-lg-6 offset-lg-3">
          <div class="alert alert-success" role="alert">
            You have successfully sent me money! Thank you!
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12 col-lg-6 offset-lg-3">
          <div class="input-group">
            {{$plan}}-{{$amount}}
            <input type="text" value="300" id="paypal-amount">

          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12 col-lg-6 offset-lg-3" id="payment_options"></div>
      </div>
    </div>
  </div>
  
</div>
</body>
<script>
  paypal.Buttons({
    //window.location.href='http://localhost:3000/paypal/'+ document.getElementById("paypal-amount").value)
      //window.location.href=`http://localhost:3000/paypal?plan=${$plan}&amount=${$amount}&id=${$id}&phone=${$phone}`//+ document.getElementById("paypal-amount").value)
      
      createOrder: function() {
  return fetch("/api/create/" + document.getElementById("paypal-amount").value)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to create order');
      return response.json(); // Parse as JSON instead of text
    })
    .then((data) => {
      return data.id; // Extract the PayPal order ID from JSON response
    });
},

onApprove: function(data) {  // Note: parameter is 'data' not 'id'
  return fetch("/api/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_id: data.orderID // Use data.orderID from PayPal response
    })
  })
  .then((response) => {
    if (!response.ok) throw new Error('Payment failed');
    return response.json();
  })
  .then((order_details) => {
    console.log('Payment success:', order_details);
    document.getElementById("paypal-success").style.display = 'block';
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('Payment failed: ' + error.message);
  });
},

    onCancel: function (data) {
      //todo
    },

    onError: function (err) {
      //todo
    }
  }).render('#payment_options');
</script>
</html>
