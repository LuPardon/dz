import axios from 'axios';
import { useState, useEffect } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function Statistika() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await axios.get('http://localhost/KV/dzdb/domovi.php');
      setData(response.data);
    } catch (error) {
      console.error('Greška prilikom dohvata podataka:', error);
    }
  }

  if (!data) return null;

  // Kreiranje objekta koji će sadržavati podatke o djelatnostima i gradovima
  const statistika = {};
  const sviGradovi = ['Osijek', 'Zagreb', 'Čakovec', 'Virovitica', 'Split', 'Zadar', 'Sisak', 'Poreč'];

  data.forEach((dom) => {
    if (dom.ord && dom.ord.length > 0) {
      dom.ord.forEach((ordinacija) => {
        const djelatnost = ordinacija.djelatnost?.naziv;
        if (djelatnost && !statistika[djelatnost]) {
          statistika[djelatnost] = new Set();
        }
        const grad = dom.grad; // Promjena ovdje, koristi se dom.grad umjesto osoba.grad
        if (djelatnost && grad) {
          statistika[djelatnost].add(grad);
        }
      });
    }
  });

  // Priprema podataka za prikaz u tablici
  const filteredData = Object.entries(statistika).filter(([djelatnost]) =>
    djelatnost.toUpperCase().includes(searchQuery.toUpperCase())
  );

  const prikazStatistike = filteredData.map(([djelatnost, gradovi], index) => {
    const dostupniGradovi = Array.from(gradovi);
    const nedostupniGradovi = sviGradovi.filter((grad) => !gradovi.has(grad));
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{djelatnost}</td>
        <td>{dostupniGradovi.join(', ')}</td>
        <td>{nedostupniGradovi.join(', ')}</td>
      </tr>
    );
  });

  // Renderiranje tablice s filtriranim podacima
  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

  return (
    <>
      <h2>Statistika djelatnosti</h2>
      <input
        type="text"
        id="myInput"
        onChange={handleSearch}
        value={searchQuery}
        placeholder="Pretraži..."
      />

      {/* Tablica */}
      <table className="table table-active">
        <thead>
          <tr>
            <th>R.br.</th>
            <th>Djelatnost</th>
            <th>Dostupni gradovi</th>
            <th>Nedostupni gradovi</th>
          </tr>
        </thead>
        <tbody>{prikazStatistike}</tbody>
      </table>
    </>
  );
}
