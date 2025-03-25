import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authentication";
import axios from "axios";

const ParentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/parent-login", {
        email,
        password,
      });

      if (response.data.message === "Login successful!") {
        console.log("Parent Data:", response); // Verify response
        login(response); // Save parent data in context        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="card-header bg-success text-white text-center py-4">
                <h4 className="fw-bold mb-0">Parent Dashboard</h4>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <h5 className="card-title text-center mb-4 text-secondary fw-bold">Parent Login</h5>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email">Parent Email</label>
                  </div>
                  
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-success btn-lg fw-bold py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </span>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <a href="#" className="text-decoration-none text-secondary">
                      Forgot your password?
                    </a>
                  </div>
                </form>
              </div>
              
              <div className="card-footer bg-light py-3 text-center">
                <small className="text-muted">
                  © {new Date().getFullYear()} SVIT Parent Portal. All rights reserved.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;
