import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/AdminLayout";
import { Avatar, Table, Modal, Button, Form, Input, InputNumber, Upload, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, FileAddOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProductServices from '../../../apis/productServices';
const { confirm } = Modal;
const { Option } = Select;
const { Dragger } = Upload;

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [loadings, setLoadings] = useState([]);
    const [imageChoosing, setImageChoosing] = useState("link");

    const [imageFiles, setImageFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const getAlProducts = async () => {
        const res = await ProductServices.getAllProducts();
        if (res.status === 200) {
            if (res.data.results.length) {
                setProducts(res.data.results);
            }
        }
    }

    const handleCreateNew = async (data) => {
        const res = await ProductServices.createProduct(data);
        if (res.status === 200) {
            await getAlProducts()
        }
        setOpen(false);
    }

    const showDeleteConfirm = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        confirm({
            title: 'Are you sure delete this product?',
            icon: <ExclamationCircleFilled />,
            content: 'This action will delete this product forever and you cannot recover it in the future!!!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                setLoadings((prevLoadings) => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            },
            onCancel() {
                setLoadings((prevLoadings) => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            },
        });
    }

    const columns = [
        {
            render: (text, record, index) => (<Avatar src={record.imageURLs.find(i => i.isMainImage).url} />),
            title: 'Image',
            dataIndex: 'imageURL',
            width: 150,
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            width: 150,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: 150,
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Category',
            dataIndex: ["category", "categoryName"],
            width: 150,
        },
        {
            title: 'Action',
            render: (text, record, index) => (<>
                <Button
                    type="dashed"
                    icon={<EditOutlined />}

                // onClick={() => enterLoading(2)}
                />
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(index)}
                    loading={loadings[index]}
                // loading={loadings[2]}
                // onClick={() => enterLoading(2)}
                />
            </>),
            width: 150,
        },
    ];

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    useEffect(() => {
        getAlProducts();
    }, []);

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://localhost:7023/api/file/upload',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                const { fileList } = info;
                setImageFiles(fileList);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            message.info('Dropped files');
        },
        accept: "image/png, image/jpeg, image/jpg, image/webp"
    };

    return (
        <MainLayout>
            <Button type="primary" icon={<FileAddOutlined />} style={{ marginBottom: "20px" }} onClick={() => setOpen(true)}>
                Create a new product
            </Button>
            <Table
                columns={columns}
                dataSource={products}
                pagination={{
                    pageSize: 50,
                }}
                scroll={{
                    y: 800,
                }}
                rowKey={rowData => rowData.id}
            />
            <Modal
                title="Create a new product"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
            >
                <Form
                    {...layout}
                    name="nest-messages"
                    // onFinish={onFinish}
                    style={{ maxWidth: 1000 }}
                    validateMessages={validateMessages}
                >
                    <Form.Item name={['productName']} label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['selectImageURLType']} label="Select Image Data Type">
                        <Select defaultValue="link" onChange={(value) => setImageChoosing(value)}>
                            <Option value="link">Image URLs</Option>
                            <Option value="upload">Upload</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name={['imageURL']} label="Image" >
                        {imageChoosing === "link" ?
                            // <Input.TextArea size="large" placeholder="Please type your image URLs, a semicolon will separate each image URL!"/>
                            <Form.List
                                name="names"
                                rules={[
                                    {
                                        validator: async (_, names) => {
                                            if (!names || names.length < 1) {
                                                return Promise.reject(new Error('At least 1 image'));
                                            }
                                        },
                                    },
                                ]}
                            >
                                {(fields, { add, remove }, { errors }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                required={false}
                                                key={field.key}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message: "Please input image URL name or delete this field.",
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder="image url"
                                                        style={{
                                                            width: '95%',
                                                            marginRight: 10
                                                        }}
                                                    />
                                                </Form.Item>
                                                {fields.length > 1 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => remove(field.name)}
                                                    />
                                                ) : null}
                                            </Form.Item>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                style={{
                                                    width: '100%',
                                                }}
                                                icon={<PlusOutlined />}
                                            >
                                                Add Image
                                            </Button>
                                            
                                            <Form.ErrorList errors={errors} />
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List> :
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Only support for the extensions: png, jpg, jpeg, webp!
                                </p>
                            </Dragger>
                        }
                    </Form.Item>
                    <Form.Item name={['price']} label="Price" rules={[{ type: 'number', min: 0, max: 9999999999 }]}>
                        <InputNumber style={{width: "100%"}}/>
                    </Form.Item>
                    <Form.Item name={['categoryId']} label="Category">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['description']} label="Description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </MainLayout>
    );
}

export default ListProducts;