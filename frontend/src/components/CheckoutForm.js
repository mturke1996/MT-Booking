import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './CheckoutForm.css'; // تأكد من إضافة الأنماط اللازمة في هذا الملف

// تأكد من استبدال هذا بمعرف العميل الخاص بك من PayPal
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const stripe = useStripe();
  const elements = useElements();

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="payment-methods">
        <label className={`payment-method-label ${paymentMethod === 'stripe' ? 'active' : ''}`}>
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={() => setPaymentMethod('stripe')}
            className="payment-method-radio"
          />
          <i className="fa-solid fa-credit-card"></i>
          Credit Card
        </label>
        <label className={`payment-method-label ${paymentMethod === 'paypal' ? 'active' : ''}`}>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
            className="payment-method-radio"
          />
          <i className="fa-brands fa-paypal"></i>
          PayPal
        </label>
      </div>

      {paymentMethod === 'stripe' ? (
        <form className="stripe-form" onSubmit={handleStripeSubmit}>
          <div className="form-group">
            <label htmlFor="card" className="form-label">Card Details:</label>
            <CardElement id="card" className="card-element" />
          </div>
          <button type="submit" disabled={!stripe} className="submit-button">Complete Purchase</button>
        </form>
      ) : (
        <div className="paypal-container">
          <div className="paypal-login">
            <h3 className="paypal-login-title">PayPal Login</h3>
            <input type="email" placeholder="Email" className="paypal-input" />
            <input type="password" placeholder="Password" className="paypal-input" />
            <button className="paypal-login-button">Login</button>
          </div>
          <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
            <PayPalButtons
              style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '0.01',
                    },
                  }],
                });
              }}
              onApprove={async (data, actions) => {
                await actions.order.capture();
                console.log('PayPal payment successful');
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
