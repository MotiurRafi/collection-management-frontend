import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CollectionCard from "./CollectionCard";
import { getAllCollections } from "../api";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash.debounce";
import { useTranslation } from 'react-i18next';

export default function Collections({ userData, setUserData, color_theme_toggle, colorThemeState, handleSearch, searchValue, setSearchValue, searchResult }) {
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3;
  const { t } = useTranslation();

  useEffect(() => {
    fetchMoreCollections();
  }, []);

  const fetchMoreCollections = debounce(async () => {
    try {
      const response = await getAllCollections(page, limit);
      const newCollections = response.data;

      setCollections((prevCollections) => [...prevCollections, ...newCollections]);

      if (newCollections.length < limit) {
        setHasMore(false);
      } else {
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }, 300);

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
      <section className="bg-body-secondary">
        <div className="container py-5" style={{minHeight: "100vh"}}>
          <h4 className="mb-5">
            <strong>{t('Collections')}</strong>
          </h4>

          <InfiniteScroll
            dataLength={collections.length}
            next={fetchMoreCollections}
            hasMore={hasMore}
            loader={<h4>. . .</h4>}
            endMessage={''}
            style={{ overflowX: 'hidden', textAlign: "center" }}
          >
            <div className="row">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collectionId={collection.id}
                  name={collection.name}
                  userName={collection.User.username}
                  userId={collection.User.id}
                  image={collection.image}
                  description={collection.description}
                  category={collection.category}
                  itemCount={collection.itemCount}
                  twoCol={false}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </section>
      <Footer userData={userData} />
    </div>
  );
}
