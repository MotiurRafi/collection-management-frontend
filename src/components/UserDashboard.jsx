import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSearchParams } from "react-router-dom";
import { getUser, getUserCollections, salesforceAuthUrl, getJiraTicket } from "../api";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import CollectionCard from "./CollectionCard";
import CollectionModal from "./CollectionModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from 'react-i18next';

export default function UserDashboard({
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
  const [collectionCount, setCollectionCount] = useState('')
  const id = searchParams.get("id");
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [ticketToggle, setTicketToggle] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 4;
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetchUser(id);
      fetchMoreCollections();
    }
  }, [id]);

  useEffect(() => {
    if (userData) {
      fetchJiraTickets()
    }
  }, [userData]);

  const fetchJiraTickets = async () => {
    const email = userData.email
    try {
      const response = await getJiraTicket(email)
      console.log(response.data)
      setUserTickets(response.data.tickets)

    } catch (error) {
      console.error("error getting user tickets", error)
    }
  }

  const fetchUser = debounce(async (id) => {
    try {
      const response = await getUser(id);
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching user", error);
    }
  }, 200);

  const fetchMoreCollections = debounce(async (addedNew) => {
    const userId = id;
    const resetPage = addedNew ? 1 : page;

    try {
      const response = await getUserCollections(resetPage, limit, userId);
      const newCollections = response.data.collections;
      setCollectionCount(response.data.collectionCount)

      setCollections((prevCollections) => {
        if (addedNew) {
          return [...newCollections];
        }

        const collectionMap = new Map(prevCollections.map(collection => [collection.id, collection]));

        newCollections.forEach(collection => {
          collectionMap.set(collection.id, collection);
        });

        return Array.from(collectionMap.values());
      });

      if (newCollections.length < limit) {
        setHasMore(false);
      } else {
        setPage((prevPage) => addedNew ? 2 : prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }, 300);

  const handleSalesforceLogin = async () => {
    try {
      const response = await salesforceAuthUrl();
      console.log('Salesforce URL:', response.data.url);

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error fetching Salesforce login URL:', error);
    }
  };


  return (
    <div>
      {userData && (userData.status === 'active' && userData.role === 'admin' || userData.id == id) ?
        (<CollectionModal userId={id} fetchMoreCollections={fetchMoreCollections} setPage={setPage} />) :
        ''
      }
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
      <div>
        {user && (
          <section>
            <div className="container py-5">
              <div className="row">
                <div className="col-lg-4">
                  <div className="card mb-4">
                    <div className="card-body text-center">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                        alt="avatar"
                        className="rounded-circle img-fluid"
                        style={{ width: "150px" }}
                      />
                      <h5 className="my-3 text-capitalize">{user.username}</h5>
                      <p className="text-muted mb-1 text-capitalize">
                        {user.role}
                      </p>
                      <p className="text-muted mb-4">
                        Since -{" "}
                        {format(new Date(user.createdAt), "dd MMM yyyy")}
                      </p>
                      <div className="d-flex justify-content-center mb-2">
                        <button type="button" className="btn btn-primary"> {collectionCount} - {t('Collections')}
                        </button>
                      </div>
                      <div className="d-flex justify-content-center mb-2">
                        {userData && (userData.status === 'active' && userData.role === 'admin' || userData.id == id) && (userData.salesforceStatus !== 'true') ?
                          (<button onClick={handleSalesforceLogin} className="btn button-success rounded bg-primary-subtle p-2 btn "> Connect Salesforce</button>) :
                          ''
                        }
                        {userData && (userData.id == id || userData.role === 'admin') && (userData.salesforceStatus === 'true') ?
                          (<button className="btn button-success rounded bg-primary-subtle p-2 btn ">Salesforce Connected</button>) :
                          ''
                        }
                      </div>
                    </div>
                  </div>
                  <div className="card mb-4">

                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0 text-capitalize">{t('Full Name')}</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="text-muted mb-0">{user.username}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">{t('Email')}</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="text-muted mb-0">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {userData && (userData.status === 'active' && userData.role === 'admin' || userData.id == id) && userTickets.length > 0 ? (
                    <div>
                      <a href={`/jira-tickets?id=${id}`}>Your Tickets</a>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col  bg-body-tertiary rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center mx-3">
                      <p className="m-0">{t('Collections')}</p>
                      {userData && (userData.status === 'active' && userData.role === 'admin' || userData.id == id) ?
                        (<i className="fa-solid fa-plus rounded bg-primary-subtle p-2 btn " data-bs-toggle="modal" data-bs-target="#exampleModal"></i>) :
                        ''
                      }
                    </div>
                  </div>
                  <InfiniteScroll
                    dataLength={collections.length}
                    next={fetchMoreCollections}
                    hasMore={hasMore}
                    loader={<h4>. . .</h4>}
                    endMessage={<p>{t('No more collections to show')}.</p>}
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
                          twoCol={true}
                        />
                      ))}
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer userData={userData} />
    </div>
  );
}
