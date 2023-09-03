import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import './styles/App.css';
import './routes/DZTablica.js';
import DZTablica from './routes/DZTablica.js';
import Navigation from './routes/Navigation';
import DpGTablica from './routes/DpGTablica'
import ZAPTablica from './routes/ZAPTablica';
import DodajDoktoraSestru from './routes/DodajDok';
import Statistika from './routes/Statistika';
import Prijava from './routes/Prijava';
import DjelatnostiPoGradu from './routes/DjelatnostiPoGradu';
import DetaljiDomZdravlja from './routes/DetaljiDomZdravlja';
import OrdinacijePoGradu from './routes/OrdinacijePoGradu';

function App() {

  useEffect(() => {
    const isPrijavljen = localStorage.getItem('prijavljen');
    if (isPrijavljen === 'true') {
      setPrijavljen(true);
    }
  }, []);

  const posPrijavu = async () => {
    setPrijavljen(!prijavljen)
  }
  let [prijavljen, setPrijavljen] = useState(false);
  let poruka = "";

  const handlePrijava = async (e) => {
    e.preventDefault();
    let form = document.querySelector('form');

    try {
      let korisnickoIme = form['korisnickoIme'].value;
      let lozinka = form['lozinka'].value;
      console.log(korisnickoIme, lozinka);
      const response = await axios.post('http://localhost/KV/dzdb/prijava.php', {
        korisnickoIme,
        lozinka,
      }).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          setPrijavljen(true);
          localStorage.setItem('prijavljen', 'true');
          localStorage.setItem('idKorisnika', response.data.prijava_podaci.id_korisnika);
          localStorage.setItem('korisnickoIme', korisnickoIme);
          localStorage.setItem('tipKorisnika', response.data.osoba_podaci.tip);
          localStorage.setItem('imeKorisnika', response.data.osoba_podaci.ime);
          poruka = 'Uspjeh';
        } else {
          poruka = 'Greška';
          alert('Netocni podaci za prijavu, molimo pokusajte ponovno.');
          localStorage.clear();
        }
      });
      console.log(prijavljen);
    } catch (error) {
      console.log('Greška prilikom prijave:', error);
    }
  };
  return (<><div className='sve'>
    {!prijavljen &&
      <form onSubmit={handlePrijava}>
        <h2>Prijava</h2>
        <div>
          <label htmlFor="korisnickoIme">Korisničko ime:</label>
          <input
            type="text"
            id="korisnickoIme"
            name="korisnickoIme"
          />
        </div>
        <div>
          <label htmlFor="lozinka">Lozinka:</label>
          <input
            type="password"
            id="lozinka"
            name="lozinka"
          />
        </div>
        <button type="submit">Prijavi se</button>
        <p>{poruka}</p>
      </form>
    }
    {prijavljen &&
      <BrowserRouter>
        <Navigation postaviPrijavu={posPrijavu} />
        <Routes>
          <Route path='/zaposlenici' element={<ZAPTablica />} />
          <Route path='/' element={<DZTablica />} />
          <Route path='/dodaj' element={<DodajDoktoraSestru />} />
          <Route path='/stat' element={<Statistika />} />
          <Route path='/djelatnosti' element={<DpGTablica />}></Route>
          <Route path='/prijava' element={<Prijava />} />
          <Route path='/4zadatak/:grad' element={<DjelatnostiPoGradu />} />
          <Route path='/dom_zdravlja/detalji/:domId' element={<DetaljiDomZdravlja />} />
          <Route path="/ordinacije" element={<OrdinacijePoGradu />} />
        </Routes>
      </BrowserRouter>}
  </div></>);
}

export default App;
