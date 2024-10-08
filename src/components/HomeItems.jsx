import React from "react";
import ItemCard from "./ItemCard";
import { useTranslation } from 'react-i18next';

export default function HomeItems({ latestItems }) {
  const { t } = useTranslation();

  return (
    <div>
      {latestItems && latestItems.length > 0 ? (
        <section>
          <div className="text-left container py-5">
            <h4 className="mb-5">
              <strong>{t('Latest Items')}</strong>
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
