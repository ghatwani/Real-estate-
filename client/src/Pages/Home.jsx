import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper ,SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import  ListingItem  from "../components/ListingItem";

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  console.log(offerListing)
  SwiperCore.use([Navigation])

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListing(data);
      } catch (error) {
        console.log(error)
      }
    };
    const fetchRentListing= async()=>{
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListing(data);
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListing= async()=>{
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListing();
    fetchRentListing();
    fetchSaleListing();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next
          <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the best place to find your next perfect place to
          find your next home.
          <br />
          We have a wide range of properties to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>

        {
          offerListing && offerListing.length>0 && offerListing.map((listing)=>(
            <SwiperSlide>
              <div style={{background:`url(${listing.imageURLs[0]}) center no-repeat` ,backgroundSize:'cover'}} key={listing._id} className="h-[500px]"></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <div className="max-w-full mx-[150px] p-3 flex flex-col gap-8 my-10">
        {
          offerListing && offerListing.length>0 && (
            <div className="">
              <div className="my-4">
                <h2 className="text-4xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover: underline" to={'/search?offer=true'}>
                Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-8">
                {
                  offerListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          rentListing && rentListing.length>0 && (
            <div className="">
              <div className="my-4">
                <h2 className="text-4xl font-semibold text-slate-600">Recent places for Rent</h2>
                <Link className="text-sm text-blue-800 hover: underline" to={'/search?type=rent'}>
                Show more 
                </Link>
              </div>
              <div className="flex flex-wrap gap-8">
                {
                  rentListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListing && saleListing.length>0 && (
            <div className="">
              <div className="my-4">
                <h2 className="text-4xl font-semibold text-slate-600">Recent places for sale</h2>
                <Link className="text-sm text-blue-800 hover: underline" to={'/search?offer=true'}>
                Show more 
                </Link>
              </div>
              <div className="flex flex-wrap gap-8">
                {
                  saleListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Home;
