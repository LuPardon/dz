import axios from 'axios';
import { useState, useEffect } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function DpGTablica() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    axios.get("http://localhost/KV/dzdb/domovi.php").then((response) => {
      setData(response.data);
    });
  }

  if (!data) return null;

  let br = 0;
  const djelatnostiPoGradovima = {};

  data.forEach((dom) => {
    const grad = dom.grad;
    if (!djelatnostiPoGradovima[grad]) {
      djelatnostiPoGradovima[grad] = [];
    }
    dom.ord.forEach((ordinacija) => {
      djelatnostiPoGradovima[grad].push(ordinacija.djelatnost.naziv);
    });
  });

  const filteredData = Object.entries(djelatnostiPoGradovima).filter(([grad, djelatnosti]) => {
    const searchValue = searchTerm.toUpperCase();
    return (
      grad.toUpperCase().includes(searchValue) ||
      djelatnosti.join(", ").toUpperCase().includes(searchValue)
    );
  });

  const sadrzaj = filteredData.map(([grad, djelatnosti], index) => {
    br++;
    return (
      <tr key={index}>
        <td>{br}</td>
        <td>{`Dom zdravlja ${grad}`}</td>
        <td>{djelatnosti.join(", ")}</td>
      </tr>
    );
  });

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div>
      <h2>Djelatnosti po gradovima</h2>
      <input
        type="text"
        id="myInput"
        onChange={handleSearch}
        value={searchTerm}
        placeholder="Pretraži..."
      />
      <table className="table table-active">
        <thead>
          <tr>
            <th>R.br.</th>
            <th>Dom zdravlja</th>
            <th>Djelatnost</th>
          </tr>
        </thead>
        <tbody>{sadrzaj}</tbody>
      </table>
    </div>
  );
}
