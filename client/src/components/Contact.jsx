import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [Landlord, setLandlord] = useState(null);
  const [message, setmessage] = useState(null);
  console.log(Landlord);

  const onChange = (e) => {
    setmessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        next(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {Landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{Landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={onChange}
            placeholder="Enter Your Message..."
            className="w-full p-3 rounded-lg border"
          ></textarea>
          <Link
            to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity:95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
