import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/OrderFulfillment.css';

const OrderFulfillment = () => {
  // State variables
  const [transactions, setTransactions] = useState([]); // stores transactions
  const [productInfo, setProductInfo] = useState({}); // stores product information
  const [activeTab, setActiveTab] = useState('pending'); // tracks the active tab
  const navigate = useNavigate(); // navigation function


  // fetch all transactions
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

  // cancels a transaction by updating its status to cancelled (status: 2)
  const cancelTransaction = async (transactionId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/transactions/${transactionId}`, {
        status: 2, // Update the status to cancelled
      });

      if (response.status === 200) {
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

  // confirms a transaction by updating its status to confirmed (status: 1)
  const confirmTransaction = async (transactionId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/transactions/${transactionId}`, {
        status: 1, // Update the status to confirmed
      });

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.transactionId === transactionId ? { ...transaction, status: 1 } : transaction
          )
        );

        // update product quantities after confirmation
        const productsToUpdate = transactions
          .find((transaction) => transaction.transactionId === transactionId)
          .products;

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

  // fetch product information related to transaction and update
  useEffect(() => {
    const fetchTransactionProductInfo = async () => {
      try {
        const productInfoPromises = transactions.map(async (transaction) => {
          // fetch user email used in transaction
          const userResponse = await axios.get(`http://localhost:5000/api/users/${transaction.userId}`);
          const userEmail = userResponse.data.userEmail;

          // fetch product information 
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

          // reduces product info array to a map for quick access
          const productInfoMap = productInfoArray.reduce((acc, info) => {
            if (info) {
              acc[info.id] = info.product;
            }
            return acc;
          }, {});

          // update transactions state with user email
          setTransactions((prevTransactions) =>
            prevTransactions.map((prevTransaction) =>
              prevTransaction.transactionId === transaction.transactionId
                ? { ...prevTransaction, userEmail }
                : prevTransaction
            )
          );

          // update product info state with new product info
          setProductInfo((prevProductInfo) => ({
            ...prevProductInfo,
            ...productInfoMap,
          }));
        });

        // wait for promises to resolve
        await Promise.all(productInfoPromises);
      } catch (error) {
        console.error('Error fetching product information:', error.message);
      }
    };

    fetchTransactionProductInfo();
  }, [transactions]);

  // filters transaction based on status
  const confirmedTransactions = transactions.filter(transaction => transaction.status === 1);
  const pendingTransactions = transactions.filter(transaction => transaction.status === 0);
  const cancelledTransactions = transactions.filter(transaction => transaction.status === 2);

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="order-fulfillment-container">
        <div className="menu-bar">
          <h2 className="page-title">Order Fulfillment</h2>
          <button className="back-to-dashboard-btn" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        </div>
        <div className="order-tabs">
          
          <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => handleChange('pending')}>Orders to Fulfill</button>
          <button className={`tab ${activeTab === 'confirmed' ? 'active' : ''}`} onClick={() => handleChange('confirmed')}>Confirmed Orders</button>
          <button className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => handleChange('cancelled')}>Cancelled Orders</button>
        </div>
        <div className="order-tab-content">
        <div className="order-tab-content-title">
          {activeTab === 'pending' && pendingTransactions.length > 0 && <h3>Orders to Fulfill</h3>}
          {activeTab === 'confirmed' && confirmedTransactions.length > 0 && <h3>Confirmed Orders</h3>}
          {activeTab === 'cancelled' && cancelledTransactions.length > 0 && <h3>Cancelled Orders</h3>}
          </div>
          {activeTab === 'pending' && pendingTransactions.map((transaction) => (
            <div key={transaction.transactionId} className="order-card">
              <div className="order-card-header-fulfill">
                <p>
                  Transaction ID: {transaction.transactionId} | Status: Pending | Email: {transaction.userEmail}
                </p>
              </div>
              <div className="order-card-body">
                {transaction.products.map((product) => (
                  <div key={product.ProductId} className="product-info">
                    <img
                      src={productInfo[product.ProductId]?.imageUrl || 'placeholder-image-url'}
                      alt={productInfo[product.ProductId]?.name || 'Product Image'}
                      className="product-image"
                    />
                    <div>
                    <h6 className="product-name-order"><b>{productInfo[product.ProductId]?.name || 'Product Name'}</b></h6>
                      <p>Quantity: {product.quantity}</p>
                      <p>Date and Time: {transaction.date}, {transaction.time} | <em>Mode of Payment: Cash on Delivery</em></p>
                      <p className="total-price">Total Price: ₱{transaction.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <div className="action-buttons">
                  {transaction.status === 0 && (
                    <>
                      <button onClick={() => confirmTransaction(transaction.transactionId)} className="confirm-btn">Confirm</button>
                      <button onClick={() => cancelTransaction(transaction.transactionId)} className="cancel-btn">Cancel</button>
                    </>
                  )}
                  {transaction.status === 1 && (
                    <button className="confirmed-btn" disabled>Confirmed</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'confirmed' && confirmedTransactions.map((transaction) => (
            <div key={transaction.transactionId} className="order-card">
              <div className="order-card-header-fulfill">
                <p>
                  Transaction ID: {transaction.transactionId} | Status: Confirmed | Email: {transaction.userEmail}
                </p>
              </div>
              <div className="order-card-body">
                {transaction.products.map((product) => (
                  <div key={product.ProductId} className="product-info">
                    <img
                      src={productInfo[product.ProductId]?.imageUrl || 'placeholder-image-url'}
                      alt={productInfo[product.ProductId]?.name || 'Product Image'}
                      className="product-image"
                    />
                    <div>
                    <h6 className="product-name-order"><b>{productInfo[product.ProductId]?.name || 'Product Name'}</b></h6>
                      <p>Quantity: {product.quantity}</p>
                      <p>Date and Time: {transaction.date}, {transaction.time} | <em>Mode of Payment: Cash on Delivery</em></p>
                      <p className="total-price">Total Price: ₱{transaction.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <div className="action-buttons">
                  {transaction.status === 0 && (
                    <>
                      <button onClick={() => confirmTransaction(transaction.transactionId)} className="confirm-btn">Confirm</button>
                      <button onClick={() => cancelTransaction(transaction.transactionId)} className="cancel-btn">Cancel</button>
                    </>
                  )}
                  {transaction.status === 1 && (
                    <button className="confirmed-btn" disabled>Confirmed</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'cancelled' && cancelledTransactions.map((transaction) => (
            <div key={transaction.transactionId} className="order-card">
              <div className="order-card-header-fulfill">
                <p>
                  Transaction ID: {transaction.transactionId} | Status: Cancelled | Email: {transaction.userEmail}
                </p>
              </div>
              <div className="order-card-body">
                {transaction.products.map((product) => (
                  <div key={product.ProductId} className="product-info">
                    <img
                      src={productInfo[product.ProductId]?.imageUrl || 'placeholder-image-url'}
                      alt={productInfo[product.ProductId]?.name || 'Product Image'}
                      className="product-image"
                    />
                    <div>
                    <h6 className="product-name"><b>{productInfo[product.ProductId]?.name || 'Product Name'}</b></h6>
                      <p>Quantity: {product.quantity}</p>
                      <p>Date and Time: {transaction.date}, {transaction.time} | <em>Mode of Payment: Cash on Delivery</em></p>
                      <p className="total-price">Total Price: ₱{transaction.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <div className="action-buttons">
                  {transaction.status === 0 && (
                    <>
                      <button onClick={() => confirmTransaction(transaction.transactionId)} className="confirm-btn">Confirm</button>
                      <button onClick={() => cancelTransaction(transaction.transactionId)} className="cancel-btn">Cancel</button>
                    </>
                  )}
                  {transaction.status === 1 && (
                    <button className="confirmed-btn" disabled>Confirmed</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'pending' && pendingTransactions.length === 0 && <p>No pending orders to display.</p>}
          {activeTab === 'confirmed' && confirmedTransactions.length === 0 && <p>No confirmed orders to display.</p>}
          {activeTab === 'cancelled' && cancelledTransactions.length === 0 && <p>No cancelled orders to display.</p>}
        </div>
      </div>
    </>
  );
};

export default OrderFulfillment;
