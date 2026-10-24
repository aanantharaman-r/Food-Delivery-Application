
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, ArrowRight, UtensilsCrossed, Gift } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password) {
      showToast({
        title: 'Missing Details',
        description: 'Please fill in all required fields.',
        variant: 'error'
      })
      return
    }

    if (password.length < 8) {
      showToast({
        title: 'Weak Password',
        description: 'Password must contain at least 8 characters.',
        variant: 'error'
      })
      return
    }

    try {
      setLoading(true)

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone
      })

      showToast({
        title: 'Registration Successful!',
        description: 'Your account has been created. Please log in.',
        variant: 'success'
      })

      navigate('/login')
    } catch (error) {
      showToast({
        title: 'Registration Failed',
        description: error.message || 'Please try again.',
        variant: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <UtensilsCrossed className="mx-auto mb-3" size={42} />
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-gray-500">
            Join us and order your favourite food.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Full Name *</label>
            <div className="flex items-center gap-2 border rounded-xl px-3">
              <User size={18} />
              <input
                className="w-full p-3 outline-none bg-transparent"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Email *</label>
            <div className="flex items-center gap-2 border rounded-xl px-3">
              <Mail size={18} />
              <input
                type="email"
                className="w-full p-3 outline-none bg-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <div className="flex items-center gap-2 border rounded-xl px-3">
              <Phone size={18} />
              <input
                type="tel"
                className="w-full p-3 outline-none bg-transparent"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Password *</label>
            <div className="flex items-center gap-2 border rounded-xl px-3">
              <Lock size={18} />
              <input
                type="password"
                className="w-full p-3 outline-none bg-transparent"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 text-white p-3 font-semibold hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
