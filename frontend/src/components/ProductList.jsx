import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [product, Setproduct] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");
    Setproduct(response.data);
  };

  const DeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      getProducts(); // agar bisa melihat perubahan nya
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <Link className="button is-success addButton" to="/add">
        Add New
      </Link>
      <div className="columns is-multiline">
        {product.map((product) => (
          <div className="column is-one-quarter" key={product.id}>
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={product.url} alt="Placeholder image" />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{product.name}</p>
                  </div>
                </div>
              </div>
              <footer className="card-footer">
                <Link className="card-footer-item" to={`edit/${product.id}`}>
                  Edit
                </Link>
                <a
                  onClick={() => DeleteProduct(product.id)}
                  href=""
                  className="card-footer-item"
                >
                  Delete
                </a>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
