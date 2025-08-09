// import React, { useEffect, useState } from "react";
// import { GET_ALL } from "../../api/apiService";

// import startsActive from "../../assets/images/icons/stars-active.svg";
// import startsDisable from "../../assets/images/icons/starts-disable.svg";
// import { Link } from "react-router-dom";

// const cardTextStyle = {
//   maxWidth: "80%",
// };

// const Section1 = (category) => {
//   const { categoryName, categoryId } = category;
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const params = {
//       pageNumber: 0,
//       pageSize: 5,
//       sortBy: "productId",
//       sortOrder: "asc",
//     };

//     GET_ALL(`categories/${categoryId}/products`, params)
//       .then((response) => {
//         console.log("response", response.content);
//         setProducts(response.content); // Set the products state
//       })
//       .catch((error) => {
//         console.error("Failed to fetch products:", error); // Handle errors
//       });
//   }, [categoryId]);

//   return (
//     <section className="padding-bottom">
//       <header className="section-heading mb-4">
//         <h3 className="title-section">{categoryName}</h3>
//       </header>
//       <div className="row">
//         {products.length > 0 &&
//           products.map((row) => (
//             <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={row.id}>
//               <div className="card card-product-grid">
//                 <Link to={`/Detail?productId=${row.id}`} className="img-wrap">
//                   <img
//                     src={`http://localhost:8080/api/public/products/image/${row.image}`}
//                     alt={row.productName}
//                   />
//                 </Link>
//                 <figcaption className="info-wrap">
//                   <ul className="rating-stars mb-1">
//                     <li style={cardTextStyle} className="stars-active">
//                       <img src={startsActive} alt="" />
//                     </li>
//                     <li>
//                       <img src={startsDisable} alt="" />
//                     </li>
//                   </ul>
//                   <Link to={`/Detail?productId=${row.id}`} className="title">
//                     {row.productName}
//                   </Link>
//                   <div className="price h5 mt-2">${row.price}</div>
//                 </figcaption>
//               </div>
//             </div>
//           ))}
//       </div>
//     </section>
//   );
// };

// export default Section1;
import React, { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import startsActive from "../../assets/images/icons/stars-active.svg";
import startsDisable from "../../assets/images/icons/starts-disable.svg";
import { Link } from "react-router-dom";

const cardTextStyle = {
  maxWidth: "80%",
};

const Section1 = ({ categoryName, categoryId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      console.error("Category ID is undefined");
      return;
    }

    console.log("Fetching products for categoryId:", categoryId); // Debugging line

    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "productId",
      sortOrder: "asc",
    };

    GET_ALL(`categories/${categoryId}/products`, params)
      .then((response) => {
        console.log("response", response.content);
        setProducts(response.content); // Set the products state
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error); // Handle errors
      });
  }, [categoryId]);

  return (
    <section className="padding-bottom">
    <header className="section-heading mb-4">
      <h3 className="title-section">{categoryName}</h3>
    </header>
    <div className="row">
      {products.length > 0 &&
        products.map((row) => {
          return (
            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4" key={row.id}>
              <div className="card card-product-grid h-100">
                <Link
                  to={`/Detail?productId=${row.productId}`}
                  className="img-wrap"
                >
                  <img
                    src={`http://localhost:8080/api/public/products/image/${row.image}`}
                    alt={row.productName}
                    className="img-fluid"
                  />
                </Link>
                <figcaption className="info-wrap p-3">
                  <ul className="rating-stars mb-1 list-inline">
                    <li className="stars-active list-inline-item">
                      <img src={startsActive} alt="active stars" />
                    </li>
                    <li className="list-inline-item">
                      <img src={startsDisable} alt="disabled stars" />
                    </li>
                  </ul>
                  <Link to={`/Detail?productId=${row.id}`} className="title d-block text-truncate">
                    {row.productName}
                  </Link>
                  <div className="d-flex align-items-center">
  <div className="price h5 text-muted mr-3">
    <del>{row.price} VND</del>
  </div>
  <div className="price h5 text-primary">
    {row.specialPrice} VND
  </div>
</div>

                </figcaption>
              </div>
            </div>
          );
        })}
    </div>
  </section>
  
  );
};

export default Section1;
