import axios from 'axios';
import { useState, useEffect } from 'react';
import CustomConfirmDialog from '../modals/CustomConfirmModal.js'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function ZAPTablica() {
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [osobaToDelete, setOsobaToDelete] = useState(null);

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
            <td>
                {osoba.ime} {osoba.prezime}
            </td>
            <td>{osoba.tip}</td>
            <td>{osoba.grad}</td>
            <td>
                <button className="btn btn-danger" onClick={() => promptDeleteZaposlenik(osoba)}>Obriši zaposlenika</button>
            </td>
        </tr>
    ));

    function promptDeleteZaposlenik(osoba) {
        setOsobaToDelete(osoba);
        setShowConfirmDialog(true);
    }

    function confirmDelete() {
        setShowConfirmDialog(false);
        obrisiZaposlenika()
    }

    function cancelDelete() {
        setShowConfirmDialog(false);
    }

    function obrisiZaposlenika() {
        axios.delete(`http://localhost/KV/dzdb/deleteZaposlenik.php?id=${osobaToDelete.id}`)
            .then(response => {
                console.log(`delete response ===> ${response.data}`);
                // Refresh the data after delete
                getData();
            })
            .catch(error => {
                console.error('Error deleting zaposlenik:', error);
            });
    }

    // Renderiranje tablice s filtriranim podacima
    function handleSearch(event) {
        setSearchQuery(event.target.value);
    }

    return (
        <>
            {showConfirmDialog && (
                <CustomConfirmDialog
                    message={`Jeste li sigurni da želite obrisati zaposlenika ${osobaToDelete.ime} ${osobaToDelete.prezime}?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </>
    );
}
