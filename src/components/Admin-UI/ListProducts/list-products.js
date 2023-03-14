import React, { useState, useEffect } from "react";
import "./list-products.css";
import MainLayout from "../../../layouts/AdminLayout";
import {
    Avatar,
    Table,
    Modal,
    Button,
    Form,
    Input,
    Upload,
    Select,
    message,
    Popover,
    Card,
    Row,
    Col
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
    FileAddOutlined,
    EyeOutlined,
    PlusOutlined,
    CheckOutlined
} from '@ant-design/icons';
import ProductServices from '../../../apis/productServices';
import CategoryServices from '../../../apis/categoryServices';
import PATH from "../../../commons/path";
const { confirm } = Modal;
const { Option } = Select;
const { Meta } = Card;

const defaultProduct = {
    productName: "",
    price: 0,
    imageURLs: [],
    description: "",
    categoryId: ""
};

const defaultValidations = {
    productName: {
        errorType: "",
        help: ""
    },
    price: {
        errorType: "",
        help: ""
    },
    category: {
        errorType: "",
        help: ""
    },
    description: {
        errorType: "",
        help: ""
    }
};

const validationRules = {
    productName: [
        {
            rule: /.+/i,
            message: "Product name is required"
        },
        {
            rule: /^[^@#^*<>=+]+$/i,
            message: "Product name must not contain special characters"
        }
    ],
    price: [
        {
            rule: /.+/i,
            message: "Price is required"
        },
        {
            rule: /^[0-9]+$/i,
            message: "Price must be a number"
        },
        {
            rule: /^\d{0,10}$/i,
            message: "Price must be in range from 0 -> 9999999999"
        }
    ],
    categoryId: [
        {
            rule: /.+/i,
            message: "Category is required"
        }
    ],
    description: [
        {
            rule: /^[^@#^*<>=+]*$/i,
            message: "Description must not contain special characters"
        }
    ]
};

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [createButton, setDisableCreateButton] = useState(true);
    const [updateButton, setDisableUpdateButton] = useState(true);
    const [product, setProduct] = useState(defaultProduct);

    const [currentProduct, setCurrentProduct] = useState(defaultProduct);
    const [updateForm] = Form.useForm();
    const [updateOpen, setUpdateOpen] = useState(false);

    const [loadings, setLoadings] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [createForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [updateFileList, setUpdateFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [formValidations, setFormValidations] = useState(defaultValidations);
    const [pagination, setPagination] = useState();

    const columns = [
        {
            render: (text, record, index) => (<Avatar src={
                record.imageURLs.find(i => i.isMainImage).url.includes("http") ?
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
            render: (text, record, index) => numberFormater(record.price),
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
                <Popover content={(
                    <Card
                        cover={<img width="200px" height="200px" alt="example" src={
                            record.imageURLs.find(i => i.isMainImage).url.includes("https") ?
                                record.imageURLs.find(i => i.isMainImage).url :
                                `${PATH.IMAGEBASEURL}${record.imageURLs.find(i => i.isMainImage).url}`
                        } />}
                        style={{
                            width: "200px",

                        }}
                    >
                        <Meta title={record.productName} description={(
                            <>
                                <b>{numberFormater(record.price)}</b>
                                <span style={{
                                    display: "-webkit-box",
                                    textOverflow: "ellipsis",
                                    wordWrap: "break-word",
                                    overflow: "hidden",
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: "vertical"

                                }}>
                                    {record.description}
                                </span>
                            </>

                        )} />
                    </Card>
                )} title={""} arrow={false} placement="left">

                    <Button
                        type="text"
                        icon={<EyeOutlined />}

                    />
                </Popover>

                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleClickUpdate(record)}
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

    const numberFormater = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    useEffect(() => {
        getAllProducts();
        getAllCategories();
    }, []);

    useEffect(() => {
        if (product.categoryId && product.price && product.productName) {
            setDisableCreateButton(false);
        }

        if (currentProduct.categoryId && currentProduct.price && currentProduct.productName) {
            setDisableUpdateButton(false);
        }
    }, [product, currentProduct]);

    const getAllProducts = async (search, page, pageSize) => {
        const res = await ProductServices.getAllProducts(search, page, pageSize);
        if (res.status === 200) {
            if (res.data.isSuccess) {
                setProducts(res.data.result.results);
                const pagination = {
                    page: res.data.result.currentPage,
                    pageSize: res.data.result.pageSize,
                    total: res.data.result.totalRecords
                };
                setPagination(pagination);
            }
        }
    }

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            if (res.data.isSuccess) {
                setCategories(res.data.results);
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
                    if (res.data.isSuccess) {
                        await getAllProducts();
                        message.success("Created!!!");
                        setCreateOpen(false);
                        setDisableCreateButton(true);
                        setProduct(defaultProduct);
                        setFileList([]);
                        setFormValidations(defaultValidations);
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

    const handleUpdateProduct = async () => {
        setIsUpdating(true);
        let uploadedImages = updateFileList.filter(file => file.uploadedImage);
        uploadedImages = uploadedImages.map(ui => ui.uploadedImage);
        if(uploadedImages[0]) {
            uploadedImages[0].isMainImage = true;
        }
        let notYetUploadedImages = updateFileList.filter(file => !file.uploadedImage);
        if (notYetUploadedImages && notYetUploadedImages.length) {
            notYetUploadedImages = notYetUploadedImages.map(ni => ni.originFileObj);

            const formData = new FormData();
            notYetUploadedImages.forEach((file) => {
                formData.append('files', file);
            });
            message.info("Uploading Images...");
            const newUploadedImages = await ProductServices.uploadFiles(formData);
            if (newUploadedImages.status === 200) {
                if (newUploadedImages.data.results && newUploadedImages.data.results.length) {
                    const justUploadedImages = newUploadedImages.data.results;
                    if(uploadedImages.length) {
                        justUploadedImages.forEach(ji => ji.isMainImage = false);
                    }
                    uploadedImages = uploadedImages.concat(justUploadedImages);
                    uploadedImages.forEach(ui => ui.productId = currentProduct.id);
                    message.success(`Uploaded ${newUploadedImages.data.results.length} Images`);
                }
            } else {
                message.error(`Cannot upload ${updateFileList.length} Images`);
                return;
            }
        }
        currentProduct.imageURLs = uploadedImages;

        message.info("Updating product...");
        const res = await ProductServices.updateProduct(currentProduct);
        if (res.status === 200) {
            if (res.data.isSuccess) {
                await getAllProducts();
                message.success("Updated!!!");
                setUpdateOpen(false);
                setDisableUpdateButton(true);
                setCurrentProduct(defaultProduct);
                setUpdateFileList([]);
                setFormValidations(defaultValidations);
            } else {
                message.error(res.data.message);
            }

        } else {
            message.error("Cannot update product with unknown errors!!!");
        }
        setIsUpdating(false);

    }

    const handleClickUpdate = (record) => {
        setCurrentProduct(record);
        updateForm.setFieldsValue(record);
        const images = record.imageURLs.map((img, index) => {
            return {
                uid: `${index + 1}`,
                name: img.id,
                status: 'done',
                url: `${PATH.IMAGEBASEURL}${img.url}`,
                uploadedImage: {
                    id: img.id,
                    url: img.url,
                    isMainImage: img.isMainImage,
                    productId: img.productId
                }
            }
        });
        setUpdateFileList(images);
        setUpdateOpen(true);
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
    const handleUpdateImagesChange = ({ fileList: newFileList }) => setUpdateFileList(newFileList);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleInputCreateChange = (event, name) => {
        let value = event.target.value;
        value = value.trim();
        if (fieldValidate(name, value)) {
            setProduct({ ...product, [name]: value });
        } else {
            setDisableCreateButton(true);
        }
    }

    const handleInputUpdateChange = (event, name) => {
        let value = event.target.value;
        value = value.trim();
        if (fieldValidate(name, value)) {
            setCurrentProduct({ ...currentProduct, [name]: value });
        } else {
            setDisableUpdateButton(true);
        }
    }

    const fieldValidate = (name, value) => {
        let invalid = false;
        const fieldRules = validationRules[name];
        if (!fieldRules) return true;
        for (let index = 0; index < fieldRules.length; index++) {
            const rule = fieldRules[index];
            const valid = rule.rule.test(value);
            if (!valid) {
                invalid = true;
                setFormValidations({
                    ...formValidations, [name]: {
                        errorType: "error",
                        help: rule.message
                    }
                });
                return;
            } else {
                setFormValidations({
                    ...formValidations, [name]: {
                        errorType: "success",
                        help: ""
                    }
                });
            }
        }
        return !invalid;
    }

    return (
        <MainLayout>
            <Button type="primary" icon={<FileAddOutlined />} style={{ marginBottom: "20px" }} onClick={() => setCreateOpen(true)}>
                Create a new product
            </Button>
            <Table
                className="list-products"
                columns={columns}
                dataSource={products}
                pagination={{
                    pageSizeOptions: ["12", "24", "48"],
                    pageSize: pagination?.pageSize,
                    current: pagination?.page,
                    total: pagination?.total,
                    showSizeChanger: true,
                    onChange: async (page, pageSize) => {
                        await getAllProducts("", page, pageSize);
                    },
                    onShowSizeChange: async (current, pageSize) => {
                        await getAllProducts("", current, pageSize);
                    }
                }}
                scroll={{
                    y: 800,
                }}
                rowKey={rowData => rowData.id}
            />

            <Modal
                title="Create a new product"
                centered
                okText="Create"
                open={createOpen}
                onOk={async () => {
                    await handleCreateNew();
                    createForm.resetFields();
                }}
                onCancel={() => {
                    setCreateOpen(false);
                    createForm.resetFields();
                    setDisableCreateButton(true);
                    setFormValidations(defaultValidations);
                }}
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
                            itemRender={(node, file, fileList) => {
                                return file === fileList[0]
                                    ? <div className="is-main-image">
                                        <CheckOutlined />
                                        {node}
                                    </div>
                                    : node;
                            }}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handleImagePreview}
                            onChange={handleImagesChange}
                            onDownload={(file) => {
                                console.log(file)
                            }}
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
                        <Input placeholder="Product name is required! don't forget to type it!" onChange={(event) => handleInputCreateChange(event, "productName")} />
                    </Form.Item>
                    <Form.Item
                        name={['price']}
                        label="Price"
                        rules={[{ type: 'number', min: 0, max: 9999999999 }]}
                        hasFeedback
                        validateStatus={formValidations.price.errorType}
                        help={formValidations.price.help}
                    >
                        <Input style={{ width: "100%" }} placeholder="Price must be a number and must be in range from 0 -> 9999999999" onChange={(event) => handleInputCreateChange(event, "price")} />
                    </Form.Item>
                    <Form.Item
                        name={['categoryId']}
                        label="Category"
                        hasFeedback
                        validateStatus={formValidations.category.errorType}
                        help={formValidations.category.help}
                    >
                        <Select
                            placeholder="You need to choose a category for your product!"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.children.toLowerCase() ?? '').includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                            }
                            onChange={(value) => {
                                if (fieldValidate("categoryId", value)) {
                                    setProduct({ ...product, categoryId: value })
                                }
                            }}>
                            {categories.map(cate => (
                                <Option key={cate.id} value={cate.id}>{cate.categoryName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={['description']}
                        label="Description"
                        hasFeedback
                        validateStatus={formValidations.description.errorType}
                        help={formValidations.description.help}
                    >
                        <Input.TextArea placeholder="Description must not contain special characters" onChange={(event) => handleInputCreateChange(event, "description")} rows={8} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Create a new product"
                centered
                open={updateOpen}
                onOk={() => {
                    handleUpdateProduct();
                }}
                onCancel={() => {
                    setUpdateOpen(false);
                    setFormValidations(defaultValidations);
                    setCurrentProduct(defaultProduct);
                }}
                width={800}
                okText="Update"
                okButtonProps={{ disabled: updateButton, danger: true }}
                estroyOnClose={true}
                confirmLoading={isUpdating}
            >
                <Row gutter={8}>
                    <Col className="gutter-row" span={3} style={{ textAlign: "right" }}>
                        Images:
                    </Col>
                    <Col className="gutter-row" span={21}>
                        <Upload
                            listType="picture-card"
                            fileList={updateFileList}
                            itemRender={(node, file, fileList) => {
                                const mainImage = fileList.find(fl => fl.uploadedImage && fl.uploadedImage.isMainImage === true);
                                if (mainImage) {
                                    if(file === mainImage) {
                                        return <div className="is-main-image">
                                        <CheckOutlined />
                                        {node}
                                        </div>
                                    } else {
                                        return node;
                                    }
                                    
                                } else if (file === fileList[0]) {
                                    return <div className="is-main-image">
                                        <CheckOutlined />
                                        {node}
                                    </div>
                                } else {
                                    return node;
                                }
                            }}
                            onPreview={handleImagePreview}
                            onChange={handleUpdateImagesChange}
                            multiple
                            maxCount={5}
                            beforeUpload={(file) => {
                                setUpdateFileList(fileList => [...fileList, file]);
                                return false;
                            }
                            }
                            onRemove={(file) => {
                                const index = updateFileList.indexOf(file);
                                const newFileList = updateFileList.slice();
                                newFileList.splice(index, 1);
                                setUpdateFileList(newFileList);
                            }
                            }
                        >
                            {updateFileList.length >= 5 ? null :
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
                    labelCol={{
                        span: 3,
                    }}
                    wrapperCol={{
                        span: 21,
                    }}
                    form={updateForm}
                    layout="horizontal"

                >
                    <Form.Item
                        label="Product name"
                        name={['productName']}
                        hasFeedback
                        validateStatus={formValidations.productName.errorType}
                        help={formValidations.productName.help}
                    >
                        <Input onChange={(event) => handleInputUpdateChange(event, "productName")} />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name={['categoryId']}
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
                            onChange={(value) => {
                                if (fieldValidate("categoryId", value)) {
                                    setCurrentProduct({ ...currentProduct, categoryId: value })
                                }
                            }}
                        >
                            {categories.map(cate => (
                                <Option key={cate.id} value={cate.id}>{cate.categoryName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name={['price']}
                        hasFeedback
                        validateStatus={formValidations.price.errorType}
                        help={formValidations.price.help}
                    >
                        <Input onChange={(event) => handleInputUpdateChange(event, "price")} />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name={['description']}
                        hasFeedback
                        validateStatus={formValidations.description.errorType}
                        help={formValidations.description.help}
                    >
                        <Input.TextArea rows={8} onChange={(event) => handleInputUpdateChange(event, "description")} />
                    </Form.Item>
                </Form>
            </Modal>
        </MainLayout>
    );
}

export default ListProducts;