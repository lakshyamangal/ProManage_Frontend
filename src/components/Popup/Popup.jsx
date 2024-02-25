import React, { useState, useRef, useEffect } from "react";
import styles from "../Popup/Popup.module.css";
import Delete from "../Delete/delete";
import Edit from "../Edit/Edit";
import { useEditCard } from "../../Context/editContext";
import { useDeleteCard } from "../../Context/DeleteCardContext";
import { useClosePopupCard } from "../../Context/closePopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = ({ cardData, hidePopup, showPopup }) => {
  const { updateOpen } = useClosePopupCard();
  const { updateDelCardId } = useDeleteCard();
  let count = 0;
  const { updateCardId, updateKey } = useEditCard();
  const openDeleteModal = (event) => {
    // debugger;
    updateDelCardId(cardData);
    console.log("calling ");

    //to toggle the isOpen state when an action occurs within the Popup component, but this action also triggers the onClick event of the parent div. To prevent this from happening, you can stop the propagation of the click event within the Popup component.
    event.stopPropagation();

    updateOpen(false, "del");
    // setShowDelete(true);
  };

  const openEditModal = (event) => {
    event.stopPropagation();
    updateCardId(cardData);
    updateOpen(false, "edit");
    // setShowEdit(true);
  };
  const divRef = useRef(null);
  // Function to handle clicks outside of the div
  const handleClickOutside = (event) => {
    if (
      count % 2 !== 0 &&
      divRef.current &&
      !divRef.current.contains(event.target)
    ) {
      updateOpen(false, "click");
    }
    count = count + 1;
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share Link Copied Successfully", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.popupContainer} ref={divRef}>
      <div className={styles.crudOptions} onClick={openEditModal}>
        Edit
      </div>
      <div
        className={styles.crudOptions}
        onClick={(event) => {
          event.stopPropagation();
          copyToClipboard(
            `http://localhost:5173/dashboard/card/${cardData._id}`
          );
          updateOpen(false);
        }}
      >
        Share
      </div>
      <div
        className={styles.crudOptions}
        style={{ color: "#CF3636" }}
        onClick={openDeleteModal}
      >
        Delete
      </div>
    </div>
  );
};

export default Popup;
