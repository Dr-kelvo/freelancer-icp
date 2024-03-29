import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import User from "./User";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getUsers as getUserList,
  createUser,
  updateUser,
  getUserByOwner,
  followUser,
} from "../../utils/userManager";
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
  const getUserOwner = useCallback(async () => {
    try {
      setLoading(true);
      getUserByOwner().then((resp) => {
        console.log(resp);
        setUser(resp.Ok);
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

  useEffect(() => {
    getUsers();
    getUserOwner();
  }, []);

  console.log(user);

  return (
    <div className="d-flex justify-content-center">
      {!loading ? (
        !user?.userName ? (
          <AddUser save={addUser} />
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">Users</h1>
              <UpdateUser user={user} save={update} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {users.map((_user, index) => (
                <User
                  key={index}
                  user={{
                    ..._user,
                  }}
                  follow={follow}
                />
              ))}
            </Row>
          </div>
        )
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Users;
