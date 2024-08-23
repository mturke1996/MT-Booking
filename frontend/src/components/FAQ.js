import React from 'react'


export default function FAQ() {
  return (
    <div className='container' style={{marginTop:"100px"}}>
        <h1>Frequently asked questions</h1>
        <div className='continer'>
        <div>
            <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>How do I make a booking?</p>
            <p style={{fontSize: "1rem", lineHeight: 1.6}}>You can make a booking by visiting our booking page, selecting your preferred dates and services, and completing the payment process</p>
        </div>
        <div>
            <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>What payment methods do you accept?</p>
            <p style={{fontSize: "1rem", lineHeight: 1.6}}>We accept various payment methods, including credit/debit cards, PayPal, and bank transfers</p>
        </div>
        <div>
        <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>How can I get help with an existing reservation on MT booking?</p>
        <p style={{fontSize: "1rem", lineHeight: 1.6}}>We understand that due to Coronavirus (COVID-19) and its health implications, you may want to change your plans. For further support, please sign into your account and visit our Customer Service Help Centre.</p>
        </div>
        <div>
            <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>How do I cancel my booking in this situation?</p>
            <p style={{fontSize: "1rem", lineHeight: 1.6}}>For the best support, please sign in using your Booking.com account. If you do not have an account, you can use your booking confirmation number and PIN code to sign in on a desktop computer or a laptop.

If your booking is no longer free to cancel or is non-refundable, you may incur a cancellation fee. Properties can also choose to change the dates of your reservation at no extra cost, so it’s worth contacting the property to see if this is possible.
If your reservation was affected by Coronavirus-related events such as border closures or travel limitations enforced by authorities, but is no longer free to cancel or is non-refundable, sign in to check options to manage the reservation.</p>
        </div>
        <div>
            <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>Can I move my booking to a future date?</p>
            <p style={{fontSize: "1rem", lineHeight: 1.6}}>Moving your booking to a future date depends on the policies of the reservation. Please sign in using either your Booking.com account or confirmation number and PIN, select the booking you want to change, and you’ll see what options are available.

You may also contact the property to ask for a date change.</p>
        </div>
        <div>
            <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>Will I get charged additionally if I move my reservation to a future date?</p>
            <p style={{fontSize: "1rem", lineHeight: 1.6}}>If you change your dates and the property has availability there may be a difference in price (higher or lower). This may be due to seasonality or different rates on weekdays versus weekends.

If the rates are higher, you will have to pay the difference between the original price and the price for your new dates. If they are lower, the price difference will be reflected in your booking.</p>
        </div>
        <div>
            <p style={{fontWeight:"bold", fontSize: "1.1rem", marginBottom: "10px"}}>Can I give my reservation to someone else?</p>
            <p style={{fontSize: "1rem", lineHeight: 1.6}}>Please contact the property directly if you would like to transfer the reservation to someone else.

Each property will have its own policies around this type of change to a reservation and can inform you appropriately what those policies are.</p>
        </div>
        </div>
       

    </div>
  )
}
