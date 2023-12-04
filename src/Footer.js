import React from 'react';
import {Github} from 'react-bootstrap-icons';
import './App.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto text-center py-3 bg-dark">
      <div className="container-fluid">
        <p className="text-white footer-text">
          Weather App &copy; &nbsp;
          {new Date ().getFullYear ()}
          {' '}{' '}
          by {' '}
          <a className="footer-link" href="https://dhakalnirajan.github.io">
            Nirajan Dhakal
          </a>
          &nbsp; |  &nbsp; Powered by {' '}
          <Github size={20} color="white" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
