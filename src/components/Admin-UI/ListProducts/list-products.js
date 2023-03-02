import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/AdminLayout";
import { Avatar, Table, Modal, Button, Form, Input, InputNumber, Upload, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, FileAddOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProductServices from '../../../apis/productServices';
import CategoryServices from '../../../apis/categoryServices';
const { confirm } = Modal;
const { Option } = Select;
const { Dragger } = Upload;

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
    const [imageChoosing, setImageChoosing] = useState("upload");

    const [imageURLs, setImageURLs] = useState([]);
    const [open, setOpen] = useState(false);

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
                setProduct({...product, categoryId: res.data.results[0].id});
            }
        }
    }

    const handleCreateNew = async () => {
        
        console.log(product);
        const res = await ProductServices.createProduct(product);
        if (res.status === 200) {
            await getAllProducts()
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
                // onClick={() => enterLoading(2)}
                />
            </>),
            width: 150,
        },
    ];

    const validateMessages = {
        required: '${label} is required!',
        types: {
            name: '${label} is not a valid email!',
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
        getAllProducts();
        getAllCategories();
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
                const fileResponse = fileList.map(file => file.response?.result);
                setProduct({ ...product, imageURLs: fileResponse});
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            } else if (status === 'removed') {
                const { fileList } = info;
                const fileResponse = fileList.map(file => file.response?.result);
                setProduct({ ...product, imageURLs: fileResponse});
            }
        },
        onDrop(e) {
            message.info('Dropped files');
        },
        accept: "image/png, image/jpeg, image/jpg, image/webp"
    };

    const handleInputChange = (event, name) => {
        if (event || event.target.value) {
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

    const handleImageURLsInputChange = (event, key) => {
        if (event.target.value) {
            const image = {
                isMainImage: key === 0 ? true : false,
                url: event.target.value,
            }
            if (imageURLs[key]) {
                let images = [...imageURLs]
                images[key] = image;
                setImageURLs(images);
                setProduct({ ...product, imageURLs: images});
            } else {
                setImageURLs(imageURLs => [...imageURLs, image]);
                setProduct({ ...product, imageURLs: imageURLs});
            }

            if (product.productName && product.price) {
                setDisableCreateButton(false);
            }
        }
    }

    const handleRemoveImageURLsInput = (key) => {
        let images = [...imageURLs];
        images.splice(key, 1);
        setImageURLs(images);
        setProduct({ ...product, imageURLs: images});
        if (product.categoryId && product.productName && product.price) {
            setDisableCreateButton(false);
        }
    }

    console.log(product);

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
                onOk={() => handleCreateNew()}
                onCancel={() => setOpen(false)}
                width={1000}
                okButtonProps={{ disabled: createButton }}
            >
                <Form
                    {...layout}
                    name="nest-messages"
                    // onFinish={onFinish}
                    onError={() => setDisableCreateButton(true)}
                    style={{ maxWidth: 1000 }}
                    validateMessages={validateMessages}
                >
                    <Form.Item name={['productName']} label="Name" rules={[{ required: true }]}>
                        <Input onChange={(event) => handleInputChange(event, "productName")} />
                    </Form.Item>
                    <Form.Item name={['selectImageURLType']} label="Select Image Data Type">
                        <Select defaultValue="upload" onChange={(value) => setImageChoosing(value)}>
                            <Option value="link">Image URLs</Option>
                            <Option value="upload">Upload</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name={['imageURL']} label="Image" >
                        {imageChoosing === "link" ?
                            <Form.List name="names" key={"list-image-urls"}>
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
                                                            whitespace: false,
                                                            message: "Please input image URL or delete this field.",
                                                        },
                                                        {
                                                            required: true,
                                                            pattern: /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/igm,
                                                            message: "Please input valid image URL or delete this field.",
                                                        }
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder="image url"
                                                        style={{
                                                            width: '95%',
                                                            marginRight: 10
                                                        }}
                                                        onChange={(event) => handleImageURLsInputChange(event, field.name)}
                                                    />
                                                </Form.Item>

                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => { handleRemoveImageURLsInput(field.name); remove(field.name)}}
                                                />
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
                        <InputNumber style={{ width: "100%" }} onChange={(event) => handleInputChange(event, "price")} />
                    </Form.Item>
                    <Form.Item name={['categoryId']} label="Category">
                        <Select defaultValue={categories[0]?.id} onChange={(value) => {setProduct({...product, categoryId: value})}}>
                            {categories.map(cate => (
                                <Option value={cate.id}>{cate.categoryName}</Option>
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