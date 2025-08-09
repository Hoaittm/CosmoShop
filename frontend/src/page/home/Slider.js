import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ALL } from "../../api/apiService";

const Slider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    GET_ALL(`catalog/products`)
      .then(response => {
        setLoading(false);
        setProducts(response);
      })
      .catch(error => {
        console.error("Failed to fetch products:", error);
      });
  }, []);

  const handleCategoryClick = category => {
    navigate(`/category?query=${category}`);
  };

  return (
    <section className="section-main padding-y">
      <main className="card">
        <div className="card-body">
          <div className="row align-items-stretch">

            {/* LEFT ASIDE */}
            <aside className="col-lg-2 col-md-3 d-none d-lg-block">
              <nav className="nav-home-aside">
                <h6 className="title-category">
                  DANH MỤC <i className="d-md-none icon fa fa-chevron-down"></i>
                </h6>
                <ul className="menu-category">
                  {!loading &&
                    [...new Set(products.map(item => item.category))].map((category, index) => (
                      <li key={index}>
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`${category}`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  {loading && <p>Loading...</p>}
                </ul>
              </nav>
            </aside>

            {/* CENTER SLIDE */}
      <div className="col-lg-8 col-md-9">
    <div id="carousel1_indicator" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000"> {/* THÊM THUỘC TÍNH NÀY */}
        <div className="carousel-indicators">
            <button type="button" data-bs-target="#carousel1_indicator" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#carousel1_indicator" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#carousel1_indicator" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
            <div className="carousel-item active">
                <img src={require("../../assets/images/banners/slide1.jpg")} className="d-block w-100" alt="First slide" />
            </div>
            <div className="carousel-item">
                <img src={require("../../assets/images/banners/slide2.jpg")} className="d-block w-100" alt="Second slide" />
            </div>
            <div className="carousel-item">
                <img src={require("../../assets/images/banners/slider3.jpg")} className="d-block w-100" alt="Third slide" />
            </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carousel1_indicator" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carousel1_indicator" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
    </div>
</div>

            {/* RIGHT ASIDE */}
            <div className="col-lg-2 d-none d-lg-block">
              <aside className="special-home-right">
                <div className="mb-2">
                  <img
                    src={require("../../assets/images/banners/slide4.jpg")}
                    className="img-fluid rounded"
                    style={{ height: "100px", objectFit: "cover", width: "100%" }}
                    alt="Banner 4"
                  />
                </div>
                <div>
                  <img
                    src={require("../../assets/images/banners/slide5.jpg")}
                    className="img-fluid rounded"
                    style={{ height: "100px", objectFit: "cover", width: "100%" }}
                    alt="Banner 5"
                  />
                </div>
              </aside>
            </div>

          </div>
        </div>
      </main>
    </section>
  );
};

export default Slider;
