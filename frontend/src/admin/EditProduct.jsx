import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CSS/EditProduct.css';

const EditProductModal = ({ editProduct, handleClose, handleEditProduct, handleEditInputChange }) => {
  return (
    <Modal show={!!editProduct} onHide={handleClose} centered>
      <Modal.Header className="edit-product-modal-header">
        <Modal.Title className="edit-product-modal-title">Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body className="edit-product-modal-body">
        <form className="edit-product-form">
          <div className="mb-3">
            <label htmlFor="editProductName" className="edit-product-form-label">
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
            <label htmlFor="editProductQuantity" className="edit-product-form-label">
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
            <label htmlFor="editProductDescription" className="edit-product-form-label">
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
            <label htmlFor="editProductImageURL" className="edit-product-form-label">
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
            <label htmlFor="editProductPrice" className="edit-product-form-label">
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

          <div className="d-flex justify-content-between edit-product-buttons">
            <Button variant="secondary" onClick={handleClose} className="btn-secondary">
              Close
            </Button>
            <Button className="btn-success" onClick={handleEditProduct}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
