import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryServices from "../../../apis/categoryServices";
import AdminLayout from '../../../layouts/AdminLayout';
import { Button, Checkbox, Form, Input } from 'antd';


const Category = () => {
    const [category, setCategory] = useState();
    const params = useParams();
    const getCategory = async () => {
        const res = await CategoryServices.getCategory(params.id);
        if (res.status === 200) {
            setCategory(res.data.result);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    const onFinish = async (values) => {
        const res = await CategoryServices.updateCategory(values);
        if(res) {
            console.log(res);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <AdminLayout>
            {
                category ? 
                <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="id"
                    hidden={true}
                    initialValue={category ? category.id : ""}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your category name!',
                        },
                    ]}
                    initialValue={category ? category.categoryName : ""}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Category Url"
                    name="url"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your category Url!',
                        },
                    ]}
                    initialValue = {category ? category.url : ""}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>:
            <></>
            }
            
        </AdminLayout>
    );
}

export default Category;