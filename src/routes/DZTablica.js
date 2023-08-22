import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import "../styles/dz_tablica.css";
// import { Accordion, Card, Button } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function DZTablica() {
    const [data, setData] = useState(null);
    const [domovi, setDomovi] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getData();
        getDomovi();
    }, []);
    
    async function getDomovi() {
        axios.get("http://localhost/KV/dzdb/domovi.php").then((response) => {
            setDomovi(response.data);
        });
    }

    async function getData() {
        axios.get("http://localhost/KV/dzdb/domovi.php").then((response) => {
            setData(response.data);
        });
    }

    if (!data) return null;

    let counter = 1;

    const groupedData = groupDataByCity(data);

    const filteredData = groupedData.filter((group) => {
        const searchValue = searchQuery.toUpperCase();
        return (
            group.city.toUpperCase().includes(searchValue) ||
            group.totalEmployees.toString().includes(searchValue)
        );
    });

    const tableRows = filteredData.map((group, index) => {
        const cityDomovi = domovi.filter(dom => dom.grad ===group.city);
        return ( 
            <Fragment  key={group.city}>
                <tr onClick={() => {
                    const element = document.getElementById(`collapse-${index}`);
                    if (element) {
                        element.classList.toggle('show');
                    }
                }}>
                    <td>{counter++}</td>
                    <td>{group.city}</td>
                    <td>
                        {group.totalEmployees}
                    </td>
                </tr>
                <tr id={`collapse-${index}`} className="collapse">
                    <td colSpan="3">
                        {cityDomovi.map(dom => (
                        //    <button 
                        //         key={dom.id_domzdravlja} 
                        //         onClick={() => console.log(dom.naziv)}
                        //         className="domovi-button"
                        //     >
                        //         {dom.naziv}
                        //     </button>
                            <Link className="domovi-button" to={`/dom_zdravlja/detalji/${dom.id_domzdravlja}`}>  {dom.naziv}</Link>
                            
                        ))}
                    </td>
                </tr>
            </Fragment>
        );
    });
    

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

    function handleSearch(event) {
        setSearchQuery(event.target.value.toUpperCase());
    }

    return (
        <>
            {/* Search Input */}
            <input
                type="text"
                id="myInput"
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Pretraži..."
            />

            {/* Table */}
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
