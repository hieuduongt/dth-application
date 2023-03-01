import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductServices from "../../../apis/productServices";
import AdminLayout from '../../../layouts/AdminLayout';
import { Button, Checkbox, Form, Input } from 'antd';


const Product = () => {
    const [product, setProduct] = useState();
    const params = useParams();
    const getProduct = async () => {
        const res = await ProductServices.getProduct(params.id);
        if (res.status === 200) {
            setProduct(res.data.result);
        }
    }

    useEffect(() => {
        getProduct();
    }, []);

    const onFinish = async (values) => {
        const res = await ProductServices.updateProduct(values);
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
                product ? 
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
                    initialValue={product ? product.id : ""}
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
                    initialValue={product.productName}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="url"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your category Url!',
                        },
                    ]}
                    initialValue = {product ? product.description : ""}
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

export default Product;