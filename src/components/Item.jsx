import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getItem, toggleLike, addComment, deleteComment, getItemComment, editComment } from "../api";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import ItemUpdateModal from "./ItemUpdateModal";
import ItemDeleteModal from "./ItemDeleteModal";
import io from 'socket.io-client';


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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const socketRef = useRef(null);
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get("id");
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (urlId) {
      fetchItem(urlId);
      fetchComment(urlId)
    }
    socketRef.current = io('https://collection-management-backend.onrender.com', {
      path: '/socket.io',
      transports: ['websocket'],
    });
    socketRef.current.emit('join-room', urlId)

  }, [urlId]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('comments-updated', (updatedComments) => {
        console.log("Received updated comments:", updatedComments); 
        setComments(updatedComments);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('comments-updated');
      }
    };
  }, []);



  const fetchItem = debounce(async (urlId) => {
    try {
      const { data } = await getItem(urlId);
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
    try {
      await toggleLike(urlId);
      fetchItem(urlId)
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  const fetchComment = async (urlId) => {
    try {
      const response = await getItemComment(urlId)
      setComments(response.data)
    } catch (error) {
      console.error("Error Fetching Comments", error)
    }
  }

  const createComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    if (!text) return;
    try {
      await addComment(text, urlId);
      fetchComment(urlId);
      socketRef.current.emit('action', urlId);
      e.target.reset();
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const removeComment = async (commentId) => {
    console.log(item)
    try {
      await deleteComment(commentId);
      fetchComment(urlId);
      socketRef.current.emit('action', urlId);
    } catch (error) {
      console.error('Error removing comment', error);
    }
  };

  const updateComment = async (commentId, text) => {
    try {
      await editComment(commentId, { text });
      fetchComment(urlId);
      socketRef.current.emit('action', urlId);
      setEditingCommentId(null);
    } catch (error) {
      console.error('Error updating comment', error);
    }
  };


  if (!item) return null;

  return (
    <div>
      {userData && (userData.status === 'active' && userData.role === 'admin' || userData.id === item.Collection.userId) ? (
        <>
          <ItemUpdateModal item={item} urlId={urlId} fetchItem={fetchItem} />
          <ItemDeleteModal urlId={urlId} collectionId={item.collectionId} />
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
        {userData && (userData.status === 'active' && userData.role === 'admin' || userData.id === item.Collection.userId) ? (
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
          <h3>Comments - </h3>
          {userData &&
            <form onSubmit={createComment}>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">Add a Comment</label>
                <input type="text" className="form-control" id="comment" aria-describedby="comment" />
              </div>
              <button type="submit" className=" mb-3 btn btn-primary">Add Comment</button>
            </form>
          }
          <ul className="d-flex flex-column gap-1">
            {comments && comments.map((comment) => (
              <li className="d-flex flex-column mb-4 position-relative" key={comment.id}>
                <h6>
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className=" mx-2 rounded-circle img-fluid" style={{width: "30px", border: "2px solid black"}}/>
                  <a className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href={`/dashboard?id=${comment.User.id}`}>{comment.User.username}</a></h6>
                {editingCommentId === comment.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateComment(comment.id, commentText);
                  }}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-warning">Save</button>
                  </form>
                ) : (
                  <>
                    {comment.text}
                    {userData && userData.id === comment.User.id &&
                      <div className="button-group position-absolute top-100 start-0" >
                        <button className="border-0 text-danger text-bold" style={{ background: 'transparent', fontSize: "12px" }} onClick={() => removeComment(comment.id)}>REMOVE</button>
                        <button className="border-0 text-warning text-bold" style={{ background: 'transparent', fontSize: "12px" }} onClick={() => {
                          setEditingCommentId(comment.id);
                          setCommentText(comment.text);
                        }}>EDIT</button>
                      </div>
                    }
                  </>
                )}
              </li>
            ))}

          </ul>
        </div>
      </div>
      <Footer userData={userData} />
    </div>
  );
}
