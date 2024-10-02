import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate= useNavigate()
  const [sidebarData, setSidebarData] = useState({
    searchTerm:"",
    type:"all",
    offer: false,
    parking: false,
    furnished:false,
    sort:'created_at',
    order:'desc'
  });
const [loading, setLoading] = useState(false)
const [listing, setListing] = useState([])
console.log(listing);



  useEffect(() => {
    const urlParams= new URLSearchParams(location.search)
    const searchTermFromURL=urlParams.get('searchTerm')
    const typefromURL=urlParams.get('type')
    const parkingFromURL=urlParams.get('parking')
    const furnishedFromURL=urlParams.get('furnished')
    const offerFromURL=urlParams.get('offer')
    const sortFromURL=urlParams.get('sort')
    const orderFromURL=urlParams.get('order')

    if(searchTermFromURL || typefromURL || parkingFromURL || furnishedFromURL || offerFromURL || sortFromURL ||orderFromURL){
      setSidebarData({
        searchTerm:searchTermFromURL || '',
        type: typefromURL || 'all',
        parking: parkingFromURL==='true'?true :false,
        furnished: furnishedFromURL === 'true'? true: false,
        offer:offerFromURL==='true'? true: false,
        sort: sortFromURL|| 'created_at',
        order: orderFromURL || 'desc',
      })
    }

    const fetchListing= async() => {
      setLoading(true)
      const searchQuery= urlParams.toString();
      console.log(searchQuery)
      const res=  await fetch(`/api/listing/get?${searchQuery}`)
      const data = await res.json()
      setLoading(false)
      setListing(data)
    }
    fetchListing()
    
  }, [location.search])
  
  const handleChange= (e) => {
    if(e.target.id==='all' || e.target.id==='rent'|| e.target.id==='sale'){
      setSidebarData({...sidebarData, type: e.target.id})
    }
    if(e.target.id ==='searchTerm'){
      setSidebarData({...sidebarData, searchTerm:e.target.value})
    }
    if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id ==='offer'){
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked ==="true"?
        true:false
      })
    }
    if(e.target.id ==='sort_order'){
      const sort= e.target.value.split('_')[0] || 'created_at';
      const order= e.target.value.split('_')[1] || 'desc';
      setSidebarData({...sidebarData, sort, order})
    }
  }
  const handleSubmit=(e) => {
    e.preventDefault()
    const urlParams= new URLSearchParams()
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('type', sidebarData.type)
    urlParams.set('parking', sidebarData.parking)
    urlParams.set('furnished', sidebarData.furnished)
    urlParams.set('offer', sidebarData.offer)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('order', sidebarData.order)

    const searchQuery= urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  
  

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex gap-8 flex-col">
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              SearchTerm:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search... "
              className="border rounded-lg p-3 w-full"
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sidebarData.type==='all'} />{" "}
              <span>Rent & Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sidebarData.type==='rent'} />{" "}
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sidebarData.type==='sale'}/>{" "}
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebarData.offer}/>{" "}
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange}  checked={sidebarData.parking}/>{" "}
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sidebarData.furnished} />{" "}
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold"> Sort:</label>
            <select name="" id="sort_order" defaultValue={"created_at_desc"} className="border rounded-lg p-3">
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Recent</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 p-3 text-white rounded-lg uppercase">
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-4xl text-slate-700 mt-7 border-b p-3 font-semibold">
          Listing Result :{" "}
        </h1>
      </div>
    </div>
  );
}
