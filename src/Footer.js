import React from 'react';
import {Github} from 'react-bootstrap-icons';
import './App.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto text-center py-3 bg-warning">
      <div className="container-fluid">
        <p className="text-light footer-text">
          Weather App <span class="text-dark">&copy;</span> &nbsp;
          {new Date ().getFullYear ()}
          {' '}{' '}
          by {' '}
          <a className="footer-link" href="https://dhakalnirajan.github.io">
            Nirajan Dhakal
          </a>
          &nbsp;   | &nbsp;  Inspired by {' '}
          <a className="footer-link" href="https://github.com/meedikshya">
            Dikshya Sharma
          </a> &nbsp; | &nbsp; Powered by {' '}
          <Github size={20} color="white" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
