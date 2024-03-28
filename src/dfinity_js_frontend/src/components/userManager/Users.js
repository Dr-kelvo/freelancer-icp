import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import User from "./User";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getUsers as getUserList,
  createUser,
  updateUser,
  getUserByClient,
  followUser,
} from "../../utils/userManager";
import { getFollowingUsers, updateService } from "../../utils/serviceManager";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  // function to get the list of users
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setUsers(await getUserList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });
  [];

  // function to get the list of users
  const getUserClient = useCallback(async () => {
    try {
      setLoading(true);
      getUserByClient().then((resp) => {
        setUser(resp.Ok);
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // get following users
  const getUserFollowingUsers = useCallback(async () => {
    try {
      setLoading(true);
      getFollowingUsers().then((resp) => {
        console.log(resp, "usrf");
        setUsers(resp);
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addUser = async (data) => {
    try {
      setLoading(true);
      createUser(data).then((resp) => {
        getUsers();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      updateUser(data).then((resp) => {
        getUsers();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  const follow = async (data) => {
    try {
      setLoading(true);
      followUser(data).then((resp) => {
        getUsers();
      });
      toast(
        <NotificationSuccess text="User added to followers successfully." />
      );
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to follow user." />);
    } finally {
      setLoading(false);
    }
  };

  const serviceUpdate = async (data) => {
    try {
      setLoading(true);
      data.cost = parseInt(data.cost, 10) * 10 ** 8;
      updateService(data).then((resp) => {
        getUsers();
        toast(<NotificationSuccess text="Service update successfull." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a service." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getUserClient();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Users</h1>
            <Button
              onClick={getUserFollowingUsers}
              className="btn btn-primary-outline"
            >
              Your Users
            </Button>
            {user?.userName ? (
              <UpdateUser user={user} save={update} />
            ) : (
              <AddUser save={addUser} />
            )}
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {users.map((_user, index) => (
              <User
                key={index}
                user={{
                  ..._user,
                }}
                update={update}
                updateService={serviceUpdate}
                follow={follow}
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

export default Users;
