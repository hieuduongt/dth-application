import "./register.css";
import React, { useState } from "react";
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, Col, Radio, Avatar, Alert, Select } from 'antd';
import AuthServices from '../../apis/authServices';
import { setToken } from "../../helpers/useToken";
import { useNavigate, useLocation } from "react-router-dom";
import PATHS from "../../commons/paths";
const { Option } = Select;

const Register = () => {
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
        <div className="register-background-content">
            <div className="register-main-content">
                <div className="register-left-content">
                    <img className="register-logo-background" src="login-logo-background.png" alt="" />
                    <div className="register-background-content-text">
                        <div>Let us bring you the best experiences!</div>
                    </div>
                </div>
                <div className="register-form">
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 20
                    }}>
                        <span><Avatar size={"large"} src="/title-icon.PNG" alt='Hieu Duong' style={{ border: "1px solid rgb(43 149 255)", marginRight: 10 }} /></span>
                        <span style={{ fontSize: 20, fontWeight: "bolder" }}>Join us and enjoy your best experiences!</span>
                    </div>
                    <Form

                        form={form}
                        name="register"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 600,
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="userName"
                            tooltip="What do you want others to call you?"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your user name!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="E-mail" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirm Password" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    width: '100%',
                                }}
                                prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number"
                            />
                        </Form.Item>

                        <Form.Item
                            name="intro"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Intro',
                                },
                            ]}
                        >
                            <Input
                                prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="Address"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select gender!',
                                },
                            ]}
                        >
                            {/* <Radio.Group value={"topLeft"} onChange={() => {}}>
                                <Radio.Button value="topLeft">topLeft</Radio.Button>
                                <Radio.Button value="topRight">topRight</Radio.Button>
                                <Radio.Button value="bottomLeft">bottomLeft</Radio.Button>
                                <Radio.Button value="bottomRight">bottomRight</Radio.Button>
                            </Radio.Group> */}
                            <Select placeholder="Select your gender" suffixIcon={<UsergroupDeleteOutlined className="site-form-item-icon"/>} >
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                            {/* <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Gender" type="radio"/> */}
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                                },
                            ]}
                        >
                            <Checkbox>
                                I have read the <a href="">agreement</a>
                            </Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", alignContent: "center" }}>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                                <div>
                                    Already have account?
                                    <a href={`${PATHS.LOGIN}?redirectUri=${getRedirectUri()}`}>
                                        Login
                                    </a>
                                </div>

                            </div>

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Register;