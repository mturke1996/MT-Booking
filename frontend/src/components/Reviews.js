import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = ({ apartmentId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ bewertung: 5, kommentar: '', benutzerId: '' }); // إضافة benutzerId هنا
  const [user, setUser] = useState(null);

  useEffect(() => {
    // جلب المستخدم من الـ localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    // جلب التقييمات من الخادم
    axios.get(`http://localhost:5000/api/apartments/${apartmentId}/reviews`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, [apartmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to submit a review.');
      return;
    }

    axios.post(`http://localhost:5000/api/apartments/${apartmentId}/reviews`, {
      benutzerId: user.username, // استخدام اسم المستخدم مباشرة من user
      bewertung: newReview.bewertung,
      kommentar: newReview.kommentar
    })
      .then(response => {
        setReviews([...reviews, response.data]);
        setNewReview({ bewertung: 5, kommentar: '', benutzerId: '' }); // إعادة تعيين benutzerId
      })
      .catch(error => {
        console.error('Error posting review:', error);
      });
  };

  return (
    <div className="reviews-container">
      <h3 className="text-2xl font-semibold mb-4">Bewertungen</h3>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.bewertungId} className="review-card mb-4 p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-800 mb-2">{review.kommentar}</p>
            <p className="text-yellow-500 font-bold">Bewertung: {review.bewertung} / 5</p>
            <p className="text-gray-600">By: {review.benutzerId}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Keine Bewertungen vorhanden.</p>
      )}
      <form onSubmit={handleSubmit} className="review-form mt-6 p-4 bg-white rounded-lg shadow-md">
        <textarea
          value={newReview.kommentar}
          onChange={e => setNewReview({ ...newReview, kommentar: e.target.value })}
          placeholder="Deine Bewertung"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <div className="flex items-center mb-2">
          <label htmlFor="bewertung" className="mr-2">Bewertung:</label>
          <input
            type="number"
            id="bewertung"
            value={newReview.bewertung}
            onChange={e => setNewReview({ ...newReview, bewertung: parseInt(e.target.value, 10) })}
            min="1"
            max="5"
            className="w-16 p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Bewertung abgeben</button>
      </form>
    </div>
  );
};

export default Reviews;
