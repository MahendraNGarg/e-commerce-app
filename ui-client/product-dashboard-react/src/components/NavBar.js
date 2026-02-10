import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand text-white">Product Showcase</span>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbar-nav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbar-nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/products"
                className="nav-link text-white"
                activeClassName="active"
                onClick={closeMenu}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/featured"
                className="nav-link text-white"
                activeClassName="active"
                onClick={closeMenu}
              >
                Featured
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/assignment"
                className="nav-link text-white"
                activeClassName="active"
                onClick={closeMenu}
              >
                Assignment
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/cart"
                className="nav-link text-white"
                activeClassName="active"
                onClick={closeMenu}
              >
                Cart
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;