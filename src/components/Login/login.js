import "./login.css";
import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Col, Row, Avatar, Alert } from 'antd';
import AuthServices from '../../apis/authServices';
import { setToken } from "../../helpers/useToken";
import { useNavigate, useLocation } from "react-router-dom";
import PATHS from "../../commons/paths";

const Login = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const getRedirectUri = () => {
        const searchParams = location.search;
        const redirectUri = new URLSearchParams(searchParams).get("redirectUri");
        return redirectUri ? redirectUri : "";
    }

    const onFinish = async (values) => {
        const result = await AuthServices.login(values);
        if (result.status === 200) {
            switch (result.data.code) {
                case 200: {
                    setToken(result.data.result);
                    const redirectUri = getRedirectUri();
                    navigate(redirectUri ? `${redirectUri}` : "/");
                }
                case 401: {
                    setErrorMessage(result.data.message);
                }
            }
        }
    };

    return (
        <Row justify={"center"} wrap={true} style={{
            height: "100vh"
        }}>
            <Col
                xs={{
                    span: 24,
                    offset: 0,
                }}
                sm={{
                    span: 24,
                    offset: 0
                }}
                md={{
                    span: 12,
                    offset: 0
                }}
                lg={{
                    span: 12,
                    offset: 0
                }}
                xl={{
                    span: 12,
                    offset: 0
                }}
                xxl={{
                    span: 12,
                    offset: 0
                }}>
                <div className="login-background">
                    <div className="login-background-content">
                        <div>
                            <img className="login-logo-background" src="login-logo-background.png" alt="" />
                            <div className="login-background-content-text">
                                Let us bring you the best experiences!
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col
                xs={{
                    span: 24,
                    offset: 0,
                }}
                sm={{
                    span: 24,
                    offset: 0
                }}
                md={{
                    span: 12,
                    offset: 0
                }}
                lg={{
                    span: 12,
                    offset: 0
                }}
                xl={{
                    span: 12,
                    offset: 0
                }}
                xxl={{
                    span: 12,
                    offset: 0
                }}>
                <div className="login-form">
                    <Form
                        form={form}
                        style={{
                            width: 400
                        }}
                        name="normal_login"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item>
                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <span><Avatar size={"large"} src="/title-icon.PNG" alt='Hieu Duong' style={{ border: "1px solid rgb(43 149 255)", marginRight: 10 }} /></span>
                                <span style={{ fontSize: 20, fontWeight: "bolder" }}>Welcome to DTH Application</span>
                            </div>

                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        {errorMessage ?
                            <Form.Item>
                                <Alert message={errorMessage} type="error" showIcon />
                            </Form.Item>
                            :
                            <></>}
                        <Form.Item>
                            <div className="login-action">
                                <div className="login-remember-me">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>
                                </div>
                                <div className="login-form-forgot">
                                    <a className="" href="#">
                                        Forgot password
                                    </a>
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            Or <a href={`${PATHS.REGISTER}?redirectUri=${getRedirectUri()}`}>register now!</a>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    )
}

export default Login;