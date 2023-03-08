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
import envVar from '../env_var';
import {totalAmt} from "./index";
import {useRouter} from "next/router";

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
    const router = useRouter();

    useEffect(() => {
        if (totalAmt == 0){
            router.push(`/`)
        }
        // Create PaymentIntent as soon as the page loads
        fetch(`${envVar.Env}/api/v1/payment/create-payment-intent`, {
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
                <title>Complete Payment</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <Row>
                    <Col xl={24}>
                        <Link href='/'>
                            <Header>
                                <Title level={2} style={{textAlign: 'center'}}>
                                    HOME by Tales Of Paws Admission Ticket
                                </Title>
                            </Header>
                        </Link>
                    </Col>
                </Row>
                {/*<Row>*/}
                {/*    <Col xs={24} xl={24}>*/}
                {/*        <Image alt={'banner'} style={{borderRadius: '25px',marginLeft:'auto',marginRight:'auto',width:'80%',display:'block',paddingBottom:'50px'}}*/}
                {/*               src="banner.jpg" preview={false}*/}
                {/*        />*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                       <div className="stripe-body">
                           {clientSecret && (
                               <Elements options={options} stripe={stripePromise}>
                                   <CheckoutForm />
                               </Elements>
                           )}
                       </div>
            </main>
        </>
    )
}
