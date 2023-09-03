import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

export default function DodajDoktoraSestru() {
    const [ordinacije, setOrdinacije] = useState([]);

    useEffect(() => {
        axios.get('http://localhost/KV/dzdb/ordinacija.php')
            .then(response => {
                // console.log(`ORDINACIJE ===> `, JSON.stringify(response, null, 2));
                setOrdinacije(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const imeRef = useRef('');
    const prezimeRef = useRef('');
    const spolRef = useRef('');
    const oibRef = useRef('');
    const adresaRef = useRef('');
    const gradRef = useRef('');
    const broj_telefonaRef = useRef('');
    const mail_adresaRef = useRef();
    const ordRef = useRef('');
    const tipRef = useRef('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(imeRef.current.value);
        console.log(prezimeRef.current.value);
        console.log(oibRef.current.value);
        console.log(spolRef.current.value);
        console.log(adresaRef.current.value);
        console.log(gradRef.current.value);
        console.log(broj_telefonaRef.current.value);
        console.log(mail_adresaRef.current.value);
        console.log(ordRef.current.value);
        console.log(tipRef.current.value);

        axios.post('http://localhost/KV/dzdb/dodajdok.php', {
            ime: imeRef.current.value,
            prezime: prezimeRef.current.value,
            oib: oibRef.current.value,
            spol: spolRef.current.value,
            adresa: adresaRef.current.value,
            grad: gradRef.current.value,
            broj_telefona: broj_telefonaRef.current.value,
            mail_adresa: mail_adresaRef.current.value,
            id_ordinacija: ordRef.current.value,
            tip: tipRef.current.value
        });

        // Resetiranje vrijednosti polja na prazan string
        imeRef.current.value = '';
        prezimeRef.current.value = '';
        spolRef.current.value = '';
        oibRef.current.value = '';
        adresaRef.current.value = '';
        gradRef.current.value = '';
        broj_telefonaRef.current.value = '';
        mail_adresaRef.current.value = '';
        ordRef.current.value = '';
        tipRef.current.value = '';
    };

    return (
        <div className="container mt-3">
            <h2>Dodaj doktora/sestru</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="ordinacija" className="form-label">Ordinacija:</label>
                    {/* <input type="text" className="form-control form-control-sm" id="ordinacija" ref={ordRef} /> */}
                    <select className="form-select form-select-sm" id="ordinacija" ref={ordRef}>
                        {ordinacije.map((ord, index) => (
                            <option key={index} value={ord.id_ordinacija}>
                                {ord.naziv} - {ord.dom_zdravlja.naziv} {/* Replace id_domzdravlja with the actual name when you fetch it */}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="ime" className="form-label">Ime:</label>
                    <input type="text" className="form-control form-control-sm" id="ime" ref={imeRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="prezime" className="form-label">Prezime:</label>
                    <input type="text" className="form-control form-control-sm" id="prezime" ref={prezimeRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="oib" className="form-label">OIB:</label>
                    <input type="text" className="form-control form-control-sm" id="oib" ref={oibRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="mail_adresa" className="form-label">Email:</label>
                    <input type="email" className="form-control form-control-sm" id="mail_adresa" ref={mail_adresaRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="spol" className="form-label">Spol:</label>
                    <select className="form-select form-select-sm" id="spol" ref={spolRef}>
                        <option value="m">Muško</option>
                        <option value="f">Žensko</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="grad" className="form-label">Grad:</label>
                    <input type="text" className="form-control form-control-sm" id="grad" ref={gradRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="adresa" className="form-label">Adresa:</label>
                    <input type="text" className="form-control form-control-sm" id="adresa" ref={adresaRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="broj_telefona" className="form-label">Broj telefona:</label>
                    <input type="tel" className="form-control form-control-sm" id="broj_telefona" ref={broj_telefonaRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="tip" className="form-label">Zanimanje:</label>
                    <select className="form-select form-select-sm" id="tip" ref={tipRef}>
                        <option value="Doktor">Doktor/Doktorica</option>
                        <option value="Med.sestra">Medicinska sestra</option>
                        <option value="Tehničar">Medicinski tehničar</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary ">Dodaj</button>
            </form>
        </div>
    );
}
