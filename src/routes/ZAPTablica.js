import axios from 'axios';
import { useState, useEffect } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function ZAPTablica() {
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        axios.get('http://localhost/KV/dzdb/domovi.php').then((response) => {
            setData(response.data);
        });
    }

    if (!data) return null;

    let counter = 1;

    // TABLICA ZAPOSLENIKA PO DJELATNOSTIMA
    const sortedData = data.sort((a, b) => a.grad.localeCompare(b.grad));

    const filteredData = sortedData.flatMap((dom) =>
        dom.ord.flatMap((ordinacija) =>
            ordinacija.oOsobe.filter((osoba) =>
                osoba.ime.toUpperCase().includes(searchQuery.toUpperCase()) ||
                osoba.prezime.toUpperCase().includes(searchQuery.toUpperCase()) ||
                osoba.tip.toUpperCase().includes(searchQuery.toUpperCase()) ||
                osoba.grad.toUpperCase().includes(searchQuery.toUpperCase())
            )
        )
    );

    const tableRows = filteredData.map((osoba) => (
        <tr key={counter++}>
            <td>{counter}</td>
            <td>{osoba.ime} {osoba.prezime}</td>
            <td>{osoba.tip}</td>
            <td>{osoba.grad}</td>
        </tr>
    ));

    // Renderiranje tablice s filtriranim podacima
    function handleSearch(event) {
        setSearchQuery(event.target.value);
    }

    return (
        <>
            {/* Tražilica */}
            <input
                type="text"
                id="myInput"
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Pretraži..."
            />

            {/* Tablica */}
            <table className='table table-active'>
                <thead>
                    <tr>
                        <th>R.BR.</th>
                        <th>IME I PREZIME</th>
                        <th>TIP</th>
                        <th>GRAD</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </>
    );
}
