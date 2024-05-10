// export default function ViewUsers() {
//     return (
//       <>
//         <p> Welcome to the homepage. </p>
//       </>
//     )
//   }

import React from 'react';
import ProductCard from '../components/productCard'; 

const ViewUsers = () => {
  const items = [
    {
      imageUrl: 'https://example.com/image1.jpg',
      altText: 'User 1',
      buttonText: 'View',
      itemName: 'Product 1',
    },
    {
      imageUrl: 'https://example.com/image2.jpg',
      altText: 'User 2',
      buttonText: 'View',
      itemName: 'Product 2',
    },
    {
      imageUrl: 'https://example.com/image2.jpg',
      altText: 'User 3',
      buttonText: 'View',
      itemName: 'Product 3',
    },
    {
      imageUrl: 'https://example.com/image2.jpg',
      altText: 'User 4',
      buttonText: 'View',
      itemName: 'Product 4',
    },
    // add more items here
  ];

  return (
    <div className="product-container">
      {items.map((item, index) => (
        <ProductCard
          key={index}
          imageUrl={item.imageUrl}
          altText={item.altText}
          buttonText={item.buttonText}
        />
      ))}
    </div>
  );
};

export default ViewUsers;