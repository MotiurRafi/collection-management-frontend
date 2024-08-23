import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import HomeItems from "./HomeItems";
import HomeCollections from "./HomeCollections";
import Footer from "./Footer";
import { getLatestItems, getLargestCollections } from "../api";
import debounce from "lodash.debounce";

export default function Home({ userData, setUserData, color_theme_toggle, colorThemeState, handleSearch, searchValue, setSearchValue, searchResult }) {

  const [latestItems, setLatestItems] = useState(null)
  const [largestCollections, setLargestCollections] = useState(null)

  useEffect(() => {
    fetchLatestItems();
    fetchLargestCollections(3);
  }, []);

  const fetchLatestItems = debounce(async () => {
    try {
      const response = await getLatestItems();
      setLatestItems(response.data);
    } catch (error) {
      console.error("Error fetching latest items:", error);
    }
  }, 300);

  const fetchLargestCollections = debounce(async (limit) => {
    try {
      const response = await getLargestCollections(limit);
      setLargestCollections(response.data)
    } catch (error) {
      console.error('Error fetching largest Collections', error)
    }
  }, 300)

  return (
    <div className="bg-dark-subtle" style={{minHeight: "100vh"}}>
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
      <div className="latest_items">
        <HomeItems latestItems={latestItems} />
      </div>
      <div className="largest_collections">
        <HomeCollections largestCollections={largestCollections} />
      </div>
      <Footer />
    </div>
  );
}
