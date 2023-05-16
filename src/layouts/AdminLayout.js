import { FileOutlined, DesktopOutlined, ContainerFilled, ProfileFilled } from '@ant-design/icons';
import { NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Avatar, Layout, Menu, theme, Popover, Button } from 'antd';
import { useEffect, useState } from 'react';
import PATH from '../commons/paths';
import { Routes, Route } from 'react-router-dom';
import PATHS from '../commons/paths';
import AdminCategoryListPage from '../components/Admin-UI/ListCategories/list-categories';
import AdminCategoryDetailPage from '../components/Admin-UI/Category/category';
import AdminProductListPage from '../components/Admin-UI/ListProducts/list-products';
import AdminHomePage from '../components/Admin-UI/Home/home';
import ProtectedRoute from '../routes/protectedRoute';
import { getTokenProperties, removeToken } from '../helpers/useToken';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem((<NavLink to={PATH.ADMIN.DASHBOARD}> Dashboard</NavLink>), 'home', <DesktopOutlined />),
    getItem("Category", 'catesub', <ContainerFilled />, [
        getItem((<NavLink to={PATH.ADMIN.LIST_CATEGORIES}> List</NavLink>), 'list-categories'),
    ]),
    getItem('Product', 'productSub', <ProfileFilled />, [
        getItem((<NavLink to={PATH.ADMIN.LIST_PRODUCTS}> List</NavLink>), 'list-products'),
    ]),
    getItem('Files', '9', <FileOutlined />),
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [openSubMenu, setOpenSubMenu] = useState([]);
    const userProperties = getTokenProperties();

    useEffect(() => {
        console.log(userProperties);
    }, []);

    const Logout = () => {
        removeToken("authToken");
        navigate(`/login?redirectUri=${location.pathname}`);
    }

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider width={250}
                collapsible
                theme={"dark"}
                collapsed={collapsed}
                defaultCollapsed={true}
                onCollapse={(value) => setCollapsed(value)}
                breakpoint="sm">
                <div
                    style={{
                        height: 64,
                        background: 'rgba(0, 0, 0, 0.4)',
                        fontWeight: "bolder",
                        fontSize: "1.1rem",
                        textAlign: 'center',
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 15
                    }}
                >
                    DTH Application
                </div>
                <Menu onOpenChange={(keys) => setOpenSubMenu(keys)}
                    theme={"dark"}
                    openKeys={openSubMenu}
                    mode="inline"
                    items={items}
                    datatype={NavLink} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        textAlign: "right",
                        paddingRight: 20,
                        background: colorBgContainer,
                    }}
                >
                    <Popover placement="bottomRight" title={userProperties.givenname} content={
                        <div>
                            <div>
                                <a href=''>
                                    Your profile
                                </a>
                            </div>
                            <Button onClick={Logout}>Log out</Button>
                        </div>
                    } trigger="click" arrow={false}>
                        <Avatar src="/title-icon.PNG" alt={userProperties.givenname} style={{ border: "1px solid rgb(43 149 255)", cursor: "pointer" }} />
                    </Popover>

                </Header>
                <Content
                    style={{
                        margin: '16px 16px',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: 5
                        }}
                    >
                        <Routes>
                            <Route path="" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
                            <Route path={PATHS.ADMIN.DASHBOARD} element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
                            <Route path={"list-products"} element={<ProtectedRoute><AdminProductListPage /></ProtectedRoute>} />
                            <Route path={PATHS.ADMIN.LIST_CATEGORIES} element={<ProtectedRoute><AdminCategoryListPage /></ProtectedRoute>} />
                            <Route path={PATHS.ADMIN.CATEGORY_DETAIL} element={<ProtectedRoute><AdminCategoryDetailPage /></ProtectedRoute>} />
                        </Routes >
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    DTH Apllication ©2023 Created by Hieu Duong 2k3
                </Footer>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;