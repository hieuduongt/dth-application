import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { FileOutlined, DesktopOutlined, ContainerFilled, ProfileFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CategoryServices from '../apis/categoryServices';
const { Header, Content, Footer } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const UserLayout = (props) => {
    const { children } = props;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");
    const location = useLocation();

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            setCategories(res.data.results.map(cate => getItem((<NavLink exact to={`/${cate.url}`}>{cate.categoryName}</NavLink>), cate.id, <DesktopOutlined />)));
            const pathName = location.pathname.replace("/", "");
            const currentCate = res.data.results.find(c => c.url == pathName);
            setCurrentCategory(currentCate?currentCate:"");
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [location.pathname]);


    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={currentCategory?.id}
                    items={categories}
                />
            </Header>
            <Content
                style={{
                    padding: '0 50px'
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>{currentCategory? currentCategory.categoryName: "All Products"}</Breadcrumb.Item>
                    {currentCategory ? <Breadcrumb.Item>All Products</Breadcrumb.Item> : <></>}
                </Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                        borderRadius: "10px"
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