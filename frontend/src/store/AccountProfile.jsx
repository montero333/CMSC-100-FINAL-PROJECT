
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoreHeader from './StoreHeader.jsx';
import { useUser } from '../components/UserContext.jsx';
import './AccountProfile.css';
import videoBackground from './acc_bg.mp4'; // Import the video file
import logo from './blank_pfp.png';


const AccountProfile = () => {
  const { userId, setUserId } = useUser();
  const [userData, setUserData] = useState(null);
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleCheckout = () => {
    console.log('Checkout clicked!');
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
  };

  useEffect(() => {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('userId');

    // Check if userId is stored and not equal to the current userId
    if (storedUserId && storedUserId !== userId) {
      // Update the userId state
      setUserId(storedUserId);
    }

    // Fetch user data or perform other actions using the userId
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/user/${userId}`);
          const data = await response.json();

          if (response.ok) {
            setUserData(data.user);
          } else {
            console.error('Error fetching user data:', data.message);
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      };

      //fetch transactions from the database
      const fetchTransactions = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/transactions');
          if (response.status === 200) {
            const userTransactions = response.data.filter(transaction => transaction.userId === userId);
            setTransactions(userTransactions);
          } else {
            console.error('Error fetching transactions:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error.message);
        }
      };

      if (userId) {
        fetchUserData();
        fetchTransactions();
      }
    }
  }, [userId, setUserId]);

  //handles for edit or saving user data
  const handleEditUsername = () => {
    // Clear the error state when switching to edit mode
    setError('');
    setNewUsername(''); // Clear the input field when switching to edit mode
    setEditUsername(!editUsername);
  };

  const handleEditPassword = () => {
    // Clear the error state when switching to edit mode
    setError('');
    setNewPassword(''); // Clear the input field when switching to edit mode
    setEditPassword(!editPassword);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedFields = {
        userName: newUsername || userData.UserName,
        password: newPassword || userData.password,
      };

      const response = await axios.patch(`http://localhost:5000/api/user/${userId}`, updatedFields, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response Data:', response.data);
  
      if (response.status === 200) {
        setUserData({
          ...userData,
          ...response.data,
        });
  
        localStorage.setItem('userData', JSON.stringify({ ...userData, ...response.data }));
        
        setEditUsername(false);
        setEditPassword(false);
        setError(null);
      }
    } catch (error) {
      // Check if it's an AxiosError
      if (error.isAxiosError && error.response) {
        const { response } = error;
        setError(`${response.data.message || response.statusText}`);
      } else {
        console.error('Error:', error);
        setError(`Error updating data: ${error.message}`);
      }
    }
  };

  //Transaction handle events
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

  //fetch product information from the database
  useEffect(() => {
    const fetchTransactionProductInfo = async () => {
      try {
        const productInfoPromises = transactions.map(async (transaction) => {
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
  
  //group transactions
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.transactionId]) {
      acc[transaction.transactionId] = [];
    }
    acc[transaction.transactionId].push(transaction);
    return acc;
  }, {});

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    document.getElementById('transactionModal').style.display = 'flex';
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    document.getElementById('transactionModal').style.display = 'none';
  };

  return (
    <div className="container">
      <div className="content">
        <StoreHeader cart={cart} setCart={setCart} handleCheckout={handleCheckout} removeFromCart={removeFromCart} hideCartButton={true} />
        <video autoPlay loop muted className="video-background">
          <source src={videoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className='welc-text'> WELCOME </h1>
        <h2 className="name-text">
          {userData && `${userData.firstName} ${userData.lastName}`}
        </h2>
        <div className="left-container">
          <div className="user-info-container">
            {userData ? (
              <div>
                <p className="in-text">YOU ARE</p>
                <p className="ut-text">{userData.UserType}</p>
                <p className="ut-subtext">{userData.userId}</p>
                <img src={logo} alt="Logo" className="accLogo" />
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                  <label className="user-info-label text-muted mb-0">Username</label>
                  {editUsername ? (
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="user-info-input form-control"
                      placeholder="Enter new username"
                    />
                  ) : (
                    <p className="user-info-value card-text">{userData.userName}</p>
                  )}
                  <button
                    onClick={handleEditUsername}
                    className={`user-info-button btn btn-${editUsername ? 'edit' : 'save'}`}
                  >
                    {editUsername ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <label className="user-info-label text-muted mb-0" style={{ backgroundColor: '#e6e6e5', padding: '10px 12px', borderRadius: '10px 0px 0px 10px' }}>Password</label>
                    {editPassword ? (
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="user-info-input form-control"
                        placeholder="Enter new password"
                      />
                    ) : (
                      <p className="user-info-value card-text"></p>
                    )}
                    <button
                      onClick={handleEditPassword}
                      className={`user-info-button btn btn-${editPassword ? 'edit' : 'save'}`}
                    >
                      {editPassword ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                </div>
                {(editUsername || editPassword) && (
                  <button onClick={handleSaveChanges} className="user-info-button btn mt-3">
                    Save Changes
                  </button>
                )}
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>
        <div className="right-container">
          <h2 className='transac-text'>MY TRANSACTIONS</h2>
          {Object.entries(groupedTransactions).map(([transactionId, group]) => (
            <div key={transactionId} className="transaction-summary" onClick={() => openModal(group)}>
              <span>Transaction ID: {transactionId}</span>
              <span>Status: {group[0].status === 0 ? 'Pending' : (group.some((transaction) => transaction.status === 1) ? 'Confirmed' : 'Cancelled')}</span>
            </div>
          ))}
        </div>
      </div>
      {selectedTransaction && (
        <div id="transactionModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {selectedTransaction.map((transaction) => (
              <div key={transaction.transactionId} className="row mb-0">
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
            ))}
            <div className="text-muted">
              <p>Date and Time: {selectedTransaction[0].date}, {selectedTransaction[0].time} | <em>Mode of Payment: Cash on Delivery</em></p>
              <p style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>Total Price: ₱{selectedTransaction[0].totalPrice}</p>
              {selectedTransaction.some((transaction) => transaction.status === 0) ? (
                <button
                  onClick={() => cancelTransaction(selectedTransaction[0].transactionId)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  disabled
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};


export default AccountProfile;
