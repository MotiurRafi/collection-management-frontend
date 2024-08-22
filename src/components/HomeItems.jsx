import React from "react";
import ItemCard from "./ItemCard";
export default function HomeItems({ latestItems }) {
  return (
    <div>
      {latestItems && latestItems.length > 0 ? (
        <section>
          <div className="text-left container py-5">
            <h4 className="mb-5">
              <strong>Latest Items</strong>
            </h4>
            <div className="row" >
              {latestItems.map((item) => (
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
          </div>
        </section>
      ) : (
        ""
      )}
    </div>
  );
}
