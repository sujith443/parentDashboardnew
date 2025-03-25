import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const PaymentModal = ({ show, handleClose, feeOptions }) => {
  const [selectedFee, setSelectedFee] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle fee selection
  const handleFeeChange = (e) => {
    const feeType = e.target.value;
    setSelectedFee(feeType);
    setPaymentAmount(""); // Reset input when changing fee type
  };

  // Get selected fee details
  const selectedFeeDetails = feeOptions.find((fee) => fee.fee_type === selectedFee);

  // Handle form submission
  const handlePayment = () => {
    if (!selectedFee || !paymentAmount) return;
    
    const dueAmount = selectedFeeDetails?.due || 0;
    if (paymentAmount > dueAmount) {
      alert("Amount exceeds the due amount!");
      return;
    }

    setSuccessMessage(`Payment of ₹${paymentAmount} for ${selectedFee} successful!`);
    setTimeout(() => {
      setSuccessMessage("");
      handleClose();
    }, 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Make Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : (
          <Form>
            {/* Fee Type Selection */}
            <Form.Group controlId="feeType">
              <Form.Label>Select Fee Type</Form.Label>
              <Form.Control as="select" value={selectedFee} onChange={handleFeeChange}>
                <option value="">Select Fee</option>
                {feeOptions
                  .filter((fee) => fee.due > 0) // Only show fees with pending dues
                  .map((fee, index) => (
                    <option key={index} value={fee.fee_type}>
                      {fee.fee_type} - ₹{fee.due} due
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            {/* Amount Input */}
            {selectedFee && (
              <Form.Group controlId="paymentAmount" className="mt-3">
                <Form.Label>Enter Amount (Max: ₹{selectedFeeDetails?.due})</Form.Label>
                <Form.Control
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  max={selectedFeeDetails?.due || ""}
                />
              </Form.Group>
            )}

            {/* Pay Now Button */}
            <Button
              variant="success"
              className="mt-3"
              onClick={handlePayment}
              disabled={!selectedFee || !paymentAmount}
            >
              Pay Now
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
