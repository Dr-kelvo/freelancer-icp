import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateService = ({ service, save }) => {
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [cover, setCover] = useState("");
  const [cost, setCost] = useState(0);
  const isFormFilled = () => terms && cover && description && cost;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-outline-warning rounded-pill"
        style={{ width: "8rem" }}
      >
        Update
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Service</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputcover"
              label="cover"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="cover"
                onChange={(e) => {
                  setCover(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="terms"
              label="Media type"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="cover"
                onChange={(e) => {
                  setTerms(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId="inputCost" label="cost" className="mb-3">
              <Form.Control
                type="number"
                placeholder="cost"
                onChange={(e) => {
                  setCost(e.target.value);
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
                id: service.id,
                description,
                terms,
                cover,
                cost,
              });
              handleClose();
            }}
          >
            Save service
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateService.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateService;
