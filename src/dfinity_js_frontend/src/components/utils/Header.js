import React, { useCallback, useEffect, useState } from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { logout as destroy } from "../../utils/auth";
import { balance as principalBalance } from "../../utils/ledger";
import Wallet from "../Wallet";
import AddService from "../serviceManager/AddService";
import AddUser from "../userManager/AddUser";
import { Link } from "react-router-dom";

const Header = ({ saveService, saveUser }) => {
  const isAuthenticated = window.auth.isAuthenticated;

  const principal = window.auth.principalText;

  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      {isAuthenticated ? (
        <Navbar
          className=" px-2 mb-2 d-flex justify-content-between align-items-center gap-4"
          bg="light"
          fluid="md"
          expand="lg"
        >
          <Navbar.Brand className="text-dark h4">Service Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="d-flex justify-content-between align-items-center"
            id="basic-navbar-nav"
          >
            <Nav className="mr-auto d-flex gap-2 align-items-center">
              <Link
                to="/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                className="text-dark h5"
              >
                Services
              </Link>
              <Link
                to="/users?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                className="text-dark h5"
              >
                Users
              </Link>
              <Nav.Item>
                <AddService save={saveService} />
              </Nav.Item>
              <Nav.Item>
                <AddUser save={saveUser} />
              </Nav.Item>
            </Nav>
            <Form className="d-flex gap-2">
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                principal={principal}
                balance={balance}
                symbol={"ICP"}
                isAuthenticated={isAuthenticated}
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
        </Navbar>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
