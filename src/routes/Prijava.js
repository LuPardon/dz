import React, { useState } from 'react';
import axios from 'axios';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import "../styles/Prijava.css";

export default function Prijava() {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [prijavljen, setPrijavljen] = useState(false);
  const [poruka, setPoruka] = useState('');

  const handlePrijava = async (e) => {
    e.preventDefault();

    try {
      console.log(korisnickoIme, lozinka);
      const response = await axios.post('http://localhost/KV/dzdb/prijava.php', {
        korisnickoIme,
        lozinka,
      });

      if (response.data.success) {
        setPrijavljen(true);
        setPoruka('uspijeh');
      } else {
        setPoruka('Greška');
      }
    } catch (error) {
      console.log('Greška prilikom prijave:', error);
    }
  };

  const handleOdjava = () => {
    setPrijavljen(false);
    setPoruka('');
  };

  return (
    <div className="prijava-container">
    {prijavljen ? (
        <div>
          <h2>Prijavljeni ste!</h2>
          <button onClick={handleOdjava}>Odjava</button>
        </div>
      ) : (
        <form onSubmit={handlePrijava}>
          <h2>Prijava</h2>
          <div className='form_input'>
            <label htmlFor="korisnickoIme">Korisničko ime:</label>
            <input
              type="text"
              id="korisnickoIme"
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
            />
          </div>
          <div className='form_input'>
            <label htmlFor="lozinka">Lozinka:</label>
            <input
              type="password"
              id="lozinka"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
            />
          </div>
          <button type="submit">Prijavi se</button>
          <p>{poruka}</p>
        </form>
      )}
    </div>
  );
}
