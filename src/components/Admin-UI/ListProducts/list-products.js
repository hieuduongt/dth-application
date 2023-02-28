import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/AdminLayout";
import { Avatar, Table, Modal, Button, Form, Input, InputNumber, Upload, Select } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, FileAddOutlined, PlusOutlined } from '@ant-design/icons';
import ProductServices from '../../../apis/productServices';
const { confirm } = Modal;
const { Option } = Select;

const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    }
};

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [loadings, setLoadings] = useState([]);
    const [imageChoosing, setImageChoosing] = useState("link");
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
            render: (text, record, index) => (<Avatar src={record.imageURL} />),
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

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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
                    <Form.Item name={['imageURL']} label="Image">
                        <Select defaultValue="link" style={{ marginBottom: 10, marginRight: 10 }} onChange={(value) => setImageChoosing(value)}>
                            <Option value="link">Image URLs</Option>
                            <Option value="upload">Upload</Option>
                        </Select>
                        {imageChoosing === "link" ?
                            <Input /> :
                            <>
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    accept="image/png, image/jpeg, image/jpg, image/avif, image/webp"
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </>
                        }
                    </Form.Item>
                    <Form.Item name={['price']} label="Price" rules={[{ type: 'number', min: 0, max: 9999999999 }]}>
                        <InputNumber />
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