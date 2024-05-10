import React from 'react';
import PropTypes from 'prop-types';

const ProductCard = ({
  imageUrl,
  altText,
  buttonText,
  userName,
  viewUser, 
}) => {
  const handleViewUser = () => {
    viewUser(userName);
  };

  return (
    <div className="item-card">
      <img src={imageUrl} alt={altText} />
      <div className="card-label">
        <p className="product-name">{userName}</p>
      </div>
      <button onClick={handleViewUser}>{buttonText}</button>
    </div>
  );
};

ProductCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  viewUser: PropTypes.func.isRequired, 
};

export default ProductCard;