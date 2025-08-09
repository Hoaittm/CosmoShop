import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GET_ALL } from "../../api/apiService";
import ProductCard from "../../components/products/productCard";
const Items = () =>{
	const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
   
    const currentPage = parseInt(queryParams.get("page")) || 1;

    const numItems = 3;
    const handleProductClick = (id) => {
		console.log("ProductID: ", id);
		navigate(`/product-detail/${id}`);
	  };
    useEffect(() => {
        setLoading(true);
        const params = {
            pageNumber: currentPage,
            pageSize: numItems,
            sortBy: "productId",
            sortOrder: "asc",
        };
        GET_ALL("catalog/products", params)
            .then((response) => {
                setProducts(response);
                console.log("products: ", response)
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch products:", error);
                setLoading(false);
            });

    },[currentPage]);

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="card mb-3">
                
                </div>

                <header className="mb-3">
                   
                    <h1>Sản phẩm gần đây</h1>
                </header>

				<div className="row">
          {!loading &&
            products.length > 0 && 
            products.slice(0,7).map((row) => (
              <div
                className="col-md-3 col-sm-6 mb-4"
                key={row.id}
                onClick={() => handleProductClick(row.id)}
                style={{ cursor: "pointer" }}
              >
                <figure className="card card-product-grid">
                  <div className="img-wrap position-relative">
        <div className="d-flex align-items-center justify-content-between position-relative">
  {/* Badge MỚI - góc trái */}
  <span className="badge bg-danger position-absolute top-0 start-0 m-2 px-2 py-1">
    MỚI
  </span>

  {/* Badge GIẢM GIÁ - góc phải */}
 {/* <span className="badge bg-success position-absolute top-0 end-1 m-2">
  {row.priceSale}%
</span> */}

</div>

                   
                    <img
                      src={require(`/public/images/products/${row.imageUrl}`)}
                      alt={row.imageUrl}
                      className="img-fluid"
					  
                    />
                  </div>
                  <figcaption className="info-wrap p-3">
                    <a href="#" className="title mb-2 d-block text-truncate">
                      {row.productName}
                    </a>
                    <div className="price-wrap d-flex align-items-center justify-content-between">
                       {row.priceSale == null ?
                            <div class="price-wrap">
                                <span class="price">{Number(row.price).toLocaleString()} VNĐ</span>
                                {/* <small class="text-muted">/sản phẩm</small> */}
                            </div>
                            : <div class="price-wrap d-flex  justify-content-center">
                                <small class="price"> <del>{Number(row.price).toLocaleString()} VNĐ</del></small> &nbsp; - &nbsp;<h6 class="price">  { (row.price * (1 - (row.priceSale / 100))).toLocaleString() }  VNĐ</h6>
                                {/* <small class="text-muted">/sản phẩm</small> */}
                            </div>
                        }
                      {/* <span className="price text-primary">{row.price.toLocaleString()} VND</span> */}
                    </div>
                    <hr />
                    
                   
                  </figcaption>
                </figure>
              </div>
            ))}
        </div>




               

            </div>
        </section>
    )
}

	 
		
export default Items