import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreState, setLoadMoreState] = useState(false);

  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        //create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        //execute query
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        console.log(listings);
        setListing(listings);
        if (listing.length > 10) {
          setLoadMoreState(true);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch Listings");
      }
    };
    fetchListings();
  }, [params.categoryName]);

  const onFetchMoreListing = async () => {
    try {
      const listingsRef = collection(db, "listings");
      //create a query
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      //execute query
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch Listings");
    }
  };
  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listing.map((listing) => {
                return (
                  listing.data.listingEnabled && (
                    <ListingItem
                      listing={listing.data}
                      id={listing.id}
                      key={listing.id}
                    />
                  )
                );
              })}
            </ul>
          </main>
          <br />
          <br />

          {loadMoreState && lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListing}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for current offers</p>
      )}
    </div>
  );
};

export default Offers;
