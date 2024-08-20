import React from 'react'

export default function Footer() {
  return (
    <div className='container'>
         <footer id="contact">
      <div className="container">
        <div className="row footer-top">
          <div className="col-12 col-md-6">
        
            <h3>luxestate</h3>
            <h3>Explore Real Estate</h3>
          </div>
          <div className="col-12 col-md-6 Newsletter">
            <input type="text" placeholder="Subscribe To Our Newsletter" className="left"/>
            <button className="newsletter-btn left"></button>
          </div>
        </div>
        <div className="row footer-bottom">
          <div className="col-sm-12 col-md-4 footer-logo">
            <h4>luxestate</h4>
            <p>© 2019 - luxestate,<br/>All Right Reserved</p>
          </div>
          <div className="col-sm-3 col-md-2 footer-column">
            <h5>LUXESTATE</h5>
            <a href="#">Agents</a>
            <a href="#">Hunters</a>
          </div>
          <div className="col-sm-3 col-md-2 footer-column">
            <h5>COMPANY</h5>
            <a href="#">About</a>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
            <a href="#">Social</a>
          </div>          
          <div className="col-sm-3 col-md-2 footer-column">
            <h5>PRODUCT</h5>
            <a href="#">Appartments</a>
            <a href="#">How It Works</a>
          </div>
          <div className="col-sm-3 col-md-2 footer-column">
            <h5>SERVICES</h5>
            <a href="#">Renting</a>
            <a href="#">Selling</a>
            <a href="#">Building</a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}