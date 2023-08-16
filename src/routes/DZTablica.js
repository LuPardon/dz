import axios from 'axios';
import { useState, useEffect } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function DZTablica() {
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        axios.get("http://localhost/KV/dzdb/domovi.php").then((response) => {
            setData(response.data);
        });
    }

    if (!data) return null;

    let counter = 1;

    // TABLICA DOMOVA ZDRAVLJA S BROJEM ZAPOSLENIKA PO GRADOVIMA
    const groupedData = groupDataByCity(data);

    const filteredData = groupedData.filter((group) => {
        const searchValue = searchQuery.toUpperCase();
        return (
            group.city.toUpperCase().includes(searchValue) ||
            group.totalEmployees.toString().includes(searchValue)
        );
    });

    const tableRows = filteredData.map((group) => (
        <tr key={group.city}>
            <td>{counter++}</td>
            <td>{group.city}</td>
            <td>{group.totalEmployees}</td>
        </tr>
    ));

    // Funkcija za grupiranje podataka po gradu i zbrajanje zaposlenika
    function groupDataByCity(data) {
        const groupedData = {};
        data.forEach((dom) => {
            if (!groupedData[dom.grad]) {
                groupedData[dom.grad] = {
                    city: dom.grad,
                    totalEmployees: dom.zaposlenici.length,
                };
            } else {
                groupedData[dom.grad].totalEmployees += dom.zaposlenici.length;
            }
        });
        return Object.values(groupedData);
    }

    // Renderiranje tablice s filtriranim podacima
    function handleSearch(event) {
        setSearchQuery(event.target.value.toUpperCase());
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
                        <th>R.BR. </th>
                        <th>GRAD </th>
                        <th>BROJ ZAPOSLENIKA </th>
                    </tr>


                    
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </>
    );
}
