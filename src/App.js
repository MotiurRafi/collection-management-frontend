import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import Home from './components/Home';
import Register from './components/Register';
import Page from './components/Page';
import { searchAll } from './api';
import Collections from './components/Collections';
import Collection from './components/Collection';
import { userAuth } from './api';
import debounce from 'lodash.debounce';
import Items from './components/Items';
import Item from './components/Item';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import SalesforceRegister from './components/SalesforceRegister';
import JiraTickets from './components/JiraTickets';
function App() {
  const [userData, setUserData] = useState(null)
  const [colorThemeState, setColorThemeState] = useState(() => {
    return localStorage.getItem('colorTheme') || 'light';
  });
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    localStorage.setItem('colorTheme', colorThemeState);
    document.documentElement.setAttribute('data-bs-theme', colorThemeState);
    if (token) {
      authenticateUser()
    }
  }, [colorThemeState, token]);

  const authenticateUser = debounce(async () => {
    try {
      const response = await userAuth();
      setUserData(response.data)
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }, 200)


  const color_theme_toggle = () => {
    setColorThemeState(colorThemeState === "light" ? "dark" : "light");
  };

  const handleSearch = debounce(async (searchValue) => {
    if (searchValue) {
      try {
        const response = await searchAll(searchValue);
        setSearchResult(response.data)
      } catch (error) {
        console.error('Search failed', error);
      }
    }
  }, 300);

  return (
    <div className="">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/register" element={<Register authenticateUser={authenticateUser} />} />
            <Route path="/page" element={<Page userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/collections" element={<Collections userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/collections/collection" element={<Collection userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/items" element={<Items userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/items/item" element={<Item userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/dashboard" element={<UserDashboard userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/dashboard/admin" element={<AdminDashboard userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
            <Route path="/salesforcer-register" element={<SalesforceRegister userData={userData} setUserData={setUserData}/>} />
            <Route path="/jira-tickets" element={<JiraTickets userData={userData} setUserData={setUserData} color_theme_toggle={color_theme_toggle} colorThemeState={colorThemeState} searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch} searchResult={searchResult} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
