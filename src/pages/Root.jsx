import { Outlet, Link } from 'react-router-dom';

export default function Root() {
  return (
    <div className="container">
      <header className="header">
        <div className="header-inner">
          <nav className="navigation-bar">
            <h1 className="shop-name">Alay-ay</h1>
            <ul className="nav-links">
              <li className="nav-link">
                <Link to={`/`}>View Users</Link>
              </li>
              <li className="nav-link">
                <Link to={`order-fulfillment`}>Order Fulfillment</Link>
              </li>
              <li className="nav-link">
                <Link to={`sales-report`}>Sales Report</Link>
              </li>
              <li className="nav-link">
                <Link to={`product-listing`}>Products</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}