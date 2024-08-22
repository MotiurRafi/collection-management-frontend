import React, { useState } from 'react';
import { createCollection } from '../api';

export default function CollectionModal({ userId }) {
    const [image, setImage] = useState(null);
    const [collectionData, setCollectionData] = useState({
        name: '',
        description: '',
        category: '',
        fields: {
            shortText: { sfn1: '', sfn2: '', sfn3: '' },
            longText: { mlfn1: '', mlfn2: '', mlfn3: '' },
            number: { ifn1: '', ifn2: '', ifn3: '' },
            checkbox: { cfn1: '', cfn2: '', cfn3: '' },
            date: { dfn1: '', dfn2: '', dfn3: '' }
        }
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCollectionData({
            ...collectionData,
            [name]: value
        });
    };

    const handleFieldChange = (type, fieldKey, e) => {
        const { value } = e.target;
        setCollectionData({
            ...collectionData,
            fields: {
                ...collectionData.fields,
                [type]: {
                    ...collectionData.fields[type],
                    [fieldKey]: value
                }
            }
        });
    };

    const addField = (type) => {
        const currentFields = collectionData.fields[type];
        const fieldCount = Object.keys(currentFields).length;
        if (fieldCount < 3) {
            const newKey = `${type}${fieldCount + 1}`;
            setCollectionData({
                ...collectionData,
                fields: {
                    ...collectionData.fields,
                    [type]: { ...currentFields, [newKey]: '' }
                }
            });
        }
    };

    const removeField = (type) => {
        const currentFields = collectionData.fields[type];
        const fieldKeys = Object.keys(currentFields);
        if (fieldKeys.length > 0) {
            const lastKey = fieldKeys[fieldKeys.length - 1];
            const { [lastKey]: _, ...remainingFields } = currentFields;
            setCollectionData({
                ...collectionData,
                fields: {
                    ...collectionData.fields,
                    [type]: remainingFields
                }
            });
        }
    };

    const prepareCustomFields = () => {
        const customFields = {};
        Object.keys(collectionData.fields).forEach(type => {
            Object.keys(collectionData.fields[type]).forEach(key => {
                customFields[key] = collectionData.fields[type][key];
            });
        });
        return customFields;
    };

    const handleCreateCollection = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', collectionData.name);
        formData.append('description', collectionData.description);
        formData.append('category', collectionData.category);
        formData.append('image', image ? document.querySelector('#image').files[0] : '');
        formData.append('customFields', JSON.stringify(prepareCustomFields()));

        try {
            const response = await createCollection(userId, formData);
            console.log(response.data);
        } catch (error) {
            console.error("Error creating collection:", error);
        }
    };

    const renderFields = (type, label) => (
        <div className="row mb-4">
            {Object.keys(collectionData.fields[type]).map((fieldKey, index) => (
                <div className="form-outline mb-4" key={index}>
                    <input
                        type="text"
                        id={`${type}Field${index}`}
                        className="form-control"
                        value={collectionData.fields[type][fieldKey]}
                        onChange={(e) => handleFieldChange(type, fieldKey, e)}
                    />
                    <label className="form-label" htmlFor={`${type}Field${index}`}>Name of the {label} Field</label>
                </div>
            ))}
            <div className="d-flex gap-2">
                {Object.keys(collectionData.fields[type]).length < 3 && (
                    <button style={{ width: "185px" }} className="btn btn-primary" onClick={(e) => { e.preventDefault(); addField(type); }}>
                        Add a {label} Field
                    </button>
                )}
                {Object.keys(collectionData.fields[type]).length > 0 && (
                    <button style={{ width: "220px" }} className="btn btn-danger" onClick={(e) => { e.preventDefault(); removeField(type); }}>
                        Remove a {label} Field
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="modal fade" id="exampleModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Create A Collection</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleCreateCollection}>
                            <div className="form-outline mb-4">
                                <input type="text" id="name" name='name' className="form-control" onChange={handleChange} />
                                <label className="form-label" htmlFor="name">Name<span className="text-danger">*</span></label>
                            </div>
                            <div className="form-outline mb-4">
                                <textarea className="form-control" id="description" name='description' rows="4" onChange={handleChange}></textarea>
                                <label className="form-label" htmlFor="description">Description<span className="text-danger">*</span></label>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label">Category</label><br />
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="category" id="categoryBooks" value="books" onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="categoryBooks">Books</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="category" id="categoryMusic" value="music" onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="categoryMusic">Music</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="category" id="categoryTools" value="tools" onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="categoryTools">Tools</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="category" id="categoryWealth" value="wealth" onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="categoryWealth">Wealth</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="category" id="categoryOthers" value="others" onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="categoryOthers">Others</label>
                                </div>
                            </div>
                            <div className="form-outline mb-4">
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Uploaded"
                                        style={{ width: '100%', maxHeight: '250px', marginBottom: "10px" }}
                                    />
                                ) : ''}
                                <input
                                    type="file"
                                    id="image"
                                    name='image'
                                    className="form-control"
                                    onChange={handleImageUpload}
                                />
                                <label className="form-label" htmlFor="image">Image</label>
                            </div>
                            <h5>Custom Fields:</h5>
                            {renderFields('shortText', 'Short Text')}
                            {renderFields('longText', 'Long Text')}
                            {renderFields('number', 'Number')}
                            {renderFields('checkbox', 'Checkbox')}
                            {renderFields('date', 'Date')}

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Create Collection</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
