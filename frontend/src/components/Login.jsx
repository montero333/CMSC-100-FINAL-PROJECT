import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
            if(result.data.message === "Success"){
                console.log("Login Success");
                alert('Login successful!');
                if (result.data.userType === "Admin") {
                    navigate('/admin-home');
                } else {
                    navigate('/home');
                }
            }
            else if (result.data === "Wrong password") {
                console.log("Incorrect password");
                alert('Incorrect password! Please try again.');
            }
            else if (result.data === "No user found with this email") {
                console.log("No user found with this email");
                alert('No user found with this email');
            }
            else {
                console.log("Unexpected response from server");
                alert('Unexpected response from server');
            }
        })
        .catch(err => {
            console.error(err);
            alert('An error occurred. Please try again later.');
        });
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2 className='mb-3 text-primary'>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                <strong>Email Id</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="form-control"
                                id="exampleInputEmail1"
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="form-control"
                                id="exampleInputPassword1"
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                    {errorMessage && <p className="text-danger my-2">{errorMessage}</p>}
                    <p className='container my-2'>Don't have an account? <Link to='/register'>Register</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;
