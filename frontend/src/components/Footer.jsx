import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-gradient-to-b from-rose-100 to-rose-200 text-base-content">
      <div>
        <span className="footer-title">Pages</span>
        <Link className="link link-hover" to="/coming-soon">About</Link>
        <Link className="link link-hover" to="/coming-soon">Terms & Privacy</Link>
        <Link className="link link-hover" to="/coming-soon">Contact</Link>
      </div>
      <div>
        <span className="footer-title">Follow</span>
        <Link className="link link-hover" to="/coming-soon">Facebook</Link>
        <Link className="link link-hover" to="/coming-soon">LinkedIn</Link>
      </div>
    </footer>
  );
};

export default Footer;