import React from "react";

export default function CollectionCard({
  collectionId,
  name,
  description,
  image,
  category,
  itemCount,
  userName,
  userId,
  twoCol
}) {
  return (
    <div className={!twoCol ? "col-md-12 col-lg-4 mb-4 mb-lg-4" : "col-md-6 mb-4"}>
      <div className="card">
        <div className="d-flex justify-content-between p-3">
          <p className="lead mb-0 text-capitalize">
            <a
              className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
              href={`/collections/collection?id=${collectionId}`}
            >
              {name}
            </a>
          </p>
          <div
            className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
            style={{ width: "35px", height: "35px" }}
          >
            <p className="text-white mb-0 small">x{itemCount}</p>
          </div>
        </div>
        <div className="img-box" style={{ height: "250px" }}>
          <img
            src={image}
            className="card-img-top h-100"
            style={{ background: "white" }}
            alt=""
          />
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <p className="small">
              <a href={`/page?category=${category}`} className="text-muted">
                {category}
              </a>
            </p>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ height: "70px" }}
          >
            {description.length > 95
              ? `${description.substring(0, 95)} . . .`
              : description}
          </div>
          <div className="d-flex justify-content-between">
            <p className="small">
              <a
                className="small d-flex justify-content-between"
                href={`/dashboard?id=${userId}`}
              >
                {userName}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
