import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SalesReport.css';

const SalesReports = () => {
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [annualSales, setAnnualSales] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [activeTab, setActiveTab] = useState('weekly');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesData('weekly');
    fetchSalesData('monthly');
    fetchSalesData('annual');
    fetchProductSales();
  }, []);

  const fetchSalesData = async (duration) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sales/${duration}`);
      const data = await response.json();

      switch (duration) {
        case 'weekly':
          setWeeklySales(data);
          break;
        case 'monthly':
          setMonthlySales(data);
          break;
        case 'annual':
          setAnnualSales(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const fetchProductSales = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      const transactions = await response.json();

      const productSalesData = transactions
        .filter(transaction => transaction.status === 1)
        .reduce((acc, transaction) => {
          transaction.products.forEach((product) => {
            const existingProduct = acc.find((p) => p.productId === product.ProductId);

            if (existingProduct) {
              existingProduct.quantity += product.quantity;
            } else {
              acc.push({
                productId: product.ProductId,
                quantity: product.quantity,
              });
            }
          });

          return acc;
        }, []);

      const productPromises = productSalesData.map(async (product) => {
        const productResponse = await fetch(`http://localhost:5000/api/products/${product.productId}`);
        const productData = await productResponse.json();
        return {
          ...product,
          productName: productData.name,
          productImg: productData.imageUrl,
          price: productData.price,
        };
      });

      const productDetails = await Promise.all(productPromises);
      setProductSales(productDetails);
    } catch (error) {
      console.error('Error fetching product sales data:', error);
    }
  };

  const handleDurationChange = (duration) => {
    setActiveTab(duration);
    fetchSalesData(duration);
  };

  const calculateTotalSales = () => {
    const totalSales = productSales.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    return parseFloat(totalSales.toFixed(2));
  };

  return (
    <div className="sales-report-container">
      <div className="menu-bar">
        <h2 className="page-title">Sales Report and Analytics</h2>
        <button className="back-to-dashboard-btn" onClick={() => navigate('/admin-dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="order-tabs">
        <button className={`tab ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => handleDurationChange('weekly')}>
          Weekly Sales
        </button>
        <button className={`tab ${activeTab === 'monthly' ? 'active' : ''}`} onClick={() => handleDurationChange('monthly')}>
          Monthly Sales
        </button>
        <button className={`tab ${activeTab === 'annual' ? 'active' : ''}`} onClick={() => handleDurationChange('annual')}>
          Annual Sales
        </button>
        <button className={`tab ${activeTab === 'product' ? 'active' : ''}`} onClick={() => handleDurationChange('product')}>
          Product Sales
        </button>
      </div>

      <h4 className="order-tab-content-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sales</h4>

      {activeTab === 'product' && (
        <h4 className="total-sales">Total: ₱{calculateTotalSales()}</h4>
      )}

      <div className="order-tab-content">
        {activeTab === 'weekly' && weeklySales.map((sale, index) => (
          <div key={index} className="order-card">
            <div className="order-card-header">
              Transaction ID: {sale.transactionId}
            </div>
            <div className="order-card-body">
              <p>Date: {sale.date}</p>
              <p>Price: ₱{sale.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        ))}

        {activeTab === 'monthly' && monthlySales.map((sale, index) => (
          <div key={index} className="order-card">
            <div className="order-card-header">
              Transaction ID: {sale.transactionId}
            </div>
            <div className="order-card-body">
              <p>Date: {sale.date}</p>
              <p>Price: ₱{sale.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        ))}

        {activeTab === 'annual' && annualSales.map((sale, index) => (
          <div key={index} className="order-card">
            <div className="order-card-header">
              Transaction ID: {sale.transactionId}
            </div>
            <div className="order-card-body">
              <p>Date: {sale.date}</p>
              <p>Price: ₱{sale.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        ))}

        {activeTab === 'product' && productSales.map((product, index) => (
          <div key={index} className="order-card">
            <img src={product.productImg} alt={product.productName} className="product-image" />
            <div className="order-card-body">
              <h6 className="product-name"><b>{product.productName}</b></h6>
              <p>Product ID: {product.productId}</p>
              <p>Sold: {product.quantity} | Price: ₱{product.price.toFixed(2)} | Total Profit: ₱{(product.price * product.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesReports;
