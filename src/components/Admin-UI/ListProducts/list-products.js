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
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/css';

const { confirm } = Modal;
const { Option } = Select;
const { Meta } = Card;

const defaultValidations = {
    productName: {
        errorType: "",
        help: ""
    },
    price: {
        errorType: "",
        help: ""
    },
    quantity: {
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
    quantity: [
        {
            rule: /.+/i,
            message: "Quantity is required"
        },
        {
            rule: /^[0-9]+$/i,
            message: "Quantity must be a number"
        },
        {
            rule: /^\d{0,4}$/i,
            message: "Quantity must be in range from 0 -> 9999"
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

const DraggableUploadListItem = ({ originNode, file }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: file.uid,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'move',
        with: "100%",
        height: "100%"
    };

    // prevent preview event when drag end
    const className = isDragging
        ? css`
          a {
            pointer-events: none;
          }
        `
        : '';
    return (
        <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
            {/* hide error tooltip when dragging */}
            {file.status === 'error' && isDragging ? originNode.props.children : originNode}
        </div>
    );
};

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [okButton, setDisableOkButton] = useState(true);

    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    const [loadings, setLoadings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(true);

    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [formValidations, setFormValidations] = useState(defaultValidations);
    const [pagination, setPagination] = useState();

    const columns = [
        {
            render: (text, record, index) => (<Avatar src={
                record.imageURLs && record.imageURLs.length ? record.imageURLs.find(i => i.isMainImage).url.includes("http") ?
                    record.imageURLs.find(i => i.isMainImage).url :
                    `${PATH.IMAGEBASEURL}${record.imageURLs.find(i => i.isMainImage).url}`
                    : ""
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
                            record.imageURLs && record.imageURLs.length ? record.imageURLs.find(i => i.isMainImage).url.includes("http") ?
                                record.imageURLs.find(i => i.isMainImage).url :
                                `${PATH.IMAGEBASEURL}${record.imageURLs.find(i => i.isMainImage).url}`
                                : ""
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

    const sensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const onImageDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const numberFormater = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    useEffect(() => {
        getAllProducts();
        getAllCategories();
    }, []);

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

    const handleCreateProduct = async () => {
        setIsLoading(true);
        const currentProduct = form.getFieldsValue();
        Object.keys(currentProduct).forEach(k => {
            try {
                currentProduct[k] = currentProduct[k].trim()
            }
            catch (ignored) { }
        });
        if (fileList.length) {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('files', file.originFileObj);
            });

            message.info("Uploading Images...");
            const uploadedImages = await ProductServices.uploadFiles(formData);
            if (uploadedImages.status === 200) {
                if (uploadedImages.data.results && uploadedImages.data.results.length) {
                    currentProduct.imageURLs = uploadedImages.data.results;
                    message.success(`Uploaded ${uploadedImages.data.results.length} Images`);
                } else {
                    message.error(uploadedImages.data.message);
                }
            } else {
                message.error(`Cannot upload ${fileList.length} Images`);
            }
        }
        const res = await ProductServices.createProduct(currentProduct);
        if (res.status === 200) {
            if (res.data.isSuccess) {
                await getAllProducts();
                message.success("Created!!!");
                setOpenModal(false);
                setDisableOkButton(true);
                setFileList([]);
                setFormValidations(defaultValidations);
                form.resetFields();
            } else {
                message.error(res.data.message);
            }
        } else {
            message.error("Cannot create product with unknown errors!!!");
        }
        setIsLoading(false);
    }

    const handleUpdateProduct = async () => {
        setIsLoading(true);
        const currentProduct = form.getFieldsValue();
        Object.keys(currentProduct).forEach(k => {
            try {
                currentProduct[k] = currentProduct[k].trim()
            }
            catch (ignored) { }
        });
        const newImageURLs = [];
        for (let index = 0; index < fileList.length; index++) {
            const image = fileList[index];
            if (image.uploadedImage) {
                newImageURLs.push(image.uploadedImage);
            } else {
                const formData = new FormData();
                formData.append('file', image.originFileObj);
                message.info(`Uploading Image: ${image.originFileObj.name}`);
                const res = await ProductServices.uploadFile(formData);
                if (res.status === 200) {
                    message.success(`Uploaded Image: ${image.originFileObj.name}`);
                    newImageURLs.push(res.data.result);
                } else {
                    message.error(`Cannot upload ${image.originFileObj.name} Images`);
                }
            }
        }

        newImageURLs.forEach(ni => ni.isMainImage = false);
        newImageURLs[0].isMainImage = true;
        currentProduct.imageURLs = newImageURLs;

        message.info("Updating product...");
        const res = await ProductServices.updateProduct(currentProduct);
        if (res.status === 200) {
            if (res.data.isSuccess) {
                await getAllProducts();
                message.success("Updated!!!");
                setOpenModal(false);
                setDisableOkButton(true);
                setFileList([]);
                setFormValidations(defaultValidations);
                form.resetFields();
            } else {
                message.error(res.data.message);
            }

        } else {
            message.error("Cannot update product with unknown errors!!!");
        }
        setIsLoading(false);

    }

    const handleClickUpdate = (record) => {
        setIsCreating(false);
        setDisableOkButton(false);
        record.imageURLs.sort((a, b) => {
            if (a.isMainImage < b.isMainImage) {
                return 1;
            }
            if (a.isMainImage > b.isMainImage) {
                return -1;
            }
            return 0;
        })
        form.setFieldsValue(record);
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
        setFileList(images);
        setOpenModal(true);
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

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleInputChange = (value, name) => {
        value = value.trim();
        if (fieldValidate(name, value)) {
            const currentData = form.getFieldsValue();
            if (currentData.productName && currentData.price && currentData.quantity && currentData.categoryId) {
                setDisableOkButton(false);
            }
        } else {
            setDisableOkButton(true);
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
            <Button
                type="primary"
                icon={<FileAddOutlined />}
                style={{ marginBottom: "20px" }}
                onClick={() => {
                    setIsCreating(true);
                    setOpenModal(true)
                }}
            >
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
                title={isCreating ? "Create a new product" : "Update chosen product"}
                centered
                okText={isCreating ? "Create" : "Update"}
                open={openModal}
                onOk={() => {
                    isCreating ?
                        handleCreateProduct() :
                        handleUpdateProduct();
                }}
                onCancel={() => {
                    setOpenModal(false);
                    form.resetFields();
                    setDisableOkButton(true);
                    setFormValidations(defaultValidations);
                    setFileList([]);
                }}
                width={800}
                okButtonProps={{ disabled: okButton }}
                estroyOnClose={true}
                confirmLoading={isLoading}
            >
                <Row gutter={8}>
                    <Col className="gutter-row" span={3} style={{ textAlign: "right" }}>
                        Images:
                    </Col>
                    <Col className="gutter-row" span={21}>
                        <DndContext sensors={[sensor]} onDragEnd={onImageDragEnd}>
                            <SortableContext items={fileList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
                                <Upload
                                    itemRender={(node, file, fileList) => {
                                        return file === fileList[0]
                                            ? <div className="is-main-image">
                                                <CheckOutlined />
                                                <DraggableUploadListItem originNode={node} file={file} />
                                            </div>
                                            : <DraggableUploadListItem originNode={node} file={file} />;
                                    }}
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
                            </SortableContext>
                        </DndContext>
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
                    form={form}
                    {...{
                        labelCol: { span: 3 }
                    }}
                    name="detail-product-modal"
                    onErrorCapture={(e) => setDisableOkButton(true)}
                    style={{ maxWidth: 1000 }}
                >
                    <Form.Item
                        name={['id']}
                        label="Id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['productName']}
                        label="Name"
                        required
                        hasFeedback
                        validateStatus={formValidations.productName.errorType}
                        help={formValidations.productName.help}
                    >
                        <Input placeholder="Product name is required! don't forget to type it!" onChange={(event) => handleInputChange(event.target.value, "productName")} />
                    </Form.Item>
                    <Form.Item
                        name={['price']}
                        label="Price"
                        required
                        hasFeedback
                        validateStatus={formValidations.price.errorType}
                        help={formValidations.price.help}
                    >
                        <Input style={{ width: "100%" }} placeholder="Price must be a number and must be in range from 0 -> 9999999999" onChange={(event) => handleInputChange(event.target.value, "price")} />
                    </Form.Item>
                    <Form.Item
                        name={['quantity']}
                        label="Quantity"
                        hasFeedback
                        required
                        validateStatus={formValidations.quantity.errorType}
                        help={formValidations.quantity.help}
                    >
                        <Input style={{ width: "100%" }} placeholder="Quantity must be a number and must be in range from 0 -> 9999" onChange={(event) => handleInputChange(event.target.value, "quantity")} />
                    </Form.Item>
                    <Form.Item
                        name={['categoryId']}
                        label="Category"
                        hasFeedback
                        required
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
                            onChange={(value) => handleInputChange(value, "categoryId")}>
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
                        <Input.TextArea placeholder="Description must not contain special characters" onChange={(event) => handleInputChange(event.target.value, "description")} rows={8} />
                    </Form.Item>
                </Form>
            </Modal>
        </MainLayout>
    );
}

export default ListProducts;