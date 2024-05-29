import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderFulfillment = () => {
  const [transactions, setTransactions] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions');

        if (response.status === 200) {
          setTransactions(response.data);
        } else {
          console.error('Error fetching transactions:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchTransaction();
  }, []);


  const cancelTransaction = async (transactionId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/transactions/${transactionId}`, {
        status: 2, // Update the status to cancelled
      });

      if (response.status === 200) {
        // If the cancellation is successful, update the local state
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.transactionId === transactionId ? { ...transaction, status: 2 } : transaction
          )
        );
      } else {
        console.error('Error cancelling transaction:', response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling transaction:', error.message);
    }
  };

  const confirmTransaction = async (transactionId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/transactions/${transactionId}`, {
        status: 1, // Update the status to confirmed
      });
  
      if (response.status === 200) {
        // If the confirmation is successful, update the local state
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.transactionId === transactionId ? { ...transaction, status: 1 } : transaction
          )
        );
  
        // Get the products to update
        const productsToUpdate = transactions
          .find((transaction) => transaction.transactionId === transactionId)
          .products;
  
        // Update product quantities
        for (const product of productsToUpdate) {
          try {
            const currentProduct = await axios.get(`http://localhost:5000/api/products/${product.ProductId}`);
            const newQuantity = currentProduct.data.quantity - product.quantity;
  
            const updateProductResponse = await axios.put(`http://localhost:5000/api/products/${product.ProductId}`, {
              quantity: newQuantity,
            });
  
            if (updateProductResponse.status !== 200) {
              console.error('Error updating product quantity:', updateProductResponse.data.message);
            }
          } catch (error) {
            console.error('Error updating product quantity:', error.message);
          }
        }
      } else {
        console.error('Error confirming transaction:', response.data.message);
      }
    } catch (error) {
      console.error('Error confirming transaction:', error.message);
    }
  };

  useEffect(() => {

    const fetchTransactionProductInfo = async () => {
      try {
        const productInfoPromises = transactions.map(async (transaction) => {
          // Fetch user email for the current transaction
          const userResponse = await axios.get(`http://localhost:5000/api/users/${transaction.userId}`);
          const userEmail = userResponse.data.userEmail;

          const productInfoArray = await Promise.all(
            transaction.products.map(async (product) => {
              const response = await axios.get(`http://localhost:5000/api/products/${product.ProductId}`);
              if (response.status === 200) {
                return {
                  id: product.ProductId,
                  product: response.data,
                };
              } else {
                console.error('Error fetching product information:', response.data.message);
                return null;
              }
            })
          );

          const productInfoMap = productInfoArray.reduce((acc, info) => {
            if (info) {
              acc[info.id] = info.product;
            }
            return acc;
          }, {});

          // Update the email for the current transaction
          setTransactions((prevTransactions) =>
          prevTransactions.map((prevTransaction) =>
            prevTransaction.transactionId === transaction.transactionId
              ? { ...prevTransaction, userEmail }
              : prevTransaction
          )
        );

          setProductInfo((prevProductInfo) => ({
            ...prevProductInfo,
            ...productInfoMap,
          }));
        });

        await Promise.all(productInfoPromises);
      } catch (error) {
        console.error('Error fetching product information:', error.message);
      }
    };

    fetchTransactionProductInfo();
  }, [transactions]);

  const confirmedTransactions = transactions.filter(transaction => transaction.status === 1);
  const pendingTransactions = transactions.filter(transaction => transaction.status === 0);
  const cancelledTransactions = transactions.filter(transaction => transaction.status === 2);

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="container mt-4">
      <Button variant="secondary" onClick={() => navigate('/admin-dashboard')}>
        Back to Dashboard
        </Button>
        <div className="row mt-3">
          <div className="col-12 mb-3">
            <ul className="nav nav-tabs">
            <li className="nav-item">
                <button
                  style={{color: 'black'}}
                  className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => handleChange('pending')}
                >
                  Orders to Fulfill
                </button>
              </li>
              <li className="nav-item">
                <button
                  style={{color: 'black'}}
                  className={`nav-link ${activeTab === 'confirmed' ? 'active' : ''}`}
                  onClick={() => handleChange('confirmed')}
                >
                  Confirmed Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  style={{color: 'black'}}
                  className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => handleChange('cancelled')}
                >
                  Cancelled Orders
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12 mb-3">
            {activeTab === 'pending' && pendingTransactions.length > 0 && <h3>Orders to Fulfill</h3>}
            {activeTab === 'confirmed' && confirmedTransactions.length > 0 && <h3>Confirmed Orders</h3>}
            {activeTab === 'cancelled' && cancelledTransactions.length > 0 && <h3>Cancelled Orders</h3>}
            
            {activeTab === 'pending' && pendingTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="card mb-4">
                <div className="card-header text-muted">
                  <h6 className="mb-0">
                    Transaction ID: {transaction.transactionId} | Status: Pending | Email: {transaction.userEmail}
                  </h6>
                </div>
                <div className="card-body">
                  {transaction.products.map((product) => (
                    <div key={product.ProductId} className="col-12 mb-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={productInfo[product.ProductId]?.imageUrl || 'placeholder-image-url'}
                          alt={productInfo[product.ProductId]?.name || 'Product Image'}
                          className="img-fluid mr-3"
                          style={{ width: '70px', height: '70px', marginRight: '15px' }}
                        />
                        <div>
                          <h6><b>{productInfo[product.ProductId]?.name || 'Product Name'}</b></h6>
                          <p>Quantity: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer text-muted">
                  <div className="row">
                    <div className="col-md-8 d-flex flex-column align-items-left">
                      <p>Date and Time: {transaction.date}, {transaction.time} | <em>Mode of Payment: Cash on Delivery</em></p>
                    </div>
                    <div className="col-md-2 d-flex flex-column align-items-left">
                      <p style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>Total Price: ₱{transaction.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-md-2 d-flex flex-column align-items-left">
                      {transaction.status === 0 && (
                        <div className="d-flex">
                          <button
                            onClick={() => confirmTransaction(transaction.transactionId)}
                            className="btn btn-success"
                            style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => cancelTransaction(transaction.transactionId)}
                            className="btn btn-danger ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {transaction.status === 1 && (
                        <button
                          className="btn btn-secondary"
                          disabled
                        >
                          Confirmed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'confirmed' && confirmedTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="card mb-4">
                <div className="card-header text-muted">
                  <h6 className="mb-0">
                    Transaction ID: {transaction.transactionId} | Status: Confirmed | Email: {transaction.userEmail}
                  </h6>
                </div>
                <div className="card-body">
                  {transaction.products.map((product) => (
                    <div key={product.ProductId} className="col-12 mb-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={productInfo[product.ProductId]?.imageUrl || 'placeholder-image-url'}
                          alt={productInfo[product.ProductId]?.name || 'Product Image'}
                          className="img-fluid mr-3"
                          style={{ width: '70px', height: '70px', marginRight: '15px' }}
                        />
                        <div>
                          <h6><b>{productInfo[product.ProductId]?.name || 'Product Name'}</b></h6>
                          <p>Quantity: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer text-muted">
                  <div className="row">
                    <div className="col-md-8 d-flex flex-column align-items-left">
                      <p>Date and Time: {transaction.date}, {transaction.time} | <em>Mode of Payment: Cash on Delivery</em></p>
                    </div>
                    <div className="col-md-2 d-flex flex-column align-items-left">
                      <p style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>Total Price: ₱{transaction.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-md-2 d-flex flex-column align-items-left">
                      {transaction.status === 0 && (
                        <div className="d-flex">
                          <button
                            onClick={() => confirmTransaction(transaction.transactionId)}
                            className="btn btn-success"
                            style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => cancelTransaction(transaction.transactionId)}
                            className="btn btn-danger ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {transaction.status === 1 && (
                        <button
                          className="btn btn-secondary"
                          disabled
                        >
                          Confirmed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'cancelled' && cancelledTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="card mb-4">
                <div className="card-header text-muted">
                  <h6 className="mb-0">
                    Transaction ID: {transaction.transactionId} | Status: Cancelled | Email: {transaction.userEmail}
                  </h6>
                </div>
                <div className="card-body">
                  {transaction.products.map((product) => (
                    <div key={product.ProductId} className="col-12 mb-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={productInfo[product.ProductId]?.imageUrl || 'placeholder-image-url'}
                          alt={productInfo[product.ProductId]?.name || 'Product Image'}
                          className="img-fluid mr-3"
                          style={{ width: '70px', height: '70px', marginRight: '15px' }}
                        />
                        <div>
                          <h6><b>{productInfo[product.ProductId]?.name || 'Product Name'}</b></h6>
                          <p>Quantity: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer text-muted">
                  <div className="row">
                    <div className="col-md-8 d-flex flex-column align-items-left">
                      <p>Date and Time: {transaction.date}, {transaction.time} | <em>Mode of Payment: Cash on Delivery</em></p>
                    </div>
                    <div className="col-md-2 d-flex flex-column align-items-left">
                      <p style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>Total Price: ₱{transaction.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-md-2 d-flex flex-column align-items-left">
                      {transaction.status === 0 && (
                        <div className="d-flex">
                          <button
                            onClick={() => confirmTransaction(transaction.transactionId)}
                            className="btn btn-success"
                            style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => cancelTransaction(transaction.transactionId)}
                            className="btn btn-danger ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {transaction.status === 1 && (
                        <button
                          className="btn btn-secondary"
                          disabled
                        >
                          Confirmed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderFulfillment;
