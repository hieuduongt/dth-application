import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useEffect, useState } from 'react';
import CategoryServices from '../apis/categoryServices';
import PATH from '../commons/path';
const { Header, Content, Footer } = Layout;


const UserLayout = (props) => {
    const { children } = props;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [categories, setCategories] = useState([]);

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            setCategories(res.data.results);
        }
    }

    useEffect(() => {
        getAllCategories()
    }, []);

    const navItems = categories.map(cate => {
        return {
            key: cate.id,
            label: cate.categoryName,
            pathName: `/${cate.url}`
        }
    });

    console.log(navItems)


    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['productList']}
                    items={navItems}
                />
            </Header>
            <Content
                style={{
                    padding: '0 50px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Product list</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                DTH Application ©2023 Created by DTH
            </Footer>
        </Layout>
    );
};
export default UserLayout;