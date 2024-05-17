import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductListing.css';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState({
        productName: '',
        productDescription: '',
        productType: '',
        productQuantity: '',
        productPrice: ''
    });
    const [newProduct, setNewProduct] = useState({
        productName: '',
        productDescription: '',
        productType: '',
        productQuantity: '',
        productPrice: ''
    });

    useEffect(() => {
        axios.get('http://localhost:3001/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleEdit = (productID) => {
        const productToEdit = products.find(product => product.productID === productID);
        setEditingProduct(productToEdit);
        setEditedProduct({
            productName: productToEdit.productName,
            productDescription: productToEdit.productDescription,
            productType: productToEdit.productType,
            productQuantity: productToEdit.productQuantity,
            productPrice: productToEdit.productPrice
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:3001/products/${editingProduct.productID}`, editedProduct)
            .then(response => {
                const updatedProducts = products.map(product =>
                    product.productID === editingProduct.productID ? response.data : product
                );
                setProducts(updatedProducts);
                setEditingProduct(null);
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    const handleNewProductChange = (event) => {
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = () => {
        axios.post('http://localhost:3001/products', newProduct)
            .then(response => {
                setProducts([...products, response.data]);
                setNewProduct({
                    productName: '',
                    productDescription: '',
                    productType: '',
                    productQuantity: '',
                    productPrice: ''
                });
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    return (
        <div className="product-listing">
            <h1>Product Listings</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productID}>
                            <td>{product.productID}</td>
                            <td>{editingProduct && editingProduct.productID === product.productID ? (
                                <input
                                    type="text"
                                    name="productName"
                                    value={editedProduct.productName}
                                    onChange={handleInputChange}
                                />
                            ) : product.productName}</td>
                            <td>{editingProduct && editingProduct.productID === product.productID ? (
                                <input
                                    type="text"
                                    name="productDescription"
                                    value={editedProduct.productDescription}
                                    onChange={handleInputChange}
                                />
                            ) : product.productDescription}</td>
                            <td>{editingProduct && editingProduct.productID === product.productID ? (
                                <input
                                    type="text"
                                    name="productType"
                                    value={editedProduct.productType}
                                    onChange={handleInputChange}
                                />
                            ) : product.productType}</td>
                            <td>{editingProduct && editingProduct.productID === product.productID ? (
                                <input
                                    type="number"
                                    name="productQuantity"
                                    value={editedProduct.productQuantity}
                                    onChange={handleInputChange}
                                />
                            ) : product.productQuantity}</td>
                            <td>{editingProduct && editingProduct.productID === product.productID ? (
                                <input
                                    type="number"
                                    name="productPrice"
                                    value={editedProduct.productPrice}
                                    onChange={handleInputChange}
                                />
                            ) : product.productPrice}</td>
                            <td>
                                {editingProduct && editingProduct.productID === product.productID ? (
                                    <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleEdit(product.productID)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Add New Product</h2>
            <form className="new-product-form">
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={newProduct.productName}
                        onChange={handleNewProductChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="productDescription"
                        value={newProduct.productDescription}
                        onChange={handleNewProductChange}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <input
                        type="text"
                        name="productType"
                        value={newProduct.productType}
                        onChange={handleNewProductChange}
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="productQuantity"
                        value={newProduct.productQuantity}
                        onChange={handleNewProductChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="productPrice"
                        value={newProduct.productPrice}
                        onChange={handleNewProductChange}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Add Product</button>
            </form>
            <Link to="/admin-home" className="btn btn-primary">Back</Link>
        </div>
    );
}

export default ProductListing;
