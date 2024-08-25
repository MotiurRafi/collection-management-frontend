import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getCollection, getCollectionItems } from "../api";
import debounce from "lodash.debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import ItemCard from "./ItemCard";
import ItemModal from './ItemModal'
import { formatDistanceToNow } from "date-fns";
import CollectionDeleteModal from "./CollectionDeleteModal";
import CollectionUpdateModal from "./CollectionUpdateModal";
import { useTranslation } from 'react-i18next';

export default function Collection({
  userData,
  setUserData,
  color_theme_toggle,
  colorThemeState,
  handleSearch,
  searchValue,
  setSearchValue,
  searchResult,
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState(null);
  const [timeAgo, setTimeAgo] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;

  useEffect(() => {
    if (id) {
      fetchCollection(id);
    }
  }, [id]);

  const fetchCollection = debounce(async (id) => {
    try {
      const response = await getCollection(id);
      setCollection(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  }, 100);

  useEffect(() => {
    if (collection && id) {
      setTimeAgo(formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true }));
      fetchInitialItems();
    }
  }, [collection, id]);

  const fetchInitialItems = async () => {
    try {
      const response = await getCollectionItems(1, limit, id);
      setItems(response.data);
      if (response.data.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching initial items:", error);
    }
  };

  const fetchMoreItems = async () => {
    try {
      const response = await getCollectionItems(page + 1, limit, id);
      const newItems = response.data;
      setItems((prevItems) => [...prevItems, ...newItems]);

      if (newItems.length < limit) {
        setHasMore(false);
      } else {
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching more items:", error);
    }
  };


  return (
    <div>
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
      {collection && (
        <div className="pb-5" style={{minHeight: "100vh"}}>
          {userData && (userData.status === 'active') && (userData.id === collection.userId || userData.role === 'admin') ? (
            <>
              <ItemModal collection={collection} fetchCollection={fetchCollection} urlId={id} />
              <CollectionUpdateModal collection={collection} fetchCollection={fetchCollection} urlId={id} />
              <CollectionDeleteModal urlId={id} userId={collection.userId}/>
            </>
          ) : ('')}
          <div className="card text-bg-dark rounded-0 position-relative" style={{ minHeight: '50vh' }}>
            {collection.image && <img src={collection.image} style={{ maxHeight: "90vh" }} className="card-image" alt={collection.name} />}
            <div
              className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center"
              style={{ height: "100%", background: 'rgba(0,0,0,.7)' }}
            >
          {userData && (userData.status === 'active') && (userData.id === collection.userId || userData.role === 'admin') ? (
                <div className=" position-absolute  top-0 end-0 mx-2 mt-2">
                  <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#updatecollectionmodal"><i className="fa-regular fa-pen-to-square"></i></button>
                  <button className="btn btn-outline-danger mx-2" data-bs-toggle="modal" data-bs-target="#deletecollectionmodal"><i className="fa-regular fa-trash-can"></i></button>
                </div>
              ) : ('')}
              <h1 className="card-title">{collection.name}</h1>
              <p className="card-text">
                {collection.description}
              </p>
              <p className="small" style={{ marginBottom: '0' }}>
                <a href={`/dashboard?id=${collection.userId}`}>
                  {collection.User.username}
                </a>
              </p>
              <p className="small">
                <a href={`/page?category=${collection.category}`}>
                  {collection.category}
                </a>
              </p>
              <p className="card-text">
                <small>{timeAgo}</small>
              </p>
            </div>
          </div>
          <div className="container mt-5">
            <div className="bg-body-tertiary rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center">
              <p className="m-0">{t('Items')}</p>
              {userData && (userData.status === 'active') && (userData.id === collection.userId || userData.role === 'admin') ? (
                <i className="fa-solid fa-plus rounded bg-primary-subtle p-2 btn " data-bs-toggle="modal" data-bs-target="#createitemmodal"></i>
              ) : ('')
              }
            </div>
          </div>

          {items && (
            <InfiniteScroll
              dataLength={items.length}
              next={fetchMoreItems}
              hasMore={hasMore}
              loader={<h4>Loading more items...</h4>}
              endMessage={<p>No more items to load</p>}
              style={{ overflowX: "hidden", textAlign: "center" }}
              className="container"
            >
              <div className="row">
                {items.map((item) => (
                  <ItemCard
                    id={item.id}
                    key={item.id}
                    name={item.name}
                    collectionName={collection.name}
                    category={collection.category}
                    userName={collection.User.username}
                    updatedAt={item.updatedAt}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}
