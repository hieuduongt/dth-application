import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/AdminLayout";
import { Avatar, Table, Modal, Button, Form, Input, InputNumber, Upload, Select, message, Tooltip, Card, Row, Col } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
    FileAddOutlined,
    EyeOutlined,
    PlusOutlined
} from '@ant-design/icons';
import ProductServices from '../../../apis/productServices';
import CategoryServices from '../../../apis/categoryServices';
import PATH from "../../../commons/path";
const { confirm } = Modal;
const { Option } = Select;
const { Meta } = Card;

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [createButton, setDisableCreateButton] = useState(true);
    const [product, setProduct] = useState({
        productName: "",
        price: 0,
        imageURLs: [],
        description: "",
        categoryId: ""
    });
    const [loadings, setLoadings] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [createForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [formValidations, setFormValidations] = useState({
        productName: {
            errorType: "warning",
            help: "Product name is required! don't forget to type it!"
        },
        price: {
            errorType: "warning",
            help: "Price must be a number and must be in range from 0 -> 9999999999"
        },
        category: {
            errorType: "warning",
            help: "You need to choose a category for your product!"
        }
    });

    const getAllProducts = async () => {
        const res = await ProductServices.getAllProducts();
        if (res.status === 200) {
            if (res.data.results.length) {
                setProducts(res.data.results);
            }
        }
    }

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            if (res.data.results.length) {
                setCategories(res.data.results);
                setProduct({ ...product, categoryId: res.data.results[0].id });
            }
        }
    }

    const handleCreateNew = async () => {
        setIsCreating(true);
        if (fileList.length) {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('files', file.originFileObj);
            });
            message.info("Uploading Images...");
            const uploadedImages = await ProductServices.uploadFiles(formData);
            if (uploadedImages.status === 200) {
                if (uploadedImages.data.results && uploadedImages.data.results.length) {
                    product.imageURLs = uploadedImages.data.results;
                    message.success(`Uploaded ${uploadedImages.data.results.length} Images`);
                }
                message.info("Creating product...");
                const res = await ProductServices.createProduct(product);
                if (res.status === 200) {
                    if(res.data.isSuccess) {
                        await getAllProducts();
                        message.success("Created!!!");
                        setCreateOpen(false);
                        setDisableCreateButton(true);
                        setProduct({
                            productName: "",
                            price: 0,
                            imageURLs: [],
                            description: "",
                            categoryId: ""
                        });
                        setFileList([]);
                    } else {
                        message.error(res.data.message);
                    }
                    
                } else {
                    message.error("Cannot create product with unknown errors!!!");
                }

            } else {
                message.error(`Cannot upload ${fileList.length} Images`);
            }
        }
        setIsCreating(false);
    }

    const handleDelete = async (id) => {
        const res = await ProductServices.deleteProduct(id);
        if (res.status === 200) {
            await getAllProducts();
            message.info("Deleted!!!")
        }
    }

    const showDeleteConfirm = (index, id) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        confirm({
            title: <h4>Are you sure you want to delete this product?</h4>,
            icon: <ExclamationCircleFilled />,
            content: <span style={{ color: "red" }}>This action will delete this product and all the info related to this product contains all media components forever and you cannot recover it in the future!!!</span>,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDelete(id);
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
            render: (text, record, index) => (<Avatar src={
                record.imageURLs.find(i => i.isMainImage).url.includes("https") ?
                    record.imageURLs.find(i => i.isMainImage).url :
                    `${PATH.IMAGEBASEURL}${record.imageURLs.find(i => i.isMainImage).url}`
            } />),
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
                <Tooltip placement="left"
                    style={{ opacity: 0 }}
                    color="#000000"
                    arrow={false} title={(
                        <Card
                            cover={<img alt="example" src={
                                record.imageURLs.find(i => i.isMainImage).url.includes("https") ?
                                    record.imageURLs.find(i => i.isMainImage).url :
                                    `${PATH.IMAGEBASEURL}${record.imageURLs.find(i => i.isMainImage).url}`
                            } />}
                        >
                            <Meta title={record.productName} description={record.description} />
                        </Card>
                    )}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}

                    />
                </Tooltip>

                <Button
                    type="text"
                    icon={<EditOutlined />}
                // onClick={() => {

                //     getProduct(record.id);
                //     setUpdateOpen(true);
                // }}
                />
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(index, record.id)}
                    loading={loadings[index]}
                />
            </>),
            width: 150,
        },
    ];

    useEffect(() => {
        getAllProducts();
        getAllCategories();
    }, []);

    const handleCancel = () => setPreviewOpen(false);
    const handleImagePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleImagesChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleInputChange = (event, name) => {
        if (event) {
            if (name.includes("price")) {
                setProduct({ ...product, [name]: event });
            } else {
                setProduct({ ...product, [name]: event.target.value });
            }

            if (product.productName && product.price) {
                setDisableCreateButton(false);
            }
        }
    }

    const fieldValidate = () => {

    }

    return (
        <MainLayout>
            <Button type="primary" icon={<FileAddOutlined />} style={{ marginBottom: "20px" }} onClick={() => setCreateOpen(true)}>
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
                open={createOpen}
                onOk={async () => { await handleCreateNew(); createForm.resetFields() }}
                onCancel={() => { setCreateOpen(false); createForm.resetFields() }}
                width={800}
                okButtonProps={{ disabled: createButton }}
                estroyOnClose={true}
                confirmLoading={isCreating}
            >
                <Row gutter={8}>
                    <Col className="gutter-row" span={3} style={{ textAlign: "right" }}>
                        Images:
                    </Col>
                    <Col className="gutter-row" span={21}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handleImagePreview}
                            onChange={handleImagesChange}
                            multiple
                            maxCount={5}
                            beforeUpload={(file) => {
                                setFileList(fileList => [...fileList, file]);
                                return false;
                            }
                            }
                            onRemove={(file) => {
                                const index = fileList.indexOf(file);
                                const newFileList = fileList.slice();
                                newFileList.splice(index, 1);
                                setFileList(newFileList);
                            }
                            }
                        >
                            {fileList.length >= 5 ? null :
                                <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        Upload(max: 5 images)
                                    </div>
                                </div>}
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
                    </Col>
                </Row>

                <Form
                    form={createForm}
                    {...{
                        labelCol: { span: 3 }
                    }}
                    name="create-new-product-modal"
                    onErrorCapture={(e) => setDisableCreateButton(true)}
                    style={{ maxWidth: 1000 }}
                >
                    <Form.Item
                        name={['productName']}
                        label="Name"
                        rules={[{ required: true }]}
                        hasFeedback
                        validateStatus={formValidations.productName.errorType}
                        help={formValidations.productName.help}
                        >
                        <Input onErrorCapture={() => console.log("error")} onChange={(event) => handleInputChange(event, "productName")} />
                    </Form.Item>
                    <Form.Item
                        name={['price']}
                        label="Price"
                        rules={[{ type: 'number', min: 0, max: 9999999999 }]}
                        hasFeedback
                        validateStatus={formValidations.price.errorType}
                        help={formValidations.price.help}
                        >
                        <InputNumber style={{ width: "100%" }} required onChange={(event) => handleInputChange(event, "price")} />
                    </Form.Item>
                    <Form.Item
                        name={['categoryId']}
                        label="Category"
                        hasFeedback
                        validateStatus={formValidations.category.errorType}
                        help={formValidations.category.help}
                        >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.children.toLowerCase() ?? '').includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                            }
                            onChange={(value) => { setProduct({ ...product, categoryId: value }) }}>
                            {categories.map(cate => (
                                <Option key={cate.id} value={cate.id}>{cate.categoryName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name={['description']} label="Description">
                        <Input.TextArea onChange={(event) => handleInputChange(event, "description")} />
                    </Form.Item>

                </Form>

            </Modal>
        </MainLayout>
    );
}

export default ListProducts;