import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand text-white">Product Showcase</span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/products"
                className="nav-link text-white"
                activeClassName="active"
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/assignment"
                className="nav-link text-white"
                activeClassName="active"
              >
                Assignment
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;