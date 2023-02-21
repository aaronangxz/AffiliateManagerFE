import React, { memo } from 'react';
import { Row, Col, Button, List, Card } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';
import { BrowserRouterProps } from 'react-router-dom';
import styles from './index.module.less';

const User: React.FC<BrowserRouterProps> = () => (
  <div>
    <Row>
      <Col xs={12} lg={12} xl={9}>
        <Card className={styles.welcome} bordered={false}>
          <Row justify='space-between'>
            <Col className={styles.name}>Hello, Name!</Col>
            <Col>
              <img alt='' src='https://tdesign.gtimg.com/starter/assets-tencent-logo.png' className={styles.logo} />
            </Col>
          </Row>
        </Card>
        <Card
          className={styles.userinfo}
          title='个人信息'
          bordered={false}
          actions={
            <Button shape='square' theme='default' variant='text'>
              <IconFont name='edit' />
            </Button>
          }
          header
        >
          <Row gutter={[16, 16]}>
            <Col span={3}>
              <div className={styles.label}>手机</div>
              <div className={styles.value}>+86 13923734567</div>
            </Col>
            <Col span={3}>
              <div className={styles.label}>座机</div>
              <div className={styles.value}>734567</div>
            </Col>
            <Col span={3}>
              <div className={styles.label}>办公室邮箱</div>
              <div className={styles.value}>Account@qq.com</div>
            </Col>
            <Col span={3}>
              <div className={styles.label}>座位</div>
              <div className={styles.value}>T32F 012</div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={3}>
              <div className={styles.label}>管理主体</div>
              <div className={styles.value}>腾讯集团</div>
            </Col>
            <Col span={3}>
              <div className={styles.label}>直属上级</div>
              <div className={styles.value}>Michael Wang</div>
            </Col>
            <Col span={3}>
              <div className={styles.label}>职称</div>
              <div className={styles.value}>高级 UI 设计师</div>
            </Col>
            <Col span={3}>
              <div className={styles.label}>入职时间</div>
              <div className={styles.value}>2021-07-01</div>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={12} lg={12} xl={3}>
        <Card className={styles.postmsg} style={{ marginLeft: '15px' }}>
          <div className={styles.avatar}>
            <span>T</span>
          </div>
          <div className={styles.name}>My Account</div>
          <div className={styles.position}>XXG 港澳业务拓展组员工 直客销售</div>
        </Card>
      </Col>
    </Row>
  </div>
);

export default memo(User);
