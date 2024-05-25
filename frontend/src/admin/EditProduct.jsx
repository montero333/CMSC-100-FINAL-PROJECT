import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CSS/EditProduct.css';

const EditProductModal = ({ editProduct, handleClose, handleEditProduct, handleEditInputChange }) => {

  return (
    <Modal show={!!editProduct} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="editProductName" className="form-label">
              Product Name:
            </label>
            <input
              type="text"
              id="editProductName"
              name="name"
              value={editProduct.name}
              onChange={handleEditInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="editProductQuantity" className="form-label">
              Product Quantity:
            </label>
            <input
              type="number"
              id="editProductQuantity"
              name="quantity"
              value={editProduct.quantity}
              onChange={handleEditInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="editProductDescription" className="form-label">
              Product Description:
            </label>
            <textarea
              id="editProductDescription"
              name="description"
              value={editProduct.description}
              onChange={handleEditInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="editProductImageURL" className="form-label">
              Product Image URL:
            </label>
            <input
              type="text"
              id="editProductImageURL"
              name="imageUrl"
              value={editProduct.imageUrl}
              onChange={handleEditInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="editProductPrice" className="form-label">
              Product Price:
            </label>
            <input
              type="number"
              id="editProductPrice"
              name="price"
              value={editProduct.price}
              onChange={handleEditInputChange}
              className="form-control"
            />
          </div>

          <Button style={{backgroundColor: '#4CAF50'}} variant="success" onClick={handleEditProduct}>
            Save Changes
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
