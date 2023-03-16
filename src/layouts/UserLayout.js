import { Breadcrumb, Layout, Menu, theme, Button, Badge, Popover, Spin, Avatar, List } from 'antd';
import { ShoppingCartOutlined, DesktopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CategoryServices from '../apis/categoryServices';
import './userLayout.css';
import ProductServices from '../apis/productServices';
import PATH from '../commons/path';
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
    const { inCartItems } = props;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [categories, setCategories] = useState([]);
    const [itemsInCart, setItemsInCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useState("");
    const location = useLocation();

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            setCategories(res.data.results.map(cate => getItem((<NavLink exact to={`/${cate.url}`}>{cate.categoryName}</NavLink>), cate.id, <DesktopOutlined />)));
            const pathName = location.pathname.replace("/", "");
            const currentCate = res.data.results.find(c => c.url == pathName);
            setCurrentCategory(currentCate ? currentCate : "");
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [location.pathname]);

    const getItemsInCart = async () => {
        setItemsInCart([]);
        setLoading(true);
        const ids = localStorage.getItem("inCartItems");
        if (ids) {
            try {
                const listIds = JSON.parse(ids);
                for (let index = 0; index < listIds.length; index++) {
                    const id = listIds[index];
                    const res = await ProductServices.getProduct(id);
                    if (res.status === 200) {
                        if (res.data.result) {
                            setItemsInCart(itemsInCart => [...itemsInCart, res.data.result]);
                        } else {
                            setItemsInCart(itemsInCart => [...itemsInCart, "not found"]);
                        }
                    }
                }
            } catch (ignored) { }
        }
        setLoading(false);
    }
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
                <div className="cart" >
                    <Popover
                        placement="bottomRight"
                        title={"Cart"}
                        content={
                            <div style={{ height: "100%" }}>
                                <p>
                                    {
                                        !loading
                                            ? <List
                                                style={{ width: "400px" }}
                                                itemLayout="horizontal"
                                                dataSource={itemsInCart}
                                                renderItem={(item, index) => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<Avatar src={item.imageURLs && item.imageURLs.length ? item.imageURLs.find(i => i.isMainImage).url.includes("http") ?
                                                                item.imageURLs.find(i => i.isMainImage).url :
                                                                `${PATH.IMAGEBASEURL}${item.imageURLs.find(i => i.isMainImage).url}`
                                                                : ""} />}
                                                        />
                                                        <a style={{
                                                            textAlign: "left",
                                                            display: "-webkit-box",
                                                            textOverflow: "ellipsis",
                                                            wordWrap: "break-word",
                                                            overflow: "hidden",
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: "vertical"
                                                        }}>
                                                            {item.productName}
                                                        </a>
                                                        <div>{item.price}</div>
                                                    </List.Item>
                                                )}
                                            />
                                            : <Spin tip="Loading" size="default">
                                                <div style={{
                                                    padding: "50px",
                                                    borderRadius: "5px"
                                                }} />
                                            </Spin>
                                    }
                                </p>
                                <Button type='link'>Go to cart</Button>
                            </div>
                        } trigger="hover" arrow={true}>
                        <Badge count={inCartItems}>
                            <Button onMouseEnter={() => getItemsInCart()} type="dashed" size={"large"} icon={<ShoppingCartOutlined />} />
                        </Badge>
                    </Popover>
                </div>

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
                    <Breadcrumb.Item>{currentCategory ? currentCategory.categoryName : "All Products"}</Breadcrumb.Item>
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