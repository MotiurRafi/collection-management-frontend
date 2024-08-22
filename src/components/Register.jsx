import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, logIn } from "../api";


export default function Register({ authenticateUser }) {
  const [registerState, setRegisterState] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [resLog, setResLog] = useState("");
  const navigate = useNavigate();

  const form_toggle = () => {
    setRegisterState(!registerState);
  };

  const emptyResLog = () => {
    setTimeout(() => {
      setResLog('')
    }, 5000);
  }

  const handleRegister = async () => {
    if (!username || !email || !password || !repeatedPassword) {
      setResLog("Please fill in all fields");
      emptyResLog()
      return;
    }
    if (password !== repeatedPassword) {
      setResLog("Passwords do not match");
      emptyResLog()
      return;
    }
    try {
      const response = await register({ username, email, password });
      setResLog("User registered successfully!");
      emptyResLog()
      setRegisterState(false)
    } catch (error) {
      console.error("Error registering user:", error);
      setResLog("Registration failed. Please try again.");
      emptyResLog()
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setResLog("Please fill in all fields");
      emptyResLog()
      return;
    }
    try {
      const response = await logIn({ email, password });
      setResLog("User logged in successfully!");
      emptyResLog()
      localStorage.setItem("token", response.data.token)
      authenticateUser();
      navigate('/');
      window.location.reload()
    } catch (error) {
      console.error("Error logging in user:", error);
      setResLog("Login failed. Please try again.")
      emptyResLog()
    }
  };

  return (
    <section
      data-bs-theme="dark"
      className="vh-100 bg-image"
      style={{
        background: "url('images/register_bg.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-5">
              <div className="card" style={{ height: "700px" }}>
                <div className="card-body px-5 py-3">
                  <h2 className="text-uppercase text-center mb-5">
                    {registerState ? "Sign Up" : "Log In"}
                  </h2>
                  <p className="text-center" style={{ height: "10px" }}>{resLog}</p>
                  {registerState ? (
                    <form>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="username"
                          className="form-control form-control-lg"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="form-label" htmlFor="username">
                          Your Name
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="email"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="form-label" htmlFor="email">
                          Your Email
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="repeatPassword"
                          className="form-control form-control-lg"
                          value={repeatedPassword}
                          onChange={(e) => setRepeatedPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="repeatPassword">
                          Repeat your password
                        </label>
                      </div>
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                          onClick={handleRegister}
                        >
                          Register
                        </button>
                      </div>
                      <p className="text-center text-muted mt-5 mb-0">
                        Already have an account?
                        <button
                          onClick={form_toggle}
                          className="fw-bold text-body btn"
                        >
                          <u>Login here</u>
                        </button>
                      </p>
                    </form>
                  ) : (
                    <form>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="loginEmail"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="form-label" htmlFor="loginEmail">
                          Your Email
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="loginPassword"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="loginPassword">
                          Password
                        </label>
                      </div>
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                          onClick={handleLogin}
                        >
                          Log In
                        </button>
                      </div>
                      <p className="text-center text-muted mt-5 mb-0">
                        Don't have an account?
                        <button
                          onClick={form_toggle}
                          className="fw-bold text-body btn"
                        >
                          <u>Register here</u>
                        </button>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
