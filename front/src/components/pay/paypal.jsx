/*import React, {useEffect, useState} from 'react';
import {PayPalScriptProvider,PayPalButtons} from '@paypal/react-paypal-js'
import ReactDOM from 'react-dom';
import axios from 'axios';
//import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';


const Checkout = () => {
    // Paypal Code
//const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
    const createOrder = (data, actions) =>{
        return actions.order.create({
        purchase_units: [
            {
            amount: {
                value: '4',
            },
            },
        ],
        });
    };
    const onApprove = (data, actions) => {
        // return actions.order.capture();
        return actions.order.capture().then(function(details) {
            console.log(details);
            //orderinfo_data.payment_id = details.id;
        });
    };
    // End-Paypal Code
    var data={
        name:'yas'
    }
    return (
        <div>
            <button>click</button>
            <PayPalScriptProvider options={{ "client-id": "AdKFNvWUUYd4eWZAG3OkDq9oc2YDA0U-z05x3btww2JSlQIqBtnniGJ6cxw5DaG133E93XBlUnZax698" }}>
                <PayPalButtons
                    createOrder={(data, actions) => createOrder(data, actions)}
                    onApprove={(data, actions) => onApprove(data, actions)}
                />
            </PayPalScriptProvider>
        </div>
    )
}

export default Checkout*/

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import ReactDOM from 'react-dom';


const Checkout = () => {
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '4.00', // Always use string with 2 decimal places
                    currency_code: 'USD' // Explicitly set currency
                }
            }]
        });
    };

    const onApprove = async (data, actions) => {
        try {
            const details = await actions.order.capture();
            console.log('Transaction completed:', details);
            
            // Add your success logic here:
            // - Update database
            // - Show success message
            // - Redirect user
            
            return details;
        } catch (error) {
            console.error('Transaction failed:', error);
            // Handle error (show message to user, etc.)
            throw error; // Important for PayPal button state
        }
    };

    return (
        <div className=''>
            <PayPalScriptProvider 
                options={{ 
                    "client-id": "AdKFNvWUUYd4eWZAG3OkDq9oc2YDA0U-z05x3btww2JSlQIqBtnniGJ6cxw5DaG133E93XBlUnZax698",
                    "currency": "USD", // Explicit currency
                    "intent": "capture" // Explicit intent
                }}
            >
                <PayPalButtons
                    style={{ layout: 'vertical' }} // Better mobile responsiveness
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={(err) => {
                        console.error('PayPal Error:', err);
                        // Handle PayPal initialization errors
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default Checkout;