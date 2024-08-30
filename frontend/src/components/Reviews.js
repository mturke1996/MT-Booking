import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reviews.css'; // افترض أننا أضفنا بعض الأنماط في ملف Reviews.css

const Reviews = ({ apartmentId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ bewertung: 5, kommentar: '' });
  const [user, setUser] = useState(null);

  // تحميل بيانات المستخدم من localStorage عند تحميل المكون
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  // تحميل التقييمات عند تحميل المكون
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // جلب التقييمات من الخادم
        const reviewsResponse = await axios.get(`https://mt-booking.onrender.com/api/reviews?apartmentId=${apartmentId}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [apartmentId]);

  // إرسال تقييم جديد
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      const response = await axios.post(`https://mt-booking.onrender.com/api/reviews`, {
        apartmentId: apartmentId,
        benutzerId: user._id, // إرسال معرف المستخدم
        bewertung: newReview.bewertung,
        kommentar: newReview.kommentar
      });

      setReviews([...reviews, response.data]); // إضافة التقييم الجديد إلى القائمة
      setNewReview({ bewertung: 5, kommentar: '' }); // إعادة تعيين النموذج
    } catch (error) {
      console.error('Error posting review:', error);
      alert('Failed to submit review. Please try again later.');
    }
  };

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">Bewertungen</h3>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review._id} className="review-card">
            <p className="review-comment">{review.kommentar}</p>
            <p className="review-rating">Bewertung: {review.bewertung} / 5</p>
            <p className="review-username">By: {user.username}</p>
          </div>
        ))
      ) : (
        <p className="no-reviews">Keine Bewertungen vorhanden.</p>
      )}
      <form onSubmit={handleSubmit} className="review-form">
        <textarea
          value={newReview.kommentar}
          onChange={e => setNewReview({ ...newReview, kommentar: e.target.value })}
          placeholder="Deine Bewertung"
          className="review-textarea"
        />
        <div className="review-rating-container">
          <label htmlFor="bewertung" className="review-rating-label">Bewertung:</label>
          <input
            type="number"
            id="bewertung"
            value={newReview.bewertung}
            onChange={e => setNewReview({ ...newReview, bewertung: parseInt(e.target.value, 10) })}
            min="1"
            max="5"
            className="review-rating-input"
          />
        </div>
        <button type="submit" className="review-submit-button">Bewertung abgeben</button>
      </form>
    </div>
  );
};

export default Reviews;
