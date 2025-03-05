'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isBiased: boolean;
  biasReason: string | null;
  createdAt: string;
  giver: {
    id: string;
    name: string;
    image: string;
  };
  job: {
    id: string;
    title: string;
  };
}

interface Vote {
  id: string;
  value: number;
  giver: {
    id: string;
    name: string;
  };
}

interface Stats {
  averageRating: number;
  totalReviews: number;
  voteScore: number;
  totalVotes: number;
}

interface ReviewsSectionProps {
  userId: string;
  jobId?: string;
}

export function ReviewsSection({ userId, jobId }: ReviewsSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({
    averageRating: 0,
    totalReviews: 0,
    voteScore: 0,
    totalVotes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (value: number) => {
    if (!session) return;

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value,
          receiverId: userId,
          jobId,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit vote');
      
      // Refresh the reviews and stats
      fetchReviews();
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !jobId) return;

    try {
      const response = await fetch(`/api/reviews/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          jobId,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  if (isLoading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalReviews}
            </div>
            <div className="text-sm text-gray-500">Total Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.voteScore}
            </div>
            <div className="text-sm text-gray-500">Vote Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalVotes}
            </div>
            <div className="text-sm text-gray-500">Total Votes</div>
          </div>
        </div>
      </div>

      {/* Voting Section */}
      {session && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleVote(1)}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100"
          >
            <ThumbsUp className="w-5 h-5" />
            <span>Upvote</span>
          </button>
          <button
            onClick={() => handleVote(-1)}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
          >
            <ThumbsDown className="w-5 h-5" />
            <span>Downvote</span>
          </button>
        </div>
      )}

      {/* Review Form */}
      {session && jobId && (
        <div className="bg-white rounded-lg shadow p-6">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="flex space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`${
                        star <= newReview.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {review.giver.image && (
                  <img
                    src={review.giver.image}
                    alt={review.giver.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {review.giver.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              {review.isBiased && (
                <div className="mb-2 flex items-center text-yellow-600 bg-yellow-50 p-2 rounded">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    This review has been flagged as potentially biased
                  </span>
                </div>
              )}
              <p className="text-gray-600">{review.comment}</p>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Review for: {review.job.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 