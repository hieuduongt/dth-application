import { React, useEffect, useState } from 'react';
import UserLayout from '../../../layouts/UserLayout';
import { Col, Row, Pagination, Card } from 'antd';
import { useLocation } from 'react-router-dom';
import ProductServices from '../../../apis/productServices';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import PATH from '../../../commons/path';
import './home.css'
import CategoryServices from '../../../apis/categoryServices';
const { Meta } = Card;

const Home = () => {
    const location = useLocation();
    const [products, setProducts] = useState();

    const getAllProducts = async (search, page, pageSize) => {
        const categories = await CategoryServices.getAllCategories();
        const pathName = location.pathname.replace("/", "");
        let categoryId = "";
        if (categories.status === 200) {
            categoryId = categories.data.results.find(c => c.url === pathName)?.id;
        }
        if (categoryId) {
            const res = await ProductServices.getAllProductsByCategory(categoryId, search, page, pageSize);
            if (res.status === 200) {
                setProducts(res.data.result);
            }
        } else {
            const res = await ProductServices.getAllProducts(search, page, pageSize);
            if (res.status === 200) {
                setProducts(res.data.result);
            }
        }
    }

    useEffect(() => {
        getAllProducts();
    }, [location.pathname]);

    const numberFormater = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    const onChange = async (pageNumber, pageSize) => {
        await getAllProducts("", pageNumber, pageSize);
    };

    return (
        <UserLayout>
            <div style={{ width: "100%", height: "100%", padding:"16px"}}>
                <Row wrap gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    {products?.results.map(product => (
                        <Col
                            key={product.id}
                            className="gutter-row"
                            xs={{
                                span: 24,
                                offset: 0,
                            }}
                            sm={{
                                span: 12,
                                offset: 0
                            }}
                            md={{
                                span: 8,
                                offset: 0
                            }}
                            lg={{
                                span: 8,
                                offset: 0
                            }}
                            xl={{
                                span: 6,
                                offset: 0
                            }}
                            xxl={{
                                span: 4,
                                offset: 0
                            }}>
                            <Card
                                cover={
                                    <div className='image-component'>
                                        <img
                                            alt={product.productName}
                                            src={product.imageURLs && product.imageURLs.length ? product.imageURLs.find(i => i.isMainImage).url.includes("http") ?
                                                product.imageURLs.find(i => i.isMainImage).url :
                                                `${PATH.IMAGEBASEURL}${product.imageURLs.find(i => i.isMainImage).url}`
                                                : ""}
                                        />
                                    </div>
                                }
                                bordered={false}
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                                style={{
                                    height: "575px"
                                }}
                            >
                                <Meta
                                    // avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                                    title={product.productName}
                                    description={(
                                        <>
                                            <p>{numberFormater(product.price)}</p>
                                            <span className='product-description-conponent'>{product.description}</span>
                                        </>
                                    )}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <br />
                <div style={{
                    textAlign: "right"
                }}>
                    <Pagination showQuickJumper current={products?.currentPage} total={products?.totalRecords} onChange={onChange} pageSize={products? products.pageSize : 24} pageSizeOptions={["6", "12", "24", "48", "96"]} defaultPageSize={"24"}/>
                </div>
                
            </div>
        </UserLayout>
    );
}

export default Home;