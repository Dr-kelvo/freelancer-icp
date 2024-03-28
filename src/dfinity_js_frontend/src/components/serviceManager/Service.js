import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import UpdateService from "./UpdateService";
import AddBid from "./AddBid";
import SelectBid from "./SelectBid";

const Service = ({ service, subscribe, update, selectBid, addBid }) => {
  const {
    id,
    title,
    description,
    category,
    createdAt,
    terms,
    updatedAt,
    client,
    freelancer,
    status,
    deadline,
    cost,
  } = service;

  const intCost = Number(cost / BigInt(10 ** 8));

  console.log(service);

  const principal = window.auth.principalText;
  const isClientsService =
    Principal.from(service.client).toText() === principal;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(client).toText()}
          </span>
          <div className="d-flex gap-2">
            <Badge bg="secondary" className="ms-auto">
              Fee: {intCost} ICP
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              Status: {status}
            </Badge>

            {isClientsService ? (
              <>
                <UpdateService service={service} save={update} />
                <SelectBid service={service} save={selectBid} />
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

          <Button
            onClick={() => {
              subscribe(service.id);
            }}
            variant="outline-dark"
            className="w-100 py-3"
          >
            Subscribe to Service
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

Service.propTypes = {
  service: PropTypes.instanceOf(Object).isRequired,
};

export default Service;
