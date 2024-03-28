import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddUser = ({ save }) => {
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [expertise, setExpertise] = useState("");
  const [portfolios, setPortfolios] = useState([]);

  const isFormFilled = () =>
    userName && expertise && email && bio && imageUrl && portfolios;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="btn btn-success-outline">
        <i className="bi bi-plus "></i> New User
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="User userName"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                placeholder="Enter userName of user"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputExpertise"
              label="Expertise"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Expertise"
                onChange={(e) => {
                  setExpertise(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEmail"
              label="Email"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId="inputBio" label="Bio" className="mb-3">
              <Form.Control
                as="textarea"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                placeholder="Bio"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputImageUrl"
              label="Profile Picture"
              className="mb-3"
            >
              <Form.Control
                text="text"
                placeholder="Image Url"
                onChange={(e) => {
                  setImageUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPortfolios"
              label="Portfolios"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="comma separated portfolios"
                onChange={(e) => {
                  setPortfolios(e.target.value.split(","));
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
                bio,
                email,
                imageUrl,
                userName,
                expertise,
                portfolios,
              });
              handleClose();
            }}
          >
            Save user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddUser.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddUser;
