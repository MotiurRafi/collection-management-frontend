import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getItem, toggleLike, addComment, deleteComment } from "../api";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import ItemUpdateModal from "./ItemUpdateModal";
import ItemDeleteModal from "./ItemDeleteModal";

export default function Item({
  userData,
  setUserData,
  color_theme_toggle,
  colorThemeState,
  handleSearch,
  searchValue,
  setSearchValue,
  searchResult,
}) {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const fetchItem = debounce(async (id) => {
    try {
      const { data } = await getItem(id);
      setItem(data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  }, 100);

  const formatDate = (date) =>
    date ? format(new Date(date), "dd MMM yyyy") : "";

  const RenderField = ({ fieldName, fieldState, fieldValue, checkbox = false }) =>
    fieldState && fieldValue && (
      <>
        {!checkbox ? (
          <div className="">
            <h6>{fieldName}</h6>
            <p className="small">{fieldValue || 'N/A'}</p>
          </div>
        ) : (
          <div className="d-flex">
            <img src={`/images/true-icon.png`} style={{ height: "20px" }} alt="" />
            <h6>{fieldName}</h6>
          </div>
        )}
      </>
    );

  const renderedFields = useMemo(
    () => (
      <>
        <RenderField fieldName={item?.Collection?.string_field1_name} fieldState={item?.Collection?.string_field1_state} fieldValue={item?.string_field1_value} />
        <RenderField fieldName={item?.Collection?.string_field2_name} fieldState={item?.Collection?.string_field2_state} fieldValue={item?.string_field2_value} />
        <RenderField fieldName={item?.Collection?.string_field3_name} fieldState={item?.Collection?.string_field3_state} fieldValue={item?.string_field3_value} />
        <RenderField fieldName={item?.Collection?.multiline_text_field1_name} fieldState={item?.Collection?.multiline_text_field1_state} fieldValue={item?.multiline_text_field1_value} />
        <RenderField fieldName={item?.Collection?.multiline_text_field2_name} fieldState={item?.Collection?.multiline_text_field2_state} fieldValue={item?.multiline_text_field2_value} />
        <RenderField fieldName={item?.Collection?.multiline_text_field3_name} fieldState={item?.Collection?.multiline_text_field3_state} fieldValue={item?.multiline_text_field3_value} />
        <RenderField fieldName={item?.Collection?.checkbox_field1_name} fieldState={item?.Collection?.checkbox_field1_state} fieldValue={item?.checkbox_field1_value === "true"} checkbox />
        <RenderField fieldName={item?.Collection?.checkbox_field2_name} fieldState={item?.Collection?.checkbox_field2_state} fieldValue={item?.checkbox_field2_value === "true"} checkbox />
        <RenderField fieldName={item?.Collection?.checkbox_field3_name} fieldState={item?.Collection?.checkbox_field3_state} fieldValue={item?.checkbox_field3_value === "true"} checkbox />
        <RenderField fieldName={item?.Collection?.integer_field1_name} fieldState={item?.Collection?.integer_field1_state} fieldValue={item?.integer_field1_value} />
        <RenderField fieldName={item?.Collection?.integer_field2_name} fieldState={item?.Collection?.integer_field2_state} fieldValue={item?.integer_field2_value} />
        <RenderField fieldName={item?.Collection?.integer_field3_name} fieldState={item?.Collection?.integer_field3_state} fieldValue={item?.integer_field3_value} />
        <RenderField fieldName={item?.Collection?.date_field1_name} fieldState={item?.Collection?.date_field1_state} fieldValue={formatDate(item?.date_field1_value)} />
        <RenderField fieldName={item?.Collection?.date_field2_name} fieldState={item?.Collection?.date_field2_state} fieldValue={formatDate(item?.date_field2_value)} />
        <RenderField fieldName={item?.Collection?.date_field3_name} fieldState={item?.Collection?.date_field3_state} fieldValue={formatDate(item?.date_field3_value)} />
      </>
    ),
    [item]
  );

  const handleLike = async (event) => {
    event.preventDefault();
    const itemId = item.id;
    try {
      const response = await toggleLike(itemId);
      console.log(response.data);
      fetchItem(id)
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    if (!text) return;
    try {
      const response = await addComment(text, item.id);
      console.log(response.data);
      fetchItem(id)
    } catch (error) {
      console.log('Error adding comment', error);
    }
  };

  const removeComment = async (id) => {
    try {
      const response = await deleteComment(id)
      console.log(response.data)
      fetchItem(item.id)
    } catch (error) {
      console.log('error removing comment', error)
    }
  }

  if (!item) return null;

  return (
    <div>
      {userData && (userData.status === 'active') && (userData.id === item.Collection.userId || userData.role === 'admin') ? (
        <>
          <ItemUpdateModal item={item} urlId={id} fetchItem={fetchItem} />
          <ItemDeleteModal urlId={id} collectionId={item.collectionId}/>
        </>
      ) : ('')}
      <Navbar
        color_theme_toggle={color_theme_toggle}
        colorThemeState={colorThemeState}
        userData={userData}
        setUserData={setUserData}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        searchResult={searchResult}
      />
      <div className="container-md  position-relative" style={{ minHeight: "100vh" }}>
        {userData && (userData.status === 'active') && (userData.id === item.Collection.userId || userData.role === 'admin') ? (
          <div className="position-absolute top-0 end-0 mx-2 mt-2">
            <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#updateitemmodal"> <i className="fa-regular fa-pen-to-square"></i></button>
            <button className="btn btn-outline-danger mx-2" data-bs-toggle="modal" data-bs-target="#deleteitemmodal"><i className="fa-regular fa-trash-can"></i></button>
          </div>
        ) : ('')}
        <div className="row m-lg-5 my-md-4 px-lg-5 d-flex flex-wrap-reverse">
          <div className="mt-4 position-relative">
            <form className="d-flex flex-column justify-content-center align-items-center position-absolute top-0 end-0">
              <button className="btn text-success" onClick={handleLike}>
                <i className={userData && item?.Likers?.some(liker => liker.id === userData.id) ? `fa-solid fa-heart` : `fa-regular fa-heart`}></i>
              </button>
              <p className="like_count position-relative" style={{ top: '-10px', background: "inherit" }}>
                {item?.Likers ? item?.Likers.length : 0}
              </p>
            </form>
            <h1>{item.name}</h1>
            {renderedFields}
            <div>
              <ul className="d-flex flex-wrap list-unstyled gap-2">
                {item.Tags?.map((tag) => (
                  <li key={tag.id}>
                    <a href={`/page?tag=${tag.name}`} className="badge bg-primary me-2">
                      {tag.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="my-5 m-lg-5 my-md-4 my-sm-4 px-lg-5">
          <h3>Comments:</h3>
          <form onSubmit={createComment}>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Add a Comment</label>
              <input type="text" className="form-control" id="comment" aria-describedby="comment" />
            </div>
            <button type="submit" className=" mb-3 btn btn-primary">Add Comment</button>
          </form>
          <ul className="d-flex flex-column flex-coloumn gap-1">
            {item.Comments?.map((comment, index) => (
              <li className="d-flex flex-coloumn mb-3" key={index}>
                {comment.text}
                <button className=" mx-4 btn btn-danger" onClick={() => removeComment(comment.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
