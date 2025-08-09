import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        return JSON.parse(localStorage.getItem("product")) || [];
    });

    useEffect(() => {
        localStorage.setItem("product", JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        const handleStorageChange = () => {
            setProducts(JSON.parse(localStorage.getItem("product")) || []);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
