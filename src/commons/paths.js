const PATHS = {
    ADMIN: {
        PATH: "/admin/*",
        DASHBOARD: "dashboard",
        LIST_PRODUCTS: "list-products",
        PRODUCT_DETAIL: "product/:id",
        LIST_CATEGORIES: "list-categories",
        CATEGORY_DETAIL: "category/:id",
    },
    USER: {
        PATH: "/",
        LIST_PRODUCTS: "category/:id",
        PRODUCT_DETAIL: "/product/:id",
        LIST_CATEGORIES: "/list-categories",
    },
    CART: "/buy/cart",
    BASEURL: "https://localhost:7023/api",
    IMAGEBASEURL: "https://localhost:7023",
    LOGIN: "/login",
    REGISTER: "/register"
};

export default PATHS;