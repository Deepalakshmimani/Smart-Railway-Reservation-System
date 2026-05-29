import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">
          <h2>RailGo</h2>
          <p>
            Book train tickets easily, quickly, and securely across India.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/trains">Trains</a>
          <a href="/bookings">My Bookings</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-support">
          <h3>Support</h3>

          <p>📞 +91 98765 43210</p>
          <p>✉ support@railgo.com</p>
          <p>🕒 24/7 Customer Support</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 RailGo. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;