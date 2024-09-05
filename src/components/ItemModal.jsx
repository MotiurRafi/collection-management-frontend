import React, { useState, useRef } from 'react';
import { createItem, searchTag } from '../api';

export default function ItemModal({ collection, fetchCollection, urlId }) {
    const closeButtonRef = useRef(null);
    const inputRefs = useRef({});
    const [searchedTags, setSearchedTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const[resLog, setResLog] = useState('')
    const [itemData, setItemData] = useState({
        name: "",
        customFieldValues: {},
        tags: []
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setItemData((prevItemData) => ({
            ...prevItemData,
            customFieldValues: {
                ...prevItemData.customFieldValues,
                [name]: type === "checkbox" ? true : value
            }
        }));
    };

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setItemData((prevItemData) => ({
            ...prevItemData,
            [name]: value
        }));
    };

    const handleCreateItem = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...itemData,
                collectionId: collection.id,
                tags: selectedTags.map(tag => tag.name)
            };
            await createItem(dataToSend);
            fetchCollection(urlId);
            closeButtonRef.current.click();
            Object.keys(inputRefs.current).forEach(key => {
                if (inputRefs.current[key]) {
                    inputRefs.current[key].value = '';
                }
            });

        } catch (error) {
            console.error("Error creating item:", error);
            setResLog('Item creation unsuccessful')
        }
    };

    const handleTagSearch = async (query) => {
        if (query && query !== '') {
            try {
                const response = await searchTag(query);
                setSearchedTags(response.data);
            } catch (error) {
                console.error('Error getting tag:', error);
            }
        }
    };

    const handleTagClick = (tag) => {
        if (!selectedTags.some(selectedTag => selectedTag.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setSearchedTags([]);
    };

    const handleAddTag = () => {
        const inputElement = inputRefs.current['searchTag'];
        const tagName = inputElement.value.trim();

        if (tagName && !selectedTags.some(tag => tag.name === tagName)) {
            setSelectedTags([...selectedTags, { name: tagName }]);
            inputElement.value = '';
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagToRemove.id));
    };

    const customFields = [
        { state: collection.string_field1_state, name: collection.string_field1_name, valueName: "sfv1", type: 'text' },
        { state: collection.string_field2_state, name: collection.string_field2_name, valueName: "sfv2", type: 'text' },
        { state: collection.string_field3_state, name: collection.string_field3_name, valueName: "sfv3", type: 'text' },
        { state: collection.multiline_text_field1_state, name: collection.multiline_text_field1_name, valueName: "mlfv1", type: 'textarea' },
        { state: collection.multiline_text_field2_state, name: collection.multiline_text_field2_name, valueName: "mlfv2", type: 'textarea' },
        { state: collection.multiline_text_field3_state, name: collection.multiline_text_field3_name, valueName: "mlfv3", type: 'textarea' },
        { state: collection.integer_field1_state, name: collection.integer_field1_name, valueName: "ifv1", type: 'number' },
        { state: collection.integer_field2_state, name: collection.integer_field2_name, valueName: "ifv2", type: 'number' },
        { state: collection.integer_field3_state, name: collection.integer_field3_name, valueName: "ifv3", type: 'number' },
        { state: collection.checkbox_field1_state, name: collection.checkbox_field1_name, valueName: "cfv1", type: 'checkbox' },
        { state: collection.checkbox_field2_state, name: collection.checkbox_field2_name, valueName: "cfv2", type: 'checkbox' },
        { state: collection.checkbox_field3_state, name: collection.checkbox_field3_name, valueName: "cfv3", type: 'checkbox' },
        { state: collection.date_field1_state, name: collection.date_field1_name, valueName: "dfv1", type: 'date' },
        { state: collection.date_field2_state, name: collection.date_field2_name, valueName: "dfv2", type: 'date' },
        { state: collection.date_field3_state, name: collection.date_field3_name, valueName: "dfv3", type: 'date' }
    ];

    const renderInputField = (field, index) => {
        if (!field.state || !field.name) return null;

        const refName = field.valueName;

        if (field.type === 'checkbox') {
            return (
                <div className="form-check mb-4" key={index}>
                    <input
                        type="checkbox"
                        id={refName}
                        name={refName}
                        className="form-check-input"
                        onChange={handleChange}
                        ref={el => inputRefs.current[refName] = el}
                    />
                    <label className="form-check-label" htmlFor={refName}>
                        {field.name}
                    </label>
                </div>
            );
        }

        if (field.type === 'textarea') {
            return (
                <div className="form-outline mb-4" key={index}>
                    <textarea
                        className="form-control"
                        id={refName}
                        name={refName}
                        rows="4"
                        onChange={handleChange}
                        ref={el => inputRefs.current[refName] = el}
                    ></textarea>
                    <label className="form-label" htmlFor={refName}>{field.name}</label>
                </div>
            );
        }

        return (
            <div className="form-outline mb-4" key={index}>
                <input
                    type={field.type}
                    id={refName}
                    name={refName}
                    className="form-control"
                    onChange={handleChange}
                    ref={el => inputRefs.current[refName] = el}
                />
                <label className="form-label" htmlFor={refName}>{field.name}</label>
            </div>
        );
    };

    return (
        <div className="modal fade" id="createitemmodal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Create An Item</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleCreateItem}>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    name='name'
                                    id="name"
                                    className="form-control"
                                    onChange={handleNameChange}
                                    required
                                    ref={el => inputRefs.current['name'] = el}
                                />
                                <label className="form-label" htmlFor="name">Name</label>
                            </div>
                            {customFields.map((field, index) => renderInputField(field, index))}
                            <div className="add_tag">
                                <h6>Add Tag</h6>
                                <input
                                    type="text"
                                    name="searchTag"
                                    id="searchTag"
                                    className="searchTag form-control"
                                    onChange={(e) => handleTagSearch(e.target.value)}
                                    autoComplete="off"
                                    ref={el => inputRefs.current['searchTag'] = el}
                                />
                                {searchedTags.length > 0 && (
                                    <ul className="dropdown-menu show">
                                        {searchedTags.map((tag) => (
                                            <li key={tag.id}>
                                                <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={() => handleTagClick(tag)}
                                                >
                                                    {tag.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button type="button" className="btn btn-primary mt-2" onClick={handleAddTag}>Add Tag</button>
                                <div className="mt-3">
                                    {selectedTags.map((tag) => (
                                        <span key={tag.id} className="badge bg-secondary me-2">
                                            {tag.name}
                                            <button type="button" className="btn-close btn-close-white ms-1" onClick={() => handleRemoveTag(tag)}></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <small className='small text-danger'>{resLog}</small>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={closeButtonRef}>Close</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
