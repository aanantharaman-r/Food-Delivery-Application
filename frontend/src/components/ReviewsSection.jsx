import React, { useState } from 'react'
import { Star, ThumbsUp, CheckCircle2, MessageSquarePlus } from 'lucide-react'
import { DUMMY_REVIEWS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

export const ReviewsSection = ({ restaurantName }) => {
  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()
  const [reviews, setReviews] = useState(DUMMY_REVIEWS)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newRev = {
      id: Date.now(),
      user: isLoggedIn ? user.name : 'Happy Foodie',
      avatar: isLoggedIn ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim()
    }

    setReviews([newRev, ...reviews])
    setNewComment('')
    setNewRating(5)
    showToast({
      title: 'Review Posted!',
      description: 'Thank you for your valuable feedback.',
      variant: 'success'
    })
  }

  // Calculate rating stats
  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1)

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            Ratings & Customer Reviews
          </h3>
          <p className="text-xs text-slate-500">
            Real feedback from verified diners at {restaurantName || 'this restaurant'}
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-4 bg-orange-50/60 border border-orange-100 p-4 rounded-2xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-orange-600 leading-none">{averageRating}</span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">{reviews.length} total reviews</span>
          </div>
        </div>
      </div>

      {/* Write a review form */}
      <form onSubmit={handleSubmitReview} className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-slate-800">Write a Review</span>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setNewRating(num)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-4 h-4 ${
                    num <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-slate-700 ml-1">{newRating}.0</span>
          </div>
        </div>

        <textarea
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your taste, food temperature, packaging experience..."
          className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
        />

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Post Review
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.user}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{rev.user}</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Verified Order
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsSection
