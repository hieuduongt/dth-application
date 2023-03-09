import { FileOutlined, DesktopOutlined, ContainerFilled, ProfileFilled } from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, Layout, Menu, theme, Popover, Button } from 'antd';
import { useEffect, useState } from 'react';
import PATH from '../commons/path';
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
    getItem((<NavLink exact to={PATH.ADMIN.HOME}> Dashboard</NavLink>), 'home', <DesktopOutlined />),
    getItem("Category", 'catesub', <ContainerFilled />, [
        getItem((<NavLink exact to={PATH.ADMIN.LIST_CATEGORIES}> List</NavLink>), 'list-categories'),
    ]),
    getItem('Product', 'productSub', <ProfileFilled />, [
        getItem((<NavLink exact to={PATH.ADMIN.LIST_PRODUCTS}> List</NavLink>), 'list-products'),
    ]),
    getItem('Files', '9', <FileOutlined />),
];

const listItems = [
    {
        key: "home",
        pathName: PATH.ADMIN.HOME
    },
    {
        parent: "catesub",
        key: "list-categories",
        pathName: PATH.ADMIN.LIST_CATEGORIES
    },
    {
        parent: "productSub",
        key: "list-products",
        pathName: PATH.ADMIN.LIST_PRODUCTS
    }
]

const MainLayout = (props) => {
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [defaultTheme, setTheme] = useState("dark");
    const [currentItem, setCurrentItem] = useState("");
    const [openSubMenu, setOpenSubMenu] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const currentTime = new Date().getHours();
        if (currentTime <= 18 && currentTime >= 6) {
            setTheme("light");
        } else {
            setTheme("dark");
        }
        const pathName = location.pathname;
        const currentActivatedItem = listItems.find(i => i.pathName.includes(pathName));
        if (currentActivatedItem) {
            setCurrentItem(currentActivatedItem.key);
            setOpenSubMenu((openSubMenu) => ([...openSubMenu, currentActivatedItem.parent]));
        };
    }, [location.pathname]);

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible theme={defaultTheme} collapsed={collapsed} defaultCollapsed={true} onCollapse={(value) => setCollapsed(value)} breakpoint="sm">
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
                <Menu onOpenChange={(keys) => setOpenSubMenu(keys)} theme={defaultTheme} openKeys={openSubMenu} selectedKeys={[currentItem]} mode="inline" items={items} datatype={NavLink} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        textAlign: "right",
                        paddingRight: 20,
                        background: colorBgContainer,
                    }}
                >
                    <Popover placement="bottomRight" title={"Hieu Duong"} content={
                        <div>
                            <p>
                            Welcome to DTH Application
                            </p>
                            
                            <Button>Log out</Button>
                        </div>
                    } trigger="click" arrow={false}>
                        <Avatar src="/title-icon.PNG" alt='Hieu Duong' style={{ border: "1px solid rgb(43 149 255)", cursor: "pointer"}} />
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
                        {children}
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
export default MainLayout;