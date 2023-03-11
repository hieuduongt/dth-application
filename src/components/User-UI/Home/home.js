import { React } from 'react';
import UserLayout from '../../../layouts/UserLayout';
import { Col, Row } from 'antd';

const Home = () => {
    return (
        <UserLayout>
            <div style={{width: "100%", height: "100%"}}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

                    <Col className="gutter-row" span={6}>
                        <div >col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div >col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div >col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div >col-6</div>
                    </Col>
                </Row>
            </div>
        </UserLayout>
    );
}

export default Home;