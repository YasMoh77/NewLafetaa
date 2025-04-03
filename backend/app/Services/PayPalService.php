<?php

namespace App\Services;

use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\src\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;

class PayPalService
{
    protected $client;

    public function __construct()
    {
        $environment = new SandboxEnvironment(
            env('PAYPAL_CLIENT_ID'),
            env('PAYPAL_CLIENT_SECRET')
        );

        $this->client = new PayPalHttpClient($environment);
    }

    public function createOrder($amount, $currency)
    {
        $request = new OrdersCreateRequest();
        $request->prefer('return=representation');
        $request->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => $currency,
                        "value" => $amount
                    ]
                ]
            ]
        ];

        try {
            $response = $this->client->execute($request);
            return $response->result;
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function captureOrder($orderId)
    {
        $request = new OrdersCaptureRequest($orderId);

        try {
            $response = $this->client->execute($request);
            return $response->result;
        } catch (\Exception $ex) {
            return null;
        }
    }
}