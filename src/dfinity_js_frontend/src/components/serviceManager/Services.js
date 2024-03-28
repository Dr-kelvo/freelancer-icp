import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Service from "./Service";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getServices as getServiceList,
  createService,
  subscribe,
  updateService,
  getFollowingServices,
  servicestatus,
  selectBid,
  addBid,
} from "../../utils/serviceManager";
import AddService from "./AddService";

const Services = () => {
  const [services, setServices] = useState([]);
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

  // function to get client  service
  const getUserServices = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setServices(await getFollowingServices());
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
      data.availableUnits = parseInt(data.availableUnits, 10);
      data.cost = parseInt(data.cost, 10) * 10 ** 8;
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

  //  function to subscribe book
  const subscribeFunc = async (service) => {
    try {
      setLoading(true);
      subscribe(service).then((resp) => {
        getServices();
        toast(
          <NotificationSuccess text="Service subscribe successfull, check users tab for your services" />
        );
      });
    } catch (error) {
      console.log(
        "failed to subscribe service, check that you have enough ICP tokens"
      );
      toast(
        <NotificationError text="Failed to subscribe service. plese check that you have enough ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

  // addBid
  const newBid = async (serviceId, description, amount) => {
    try {
      setLoading(true);
      amount = parseInt(amount, 10) * 10 ** 8;
      addBid(serviceId, description, amount).then((resp) => {
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

  console.log(services);

  useEffect(() => {
    getServices();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Services</h1>
            {/* get user subscribed service */}
            <Button
              onClick={getUserServices}
              className="btn btn-primary-outline text"
            >
              current Services
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
                subscribe={subscribeFunc}
                update={update}
                selectBid={bidSelect}
                addBid={newBid}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Services;
