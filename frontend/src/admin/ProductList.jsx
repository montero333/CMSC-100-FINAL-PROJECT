import React, { useState, useEffect } from 'react';
import short  from 'short-uuid';
import EditProductModal from './EditProduct.jsx';
import { Toast, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CSS/ProductList.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: short.generate(),
    name: '',
    type: 'Crop',
    price: 0,
    description: '',
    quantity: 0,
    imageUrl: '',
  });
  const [editProduct, setEditProduct] = useState(null);
  const [showAddedToList, setShowAddedToList] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    // Fetch products from the server on component mount
    fetchProducts();
  }, []);

  
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products'); 
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (
      newProduct.name.trim() === '' ||
      newProduct.price === 0 ||
      newProduct.quantity === 0
    ) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        fetchProducts(); // Refresh the products after adding a new one
        setNewProduct({
          id: short.generate(),
          name: '',
          type: 'Crop',
          price: 0,
          description: '',
          quantity: 0,
          imageUrl: '',
        });
        setShowAddedToList(true);
      } else {
        alert('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

const handleEditProduct = async () => {
  try {
    if (editProduct && editProduct.name && editProduct.quantity) {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editProduct.id ? { ...product, ...editProduct } : product
          )
        );

        fetchProducts(); 
        setEditProduct(null);
      } else {
        console.error('Failed to edit product. Server returned:', response.status, response.statusText);
        alert('Failed to edit product. Please try again.');
      }
    } else {
      alert('Please fill out all required fields.');
    }
  } catch (error) {
    console.error('Error editing product:', error);
    alert('Failed to edit product. Please try again.');
  }
};

  const handleEditButtonClick = (product) => {
    setEditProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: 0 }), 
        });
  
        if (response.ok) {
          const updatedProducts = products.map((product) =>
          product.id === productId ? { ...product, quantity: 0 } : product
        );

        setProducts(updatedProducts);
        } else {
          console.error('Failed to delete product. Server returned:', response.status, response.statusText);
          alert('Failed to delete product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const [sortCriteria, setSortCriteria] = useState('name'); // Default sorting criteria
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

  const handleSortCriteriaChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Sorting Logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortCriteria] > b[sortCriteria] ? 1 : -1;
    } else {
      return a[sortCriteria] < b[sortCriteria] ? 1 : -1;
    }
  });

  return (
    <>           
    <div className="container mt-3">
      <div className="row">
      <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              
              <Button variant="secondary" onClick={() => navigate('/admin-dashboard')}>
                Back to Dashboard
                </Button>

              <h3 className="card-title">Add Product</h3>
              
              <form>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Product Name:
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productType" className="form-label">
                    Product Type:
                  </label>
                  <select
                    id="productType"
                    name="type"
                    value={newProduct.type}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Crop">Crop</option>
                    <option value="Poultry">Poultry</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Product Price:
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">
                    Product Description:
                  </label>
                  <textarea
                    id="productDescription"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="form-control"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="productQuantity" className="form-label">
                    Product Quantity:
                  </label>
                  <input
                    type="number"
                    id="productQuantity"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productImageUrl" className="form-label">
                    Product Image URL:
                  </label>
                  <input
                    type="text"
                    id="productImageUrl"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>


                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="btn btn-success"
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  Add Product
                </button>
                    <Toast
                    onClose={() => setShowAddedToList(false)}
                    show={showAddedToList}
                    delay={5000}
                    autohide
                    style={{
                      position: 'fixed',
                      padding: '10px',
                      bottom: 40,
                      left: 80,
                      zIndex: 1,
                      borderRadius: '20px',
                      backgroundColor: '#4CAF50',
                      border: 'none',
                      boxShadow: 'none',  

                    }}
                    >
                    
                    <Toast.Body style={{ fontFamily: 'Montserrat', color: 'white' }}>
                        <strong className="mr-auto" style={{ fontWeight: 'bold' }}>
                        SUCSESS: &nbsp;
                        </strong>
                        The product is added to the listing!
                    </Toast.Body>
                    </Toast>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-8 product-listing">
          {/* sorting dropdown */}
          <div className="sorting-form mb-3 d-flex align-items-center justify-content-between" style={{ maxWidth: '900px' }}>
            <h3>List of Products</h3>
            <div className="d-flex align-items-center">
              <label htmlFor="sortCriteria" className="form-label me-2">
                <h6 style={{color: '#757575'}}>Sort by:</h6>
              </label>
              <select
                id="sortCriteria"
                className="form-select me-3"
                value={sortCriteria}
                onChange={handleSortCriteriaChange}
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="price">Price</option>
                <option value="quantity">Quantity</option>
              </select>

              <label htmlFor="sortOrder" className="form-label me-2">
              <h6 style={{color: '#757575'}}>Order:</h6>
              </label>
              <select
                id="sortOrder"
                className="form-select"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          {sortedProducts.map((product) => (
            <div key={product.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-fluid"
                    style={{ objectFit: 'cover', width: '100%', height: '190px' }}
                  />
                </div>
                <div className="col-md-9" style={{ marginTop: '20px' }}>
                  <div className="card-body">
                    <h4 className="card-title fw-bold">{product.name}</h4>
                    <p className="card-text text-dark d-flex flex-column flex-sm-row justify-content-between">
                      <span className="text-muted">ID: {product.id}</span>
                      <span>Quantity: {product.quantity}</span>
                      <span>Price: ₱{product.price}</span>
                    </p>
                    <div className="d-flex mt-3">
                      <button
                        onClick={() => handleEditButtonClick(product)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <EditProductModal
          editProduct={editProduct}
          handleClose={() => setEditProduct(null)}
          handleEditProduct={handleEditProduct}
          handleEditInputChange={handleEditInputChange}
        />
      )}
    </div>
    </>
  );
};

export default ProductListing;


