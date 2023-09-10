import axios from "axios";
import { useState, useEffect, Fragment } from 'react';
import AddOrdinacijaModal from '../modals/AddOrdinacijaModal.js';
import '../styles/ordinacije_po_gradu.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function OrdinacijePoGradu() {
    const [ordinacijeData, setOrdinacijeData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [domoviData, setDomoviData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);

    const openModal = (cityName) => {
        setSelectedCity(cityName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = async (formData) => {
        console.log('Form data:', formData);
        try {
            const response = await axios.post("http://localhost/KV/dzdb/add_ordinacija.php", formData);
            if(response.data.message) {
                alert(response.data.message);
            } else {
                closeModal();
                alert("Ordinacija uspješno dodana!");
                fetchOrdinacijeData();
            }
        } catch (error) {
            console.error("Error adding ordinacija:", error);
            alert("Pogreška pri dodavanju ordinacije. Molimo pokušajte ponovno.");
        }
    };

    useEffect(() => {
        fetchDomoviData();
        fetchOrdinacijeData();
    }, []);

    async function fetchDomoviData() {
        try {
            const response = await axios.get("http://localhost/KV/dzdb/domovi.php");
            setDomoviData(response.data);
        } catch (error) {
            console.error("Error fetching domovi data:", error);
        }
    }

    async function fetchOrdinacijeData() {
        try {
            const response = await axios.get("http://localhost/KV/dzdb/ordinacija.php");
            setOrdinacijeData(response.data);
            console.log(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function groupByCity() {
        const grouped = {};
    
        const allCities = [...new Set(domoviData.map(dom => dom.grad))];
    
        allCities.forEach(city => {
            grouped[city] = ordinacijeData.filter(ordinacija => {
                const domZdravlja = domoviData.find(dom => dom.id_domzdravlja === ordinacija.id_domzdravlja);
                return domZdravlja && domZdravlja.grad === city;
            });
        });
    
        for (const city in grouped) {
            grouped[city] = grouped[city].filter(ordinacija => {
                const domZdravlja = domoviData.find(dom => dom.id_domzdravlja === ordinacija.id_domzdravlja);
                const grad = domZdravlja ? domZdravlja.grad : "Nedostupno";
                return grad.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.naziv.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.opis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.adresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.djelatnost.naziv.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.broj_telefona.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.mail_adresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.radno_vrijeme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ordinacija.napomena.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }
    
        return grouped;
    }

    const groupedByCity = groupByCity();

    const tableRows = Object.entries(groupedByCity).map(([city, ordinacije], index) => (
        <Fragment key={city}>
            <tr onClick={() => {
                const element = document.getElementById(`collapse-${index}`);
                if (element) {
                    element.classList.toggle('show');
                }
            }}>
                <td id="ordinacija_grad"><span>{city}</span><button id="add_ordinacija" className="btn btn-dark" 
                onClick={(e) => {
                    e.stopPropagation();
                    openModal(city);
                    console.log('CLICKED ADD BUTTON');
                }}>+</button></td>

            </tr>
            <tr id={`collapse-${index}`} className="collapse">
                <td>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Dom zdravlja </th>
                                <th>Naziv</th>
                                <th>Opis</th>
                                <th>Adresa</th>
                                <th>Djelatnost</th>
                                <th>Broj telefona</th>
                                <th>Email</th>
                                <th>Radno vrijeme</th>
                                <th>Napomena</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordinacije.map(ordinacija =>
                            // <tr key={ordinacija.id_ordinacija}>
                            //     {/* <td>{domZdravljaNaziv}</td> */}
                            //     <td>{ordinacija.naziv}</td>
                            //     <td>{ordinacija.opis}</td>
                            //     <td>{ordinacija.adresa}</td>
                            //     <td>{ordinacija.djelatnost.naziv}</td>
                            //     <td>{ordinacija.broj_telefona}</td>
                            //     <td>{ordinacija.mail_adresa}</td>
                            //     <td>{ordinacija.radno_vrijeme}</td>
                            //     <td>{ordinacija.napomena}</td>
                            // </tr>
                            {
                                const domZdravlja = domoviData.find(dom => dom.id_domzdravlja === ordinacija.id_domzdravlja);
                                const domZdravljaNaziv = domZdravlja ? domZdravlja.naziv : "N/A";

                                return (
                                    <tr key={ordinacija.id_ordinacija}>
                                        <td>{domZdravljaNaziv}</td>
                                        <td>{ordinacija.naziv}</td>
                                        <td>{ordinacija.opis}</td>
                                        <td>{ordinacija.adresa}</td>
                                        <td>{ordinacija.djelatnost.naziv}</td>
                                        <td>{ordinacija.broj_telefona}</td>
                                        <td>{ordinacija.mail_adresa}</td>
                                        <td>{ordinacija.radno_vrijeme}</td>
                                        <td>{ordinacija.napomena}</td>
                                    </tr>
                                );
                            }
                            )}
                        </tbody>
                    </table>
                </td>
            </tr>
        </Fragment>
    ));

    function handleSearch(event) {
        setSearchQuery(event.target.value);
    }

    return (
        <>
            <h2>Ordinacije</h2>
            <input
                type="text"
                id="myInput"
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Pretraži..."
            />
            <table className="table table-active">
                <thead>
                    <tr>
                        <th>Grad</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
            {isModalOpen && (
                <AddOrdinacijaModal 
                    city={selectedCity}
                    onConfirm={handleConfirm} 
                    onCancel={closeModal} 
                />)}
        </>
    );
}