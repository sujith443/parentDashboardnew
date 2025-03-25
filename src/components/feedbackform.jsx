import React, { useState } from "react";
import { useAuth } from "./Authentication";
import axios from "axios";

const ParentStudentFeedbackForm = () => {
  const { user } = useAuth();
  const { parent, student } = user.data;
  
  // Sample professor data based on BTech departments in South India
  const professors = [
    { id: 1, name: "Dr. Ramesh Kumar", department: "Electronics & Communication" },
    { id: 2, name: "Dr. Priya Singh", department: "Electronics & Communication" },
    { id: 3, name: "Prof. Anand Reddy", department: "Computer Science" },
    { id: 4, name: "Dr. Lakshmi Narayan", department: "Electronics & Communication" },
    { id: 5, name: "Prof. Venkat Rao", department: "Electrical Engineering" }
  ];

  const [formData, setFormData] = useState({
    professorId: "",
    concernType: "",
    subjectName: "",
    feedbackDetails: "",
    requestMeeting: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedProfessor = professors.find(p => p.id === parseInt(formData.professorId));
      
      const feedbackData = {
        ...formData,
        professorName: selectedProfessor ? selectedProfessor.name : "",
        professorDepartment: selectedProfessor ? selectedProfessor.department : "",
        studentId: student.hallticketnumber,
        studentName: student.name,
        branch: student.branch,
        parentName: parent.father_name,
        parentEmail: parent.email,
        parentPhone: parent.father_phone,
        submissionDate: new Date().toISOString()
      };
      
      // Replace with your actual API endpoint
      await axios.post("http://localhost:5000/parent/submit-feedback", feedbackData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  const concernTypes = [
    "Academic Performance Issue",
    "Attendance Concern",
    "Behavioral Issue",
    "Curriculum Query",
    "Exam/Assessment Question",
    "Positive Feedback",
    "Request for Extra Help",
    "Other"
  ];

  if (submitted) {
    return (
      <div className="container mt-4">
        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">Message Sent Successfully</h4>
          </div>
          <div className="card-body text-center py-5">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3rem" }}></i>
            </div>
            <h3>Thank you for your feedback!</h3>
            <p className="lead mb-4">
              Your message has been sent to the professor. We appreciate your involvement in your child's education.
            </p>
            <div className="mt-4">
              <button 
                className="btn btn-primary me-2" 
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    professorId: "",
                    concernType: "",
                    subjectName: "",
                    feedbackDetails: "",
                    requestMeeting: false
                  });
                }}
              >
                Send Another Message
              </button>
              <button className="btn btn-outline-secondary">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Message to Professor</h4>
            </div>
            <div className="card-body p-4">
              {/* Student Information Banner */}
              <div className="alert alert-light border d-flex justify-content-between align-items-center mb-4">
                <div>
                  <strong>Student:</strong> {student.name} ({student.hallticketnumber})
                </div>
                <div>
                  <span className="badge bg-secondary">{student.branch}</span>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Professor Selection */}
                <div className="mb-3">
                  <label className="form-label">Send To</label>
                  <select
                    className="form-select"
                    name="professorId"
                    value={formData.professorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Professor --</option>
                    {professors.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name} ({prof.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Concern Type */}
                <div className="mb-3">
                  <label className="form-label">Type of Communication</label>
                  <select
                    className="form-select"
                    name="concernType"
                    value={formData.concernType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Type --</option>
                    {concernTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <label className="form-label">Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    placeholder="e.g., Digital Electronics, Data Structures"
                    required
                  />
                </div>

                {/* Feedback Details */}
                <div className="mb-3">
                  <label className="form-label">Details</label>
                  <textarea
                    className="form-control"
                    name="feedbackDetails"
                    rows="5"
                    value={formData.feedbackDetails}
                    onChange={handleChange}
                    placeholder="Please provide specific details about your child's progress, concerns, or questions you have for the professor..."
                    required
                  ></textarea>
                </div>

                {/* Request Meeting Option */}
                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="requestMeeting"
                    name="requestMeeting"
                    checked={formData.requestMeeting}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="requestMeeting">
                    I would like to request a meeting with the professor
                  </label>
                </div>

                {/* Contact Information Reminder */}
                <div className="alert alert-info mb-4">
                  <small>
                    <strong>Note:</strong> The professor can reach you at {parent.email} or {parent.father_phone} if they need to follow up.
                  </small>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 
                      <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> : 
                      "Send Message"
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentStudentFeedbackForm;