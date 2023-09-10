import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AddDomZdravljaModal from '../modals/AddDomZdravljaModal';
import "../styles/dz_tablica.css";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function DZTablica({fetchGradovi}) {
    const [domovi, setDomovi] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isDomModalOpen, setIsDomModalOpen] = useState(false);

    const openDomModal = () => {
        setIsDomModalOpen(true);
    };

    const closeDomModal = () => {
        setIsDomModalOpen(false);
    };

    const handleDomConfirm = async (formData) => {
        console.log('Form data:', formData);
        try {
            const response = await axios.post("http://localhost/KV/dzdb/add_dom_zdravlja.php", formData);
            
            if(response.data.error) {
                alert(response.data.message);
            } else {
                closeDomModal();
                alert(response.data.message);
                
                getDomovi();
                fetchGradovi();
            }
        } catch (error) {
            console.error("Error adding Dom zdravlja:", error);
            alert("Pogreška pri dodavanju doma zdravlja. Molimo pokušajte ponovno.");
        }
    };

    useEffect(() => {
        getDomovi();
    }, []);

    async function getDomovi() {
        axios.get("http://localhost/KV/dzdb/domovi.php").then((response) => {
            setDomovi(response.data);
        });
    }

    if (!domovi) return null;

    let counter = 1;

    const groupedData = groupDataByCity(domovi);

    const filteredData = groupedData.filter((group) => {
        const searchValue = searchQuery.toUpperCase();
        return (
            group.city.toUpperCase().includes(searchValue) ||
            group.totalEmployees.toString().includes(searchValue)
        );
    });

    const tableRows = filteredData.sort((a, b) => a.city.localeCompare(b.city)).map((group, index) => {
        if (domovi.length === 0) return;
        const cityDomovi = domovi.filter(dom => dom.grad == group.city);
        return (
            <Fragment key={group.city}>
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
                    {/* <td> */}
                        {/* <button className="btn btn-primary" onClick={openDomModal}>+</button> */}
                    {/* </td> */}
                </tr>
                <tr id={`collapse-${index}`} className="collapse">
                    <td colSpan="3">
                        {cityDomovi.map(dom => (
                            <Link key={dom.id_domzdravlja} className="domovi-button" to={`/dom_zdravlja/detalji/${dom.id_domzdravlja}`}>  {dom.naziv}</Link>
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
        setSearchQuery(event.target.value);
    }

    return (
        <>
            <h2>Svi domovi zdravlja</h2>
            <input
                type="text"
                id="myInput"
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Pretraži..."
            />
            <table className='table table-active'>
                <thead>
                    <tr>
                        <th>R.BR. </th>
                        <th>GRAD </th>
                        <th>BROJ ZAPOSLENIKA </th>
                    </tr>
                </thead>
                <tbody id='clickable_table'>{tableRows}</tbody>
            </table>
            <button id="add_dom_zdravlja" className="btn btn-dark" onClick={openDomModal}>+</button>
            {isDomModalOpen && (
                <AddDomZdravljaModal
                    onConfirm={handleDomConfirm}
                    onCancel={closeDomModal}
                />
            )}
        </>
    );
}
