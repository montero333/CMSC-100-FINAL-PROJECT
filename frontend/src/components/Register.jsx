import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './CSS/Register.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:3001/register', { firstName, middleName, lastName, email, password })
            .then(result => {
                console.log(result);
                if (result.data === "Already registered") {
                    alert("E-mail already registered! Please Login to proceed.");
                    navigate('/login');
                } else {
                    alert("Registered successfully! Please Login to proceed.");
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    };

    

    return (
        <div className="register-content">
            <video autoPlay loop className="video">
                <source src="/src/assets/regVid.mp4" type="video/mp4" />
            </video>
            
            <div className="register-form">
                <div className="rectangle">
                    <h2 className="regTitle">Support Our</h2>
                    <h2 className="regTitle2">LOCAL</h2>
                    <h2 className="regTitle3">Farmers</h2>
                    <h3 className="quote">"By making the right choice"</h3>
                    <h3 className="formTitle">SIGN UP</h3>
                    <h3 className="formName1">First Name</h3>
                    <h3 className="formName2">Middle Name</h3>
                    <h3 className="formName3">Last Name</h3>
                    <h3 className="formName2-sub">(OPTIONAL)</h3>
                    <h3 className="formName4">EMAIL</h3>
                    <h3 className="formName5">PASSWORD</h3>

                    <form onSubmit={handleSubmit}>
                    <div className="fname">
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                className="form-control register-input"
                                id="exampleInputFirstName"
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mname">
                            <input
                                type="text"
                                placeholder="Enter Middle Name"
                                className="form-control"
                                id="exampleInputMiddleName"
                                onChange={(event) => setMiddleName(event.target.value)}
                            />
                        </div>
                        <div className="lname">
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                className="form-control"
                                id="exampleInputLastName"
                                onChange={(event) => setLastName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="email">
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="form-control"
                                id="exampleInputEmail"
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="password">
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="form-control"
                                id="exampleInputPassword"
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submitReg">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;