import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ItemCard from './ItemCard';
import Navbar from './Navbar';
import Footer from './Footer';
import { getAllItems } from '../api';
import { useTranslation } from 'react-i18next';

export default function Items({ userData, setUserData, color_theme_toggle, colorThemeState, handleSearch, searchValue, setSearchValue, searchResult }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;
  const { t } = useTranslation();

  useEffect(() => {
    fetchInitialItems();
  }, []);

  const fetchInitialItems = async () => {
    try {
      const response = await getAllItems(1, limit);
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
      const response = await getAllItems(page + 1, limit);
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
      <section className="bg-body-secondary">
        <div className="container py-5" style={{minHeight: "100vh"}}>
          <h4 className="mb-5">
            <strong>{t('Items')}</strong>
          </h4>

          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreItems}
            hasMore={hasMore}
            loader={<h4>. . .</h4>}
            endMessage={<p>{t('No more items to load')}</p>}
            style={{ overflowX: 'hidden', textAlign: "center" }}
          >
            <div className="row">
              {items.map((item) => (
                <ItemCard
                  id={item.id}
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
      <Footer />
    </div>
  );
}
