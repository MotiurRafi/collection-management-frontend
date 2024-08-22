import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import CollectionCard from "./CollectionCard";
import ItemCard from "./ItemCard";
import { useSearchParams } from "react-router-dom";
import { getCategoryCollections, getTagItems } from "../api";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash.debounce";
import Footer from "./Footer";

export default function Page({
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
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(1);
  const [hasMoreCollections, setHasMoreCollections] = useState(true);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const itemsPerPage = 18;

  useEffect(() => {
    if (category) {
      fetchCollections();
    }
    if (tag) {
      fetchItems();
    }
  }, [category, tag]);

  const fetchCollections = debounce(async () => {
    if (category) {
      try {
        const response = await getCategoryCollections(
          category,
          collectionsPage,
          itemsPerPage
        );
        const newCollections = response.data;
        setCollections((prevCollections) => [
          ...prevCollections,
          ...newCollections,
        ]);

        if (newCollections.length < itemsPerPage) {
          setHasMoreCollections(false);
        } else {
          setCollectionsPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  }, 300);

  const fetchItems = debounce(async () => {
    if (tag) {
      try {
        const response = await getTagItems(tag, itemsPage, itemsPerPage);
        const newItems = response.data;

        setItems((prevItems) => [...prevItems, ...newItems]);

        if (newItems.length < itemsPerPage) {
          setHasMoreItems(false);
        } else {
          setItemsPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
  }, 300);

  return (
    <div className="bg-body-secondary">
      <Navbar
        userData={userData}
        setUserData={setUserData}
        color_theme_toggle={color_theme_toggle}
        colorThemeState={colorThemeState}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        searchResult={searchResult}
      />

      <div className="text-left container py-5">
        {collections.length > 0 && (
          <section>
            <div className="container py-5">
              <h4 className="mb-5">
                <strong>Category - {category}</strong>
              </h4>
              <InfiniteScroll
                dataLength={collections.length}
                next={fetchCollections}
                hasMore={hasMoreCollections}
                loader={<h4>Loading more collections...</h4>}
                endMessage={""}
                style={{ overflowX: "hidden" }}
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
        )}
      </div>

      <div>
        {items.length > 0 && (
          <section>
            <div className="text-left container py-5">
              <h4 className="mb-5">
                <strong>Tag - {tag}</strong>
              </h4>
              <InfiniteScroll
                dataLength={items.length}
                next={fetchItems}
                hasMore={hasMoreItems}
                loader={<h4>Loading more items...</h4>}
                endMessage={""}
                style={{ overflowX: "hidden" }}
              >
                <div className="row">
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      name={item.name}
                      collectionName={item.Collection.name}
                      category={item.Collection.category}
                      userName={item.Collection.User.username}
                      updatedAt={item.updatedAt}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
