import React, { useState } from 'react';
import { submitFeedback } from '../../services/api';

export default function FeedbackForm({ bookingId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    submitFeedback(bookingId, rating, comment)
      .then(() => {
        alert('Thank you for your feedback!');
        onClose();
      })
      .catch(err => alert('Error submitting feedback'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 top-safe">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">Leave Feedback</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 text-sm sm:text-base"
            >
              {[5,4,3,2,1].map(r => (
                <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 text-sm sm:text-base"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 sm:py-3 rounded font-medium hover:bg-secondary disabled:bg-gray-400 transition min-h-[44px] text-sm sm:text-base active:scale-95 sm:active:scale-100"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded font-medium hover:bg-gray-400 transition min-h-[44px] text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}