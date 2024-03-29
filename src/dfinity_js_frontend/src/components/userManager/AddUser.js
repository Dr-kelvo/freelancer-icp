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
  const [skills, setSkills] = useState([]);

  const isFormFilled = () =>
    userName && expertise && email && bio && imageUrl && portfolios;

  return (
    <>
      <div className="d-flex flex-column align-items-center mb-4 w-50">
        <h2>
          <Modal.Title>Create User Profile</Modal.Title>
        </h2>
        <Form className="w-75 p-3">
          <Modal.Body className="w-100">
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
              controlId="inputSkills"
              label="Skills"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="comma separated skills"
                onChange={(e) => {
                  setSkills(e.target.value.split(","));
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
        <Modal.Footer className="align-self-end mr-4">
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
                skills,
                portfolios,
              });
            }}
          >
            Save user
          </Button>
        </Modal.Footer>
      </div>
    </>
  );
};

AddUser.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddUser;
