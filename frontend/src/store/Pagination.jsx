import React from 'react';
import './Store.css';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ startIndex, displayedProducts, totalPages, setStartIndex }) => {
    return (
        <div className="pagCon">
            <Pagination style={{ listStyle: 'none', padding: 0, display: 'flex', alignItems: 'center' }}>
                <Pagination.Item
                    onClick={() => setStartIndex(Math.max(startIndex - displayedProducts, 0))}
                    disabled={startIndex === 0}
                    className="pagination-item" // Apply the CSS class
                >
                    {'< '}&nbsp;&nbsp;{/* Add two non-breaking spaces */}
                </Pagination.Item>
                <Pagination.Item disabled className="pagination-item"> {/* Apply the CSS class */}
                    {Math.floor(startIndex / displayedProducts) + 1}
                </Pagination.Item>
                <Pagination.Item
                    onClick={() => setStartIndex(Math.min(startIndex + displayedProducts, (totalPages - 1) * displayedProducts))}
                    disabled={startIndex + displayedProducts >= totalPages * displayedProducts}
                    className="pagination-item" // Apply the CSS class
                >
                    &nbsp;&nbsp;{' >'}{/* Add two non-breaking spaces */}
                </Pagination.Item>
            </Pagination>
        </div>
    );
};

export default PaginationComponent;
