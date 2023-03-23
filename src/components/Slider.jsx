import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Spinner from "./Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      console.log(listingsRef);
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(10));
      const querySnap = await getDocs(q);
      console.log(querySnap);
      let listing = [];
      querySnap.forEach((doc) => {
        console.log(doc.data());
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listing);
      setListings(listing);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map(
            ({ data, id }) =>
              data.listingEnabled && (
                <SwiperSlide
                  key={id}
                  onClick={() => navigate(`/category/${data.type}/${id}`)}
                >
                  <div
                    style={{
                      background: `url(${data.imgUrls[0]}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                    className="swiperSlideDiv"
                  >
                    <p className="swiperSlideText">{data.name}</p>
                    <p className="swiperSlidePrice">
                      ${data.discountedPrice ?? data.regularPrice}{" "}
                      {data.type === "rent" && "/ month"}
                    </p>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </>
    )
  );
};

export default Slider;
