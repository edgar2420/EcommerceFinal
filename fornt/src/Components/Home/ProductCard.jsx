/* eslint-disable jsx-a11y/alt-text */
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const defaultImage = "/images/product.jpg";

  let productImages = [];
  if (product.imagenUrl) {
    try {
      productImages = JSON.parse(product.imagenUrl);
    } catch {
      productImages = [product.imagenUrl];
    }
  }
  const productImage =
    productImages.length > 0
      ? `https://backendecommerce-dy3z.onrender.com${productImages[0]}`
      : defaultImage;

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="col-lg-3 col-sm-6 col-12">
      <div
        className="card card-product-grid"
        onClick={handleProductClick}
        style={{ cursor: "pointer" }}
      >
        <div className="img-wrap" style={{ padding: "0" }}>
          <img src={productImage} alt={product.nombre || "Producto"} />
        </div>
        <div className="info-wrap">
          <p className="title">{product.nombre || "Producto sin nombre"}</p>
          <div className="rating-wrap">
            <ul className="rating-stars">
              <li
                className="stars-active"
                style={{ width: `${(product.rating || 0) * 20}%` }}
              >
                <img src="/images/stars-active.svg" alt="Estrellas activas" />
              </li>
            </ul>
          </div>
        </div>
        <div className="bottom-wrap">
          <a href="#" className="btn btn-primary float-end">
            <FontAwesomeIcon icon={faShoppingCart} />
          </a>
          <div className="price-wrap lh-sm">
            <strong className="price">
              {product.precio ? `${product.precio} Bs` : "Precio no disponible"}
            </strong>
            <br />
            <small className="text-muted">
              {product.stock > 0 ? "Disponible" : "Agotado"}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
