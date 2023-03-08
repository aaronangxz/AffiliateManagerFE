import React, {useState} from 'react';
import {citizenTix, touristTix} from "./index";
import {Card, Form, Input} from "antd";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export let contactFormValues = [];
export let emptyValues = [];

function InfoForm() {
    const [inputFields, setInputFields] = useState([])
    const [value, setValue] = useState("")

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
        contactFormValues = data
    }

    const handleNumChange = (index, event) => {
        let data = [...inputFields];
        data[index]['customer_mobile'] = event;
        setInputFields(data);
        contactFormValues = data
    }

    const getForms = () => {
        if (emptyValues.length == citizenTix + touristTix) {
            return;
        }
        for (let i = 0; i < citizenTix + touristTix; i++) {
            let newField = {customer_name: '', customer_email: '', customer_mobile: ''};
            emptyValues.push(newField)
            setInputFields(emptyValues);
        }
    }

    React.useEffect(() => {
        emptyValues = [];
        getForms();
    }, [])


    return (
        <div className="App">
            {inputFields.map((input, index) => {
                return (
                    <Card key={index} title={`Visitor ${
                        // @ts-ignore
                        index + 1}`} bordered={true} style={{width: "auto", marginBottom: '10px'}}>
                        <Form.Item label="Name">
                            <Input name='customer_name' onChange={event => handleFormChange(index, event)}
                                   style={{fontSize: '17px'}}/>
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input name='customer_email' onChange={event => handleFormChange(index, event)}
                                   style={{fontSize: '17px'}}/>
                        </Form.Item>
                        <Form.Item label="Contact">
                            <PhoneInput
                                country={'my'}
                                onChange={event => handleNumChange(index, event)}
                                inputStyle={{color:'black'}}
                                preferredCountries={['my','sg']}
                                countryCodeEditable={false}
                                autoFormat={false}
                            />
                        </Form.Item>

                    </Card>
                )
            })}
        </div>
    );
}

export default InfoForm;