import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
    Typography,
    Select,
    Divider,
    Button,
    Col,
    Row,
    Form,
    Input,
    Layout,
    Checkbox,
    Card, Image
} from 'antd';

import React, {useEffect, useState} from 'react';

import Link from "next/link";
import {Elements
} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import CheckoutForm from "../components/checkout";
import {Appearance, StripeElementsOptions} from "@stripe/stripe-js/types/stripe-js/elements-group";
const {Header} = Layout;

const {Title} = Typography;
const slotMap: {
    [key: number]: string;
} = {
    0: 'Corgi - 10.30am to 12:00pm',
    1: 'Corgi - 12.30pm to 02:00pm',
    2: 'Dogs - 02.30pm to 04:00pm',
    3: 'Dogs - 05.00pm to 06.30pm',
};

export default function Payment() {
    const [hasMounted, setHasMounted] = React.useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const stripePromise = loadStripe("pk_test_GvF3BSyx8RSXMK5yAFhqEd3H");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("http://127.0.0.1:8888/api/v1/payment/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        })
            .then((res) =>
                res.json()
            )
            .then((data) => {
                console.log(data)
                setClientSecret(data.client_secret)
            });
    }, []);

    const appearance:Appearance = {
        theme: 'stripe',
    };
    const options:StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    // useEffect(() => {
    //     setHasMounted(true);
    // }, [])
    // if (!hasMounted) {
    //     return null;
    // }

    return (
        <>
            <Head>
                <title>Complete Booking</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <Row>
                    <Col xl={6}></Col>
                    <Col xl={12}>
                        <Link href='/'>
                            <Header>
                                <Title level={2} style={{textAlign: 'center', margin: '0px', padding: '20px'}}>
                                    HOME by Tales Of Paws Admission Ticket
                                </Title>
                            </Header>
                        </Link>
                    </Col>
                    <Col xl={6}></Col>
                </Row>
               <Row>
                   <Col>
                       <div className="stripe-body">
                           {clientSecret && (
                               <Elements options={options} stripe={stripePromise}>
                                   <CheckoutForm />
                               </Elements>
                           )}
                       </div>
                   </Col>
               </Row>
            </main>
        </>
    )
}
