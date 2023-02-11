import React, { useRef, memo, useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, MessagePlugin, Select } from 'tdesign-react';
import { CONTRACT_STATUS_OPTIONS, CONTRACT_TYPE_OPTIONS } from '../consts';
import { FormInstanceFunctions, SubmitContext } from 'tdesign-react/es/form/type';

const { FormItem } = Form;

export type FormValueType = {
  name?: string;
  status?: string;
  number?: string;
  time?: string;
  type?: string;
};

export type SearchFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
};

const SearchForm = ({ handleStringCallBack }:any,props:any ) => {
  const [searchString, setSearchString] = useState('');

  const formRef = useRef<FormInstanceFunctions>();
  const onSubmit = (e: SubmitContext) => {
    if (e.validateResult === true) {
      MessagePlugin.info('提交成功');
    }
    const queryValue = formRef?.current?.getFieldsValue?.(true);
    console.log('form 数据', queryValue);
  };

  const onReset = () => {
    props.onCancel();
    MessagePlugin.info('重置成功');
  };

  useEffect(() => {
    handleStringCallBack(searchString);
  }, [searchString]);

  return (
    <div className='list-common-table-query'>
      <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} labelWidth={80} colon>
        <Row>
          <Col flex='1'>
            <Row gutter={[16, 16]}>
              <Col span={4} xs={12} sm={6} xl={4}>
                <FormItem label='Affiliate' name='name'>
                  <Input clearable={true} placeholder='Enter Affiliate Name' onChange={setSearchString} />
                </FormItem>
              </Col>
              <Col span={4} xs={12} sm={6} xl={4}>
                <FormItem label='Booking' name='number'>
                  <Input clearable={true} placeholder='Enter Booking ID' />
                </FormItem>
              </Col>
              <Col span={4} xs={12} sm={6} xl={4}>
                <FormItem label='Status' name='type'>
                  <Select options={CONTRACT_TYPE_OPTIONS} placeholder='Select Status' />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col flex='160px'>
            <Button theme='primary' type='submit' style={{ margin: '0px 20px' }}>
              Filter
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default memo(SearchForm);
