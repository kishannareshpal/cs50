import React from 'react'

export default function Register() {
    return (
        <div>
            <h1>Please register</h1>
            <label htmlFor="">Your name:</label>
            <input type="text" placeholder="name"/>
            <button className="btn btn-primary">Register</button>
        </div>
    )
}
