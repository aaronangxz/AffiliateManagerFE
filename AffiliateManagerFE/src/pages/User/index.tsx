import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Divider, Input, MessagePlugin, Row, Tooltip } from 'tdesign-react';
import { BrowserRouterProps, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { getToken } from '../../auth_token';
import envVar from '../../env_var';
import moment from 'moment';
import Board, { ETrend, IBoardProps } from '../../components/Board';
import QRCodeStyling from 'qr-code-styling';
import { DownloadIcon } from 'tdesign-icons-react';

const affiliateTypeMap: {
  [key: number]: string;
} = {
  0: 'Airbnb',
  1: 'Grab',
};

const roleTypeMap: {
  [key: number]: string;
} = {
  0: 'Affiliate',
  1: 'Administrator',
  2: 'Developer',
};

export const User: React.FC<BrowserRouterProps> = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    user_id: 0,
    user_name: '-',
    user_email: '-',
    user_contact: '-',
    user_role: null,
    create_timestamp: 0,
  });
  const [affiliateDetails, setAffiliateDetails] = useState({
    affiliate_id: 0,
    affiliate_type: null,
    entity_name: '-',
    entity_identifier: '-',
    unique_referral_code: '-',
    referral_count: 0,
    referral_clicks: 0,
    referral_commission: 0,
    total_revenue: 0,
  });

  const PANE_LIST: Array<IBoardProps> = [
    {
      title: 'Lifetime Affiliate Revenue',
      subtitle: 'The grand total of all ticket sales made through referrals since day 1.',
      count: (affiliateDetails.total_revenue / 100).toFixed(2),
      trend: ETrend.undefined,
    },
    {
      title: 'Lifetime Commission',
      subtitle: 'The grand total of all ticket sales made through referrals since day 1.',
      count: (affiliateDetails.referral_commission / 100).toFixed(2),
      trend: ETrend.undefined,
    },
    {
      title: 'Lifetime Clicks',
      subtitle: 'The grand total of all ticket sales made through referrals since day 1.',
      count: affiliateDetails.referral_clicks.toString(),
      trend: ETrend.undefined,
    },
    {
      title: 'Lifetime Bookings',
      subtitle: 'The grand total of all ticket sales made through referrals since day 1.',
      count: affiliateDetails.referral_count.toString(),
      trend: ETrend.undefined,
    },
  ];
  const getUserDetails = () => {
    if (getToken() === undefined || getToken() === null) {
      navigate('/login/index');
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${getToken()?.tokens.access_token}`);
    fetch(`${envVar.Env}/api/v1/user/info`, {
      headers: myHeaders,
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          MessagePlugin.error(result.response_meta.error_msg);
        }
        if (result.affiliate_meta !== undefined) {
          setAffiliateDetails(result.affiliate_meta);
        }

        if (result.user_info !== undefined) {
          setUserDetails(result.user_info);
        }
      })
      .catch((error) => {
        MessagePlugin.error(error);
        console.log('error', error);
      });
  };

  const qrCode = new QRCodeStyling({
    data: `https://affiliate-manager-booking.vercel.app?ref=${affiliateDetails.unique_referral_code}`,
    width: 300,
    height: 300,
    image: '/icons8-corgi-100.png',
    dotsOptions: {
      color: '#6a1a4c',
      type: 'extra-rounded',
      gradient: {
        type: 'radial',
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#ffcd89' },
          { offset: 1, color: '#ffdc95' },
        ],
      },
    },
    backgroundOptions: {
      color: '#fffcf0',
    },
    imageOptions: {
      hideBackgroundDots: true,
      crossOrigin: 'anonymous',
      margin: 0,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#ffcf6c',
    },
  });

  useEffect(() => {
    getUserDetails();
    qrCode.append(ref.current);
  }, []);

  const onDownloadClick = () => {
    qrCode.download({
      name: `referral_qr_${affiliateDetails.unique_referral_code}`,
      extension: 'png',
    });
  };

  // const onCodeCopy = () =>{
  //   navigator.clipboard.writeText(tableName).then(() => {}
  // }

  return (
    <div>
      <Card className={styles.stats} style={{ marginTop: '20px' }}>
        <Row>
          <Col>
            <h1 style={{ color: 'white' }}>Your Lifetime Stats</h1>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          {PANE_LIST.map((item) => (
            <Col key={item.title} xs={3} xl={3}>
              <Board
                title={item.title}
                subtitle={item.subtitle}
                trend={item.trend}
                trendNum={item.trendNum}
                count={item.count}
                // loading={cardLoading}
              />
            </Col>
          ))}
        </Row>
      </Card>
      <Divider />
      <Row>
        <Col xs={12} lg={12} xl={12}>
          <Card className={styles.welcome} bordered={false} style={{ borderRadius: '15px' }}>
            <Row justify='space-between'>
              <Col className={styles.name}>Hello, {getToken()?.user_name}!</Col>
              <Col>
                <img alt='' src='' />
              </Col>
            </Row>
          </Card>
          <Card className={styles.userinfo} style={{ borderRadius: '15px' }}>
            <Row>
              <Col>
                <h1>Your Profile</h1>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {userDetails.user_role !== 1 ? (
                <Col span={3}>
                  <div className={styles.label}>Entity Name</div>
                  <div className={styles.value}>
                    {affiliateDetails.entity_name === undefined ? 'N/A' : affiliateDetails.entity_name}
                  </div>
                </Col>
              ) : null}
              {userDetails.user_role !== 1 ? (
                <Col span={3}>
                  <div className={styles.label}>Entity Identifier</div>
                  <div className={styles.value}>
                    {affiliateDetails.entity_identifier === undefined ? 'N/A' : affiliateDetails.entity_identifier}
                  </div>
                </Col>
              ) : null}
              <Col span={3}>
                <div className={styles.label}>Email</div>
                <div className={styles.value}>{userDetails.user_email}</div>
              </Col>
              <Col span={3}>
                <div className={styles.label}>Contact Number</div>
                <div className={styles.value}>{userDetails.user_contact}</div>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={3}>
                <div className={styles.label}>Role</div>
                <div className={styles.value}>
                  {userDetails.user_role === null ? 'N/A' : roleTypeMap[userDetails.user_role]}
                </div>
              </Col>
              {userDetails.user_role !== 1 ? (
                <Col span={3}>
                  <div className={styles.label}>Type</div>
                  <div className={styles.value}>
                    {affiliateDetails.affiliate_type === null
                      ? 'N/A'
                      : affiliateTypeMap[affiliateDetails.affiliate_type]}
                  </div>
                </Col>
              ) : null}
              <Col span={3}>
                <div className={styles.label}>Join Date</div>
                <div className={styles.value}>{moment.unix(userDetails.create_timestamp).format('MMM DD, yyyy')}</div>
              </Col>
            </Row>
          </Card>
        </Col>
        {/* <Col xs={12} lg={12} xl={3}> */}
        {/*  <Card className={styles.postmsg} style={{ marginLeft: '15px', height: '350px' }}> */}
        {/*    <div className={styles.avatar}> */}
        {/*      <span>{Array.from(getToken()?.user_name)[0]}</span> */}
        {/*    </div> */}
        {/*    <div className={styles.name}>My Profile</div> */}
        {/*    <div className={styles.position}>{affiliateDetails.entity_name}</div> */}
        {/*  </Card> */}
        {/* </Col> */}
      </Row>
      {userDetails.user_role !== 1 ? (
        <Card style={{ marginTop: '20px', borderRadius: '15px' }}>
          <h1>Your Referral Code</h1>
          <Row>
            <Col>
              <h2>Referral Code</h2>
              <Tooltip content='Click to copy' theme='light'>
                <Input
                  autoWidth
                  placeholder='只读状态'
                  value={affiliateDetails.unique_referral_code}
                  readonly
                  onClick={() => {
                    navigator.clipboard.writeText(affiliateDetails.unique_referral_code);
                    MessagePlugin.success('Copied');
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Referral Link</h2>
              <Tooltip content='Click to copy' theme='light'>
                <Input
                  autoWidth
                  placeholder='只读状态'
                  value={`https://affiliate-manager-booking.vercel.app?ref=${affiliateDetails.unique_referral_code}`}
                  readonly
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://affiliate-manager-booking.vercel.app?ref=${affiliateDetails.unique_referral_code}`,
                    );
                    MessagePlugin.success('Copied');
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Referral QR Code</h2>
              <div ref={ref} />
              <div style={styles.inputWrapper}>
                <Button variant='outline' icon={<DownloadIcon />} onClick={onDownloadClick}>
                  Download Your QR Code
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      ) : null}
    </div>
  );
};

export default memo(User);
