import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';

export default function Navigation(props) {
    const [prijavljen, setPrijavljen] = useState(false);
    const navigate = useNavigate();

    const handleOdjava = () => {
     props.postaviPrijavu();
      navigate('/');
    };
  
  
  return(
  <>
  <nav className="navbar navbar-expand-lg bg-body-tertiary" >
  <div className="container-fluid bg-active">
    <Link className="navbar-brand" to="/">Domovi Zdravlja</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/">Svi domovi zdravlja</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/zaposlenici" >Svi zaposlenici</Link>
        </li>
        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Djelatnosti po gradu
          </Link>
          <div id="unutra">
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" to="/4zadatak/Virovitica" >Virovitica</Link></li>
            <li><Link className="dropdown-item" to="/4zadatak/Osijek" >Osijek</Link></li>
            <li><Link className="dropdown-item" to="/4zadatak/Zagreb" >Zagreb</Link></li>
            <li><Link className="dropdown-item" to="/4zadatak/Zadar" >Zadar</Link></li>
            <li><Link className="dropdown-item" to="/4zadatak/Split" >Split</Link></li>
            <li><Link className="dropdown-item" to='/4zadatak/Čakovec'>Čakovec</Link></li>
            <li><Link className="dropdown-item" to="/4zadatak/Poreč" >Poreč</Link></li>
            <li><Link className="dropdown-item" to="/4zadatak/Sisak" >Sisak</Link></li>
          </ul>
          </div>
        </li>

        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/djelatnosti">
            Djelatnosti po gradovima
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/ordinacije" >Ordinacije po gradovima</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/stat" >Statistika djelatnosti</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/dodaj" >Dodaj doktora/sestru</Link>
        </li>
        </ul>

        {!prijavljen ? (
        <button className="btn btn-danger" onClick={handleOdjava}>
        Odjava
      </button>) : (
      <Link className="btn btn-primary" to="/prijava">
                Prijava
              </Link>
            )}
    </div>
  </div>
</nav>
  </>
  );
}