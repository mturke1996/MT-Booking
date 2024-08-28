import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [profileData, setProfileData] = useState({
    birthdate: "",
    profession: "",
    address: "",
    profile_picture: "/path/to/default-picture.jpg",
    phone: "",
    bio: "",
  });
  const [userData, setUserData] = useState({
    name: "",
    lastname: "",
    email: "",
  });

  // جلب بيانات المستخدم الأساسية
  useEffect(() => {
    if (user) {
      axios
        .get(`https://mt-booking.onrender.com/users/${user.Id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching user data:",
            error.response?.data.message || error.message
          );
        });
    }
  }, [user]);

  // جلب بيانات تفاصيل المستخدم
  useEffect(() => {
    if (user) {
      axios
        .get(`https://mt-booking.onrender.com/user/details/${user.id}`)
        .then((response) => {
          setProfileData(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching user details:",
            error.response?.data.message || error.message
          );
        });
    }
  }, [user]);

  // تحديث بيانات المستخدم
  const handleEditClick = () => {
    if (!user) return;

    if (isEditing) {
      axios
        .put(`https://mt-booking.onrender.com/user/details/${user.id}`, profileData)
        .then((response) => {
          setProfileData(response.data);
          setIsEditing(false);
        })
        .catch((error) => {
          console.error(
            "Error updating user data:",
            error.response?.data.message || error.message
          );
        });
    } else {
      setIsEditing(true);
    }
  };

  // إضافة بيانات جديدة للمستخدم
  const handleAddNewClick = () => {
    if (!user) return;

    if (isAddingNew) {
      axios
        .post("https://mt-booking.onrender.com/user/details", {
          ...profileData,
          user_id: user.id,
        })
        .then((response) => {
          setProfileData(response.data);
          setIsAddingNew(false);
        })
        .catch((error) => {
          console.error(
            "Error adding new user details:",
            error.response?.data.message || error.message
          );
        });
    } else {
      setIsAddingNew(true);
    }
  };

  // تحديث قيمة الحقول في النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img
          className="profile-picture"
          src={profileData.profile_picture}
          alt="Profile"
        />
        {(isEditing || isAddingNew) && (
          <input
            type="text"
            name="profile_picture"
            value={profileData.profile_picture}
            onChange={handleInputChange}
            placeholder="Profile Picture URL"
          />
        )}
      </div>
      <div className="profile-right">
        <h1 className="profile-name">
          {user.name} {user.lastname}
        </h1>
        <p className="profile-title">
          {profileData.profession || "Web Developer | Designer"}
        </p>

        <div className="profile-actions">
          <button
            className="profile-button"
            onClick={handleEditClick}
            disabled={!user?.id}
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
          <button
            className="profile-button"
            onClick={handleAddNewClick}
            disabled={!user?.id}
          >
            {isAddingNew ? "Save New Details" : "Add New Details"}
          </button>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            {isEditing || isAddingNew ? (
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <span className="info-value">{profileData.phone}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Birthdate:</span>
            {isEditing || isAddingNew ? (
              <input
                type="date"
                name="birthdate"
                value={profileData.birthdate}
                onChange={handleInputChange}
              />
            ) : (
              <span className="info-value">{profileData.birthdate}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Occupation:</span>
            {isEditing || isAddingNew ? (
              <input
                type="text"
                name="profession"
                value={profileData.profession}
                onChange={handleInputChange}
              />
            ) : (
              <span className="info-value">{profileData.profession}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Address:</span>
            {isEditing || isAddingNew ? (
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
              />
            ) : (
              <span className="info-value">{profileData.address}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Bio:</span>
            {isEditing || isAddingNew ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
              />
            ) : (
              <span className="info-value">{profileData.bio}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
