import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/_styles.miguel.css";

function SessionLogin({ mode }) {
    const [isSignUp, setIsSignUp] = useState(mode);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsSignUp(mode);
    }, [location]);

    // Function to toggle between sign-up and sign-in
    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <div className="session-login-container">
						<div className={`container ${isSignUp ? 'active' : ''}`} id="container">
							<div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
								<form>
									<h1 className="text-b f-body">{isSignUp ? 'Log In' : 'Create an Account'}</h1>
									<div className="social-icons">
										<a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
										<a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
										<a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
										<a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
									</div>
									{isSignUp == 1 && (
										<>
											<div className="w-5/6 mb-2">
                                                <input className="text-black"
                                                type="email" placeholder="Email" />
                                                <input className="text-black"
                                                type="password" placeholder="Password" />
                                            </div>
											<button className="f-body bg-primary-n border-[1px] border-primary-n hover:bg-transparent hover:text-black transition-all ease-in-out duration-500">
                                                    Login
                                            </button>
											<div className="mt-1"><a className="f-body-sm" 
                                            href="/recover">Forgot Your Password?</a></div>
										</>
									)}
									{isSignUp == 0 && (
										<>
											<div className="w-5/6 mb-2">
                                                <input className="text-black"
                                                type="text" placeholder="Name" />
                                                <input className="text-black"
                                                type="email" placeholder="Email" />
                                                <input className="text-black"
                                                type="password" placeholder="Password" />
                                            </div>
											<button className="f-body bg-primary-n border-[1px] border-primary-n hover:bg-transparent hover:text-black transition-all ease-in-out duration-500">
                                                Sign Up
                                            </button>
										</>
									)}
								</form>
							</div>
							<div className="toggle-container">
								<div className="toggle">
									<div className={`toggle-panel toggle-left ${isSignUp ? 'hidden' : ''}`}>
										<h5 className="f-body text-xl">Don't have an account?</h5>
										<p className="f-body-sm">Create an account to access all site features</p>
										<button className=" f-body bg-transparent border-[1px] border-black text-b hover:bg-primary-n hover:text-white transition-all ease-in-out duration-500" 
                                        onClick={() => { navigate("/signup"); toggleForm(); }}>Sign up</button>
									</div>
									<div className={`toggle-panel toggle-right ${isSignUp ? '' : 'hidden'}`}>
										<h5 className="f-body text-xl">You already have an account?</h5>
										<p className="f-body-sm">Enter your credentials to access all site features</p>
										<button className="f-body bg-transparent border-[1px] border-black text-b hover:bg-primary-n hover:text-white transition-all ease-in-out duration-500" 
                                         onClick={() => { navigate("/login"); toggleForm(); }}>Login</button>
									</div>
								</div>
							</div>
						</div>
					</div>
    );
}

export default SessionLogin;