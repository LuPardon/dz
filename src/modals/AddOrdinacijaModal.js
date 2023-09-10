import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../styles/add_ordinacija_modal.css';

export default function AddOrdinacijaModal({ city, onConfirm, onCancel }) {
    const [formData, setFormData] = useState({
        id_dom_zdravlja: '',
        naziv: '',
        opis: '',
        adresa: '',
        djelatnost: '',
        broj_telefona: '',
        mail_adresa: '',
        radno_vrijeme: '',
        napomena: '',
    });
    const [domoviData, setDomoviData] = useState([]);

    useEffect(() => {
        if (city) {
            fetchDomoviZdravlja(city);
        }
    }, [city]);

    async function fetchDomoviZdravlja(city) {
        try {
            const response = await axios.get(`http://localhost/KV/dzdb/domovi.php?city=${city}`);
            setDomoviData(response.data);
            if (response.data.length > 0) {
                setFormData(prevState => ({
                    ...prevState,
                    id_dom_zdravlja: response.data[0].id_domzdravlja,
                }));
            }
        } catch (error) {
            console.error("Error fetching domovi data:", error);
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="add-ordinacija-overlay">
            <div className="add-ordinacija-dialog">
                <div className="input-group">
                    <label>Dom zdravlja</label>
                    <select name="id_dom_zdravlja" value={formData.id_dom_zdravlja} onChange={handleChange}>
                        {domoviData.map(dom => (
                            <option key={dom.id_domzdravlja} value={dom.id_domzdravlja}>{dom.naziv}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label>Naziv</label>
                    <input type="text" name="naziv" value={formData.naziv} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Opis</label>
                    <input type="text" name="opis" value={formData.opis} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Adresa</label>
                    <input type="text" name="adresa" value={formData.adresa} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Djelatnost</label>
                    <select name="djelatnost" value={formData.djelatnost} onChange={handleChange}>
                        <option value="">--Odaberite--</option>
                        <option value="Pedijatrija">Pedijatrija</option>
                        <option value="Opća obiteljska medicina">Opća obiteljska medicina</option>
                        <option value="Zdravstvena zaštita žena">Zdravstvena zaštita žena</option>
                        <option value="Stomatologija">Stomatologija</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Broj telefona</label>
                    <input type="tel" name="broj_telefona" value={formData.broj_telefona} onChange={handleChange} pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
                </div>
                <div className="input-group">
                    <label>Mail adresa</label>
                    <input type="email" name="mail_adresa" value={formData.mail_adresa} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Radno vrijeme</label>
                    <input type="text" name="radno_vrijeme" value={formData.radno_vrijeme} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Napomena</label>
                    <input type="text" name="napomena" value={formData.napomena} onChange={handleChange} />
                </div>
                <div className="button-container">
                    <button className='btn btn-primary' onClick={() => onConfirm(formData)}>Spremi</button>
                    <button className='btn btn-danger' onClick={onCancel}>Odustani</button>
                </div>
            </div>
        </div>
    );
}
