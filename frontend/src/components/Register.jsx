import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const result = await axios.post('http://localhost:3001/register', { firstName, middleName, lastName, email, password });

            if (result.status === 201) {
                alert("Registered successfully! Please Login to proceed.");
                navigate('/login');
            } else {
                setErrorMessage("Unexpected response from server");
            }
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.error === "Email already registered") {
                console.log("E-mail already registered! Please Login to proceed.");
                alert("E-mail already registered! Please Login to proceed.");
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2 className="mb-3 text-primary">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputFirstName" className="form-label">
                                <strong>First Name</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                className="form-control"
                                id="exampleInputFirstName"
                                onChange={(event) => setFirstName(event.target.value)}
                                value={firstName}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputMiddleName" className="form-label">
                                <strong>Middle Name (Optional)</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Middle Name"
                                className="form-control"
                                id="exampleInputMiddleName"
                                onChange={(event) => setMiddleName(event.target.value)}
                                value={middleName}
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputLastName" className="form-label">
                                <strong>Last Name</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                className="form-control"
                                id="exampleInputLastName"
                                onChange={(event) => setLastName(event.target.value)}
                                value={lastName}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail" className="form-label">
                                <strong>Email Id</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="form-control"
                                id="exampleInputEmail"
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputPassword" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="form-control"
                                id="exampleInputPassword"
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                    </form>
                    {errorMessage && <p className="text-danger my-2">{errorMessage}</p>}
                    <p className="container my-2">Already have an account? <Link to='/login'>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
