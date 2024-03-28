import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import UpdateUser from "./UpdateUser";
import { Principal } from "@dfinity/principal";
import UpdateService from "../serviceManager/UpdateService";

const User = ({ user, update, updateService, follow }) => {
  const {
    id,
    userName,
    followers,
    email,
    expertise,
    principal,
    imageUrl,
    services,
  } = user;

  const userPrincipal = window.auth.principalText;
  const sameClient = Principal.from(principal).toText() === userPrincipal;

  console.log(user);

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column text-start">
          <Stack className="d-flex flex-row justify-content-between align-items-center gap-2">
            {/* small profile picture */}
            <img
              src={imageUrl}
              alt={userName}
              className="img-circle"
              style={{ objectFit: "cover" }}
              width="80"
              height="80"
            />
            <Card.Title>Name: {userName}</Card.Title>
            {sameClient ? (
              <UpdateUser user={user} save={update} />
            ) : (
              <Button
                className="btn btn-outline-success text-white"
                onClick={() => {
                  follow(user.id);
                }}
              >
                Follow
              </Button>
            )}
          </Stack>
          <Badge bg="secondary" className="ms-auto">
            {Number(followers)} Followers
          </Badge>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">Expertise: {expertise}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            Principal: {Principal.from(principal).toText()}
          </Card.Text>
          <h3>User services</h3>
          {services.map((service, index) => {
            const intCost = Number(service.cost / BigInt(10 ** 8));

            return (
              <Card key={index} className="flex-grow-1 w-40">
                <Card.Header>
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="secondary" className="ms-auto">
                      price: {intCost} ICP
                    </Badge>
                    <Badge bg="secondary" className="ms-auto">
                      {Number(service.status)} Status
                    </Badge>
                    {sameClient && (
                      <UpdateService service={service} save={updateService} />
                    )}
                  </Stack>
                </Card.Header>
                <Card.Body className="d-flex  flex-column">
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text className="flex-grow-1 ">
                    description: {service.description}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    Type: {service.category}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    date: {service.createdAt}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    Subs: {Number(service.subscriptions)}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    Tags:
                    {service.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="ms-auto">
                        {tag}
                      </Badge>
                    ))}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </Card.Body>
      </Card>
    </Col>
  );
};

User.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
};

export default User;
