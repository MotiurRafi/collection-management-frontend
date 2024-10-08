import React, { useState, useEffect, useRef } from 'react';
import { updateCollection } from '../api';

export default function CollectionUpdateModal({ collection, fetchCollection, urlId }) {
    const closeButtonRef = useRef(null);
    const [resLog, setResLog] = useState('')
    const [name, setName] = useState(collection.name);
    const [description, setDescription] = useState(collection.description);
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState(collection.category);
    const [fields, setFields] = useState({
        sfn: {},
        mlfn: {},
        ifn: {},
        cfn: {},
        dfn: {}
    });
    const uiCategories = ['books', 'artworks', 'stamps', 'coins', 'antique', 'comics', 'music', 'tools', 'wealth', 'others']

    useEffect(() => {
        const initialFields = {
            sfn: {},
            mlfn: {},
            ifn: {},
            cfn: {},
            dfn: {}
        };

        if (collection.integer_field1_state && collection.integer_field1_name) {
            initialFields.ifn.ifn1 = collection.integer_field1_name;
        }
        if (collection.integer_field2_state && collection.integer_field2_name) {
            initialFields.ifn.ifn2 = collection.integer_field2_name;
        }
        if (collection.integer_field3_state && collection.integer_field3_name) {
            initialFields.ifn.ifn3 = collection.integer_field3_name;
        }

        if (collection.string_field1_state && collection.string_field1_name) {
            initialFields.sfn.sfn1 = collection.string_field1_name;
        }
        if (collection.string_field2_state && collection.string_field2_name) {
            initialFields.sfn.sfn2 = collection.string_field2_name;
        }
        if (collection.string_field3_state && collection.string_field3_name) {
            initialFields.sfn.sfn3 = collection.string_field3_name;
        }

        if (collection.multiline_text_field1_state && collection.multiline_text_field1_name) {
            initialFields.mlfn.mlfn1 = collection.multiline_text_field1_name;
        }
        if (collection.multiline_text_field2_state && collection.multiline_text_field2_name) {
            initialFields.mlfn.mlfn2 = collection.multiline_text_field2_name;
        }
        if (collection.multiline_text_field3_state && collection.multiline_text_field3_name) {
            initialFields.mlfn.mlfn3 = collection.multiline_text_field3_name;
        }

        if (collection.checkbox_field1_state && collection.checkbox_field1_name) {
            initialFields.cfn.cfn1 = collection.checkbox_field1_name;
        }
        if (collection.checkbox_field2_state && collection.checkbox_field2_name) {
            initialFields.cfn.cfn2 = collection.checkbox_field2_name;
        }
        if (collection.checkbox_field3_state && collection.checkbox_field3_name) {
            initialFields.cfn.cfn3 = collection.checkbox_field3_name;
        }

        if (collection.date_field1_state && collection.date_field1_name) {
            initialFields.dfn.dfn1 = collection.date_field1_name;
        }
        if (collection.date_field2_state && collection.date_field2_name) {
            initialFields.dfn.dfn2 = collection.date_field2_name;
        }
        if (collection.date_field3_state && collection.date_field3_name) {
            initialFields.dfn.dfn3 = collection.date_field3_name;
        }
        setFields(initialFields);
    }, [collection]);

    const renderFields = (name, label) => {
        return (
            <div className="row mb-4">
                {Object.keys(fields[name]).map((fieldKey, index) => (
                    <div className="form-outline mb-4" key={index}>
                        <input
                            type="text"
                            id={name + (index + 1)}
                            className="form-control"
                            value={fields[name][fieldKey]}
                            onChange={(e) => handleFieldChange(name, fieldKey, e)}
                        />
                        <label className="form-label" htmlFor={`${name}Field${index}`}>Name of the {label} Field</label>
                    </div>
                ))}
                <div className="d-flex gap-2">
                    {Object.keys(fields[name]).length < 3 && (
                        <button style={{ width: "185px" }} className="btn btn-primary" onClick={(e) => { e.preventDefault(); addField(name); }}>
                            Add a {label} Field
                        </button>
                    )}
                    {Object.keys(fields[name]).length > 0 && (
                        <button style={{ width: "220px" }} className="btn btn-danger" onClick={(e) => { e.preventDefault(); removeField(name); }}>
                            Remove a {label} Field
                        </button>
                    )}
                </div>
            </div>
        )
    };

    const addField = (name) => {
        if (Object.keys(fields[name]).length < 3) {
            const newKey = `${name}${Object.keys(fields[name]).length + 1}`;
            setFields({
                ...fields,
                [name]: { ...fields[name], [newKey]: '' }
            });
        }
    };

    const removeField = (name) => {
        if (Object.keys(fields[name]).length > 0) {
            const newFields = { ...fields[name] };
            delete newFields[`${name}${Object.keys(fields[name]).length}`];
            setFields({
                ...fields,
                [name]: newFields
            });
        }
    };

    const handleFieldChange = (name, fieldKey, e) => {
        const { value } = e.target;
        setFields({
            ...fields,
            [name]: {
                ...fields[name],
                [fieldKey]: value
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);

        if (image) {
            formData.append('image', image);
        }

        const flatCustomFields = {};
        Object.keys(fields).forEach(fieldGroup => {
            Object.keys(fields[fieldGroup]).forEach(fieldKey => {
                flatCustomFields[fieldKey] = fields[fieldGroup][fieldKey];
            });
        });
        formData.append('customFields', JSON.stringify(flatCustomFields));

        try {
            await updateCollection(formData, collection.id);
            fetchCollection(urlId)
            closeButtonRef.current.click();
        } catch (error) {
            console.error('Failed to update collection', error);
            setResLog('Updating collection failed')
        }
    };


    return (
        <div className="modal fade" id="updatecollectionmodal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Collection</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    name='name'
                                    id="name"
                                    className="form-control"
                                    required
                                />
                                <label className="form-label" htmlFor="name">Name</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name='description'
                                    id="description"
                                    className="form-control"
                                    required
                                />
                                <label className="form-label" htmlFor="description">Description</label>
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label">Category</label><br />
                                {uiCategories.map((cat, index) => (
                                    <div className="form-check form-check-inline" key={index}>
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="category"
                                            id={`category${index}`}
                                            value={cat}
                                            checked={category === cat}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label text-capitalize" htmlFor={`category${index}`}>
                                            {cat}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleImageChange}
                                    className="form-control"
                                    accept="image/*"
                                />
                                <label className="form-label" htmlFor="image">Image</label>
                            </div>

                            <h5>Custom Fields:</h5>
                            {renderFields('sfn', 'Short Text')}
                            {renderFields('mlfn', 'Multiline Text')}
                            {renderFields('ifn', 'Number')}
                            {renderFields('cfn', 'Checkbox')}
                            {renderFields('dfn', 'Date')}

                            <div className="modal-footer">
                                <small className='small text-danger'>{resLog}</small>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={closeButtonRef}>Close</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
