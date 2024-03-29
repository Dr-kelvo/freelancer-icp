import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import UpdateService from "./UpdateService";
import AddBid from "./AddBid";
import SelectBid from "./SelectBid";

const Service = ({ service, update, selectBid, addBid, payBid }) => {
  const {
    id,
    title,
    description,
    category,
    createdAt,
    terms,
    updatedAt,
    user,
    freelancer,
    status,
    deadline,
    cost,
  } = service;

  const intCost = Number(cost / BigInt(10 ** 8));

  console.log(service);

  const principal = window.auth.principalText;
  const isUsersService = Principal.from(service.user).toText() === principal;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(user).toText()}
          </span>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="secondary" className="ms-auto">
              Cost: {intCost} ICP
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {status}
            </Badge>
            {isUsersService ? (
              <>
                <UpdateService service={service} save={update} />
                {freelancer.length > 0 ? (
                  <Button
                    onClick={() => {
                      payBid(id);
                    }}
                  >
                    PayOut
                  </Button>
                ) : (
                  <SelectBid service={service} save={selectBid} />
                )}
              </>
            ) : (
              <AddBid serviceId={id} save={addBid} />
            )}
          </div>
        </Card.Header>

        <Card.Body className="d-flex  flex-column ">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">
            description: {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">Type: {category}</Card.Text>
          <Card.Text className="flex-grow-1 ">date: {createdAt}</Card.Text>
          <Card.Text className="flex-grow-1 ">deadline: {deadline}</Card.Text>
          <Card.Text className="flex-grow-1 ">terms: {terms}</Card.Text>
          {freelancer && (
            <Card.Text className="flex-grow-1 ">
              freelancer: {freelancer}
            </Card.Text>
          )}
          <Card.Text className="flex-grow-1">updatedAt: {updatedAt}</Card.Text>
          <Card.Text className="flex-grow-1">Id: {id}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Service.propTypes = {
  service: PropTypes.instanceOf(Object).isRequired,
};

export default Service;
