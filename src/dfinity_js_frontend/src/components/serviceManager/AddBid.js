import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddBid = ({ serviceId, save }) => {
  const [amount, setAmount] = useState([]);
  const [description, setDescription] = useState("");

  const isFormFilled = () =>
    bidName && expertise && email && bio && imageUrl && amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="btn btn-success-outline">
        <i className="bi bi-plus "></i> New Bid
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Bid</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAmount"
              label="Amount"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder=" amount"
                onChange={(e) => {
                  setAmount(e.target.value.split(","));
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                serviceId,
                description,
                amount,
              });
              handleClose();
            }}
          >
            Save bid
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddBid.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddBid;
