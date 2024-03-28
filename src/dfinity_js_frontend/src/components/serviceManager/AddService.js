import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddService = ({ save }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [cost, setCost] = useState(0);
  const isFormFilled = () =>
    title && deadline && terms && category && description && cost && tags;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn btn-outline-success text-white"
      >
        <i className="bi bi-plus"></i> Add Service
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Service</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputTitle"
              label="Service title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter title of service"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCategory"
              label="category"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="category"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputdeadline"
              label="deadline"
              className="mb-3"
            >
              <Form.Control
                type="date"
                onChange={(e) => {
                  setDeadline(e.target.value);
                }}
                placeholder="Enter deadline url"
              />
            </FloatingLabel>
            <FloatingLabel controlId="terms" label="Terms" className="mb-3">
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTerms(e.target.value);
                }}
                placeholder="Enter deadline url"
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
            {/* tags entry to array */}
            <FloatingLabel controlId="inputTags" label="Tags" className="mb-3">
              <Form.Control
                type="text"
                placeholder="comma separated tags"
                onChange={(e) => {
                  setTags(e.target.value.split(","));
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
                title,
                deadline,
                description,
                tags,
                terms,
                category,
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

AddService.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddService;
