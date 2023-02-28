import { React, useEffect, useState } from 'react';
import { Avatar, List, Space } from 'antd';
import MainLayout from '../../../layouts/AdminLayout';
import CategoryServices from '../../../apis/categoryServices';
import { NavLink } from 'react-router-dom';


const ListCategory = () => {
    const [listCategories, setListCategories]= useState([]);
    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if(res.status === 200) {
            if(res.data.results.length) {
                setListCategories(res.data.results);
            }
        }
    }
    useEffect(() => {
        getAllCategories();
    }, []);
    return (
        <MainLayout>
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
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<NavLink exact to={`/admin/category/${item.id}`}>{item.categoryName}</NavLink>}
                            description={item.url}
                        />
                    </List.Item>
                )}
            />
        </MainLayout>
    );
}

export default ListCategory;