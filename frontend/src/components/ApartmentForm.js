import React, { useState } from 'react';
import axios from 'axios';
import './ApartmentForm.css';

const ApartmentForm = () => {
  const [formData, setFormData] = useState({
    Adresse: '',
    Zimmeranzahl: '',
    'Fläche (m²)': '',
    'Monatliche Miete': '',
    Status: '',
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    Beschreibung: '',
    Wohnungstyp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/apartments', formData);
      alert('Apartment added successfully: ' + response.data.message);
      setFormData({
        Adresse: '',
        Zimmeranzahl: '',
        'Fläche (m²)': '',
        'Monatliche Miete': '',
        Status: '',
        img1: '',
        img2: '',
        img3: '',
        img4: '',
        Beschreibung: '',
        Wohnungstyp: '',
      });
    } catch (error) {
      console.error('Error adding apartment:', error);
      alert('Failed to add apartment.');
    }
  };

  return (
    <div className="form-container">
      <h1>Add a New Apartment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Adresse">Adresse:</label>
        <input type="text" id="Adresse" name="Adresse" value={formData.Adresse} onChange={handleChange} required />

        <label htmlFor="Zimmeranzahl">Zimmeranzahl:</label>
        <input type="number" id="Zimmeranzahl" name="Zimmeranzahl" value={formData.Zimmeranzahl} onChange={handleChange} required />

        <label htmlFor="Fläche (m²)">Fläche (m²):</label>
        <input type="number" step="0.01" id="Fläche (m²)" name="Fläche (m²)" value={formData['Fläche (m²)']} onChange={handleChange} required />

        <label htmlFor="Monatliche Miete">Monatliche Miete:</label>
        <input type="number" step="0.01" id="Monatliche Miete" name="Monatliche Miete" value={formData['Monatliche Miete']} onChange={handleChange} required />

        <label htmlFor="Status">Status:</label>
        <input type="text" id="Status" name="Status" value={formData.Status} onChange={handleChange} required />

        <label htmlFor="img1">Image 1 URL:</label>
        <input type="text" id="img1" name="img1" value={formData.img1} onChange={handleChange} required />

        <label htmlFor="img2">Image 2 URL:</label>
        <input type="text" id="img2" name="img2" value={formData.img2} onChange={handleChange} required />

        <label htmlFor="img3">Image 3 URL:</label>
        <input type="text" id="img3" name="img3" value={formData.img3} onChange={handleChange} required />

        <label htmlFor="img4">Image 4 URL:</label>
        <input type="text" id="img4" name="img4" value={formData.img4} onChange={handleChange} required />

        <label htmlFor="Beschreibung">Beschreibung:</label>
        <textarea id="Beschreibung" name="Beschreibung" value={formData.Beschreibung} onChange={handleChange} required></textarea>

        <label htmlFor="Wohnungstyp">Wohnungstyp:</label>
        <input type="text" id="Wohnungstyp" name="Wohnungstyp" value={formData.Wohnungstyp} onChange={handleChange} required />

        <button type="submit">Add Apartment</button>
      </form>
    </div>
  );
};

export default ApartmentForm;
