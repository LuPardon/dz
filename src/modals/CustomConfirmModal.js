import React from 'react';
import '../styles/custom_confirm_modal.css';

export default function CustomConfirmModal({ message, onConfirm, onCancel }) {
    return (
      <div className="custom-confirm-overlay">
        <div className="custom-confirm-dialog">
          <p>{message}</p>
          <div className="button-container">
            <button className='btn btn-primary' onClick={onConfirm}>Potvrdi</button>
            <button className='btn btn-danger' onClick={onCancel}>Odustani</button>
          </div>
        </div>
      </div>
    );
  }
