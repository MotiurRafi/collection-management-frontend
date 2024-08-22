import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function ItemCard({
  id,
  name,
  category,
  collectionName,
  userName,
  updatedAt,
}) {
  const timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
  return (
    <div className="col-md-6 col-sm-6 col-lg-4 mb-4 mb-lg-3 text-left">
      <div className="card mb-3" style={{ maxWidth: "540px" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={`/images/${category}-card-logo.jpg`}
              className="img-fluid rounded-start h-100"
              alt="..."
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title text-capitalize ">
                <a
                  className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                  href={`/items/item?id=${id}`}
                >
                  {name}
                </a>
              </h5>
              <p className="card-text">{collectionName}</p>
              <small className="text-body-secondary">BY {userName}</small>
              <p className="card-text">
                <small className="text-body-secondary">
                   Updated {timeAgo}
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
