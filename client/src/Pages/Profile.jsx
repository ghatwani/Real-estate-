import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFaliure,
  deleteUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signInFailure,
  signoutUserFaliure,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const Profile = () => {
  const dispatch = useDispatch();

  const fileRef = useRef(null);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setfile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [listingError, setlistingError] = useState(false);
  const [showUserListing, setshowUserListing] = useState([]);
console.log("formData", formData);

  // console.log(filePerc)
  // console.log(fileUploadError)
  // console.log(file)
  // console.log("formData", formData)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePerc(Math.round(progress));
        console.log("progress", progress)
      },
      (error) => {
        setfileUploadError(true);
        // console.log(4)
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          // {console.log(downloadURL)
          setformData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFaliure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFaliure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFaliure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/sign-out");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFaliure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
      dispatch();
    } catch (error) {
      dispatch(signoutUserFaliure(error.message));
    }
  };
  const handleShowListing = async () => {
    try {
      setlistingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setlistingError(true);
        console.log(data.message);
        return;
      }
      setshowUserListing(data);
    } catch (error) {
      console.log(error);
      setlistingError(true);
    }
  };

  const handleDelete=async(listingId) => {
    try {
      const res= await fetch(`/api/listing/delete/${listingId}`, {
        method:"DELETE"
      });
      const data= await res.json()
      if(data.success===false){
        console.log(data.message)
        return;
      }
      setshowUserListing((prev)=>prev.filter((listing)=>listing._id !==listingId))
    } catch (error) {
      console.log(error.message)
    }
  }
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setfile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/.*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload. Image should be less than 2Mb
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc == 100 ? (
            <span className="text-green-700">Image successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg upppercase text-center hover:opacity:95"
          to={"/create-listing"}
        >
          {" "}
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-4">{error ? error : ""}</p>
      <p className="text-green-700 mt-4">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-700 w-full ">
        {" "}
        Show Listing
      </button>

      <p className="text-red-700 text-sm text-center">
        {" "}
        {listingError ? "An error occured!" : ""}
      </p>
      {showUserListing && showUserListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 font-semibold text-2xl">Your Listings</h1>
          {showUserListing.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listings/${listing._id}`}>
                <img
                  src={listing.imageURLs[0]}
                  alt="listing image"
                  className="h-16 w-16 object-contain "
                />
              </Link>

              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate "
                to={`/listings/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={()=>handleDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
