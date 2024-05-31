import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CSS/EditProduct.css';

// component for the Edit Product Modal
const EditProductModal = ({ editProduct, handleClose, handleEditProduct, handleEditInputChange }) => {

  return (
    // shows when editProduct exists
    <Modal show={!!editProduct} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title className="modal-title">Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form for editing product details */}
        <form className="edit-product-form">
          {/* Product Name input field */}
          <div className="mb-3">
            <label htmlFor="editProductName" className="form-label">
              Product Name:
            </label>
            <input
              type="text"
              id="editProductName"
              name="name"
              value={editProduct.name}
              onChange={handleEditInputChange} // Calls function to handle input changes
              className="form-control"
            />
          </div>

          {/* Product Quantity input field */}
          <div className="mb-3">
            <label htmlFor="editProductQuantity" className="form-label">
              Product Quantity:
            </label>
            <input
              type="number"
              id="editProductQuantity"
              name="quantity"
              value={editProduct.quantity}
              onChange={handleEditInputChange} // calls function that handles input changes
              className="form-control"
            />
          </div>

          {/* Product Description textarea */}
          <div className="mb-3">
            <label htmlFor="editProductDescription" className="form-label">
              Product Description:
            </label>
            <textarea
              id="editProductDescription"
              name="description"
              value={editProduct.description}
              onChange={handleEditInputChange} // calls function that handles input changes
              className="form-control"
            />
          </div>

          {/* Product Image URL input field */}
          <div className="mb-3">
            <label htmlFor="editProductImageURL" className="form-label">
              Product Image URL:
            </label>
            <input
              type="text"
              id="editProductImageURL"
              name="imageUrl"
              value={editProduct.imageUrl}
              onChange={handleEditInputChange} // calls function that handles input changes
              className="form-control"
            />
          </div>

          {/* Product Price input field */}
          <div className="mb-3">
            <label htmlFor="editProductPrice" className="form-label">
              Product Price:
            </label>
            <input
              type="number"
              id="editProductPrice"
              name="price"
              value={editProduct.price}
              onChange={handleEditInputChange} // calls function that handles input changes
              className="form-control"
            />
          </div>

          {/* Buttons for closing the modal and saving changes */}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}> {/* Button to close the modal */}
              Close
            </Button>
            <Button className="btn-success" onClick={handleEditProduct}> {/* Button to save changes */}
              Save Changes
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
