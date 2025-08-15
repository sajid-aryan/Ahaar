import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-gradient-to-b from-rose-100 to-rose-200 text-base-content">
      <div>
        <span className="footer-title">Pages</span>
        <Link className="link link-hover" to="/about">About</Link>
        <Link className="link link-hover" to="/privacy">Terms & Privacy</Link>
        <Link className="link link-hover" to="/contact">Contact</Link>
      </div>
      <div>
        <span className="footer-title">Follow</span>
        <a className="link link-hover">Facebook</a>
        <a className="link link-hover">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;