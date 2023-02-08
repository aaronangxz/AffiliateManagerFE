import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Card, Typography, Image, Divider, DatePicker, Button, Radio, InputNumber, Col, Row, Form, message} from 'antd';
import type {DatePickerProps, RadioChangeEvent} from 'antd';
import React, {useEffect} from 'react';
import moment from "moment";
import {useRouter} from 'next/router'

const {Title} = Typography;
export let childTix = 0;
export let adultTix = 0;
export let totalAmt = 0;
export let selectDate = '';
export let selectSlot = 0;

export default function Home() {
    const [childAmount, setChildAmount] = React.useState(0);
    const [childCount, setChildCount] = React.useState(0);
    const [adultAmount, setAdultAmount] = React.useState(0);
    const [adultCount, setAdultCount] = React.useState(0);
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [disableSlot0, setDisableSlot0] = React.useState(true);
    const [disableSlot1, setDisableSlot1] = React.useState(true);
    const [disableSlot2, setDisableSlot2] = React.useState(true);
    const [disableSlot3, setDisableSlot3] = React.useState(true);
    const [disableSlot4, setDisableSlot4] = React.useState(true);
    const [slotData, setSlotData] = React.useState([]);
    const [childMax, setChildMax] = React.useState(0);
    const [adultMax, setAdultMax] = React.useState(0);
    const [childDisable, setChildDisable] = React.useState(true);
    const [adultDisable, setAdultDisable] = React.useState(true);
    const [selectedSlot, setSelectedSlot] = React.useState(null);
    const [hasMounted, setHasMounted] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const disableTimeSlots = () => {
        setDisableSlot0(true)
        setDisableSlot1(true)
        setDisableSlot2(true)
        setDisableSlot3(true)
        setDisableSlot4(true)
        setAdultDisable(true)
        setChildDisable(true)
        setSelectedSlot(null)
    }
    const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(dateString);
        selectDate = dateString
        fetch(`http://192.168.86.228:8888/api/v1/booking/slots/available?date=${dateString}`, {
            method: 'GET',
            redirect: 'follow'
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.response_meta.error_code != 0) {
                    messageApi.open({
                        type: 'error',
                        content: result.response_meta.error_msg,
                    });
                }

                if (result.booking_slots === undefined) {
                    disableTimeSlots();
                    return
                }

                for (let i = 0; i < result.booking_slots.length; i++) {
                    slotData.push(result.booking_slots[i])
                }

                setDisableSlot0(result.booking_slots.length < 1 ? true : (result.booking_slots[0].citizen_slot == 0 && result.booking_slots[0].tourist_slot == 0))
                setDisableSlot1(result.booking_slots.length < 2 ? true : (result.booking_slots[1].citizen_slot == 0 && result.booking_slots[1].tourist_slot == 0))
                setDisableSlot2(result.booking_slots.length < 3 ? true : (result.booking_slots[2].citizen_slot == 0 && result.booking_slots[2].tourist_slot == 0))
                setDisableSlot3(result.booking_slots.length < 4 ? true : (result.booking_slots[3].citizen_slot == 0 && result.booking_slots[3].tourist_slot == 0))
                setDisableSlot4(result.booking_slots.length < 5 ? true : (result.booking_slots[4].citizen_slot == 0 && result.booking_slots[4].tourist_slot == 0))
            })
            .catch(error => {
                messageApi.open({
                    type: 'error',
                    content: error.value == null? 'Unable to fetch time slots now, try again later.' : error.value,
                });
                disableTimeSlots();
            });
    };

    const onTimeSlotChange = (e: RadioChangeEvent) => {
        setSelectedSlot(e.target.value)
        selectSlot = e.target.value
        console.log(`radio checked:${e.target.value}`);
        if (slotData.length >= e.target.value) {
            setAdultDisable(slotData[e.target.value].adult_slot == 0)
            setAdultMax(slotData[e.target.value].adult_slot)
            setChildDisable(slotData[e.target.value].child_slot == 0)
            setChildMax(slotData[e.target.value].child_slot)
        }
    };

    useEffect(() => {
        setHasMounted(true);
        if (adultDisable) {
            setAdultAmount(0)
        } else {
            setAdultAmount(adultCount * 99)
        }

        if (childDisable) {
            setChildAmount(0)
        } else {
            setChildAmount(childCount * 50)
        }
        setTotalAmount(adultAmount + childAmount)
        console.log(totalAmount)
    }, [adultDisable, childDisable, adultAmount, childAmount, totalAmount, adultCount, childCount])
    //To fix Hydration issue
    if (!hasMounted) {
        return null;
    }
    const onAdultChange = (value: number) => {
        setAdultAmount(value * 99)
        setAdultCount(value)
    };

    const onChildChange = (value: number) => {
        setChildAmount(value * 50)
        setChildCount(value)
    };


    const onFinish = (values: any) => {
        console.log('Success:', values);
        childTix = childCount;
        adultTix = adultCount;
        totalAmt = totalAmount;
        router.push(`/booking`)
    };

    return (
        <>
            {contextHolder}
            <Head>
                <title>HOME by Tales Of Paws</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                {/*<div className={styles.description}>*/}
                {/*    <div>*/}
                {/*        <a*/}
                {/*            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"*/}
                {/*            target="_blank"*/}
                {/*            rel="noopener noreferrer"*/}
                {/*        >*/}
                {/*            HOME by Tales Of Paws*/}
                {/*        </a>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <Title level={2} style={{textAlign: 'left', margin: '0px', padding: '20px'}}>
                    HOME by Tales Of Paws Admission Ticket
                </Title>
                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Image alt={'banner'} style={{borderRadius: '25px'}}
                               src="banner.jpg" preview={false}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xl={2}></Col>
                    <Col style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '15px'
                    }} xs={24} xl={20}>
                        <Card title="Highlights" size={'small'} bordered={false}
                              style={{width: '100%', backgroundColor: '#fff0ce', borderRadius: '15px', padding: '10px'}}
                              headStyle={{border: '0px', fontSize: '25px', paddingTop: '10px'}}>
                            <p>Southeast Asia&apos;s first and only Universal Studios theme park!</p>
                            <p>Delight your little ones as they catch their favorite characters like Elmo and see the
                                Minions at their despicable best!</p>
                            <p>Make it a holiday to remember as you meet your favorite Universal Stars, enjoy musical
                                meet-and-greets, the thrilling rides, and more</p>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Divider orientation="left" style={{paddingTop: '10px', fontSize: '20px'}}><h2>Ticket
                            Options</h2>
                        </Divider>
                    </Col>
                </Row>
                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Row>
                            <Col xl={1}></Col>
                            <Col>
                                <DatePicker size={'large'} disabledDate={(current) => {
                                    return moment().add(-1, 'days') >= current ||
                                        moment().add(1, 'month') <= current;
                                }} style={{marginLeft: '30px'}} onChange={onDateChange} inputReadOnly={true}/>

                            </Col>
                        </Row>
                        <Divider orientation="left" style={{paddingTop: '10px', fontSize: '15px'}}>Time
                            Slots</Divider>
                        <Row>
                            <Col xl={1}></Col>
                            <Col xs={24} xl={20}>
                                <Radio.Group onChange={onTimeSlotChange} defaultValue=""
                                             style={{marginLeft: '0px'}} value={selectedSlot}>
                                    <Row>
                                        <h3>Corgi Session</h3>
                                    </Row>
                                    <Row>
                                        <Radio.Button  value='0' disabled={disableSlot0}>10.30am - 12:00pm</Radio.Button>
                                        <Radio.Button value='1' disabled={disableSlot1}>12.30pm - 02:00pm</Radio.Button>
                                    </Row>
                                    <Row style={{marginTop:'10px'}}>
                                        <h3 >Dogs Cafe</h3>
                                    </Row>
                                   <Row>
                                       <Radio.Button value='2' disabled={disableSlot2}>02.30pm - 04:00pm</Radio.Button>
                                       <Radio.Button value='3' disabled={disableSlot3}>05.00pm - 06.30pm</Radio.Button>
                                   </Row>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Divider orientation="left"
                                 style={{paddingTop: '10px', fontSize: '15px'}}>Quantity</Divider>
                        <Form
                            name="tix"
                            style={{width: "auto", paddingLeft: '0px'}}
                            onFinish={onFinish}
                        >
                            <Row>
                                <Col xl={2} md={4}></Col>
                                <Col xs={5} xl={1}>
                                    <h2 style={{marginLeft: '10px'}}>Citizen</h2>
                                </Col>
                                <Col xs={3} xl={8}></Col>
                                <Col xl={3}>
                                    <h2>MYR 88.00</h2>
                                </Col>
                                <Col xs={5} xl={2}>
                                    <Row>
                                        <Col xs={8}></Col>
                                        <Col xs={1}>
                                            <Form.Item name="adult_tix_count" labelAlign={"right"}>
                                                <InputNumber onChange={onAdultChange} placeholder={'0'}
                                                             disabled={adultDisable}
                                                             style={{
                                                                 width: '60px',
                                                                 borderRadius: '10px',
                                                                 fontSize: '16px'
                                                             }}
                                                             min={0}
                                                             max={adultMax}
                                                             inputMode={'numeric'}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={2} md={4}></Col>
                                <Col xs={5} xl={1}>
                                    <h2 style={{marginLeft: '10px'}}>Tourist</h2>
                                </Col>
                                <Col xs={3} xl={8}></Col>
                                <Col xl={3}>
                                    <h2>MYR 98.00</h2>
                                </Col>
                                <Col xs={5} xl={2}>
                                    <Row>
                                        <Col xs={8}></Col>
                                        <Col xs={1}>
                                            <Form.Item name="child_tix_count" labelAlign={"right"}>
                                                <InputNumber
                                                    onChange={onChildChange} placeholder={'0'}
                                                    disabled={childDisable}
                                                    style={{width: '60px', borderRadius: '10px', fontSize: '16px'}}
                                                    min={0}
                                                    max={childMax}
                                                    inputMode={'numeric'}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={2} md={3} xs={1}></Col>
                                <Col xl={4} md={5} xs={10}>
                                    <h2 style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>MYR {totalAmount}.00</h2>
                                </Col>
                                <Col xl={8} md={8} xs={3}></Col>
                                <Col xl={4}>
                                    <Form.Item>
                                        <Button type="primary" shape="round" size={'large'}
                                                style={{background: "#fa8547"}} disabled={totalAmount == 0}
                                                htmlType="submit">
                                            Book Now
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Divider orientation="left" style={{paddingTop: '10px', fontSize: '20px'}}><h2>What To
                            Expect</h2>
                        </Divider>
                    </Col>
                </Row>
                <Row>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Col xs={24} xl={18}>
                            <div style={{width: 'auto', textAlign: 'center'}}>
                                <p>Purchase Universal Studios Singapore tickets and enter a world in Resorts World
                                    Sentosa
                                    where the worlds of blockbuster films and their iconic characters come to life! In
                                    this
                                    wonderful theme park, you and your companions can experience the thrills of
                                    cutting-edge
                                    rides, shows, and attractions based on movies and television shows like Puss In
                                    Boots’
                                    Giant Journey, Battlestar Galactica: HUMAN vs. CYLON™, TRANSFORMERS The Ride: The
                                    Ultimate 3D Battle, Jurassic Park Rapids Adventure™, Sesame Street Spaghetti Space
                                    Chase
                                    and more! Whichever attractions you visit, Universal Studios Singapore will surely
                                    indulge the interests of thrill-seekers, movie buffs, and every imaginative
                                    child!</p>
                            </div>
                        </Col>
                    </div>
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15px'
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <Image alt={'banner'} style={{borderRadius: '10px'}}
                               src="img6.webp" preview={true}/>
                    </Col>
                    Minions Minions Minions Minions
                    <Col xl={4}></Col>
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15px'
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <Image alt={'banner'} style={{borderRadius: '10px'}}
                               src="img7.webp" preview={true}/>
                    </Col>
                    Minions Minions Minions Minions
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15px'
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <Image alt={'banner'} style={{borderRadius: '10px'}}
                               src="img1.webp" preview={true}/>
                    </Col>
                    Minions Minions Minions Minions
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15px'
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <Image alt={'banner'} style={{borderRadius: '10px'}}
                               src="img2.webp" preview={true}/>
                    </Col>
                    Minions Minions Minions Minions
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15px'
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <Image alt={'banner'} style={{borderRadius: '10px'}}
                               src="img3.webp" preview={true}/>
                    </Col>
                    Minions Minions Minions Minions
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15px'
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <Image alt={'banner'} style={{borderRadius: '10px'}}
                               src="img4.webp" preview={true}/>
                    </Col>
                    Minions Minions Minions Minions
                </Row>

                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Divider orientation="left" style={{paddingTop: '10px', fontSize: '20px'}}><h2>Things To
                            Note</h2>
                        </Divider>
                    </Col>
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <p>1. All packages are fixed dated, direct entry tickets, unless otherwise stated that
                            reservation
                            is required. Fixed dated vouchers are valid only on the selected date (and time if
                            applicable) only</p>
                        <p>2. If you are requesting for a change of date for the 2nd time, do note that a nominal admin
                            fee
                            of SGD 2 applies per ticket</p>
                        <p>3. Please be advised that Resorts World Sentosa will be cash-free and will not accept all
                            denominations of currency notes or coins as payment in any transaction (eff. 23 Jan 2022).
                            This change includes all attractions at RWS including Universal Studios Singapore®, S.E.A.
                            Aquarium and Adventure Cove Waterpark, as well as hotels in the Integrated Resort, and all
                            RWS owned dining establishments. Guests will be able to make contactless payments with their
                            cards or digital wallets. The above does not apply to tenant businesses operating within the
                            Integrated Resort</p>
                    </Col>
                    <Col xl={4}></Col>
                </Row>
                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Divider orientation="left" style={{paddingTop: '10px', fontSize: '20px'}}><h2>Location</h2>
                        </Divider>
                    </Col>
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4157.852022974436!2d103.77384573716512!3d1.4849890983509988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da6deef77cf3bd%3A0x331d0f0a4faa2cd1!2sHOME%20by%20Tales%20Of%20Paws!5e0!3m2!1sen!2ssg!4v1675526918371!5m2!1sen!2ssg"
                            width="100%" height="450" loading="lazy" frameBorder={0}
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </Col>
                    <Col xl={4}></Col>
                </Row>

                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} xl={20}>
                        <Divider orientation="left" style={{paddingTop: '10px', fontSize: '20px'}}><h2>FAQ</h2>
                        </Divider>
                    </Col>
                </Row>
                <Row style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Col xl={4}></Col>
                    <Col xs={24} xl={16}>
                        <p>No cancellations or refunds will be provided for this activity.</p>
                        <p>For more information on Klook&apos;s cancellation policies, please refer to !</p>
                    </Col>
                    <Col xl={4}></Col>
                </Row>
            </main>
        </>
    )
}
