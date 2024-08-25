import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Navbar({
  color_theme_toggle,
  colorThemeState,
  userData,
  setUserData,
  handleSearch,
  setSearchValue,
  searchValue,
  searchResult,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/register");
    setUserData(null);
    console.log(userData);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            {t('CM')}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  {t('Home')}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/collections">
                  {t('Collections')}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/items">
                  {t('Items')}
                </a>
              </li>
            </ul>
            <form className="d-flex" role="search" style={{ position: "relative" }} >
              <input
                className="form-control me-2" type="search" placeholder={t('Search')} aria-label="Search" value={searchValue}
                onChange={(e) => {
                  e.preventDefault();
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              {searchResult && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    top: "100%",
                    width: "100%",
                    display: searchValue && searchResult ? "block" : "none"
                  }}
                >
                  {searchResult.collections && searchResult.collections.length > 0 && (
                    <>
                      <li className="dropdown-header">{t('Collections')}</li>
                      {searchResult.collections.map((collection) => (
                        <li key={collection.id} className="dropdown-item text-wrap text-break">
                          <a href={`/collections/collection?id=${collection.id}`}>{collection.name}</a> -
                          <a href={`/page?category=${collection.category}`}>{collection.category}</a>
                        </li>
                      ))}
                    </>
                  )}

                  {searchResult.items && searchResult.items.length > 0 && (
                    <>
                      <li className="dropdown-header">{t('Items')}</li>
                      {searchResult.items.map((item) => (
                        <li key={item.id} className="dropdown-item text-wrap text-break">
                          <a href={`/item?id=${item.id}`}>{item.name} {item.string_field1_value ? ` - ${item.string_field1_value}` : ''}</a>
                        </li>
                      ))}
                    </>
                  )}
                  {searchResult.tags && searchResult.tags.length > 0 && (
                    <>
                      <li className="dropdown-header">{t('Tags')}</li>
                      {searchResult.tags.map((tag) => (
                        <li key={tag.id} className="dropdown-item text-wrap text-break">
                          <a href={`/page?tag=${tag.name}`}>{tag.name} {tag.itemCount ? ` - ( ${tag.itemCount} Item )` : ""}</a>
                        </li>
                      ))}
                    </>
                  )}
                  {searchResult.comments &&
                    searchResult.comments.length > 0 && (
                      <>
                        <li className="dropdown-header">{t('Comments')}</li>
                        {searchResult.comments.map((comment) => (
                          <li key={comment.id} className="dropdown-item text-wrap text-break">
                            <a href={`/items/item?id=${comment.itemId}`}>
                              {comment.Item.name}<br />
                              <p className="small" style={{ lineHeight: ".75" }}>{comment.text.length > 45 ? `${comment.text.substring(0, 45)}...` : comment.text}</p>
                            </a>
                          </li>
                        ))}
                      </>
                    )}
                </ul>
              )}
            </form>
            <div className="d-flex justify-content-end mx-2">
              <button
                className="btn mx-4"
                onClick={() => {
                  color_theme_toggle();
                }}
              >
                <i
                  className={
                    colorThemeState === "light"
                      ? "fa-regular fa-sun"
                      : "fa-regular fa-moon"
                  }
                ></i>
              </button>
              <button className="btn btn-primary mx-4" role="button" data-bs-toggle="button" onClick={toggleLanguage}>
                {i18n.language === 'en' ? 'বাংলা' : 'English'}
              </button>

              {userData ? (
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                  >
                    <i className="fa-regular fa-user"></i>
                  </button>
                  <ul className="dropdown-menu custom-dropdown-menu dropdown-menu-end text-end" style={{ width: "max-content" }}>
                    <li>
                      <a className="dropdown-item text-wrap text-break" href={`/dashboard?id=${userData.id}`}>
                        {userData.username}
                      </a>
                    </li>
                    {userData.role === "admin" ? (
                      <li>
                        <a className={`dropdown-item text-wrap text-break ${userData.status === 'blocked' ? 'disabled' : ''}`} href="/dashboard/admin">
                          {t('Admin Dashboard')}
                          {userData.status === "blocked" ? (
                            <i className="fa-solid fa-lock px-2 text-danger"></i>
                          ) : (
                            ""
                          )}
                        </a>
                      </li>
                    ) : (
                      " "
                    )}
                    <li>
                      <button
                        className="btn dropdown-item text-wrap text-break text-danger"
                        onClick={() => {
                          handleLogOut();
                        }}
                      >
                        {t('LogOut')}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <a
                  type="button"
                  href="/register"
                  className="btn btn-outline-secondary"
                >
                  {t('Sign In')}
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
