import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function DjelatnostiPoGradu() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { grad } = useParams();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get("http://localhost/KV/dzdb/domovi.php");
            setData(response.data);
            console.log('citanje data', response.data);
        } catch (error) {
            console.error("Greška pri dohvaćanju podataka:", error);
        }
    }

    function PostaviRetke() {
        let redakData2 = [];
        data.forEach((domZdravlja) => {
            if (grad === domZdravlja.grad) {
                domZdravlja.ord.forEach((ordinacija2) => {
                    let praviDoktor = '-';
                    let pravaSestra = '-';
                    let praviTehnicar = '-';
                    ordinacija2.oOsobe.forEach((osoba) => {
                        if (osoba.tip === 'Doktor') praviDoktor = osoba.ime;
                        else if (osoba.tip === 'Med.sestra') pravaSestra = osoba.ime;
                        else if (osoba.tip === 'Tehničar') praviTehnicar = osoba.ime;
                    });
                    redakData2.push({
                        id: ordinacija2.id_ordinacija,
                        djelatnost: ordinacija2.djelatnost.naziv,
                        doktor: praviDoktor,
                        sestra: pravaSestra,
                        tehnicar: praviTehnicar
                    });
                });
            }
        });

        return redakData2;
    }

    function handleSearch(event) {
        setSearchQuery(event.target.value);
    }

    const filteredRows = PostaviRetke().filter((item) => {
        const searchValue = searchQuery.toUpperCase();
        const itemValues = Object.values(item).map((value) =>
            typeof value === "string" ? value.toUpperCase() : value
        );
        return itemValues.some((value) => {
            if (typeof value === "string") {
                return value.includes(searchValue);
            }
            return false;
        });
    });

    const tableRows = filteredRows.map((item, index) => (
        <tr key={item.id}>
            <td>{index + 1}</td>
            <td>{item.djelatnost}</td>
            <td>{item.doktor}</td>
            <td>{item.sestra}</td>
            <td>{item.tehnicar}</td>
        </tr>
    ));

    return (
        <>
            <h2>{grad}</h2>
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
                        <th>R.br.</th>
                        <th>Djelatnost</th>
                        <th>Doktor</th>
                        <th>Med. sestra/brat</th>
                        <th>Tehničar</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </>
    );
}
