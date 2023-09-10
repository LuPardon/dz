import React, { useState } from 'react';
import '../styles/add_ordinacija_modal.css';

export default function AddDomZdravljaModal({ onConfirm, onCancel }) {
    const [formData, setFormData] = useState({
        naziv: '',
        grad: '',
        adresa: '',
        mail: '',
        broj_telefona: '',
    });

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
                    <label>Naziv</label>
                    <input type="text" name="naziv" value={formData.naziv} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Grad</label>
                    <input type="text" name="grad" value={formData.grad} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Adresa</label>
                    <input type="text" name="adresa" value={formData.adresa} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>E-mail adresa</label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Broj telefona</label>
                    <input type="tel" name="broj_telefona" value={formData.broj_telefona} onChange={handleChange} />
                </div>
                <div className="button-container">
                    <button className='btn btn-primary' onClick={() => onConfirm(formData)}>Spremi</button>
                    <button className='btn btn-danger' onClick={onCancel}>Odustani</button>
                </div>
            </div>
        </div>
    );
}
