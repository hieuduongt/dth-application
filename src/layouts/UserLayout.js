import { Layout, theme, Button, Badge, Popover, Avatar, List, Input, Select } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CategoryServices from '../apis/categoryServices';
import './userLayout.css';
import ProductServices from '../apis/productServices';
import PATH from '../commons/path';
const { Header, Content, Footer } = Layout;
const { Search } = Input;

const UserLayout = (props) => {
    const { children } = props;
    const { inCartItems } = props;
    const { onRemoveItemInCart } = props;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [categories, setCategories] = useState([]);
    const [itemsInCart, setItemsInCart] = useState([]);
    const location = useLocation();

    const getAllCategories = async () => {
        const res = await CategoryServices.getAllCategories();
        if (res.status === 200) {
            setCategories(res.data.results);
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [location.pathname]);

    const getItemsInCart = async () => {
        const ids = localStorage.getItem("inCartItems");
        try {
            const listIds = JSON.parse(ids);
            const newCartItems = [];
            const currentIds = itemsInCart.map(ic => ic.id);
            const newItem = listIds.filter(id => currentIds.indexOf(id) === -1);
            if (newItem.length || !itemsInCart.length) {
                for (let index = 0; index < listIds.length; index++) {
                    const id = listIds[index];
                    const res = await ProductServices.getProduct(id);
                    if (res.status === 200) {
                        if (res.data.result) {
                            newCartItems.push(res.data.result);
                        } else {
                            newCartItems.push({
                                id: id,
                                productName: "Not available",
                                price: 0
                            });
                        }
                    }
                }
                setItemsInCart(newCartItems);
            }
        } catch (ignored) { }
    }

    const numberFormater = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    const removeCartItem = (item) => {
        const ids = localStorage.getItem("inCartItems");
        if (ids) {
            try {
                let idArray = JSON.parse(ids);
                idArray = idArray.filter(id => id !== item.id);
                localStorage.setItem("inCartItems", JSON.stringify(idArray));
                setItemsInCart(itemsInCart => itemsInCart.filter(ic => ic.id !== item.id));
                onRemoveItemInCart();
            } catch (ignored) {

            }
        }
    }

    return (
        <Layout className="layout">
            <Header color='red' style={{
                height: 85
            }}>
                <div className="header">
                    <div className="logo" >
                        <a href='/'>
                            <img src="logo.png" alt="DTH Logo" />
                        </a>
                    </div>
                    <div className='search-bar'>
                        <Search
                            placeholder="input search text"
                            enterButton="Search"
                            size="large"
                            prefix={
                                <SearchOutlined />
                            }
                            addonBefore={
                                <Select size='large' key={"category-search"} defaultValue={"all"} style={{ background: "white", borderRadius: "7px", width: 200 }}>
                                    <Select.Option key={"all"} value="all">Search in DTH</Select.Option>
                                    {
                                        categories.map(cate => (
                                            <Select.Option key={cate.id} value={cate.id}>Search in {cate.categoryName}</Select.Option>
                                        ))
                                    }
                                </Select>
                            }

                        />
                    </div>
                    <div className="cart" >
                        <Badge count={inCartItems} size="small">
                            <Popover
                                placement="bottom"
                                title={"Cart"}
                                content={
                                    <div style={{ height: "100%" }}>
                                        <List
                                            style={{ width: "400px" }}
                                            itemLayout="horizontal"
                                            dataSource={itemsInCart}
                                            renderItem={(item, index) => (
                                                <List.Item>
                                                    <Avatar src={item.imageURLs && item.imageURLs.length ? item.imageURLs.find(i => i.isMainImage).url.includes("http") ?
                                                        item.imageURLs.find(i => i.isMainImage).url :
                                                        `${PATH.IMAGEBASEURL}${item.imageURLs.find(i => i.isMainImage).url}`
                                                        : ""} />
                                                    <a style={{
                                                        textAlign: "left",
                                                        display: "-webkit-box",
                                                        textOverflow: "ellipsis",
                                                        wordWrap: "break-word",
                                                        overflow: "hidden",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        width: "200px"
                                                    }}>
                                                        {item.productName}
                                                    </a>
                                                    <p>{numberFormater(item.price)}</p>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeCartItem(item)}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                        <Button type='link'><NavLink exact to={PATH.CART}>Go to cart</NavLink></Button>
                                    </div>
                                } trigger="click" arrow={true}>

                                <Button onMouseEnter={() => getItemsInCart()} type="dashed" size={"large"} icon={<ShoppingCartOutlined />} />

                            </Popover>
                        </Badge>
                    </div>
                    <div className='language'>
                        <Popover placement="bottom" title={"Choose your language"} content={
                            <div>
                                <p>English</p>
                                <p>Vietnamese</p>
                            </div>
                        } trigger="click">
                            <Button size='large' icon={<DownOutlined />}>Language</Button>
                        </Popover>
                    </div>
                    <div className="user" >
                        <Popover placement="bottomRight" title={"Hieu Duong"} content={
                            <div>
                                <p>
                                    Welcome to DTH Application
                                </p>

                                <Button>Log out</Button>
                            </div>
                        } trigger="click" arrow={true}>
                            <Avatar size={"large"} src="/title-icon.PNG" alt='Hieu Duong' style={{ border: "1px solid rgb(43 149 255)", cursor: "pointer", }} />
                        </Popover>
                    </div>
                </div>
            </Header>
            <Content
                style={{
                    padding: '50px 50px'
                }}
            >
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