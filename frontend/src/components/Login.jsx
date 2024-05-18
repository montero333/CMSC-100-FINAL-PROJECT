import './CSS/Login.css';
import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        const intervalId = setInterval(nextSlide, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="login-container">
            <div className="slideshow">
                <img src="/src/assets/s1.jpg" alt="Slide 1" className="slide" />
                <img src="/src/assets/s2.jpg" alt="Slide 2" className="slide" />
                <img src="/src/assets/s3.jpg" alt="Slide 3" className="slide" />
            </div>
        <img src="/src/assets/logo.png" alt="LogoLI" className="logoLI" />
        <h1 className="titleLI">Alay-ay</h1>
        <h2 className="subtitleLI">LEAF ABI PRESENTS</h2>
        <h3 className="secondary-subtitleLI">Where Agriculture Meets Your Table</h3>

        <div className="circle" style={{ backgroundColor: "#d4dbb1" }}></div>
        <Link to="/" className="mabuhay-text">mabuhay.</Link>
        <img src="/src/assets/mascot.png" alt="Mascot" className="mascot" />

        <h4 className="email-text">EMAIL</h4>
        <h4 className="pw-text">PASSWORD</h4>

        <form onSubmit={handleSubmit}>
            <div className="emInput">
                <input
                    type="email"
                    placeholder="jdelacruz100@up.edu.ph"
                    className="form-control"
                    id="exampleInputEmail1"
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    required
                />
            </div>
            <div className="pwInput">
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
            <button type="submit" className="button-submit">  LOGIN  </button>
        </form>
        {errorMessage && <p className="text-danger my-2">{errorMessage}</p>}

    </div>
    );
    
}

export default Login;
