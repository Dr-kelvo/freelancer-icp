import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";
import { getServiceBids } from "../../utils/serviceManager";
import Loader from "../utils/Loader";

function SelectBid({ service, save }) {
  const [show, setShow] = useState(false);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, title } = service;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // fetch all bids to bids
  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      setBids(await getServiceBids(id));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  console.log(bids, "bids");

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Button onClick={handleShow} className="btn btn-outline-info">
            Bids
          </Button>
          <Modal
            size="lg"
            className="w-[50%]"
            show={show}
            onHide={handleClose}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Bids for {title}</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Freelancer</th>
                      <th scope="col">Description</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid, index) => (
                      <TableRow
                        key={index}
                        bid={bid}
                        save={save}
                        handleClose={handleClose}
                      />
                    ))}
                  </tbody>
                </table>
              </Modal.Body>
            </Form>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

SelectBid.propTypes = {
  service: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
};

function TableRow({ bid, save, handleClose }) {
  return (
    <tr>
      <td>{bid.freelancer}</td>
      <td>{bid.description}</td>
      <td>{Number(bid.amount) / 10 ** 8} ICP</td>
      <td>
        <Button
          variant="dark"
          onClick={() => {
            save(bid.id);
            handleClose();
          }}
        >
          Select Bid
        </Button>
      </td>
    </tr>
  );
}

export default SelectBid;
