import axios from "axios";
import { useState, useEffect, Fragment } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function OrdinacijePoGradu() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [domoviData, setDomoviData] = useState([]);

    useEffect(() => {
        fetchDomoviData();
        fetchData();
    }, []);

    async function fetchDomoviData() {
        try {
            const response = await axios.get("http://localhost/KV/dzdb/domovi.php");
            setDomoviData(response.data);
        } catch (error) {
            console.error("Error fetching domovi data:", error);
        }
    }

    async function fetchData() {
        try {
            const response = await axios.get("http://localhost/KV/dzdb/ordinacija.php");
            setData(response.data);
            console.log(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function groupByCity() {
        const grouped = {};
        data.forEach(ordinacija => {
            const domZdravlja = domoviData.find(dom => dom.id_domzdravlja === ordinacija.id_domzdravlja);
            const grad = domZdravlja ? domZdravlja.grad : "Unknown"; // Default to "Unknown" if not found

            if (!grouped[grad]) {
                grouped[grad] = [];
            }
            grouped[grad].push(ordinacija);
        });
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
                <td>{city}</td>
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
        setSearchQuery(event.target.value.toUpperCase());
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
        </>
    );
}