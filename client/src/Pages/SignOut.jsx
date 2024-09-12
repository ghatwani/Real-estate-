import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Oauth from '../components/Oauth';

const SignOut = () => {
  const [formData, setformData] = useState({})
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setformData(
      {
        ...formData,
        [e.target.id]: e.target.value
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setloading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        setloading(false)
        seterror(data.message);
      }
      setloading(false)
      seterror(null)
      navigate('/sign-in')
    } catch (error) {
      setloading(false)
      seterror(error.message)
    }
  }

  // console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
        <input type='text' placeholder='Username' className='border p-3 rounded-lg ' id="username" onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg ' id="email" onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg ' id="password" onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "loading..." : "Sign Up"}</button>
          <Oauth/>

      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignOut