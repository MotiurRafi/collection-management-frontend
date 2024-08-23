import React from "react";
import CollectionCard from "./CollectionCard";
import { useTranslation } from 'react-i18next';

export default function Home_collections({ largestCollections }) {
  const { t } = useTranslation();

  return (
    <div>
      {largestCollections && largestCollections.length > 0 && (
        <section className="bg-body-secondary">
          <div className="container py-5">
            <h4 className="mb-5">
              <strong>{t('Largest Collections')}</strong>
            </h4>
            <div className="row">
              {largestCollections.map((collection) => (
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
          </div>
        </section>
      )}
    </div>
  );
}
