import React from "react";
import { login } from "../utils/auth";
import Users from "../components/userManager/Users";
import Cover from "../components/utils/Cover";
import coverImg from "../assets/img/cover.jpg";
import { Notification } from "../components/utils/Notifications";

const UsersPage = () => {
  const isAuthenticated = window.auth.isAuthenticated;

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <div fluid="md" className="bg-gray-800">
          <main>
            <Users />
          </main>
        </div>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default UsersPage;
