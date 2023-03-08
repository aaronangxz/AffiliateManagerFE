import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import {StripePaymentElementOptions} from "@stripe/stripe-js";
import {citizenTix, referralId, selectDate, selectSlot, totalAmt, touristTix} from "../pages";
import {Divider, message} from "antd";
import {contactFormValues} from "../pages/form";
import envVar from "../env_var";
import {useRouter} from "next/router";

export let bookingId = 0;
export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/confirmation",
            },
            // confirmParams: {
            //     // Make sure to change this to your payment completion page
            //     return_url: "http://localhost:3000/confirmation",
            // },
            redirect:'if_required'
        });

        if (error === undefined){
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify({
                "referral_id": referralId,
                "booking_day": selectDate,
                "booking_slot": parseInt(String(selectSlot),10) ,
                "citizen_ticket_count": citizenTix,
                "tourist_ticket_count": touristTix,
                "customer_info": contactFormValues
            });

            fetch(`${envVar.Env}/api/v1/tracking/checkout`, {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result.response_meta.error_code !== 0){
                        console.log(result)
                    }
                    bookingId = result.booking_details.booking_id;
                    router.push(`/confirmation`)
                })
                .catch(error => {
                    console.log('error', error)
                });
        }else{
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        }
        setIsLoading(false);
    };

    const paymentElementOptions:StripePaymentElementOptions = {
        layout: "auto"
    }

    return (
        <form className='stripe-form' id="payment-form" onSubmit={handleSubmit}>
            <h2>Total: MYR {totalAmt}</h2>
            <Divider/>
            <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e:any) => setEmail(e.target.value)}
            />
            <PaymentElement className='payment-element' id="payment-element" options={paymentElementOptions} />
            <button className='stripe-button' disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div className='payment-message' id="payment-message">{message}</div>}
        </form>
    );
}