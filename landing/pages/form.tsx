import React, {useState} from 'react';
import {adultTix, childTix} from "./index";
import {Card, Form, Input} from "antd";

export let formValues = [];
export let emptyValues = [];

function InfoForm() {
    const [inputFields, setInputFields] = useState([])

    const handleFormChange = (index, event) => {
        console.log(event)
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
        formValues = data
    }

    const getForms = () => {
        console.log(adultTix + childTix);
        if (emptyValues.length == adultTix + childTix) {
            return;
        }
        for (let i = 0; i < adultTix + childTix; i++) {
            let newField = {name: '', email: '', contact: ''};
            // setInputFields([...inputFields, newField]);
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
                            <Input name='name' onChange={event => handleFormChange(index, event)}
                                   style={{fontSize: '17px'}}/>
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input name='email' onChange={event => handleFormChange(index, event)}
                                   style={{fontSize: '17px'}}/>
                        </Form.Item>
                        <Form.Item label="Contact">
                            <Input name='contact' onChange={event => handleFormChange(index, event)}
                                   style={{fontSize: '17px'}}/>
                        </Form.Item>
                    </Card>
                )
            })}
        </div>
    );
}

export default InfoForm;