import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import Switch from "react-switch";

import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const ListingItem = ({ listing, id, onDelete, onEdit, onList }) => {
  console.log(listing);
  const { listingEnabled } = listing;
  const [isEnabled, setIsEnabled] = useState(listingEnabled);
  console.log(isEnabled);

  const [formData, setFormData] = useState({ ...listing });

  const handleChange = async () => {
    const docRef = doc(db, "listings", id);
    if (formData.listingEnabled === true) {
      formData.listingEnabled = false;
      setIsEnabled(false);
    } else {
      formData.listingEnabled = true;
      setIsEnabled(true);
    }
    await updateDoc(docRef, formData);
    if (formData.listingEnabled === true) {
      toast.success("List is active");
    } else {
      toast.success("List is not active");
    }
  };
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        {listing.imgUrls && (
          <img
            src={listing.imgUrls[0]}
            alt={listing.name}
            className="categoryListingImg"
          />
        )}
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && "/ Month"}
          </p>

          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
      {onList && (
        <Switch
          onChange={handleChange}
          checked={isEnabled}
          height={22}
          width={44}
          handleDiameter={18}
          // className="editList"
        />
      )}
    </li>
  );
};

export default ListingItem;
