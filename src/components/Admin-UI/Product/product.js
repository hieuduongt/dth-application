import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductServices from "../../../apis/productServices";
import AdminLayout from '../../../layouts/AdminLayout';
import { Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const Product = () => {
    const [product, setProduct] = useState();
    const params = useParams();
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const getProduct = async () => {
        const res = await ProductServices.getProduct(params.id);
        if (res.status === 200) {
            setProduct(res.data.result);
        }
    }

    useEffect(() => {
        getProduct();
    }, []);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    return (
        <AdminLayout>
            <Upload
                beforeUpload={() => {return false}}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple
                maxCount={8}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </AdminLayout>
    );
}

export default Product;