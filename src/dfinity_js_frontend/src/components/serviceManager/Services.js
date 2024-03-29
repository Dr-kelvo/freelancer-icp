import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Service from "./Service";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getServices as getServiceList,
  createService,
  payBid,
  updateService,
  getActiveServices,
  selectBid,
  addBid,
} from "../../utils/serviceManager";
import AddService from "./AddService";
import { createUser, getUserByOwner } from "../../utils/userManager";
import AddUser from "../userManager/AddUser";

const Services = () => {
  const [services, setServices] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  // function to get the list of services
  const getServices = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setServices(await getServiceList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get user  service
  const getUserServices = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setServices(await getActiveServices());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get the list of users
  const getUserOwner = useCallback(async () => {
    try {
      setLoading(true);
      getUserByOwner().then((resp) => {
        setUser(resp.Ok);
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addService = async (data) => {
    console.log("adder");
    try {
      setLoading(true);
      createService(data).then((resp) => {
        getServices();
        toast(<NotificationSuccess text="Service added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a service." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to payBid book
  const payBidFunc = async (serviceId) => {
    try {
      setLoading(true);
      payBid(serviceId).then((resp) => {
        getServices();
        toast(
          <NotificationSuccess text="Service payBid successfull, refresh to see new balance" />
        );
      });
    } catch (error) {
      console.log(
        "failed to payBid service, check that you have enough ICP tokens"
      );
      console.log(error);
      toast(
        <NotificationError text="Failed to payBid service. plese check that you have enough ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

  // addBid
  const newBid = async (serviceId, description, amount) => {
    try {
      setLoading(true);
      const amountInt = parseInt(amount, 10) * 10 ** 8;
      addBid(serviceId, description, amountInt).then((resp) => {
        getServices();
        toast(<NotificationSuccess text="Bid added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add a bid." />);
    } finally {
      setLoading(false);
    }
  };

  // selectBid
  const bidSelect = async (bidId) => {
    try {
      setLoading(true);
      selectBid(bidId).then((resp) => {
        getServices();
        toast(<NotificationSuccess text="Bid selected successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to select a bid." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.cost = parseInt(data.cost, 10) * 10 ** 8;
      updateService(data).then((resp) => {
        getServices();
        toast(<NotificationSuccess text="Service update successfull." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a service." />);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (data) => {
    try {
      setLoading(true);
      createUser(data).then((resp) => {
        getUserOwner();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  console.log(services);

  useEffect(() => {
    getServices();
    getUserOwner();
  }, []);

  console.log(user);

  return (
    <>
      {!loading ? (
        !user?.userName ? (
          <AddUser save={addUser} />
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">Services</h1>
              {/* get user payBidd service */}
              <Button
                onClick={getUserServices}
                className="btn btn-primary-outline text"
              >
                active Services
              </Button>
              <AddService save={addService} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {services.map((_service, index) => (
                <Service
                  key={index}
                  service={{
                    ..._service,
                  }}
                  update={update}
                  selectBid={bidSelect}
                  addBid={newBid}
                  payBid={payBidFunc}
                />
              ))}
            </Row>
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Services;
