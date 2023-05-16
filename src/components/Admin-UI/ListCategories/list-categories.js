import { React, useEffect, useState } from 'react';
import { Button, List, Space, Modal, Form, Input, message } from 'antd';
import MainLayout from '../../../layouts/AdminLayout';
import CategoryServices from '../../../apis/categoryServices';
import { NavLink } from 'react-router-dom';
import {
    FileAddOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
const { confirm } = Modal;


const ListCategory = () => {
    const [listCategories, setListCategories] = useState([]);
    const [loadings, setLoadings] = useState([]);
    const [category, setCategory] = useState();
    const [createOpen, setCreateOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [createValid, setCreateValid] = useState(false);
    const [updateValid, setUpdateValid] = useState(false);
    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            if (res.data.results.length) {
                setListCategories(res.data.results);
            }
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    const showDeleteConfirm = (index, id) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        confirm({
            title: <h4>Are you sure you want to delete this category?</h4>,
            icon: <ExclamationCircleFilled />,
            content: <span style={{ color: "red" }}>This action will delete this category and all the info related to this category contains all media components forever and you cannot recover it in the future!!!</span>,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDeleteCategory(id);
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

    const onCreateNewCategory = async () => {
        const res = await CategoryServices.createCategory(category);
        if(res.status === 200) {
            if(res.data.isSuccess) {
                message.success("Created new category!");
                setCreateOpen(false);
                createForm.resetFields();
                await getAllCategories();
            } else {
                message.error("Error when creating new category: " + res.data.message);
            }
        }
    }

    const onDeleteCategory = async (id) => {
        const res = await CategoryServices.deleteCategory(id);
        if(res.status === 200) {
            if(res.data.isSuccess) {
                message.success("Deleted category!");
                await getAllCategories();
            } else {
                message.error("Error when deleting category: " + res.data.message);
            }
        }
    }

    const onUpdateCategory = async () => {
        const res = await CategoryServices.updateCategory(updateForm.getFieldsValue());
        if(res.status === 200) {
            if(res.data.isSuccess) {
                message.success("Updated new category!");
                setUpdateOpen(false);
                updateForm.resetFields();
                await getAllCategories();
            } else {
                message.error("Error when updating category: " + res.data.message);
            }
        }
    }

    const handleInputCreateChange = (event) => {
        createForm
            .validateFields()
            .then((values) => {
                setCategory(createForm.getFieldsValue());
                setCreateValid(true);
            })
            .catch((info) => {
                setCreateValid(false);
            });
    }

    const handleInputUpdateChange = (event) => {
        updateForm
            .validateFields()
            .then((values) => {
                setUpdateValid(true);
            })
            .catch((info) => {
                setUpdateValid(false);
            });
    }

    return (
        <div>
            <Button type="primary" icon={<FileAddOutlined />} style={{ marginBottom: "20px" }} onClick={() => setCreateOpen(true)}>
                Create a new category
            </Button>
            <Space
                direction="vertical"
                style={{
                    marginBottom: '20px',
                }}
                size="middle"
            >
            </Space>
            <List
                pagination={{
                    align: "center",
                    position: "bottom"
                }}

                dataSource={listCategories}
                renderItem={(item, index) => (
                    <List.Item actions={[
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => {
                                updateForm.setFieldsValue(item);
                                setUpdateOpen(true);
                            }}
                        />,
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteConfirm(index, item.id)}
                            loading={loadings[index]}
                        />
                    ]}>
                        <List.Item.Meta
                            title={<NavLink to={`/admin/category/${item.id}`}>{item.categoryName}</NavLink>}
                            description={item.url}
                        />
                    </List.Item>
                )}
            />
            <Modal
                open={createOpen}
                title="Create a new category"
                okText="Create"
                okButtonProps={{ disabled: !createValid }}
                cancelText="Cancel"
                onCancel={() => {
                    setCreateOpen(false);
                    createForm.resetFields();
                }}
                onOk={() => onCreateNewCategory()}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Form.Item
                        name="categoryName"
                        label="Category Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category name!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputCreateChange} />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category url!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputCreateChange} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={createOpen}
                title="Create a new category"
                okText="Create"
                okButtonProps={{ disabled: !createValid }}
                cancelText="Cancel"
                onCancel={() => {
                    setCreateOpen(false);
                    createForm.resetFields();
                }}
                onOk={() => onCreateNewCategory()}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Form.Item
                        name="categoryName"
                        label="Category Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category name!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputCreateChange} />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category url!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputCreateChange} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={updateOpen}
                title="Update a category"
                okText="Update"
                okButtonProps={{ disabled: !updateValid }}
                cancelText="Cancel"
                onCancel={() => {
                    setUpdateOpen(false);
                    updateForm.resetFields();
                    setUpdateValid(false);
                }}
                onOk={() => onUpdateCategory()}
            >
                <Form
                    form={updateForm}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Form.Item name="id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Form.Item
                        name="categoryName"
                        label="Category Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category name!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputUpdateChange} />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category url!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputUpdateChange} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ListCategory;