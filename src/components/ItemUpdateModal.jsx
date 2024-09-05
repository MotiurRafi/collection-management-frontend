import React, { useState, useEffect, useRef } from 'react';
import { updateItem, searchTag } from '../api';

export default function ItemUpdateModal({ item, urlId, fetchItem }) {
  const closeButtonRef = useRef(null);
  const [resLog, setResLog] = useState('')
  const [searchedTags, setSearchedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sfv1: '',
    sfv2: '',
    sfv3: '',
    mlfv1: '',
    mlfv2: '',
    mlfv3: '',
    cfv1: false,
    cfv2: false,
    cfv3: false,
    ifv1: '',
    ifv2: '',
    ifv3: '',
    dfv1: '',
    dfv2: '',
    dfv3: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        sfv1: item.string_field1_value || '',
        sfv2: item.string_field2_value || '',
        sfv3: item.string_field3_value || '',
        mlfv1: item.multiline_text_field1_value || '',
        mlfv2: item.multiline_text_field2_value || '',
        mlfv3: item.multiline_text_field3_value || '',
        cfv1: item.checkbox_field1_value === "true",
        cfv2: item.checkbox_field2_value === "true",
        cfv3: item.checkbox_field3_value === "true",
        ifv1: item.integer_field1_value || '',
        ifv2: item.integer_field2_value || '',
        ifv3: item.integer_field3_value || '',
        dfv1: item.date_field1_value || '',
        dfv2: item.date_field2_value || '',
        dfv3: item.date_field3_value || '',
      });
      setSelectedTags(item.Tags || []);
    }
  }, [item]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, type, checked, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingTagNames = new Set(item.Tags.map(tag => tag.name));
      const selectedTagNames = new Set(selectedTags.map(tag => tag.name));
      const tagsToRemove = Array.from(existingTagNames).filter(name => !selectedTagNames.has(name));

      const response = await updateItem(item.id, {
        name: formData.name,
        customFieldValues: formData,
        tagsToRemove: tagsToRemove,
        tags: selectedTags.map(tag => tag.name)
      });
      console.log("Item updated successfully:", response.data);
      fetchItem(urlId)
      closeButtonRef.current.click();
    } catch (error) {
      console.error("Error updating item:", error);
      setResLog('Updating item failed')
    }
  };

  const renderDynamicFields = (fields) => {
    return fields.map((field, index) => (
      <div className='form-outline mb-4' key={index}>
        <label className='form-label' htmlFor={field.name}>{field.label}</label>
        {field.type === 'checkbox' ? (
          <input
            className='form-check-input'
            type='checkbox'
            name={field.name}
            id={field.name}
            checked={formData[field.name]}
            onChange={handleChange}
          />
        ) : field.type === 'textarea' ? (
          <textarea
            className='form-control'
            name={field.name}
            id={field.name}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ) : (
          <input
            className='form-control'
            type={field.type}
            name={field.name}
            id={field.name}
            value={formData[field.name]}
            onChange={handleChange}
          />
        )}
      </div>
    ));
  };

  const renderInputFields = () => {
    if (!item?.Collection) return null;

    const fields = [
      { name: 'sfv1', type: 'text', label: item.Collection.string_field1_name, state: item.Collection.string_field1_state },
      { name: 'sfv2', type: 'text', label: item.Collection.string_field2_name, state: item.Collection.string_field2_state },
      { name: 'sfv3', type: 'text', label: item.Collection.string_field3_name, state: item.Collection.string_field3_state },
      { name: 'ifv1', type: 'number', label: item.Collection.integer_field1_name, state: item.Collection.integer_field1_state },
      { name: 'ifv2', type: 'number', label: item.Collection.integer_field2_name, state: item.Collection.integer_field2_state },
      { name: 'ifv3', type: 'number', label: item.Collection.integer_field3_name, state: item.Collection.integer_field3_state },
      { name: 'mlfv1', type: 'textarea', label: item.Collection.multiline_text_field1_name, state: item.Collection.multiline_text_field1_state },
      { name: 'mlfv2', type: 'textarea', label: item.Collection.multiline_text_field2_name, state: item.Collection.multiline_text_field2_state },
      { name: 'mlfv3', type: 'textarea', label: item.Collection.multiline_text_field3_name, state: item.Collection.multiline_text_field3_state },
      { name: 'cfv1', type: 'checkbox', label: item.Collection.checkbox_field1_name, state: item.Collection.checkbox_field1_state },
      { name: 'cfv2', type: 'checkbox', label: item.Collection.checkbox_field2_name, state: item.Collection.checkbox_field2_state },
      { name: 'cfv3', type: 'checkbox', label: item.Collection.checkbox_field3_name, state: item.Collection.checkbox_field3_state },
      { name: 'dfv1', type: 'date', label: item.Collection.date_field1_name, state: item.Collection.date_field1_state },
      { name: 'dfv2', type: 'date', label: item.Collection.date_field2_name, state: item.Collection.date_field2_state },
      { name: 'dfv3', type: 'date', label: item.Collection.date_field3_name, state: item.Collection.date_field3_state },
    ].filter(field => field.state);

    return renderDynamicFields(fields);
  };


  const handleTagSearch = async (query) => {
    if (query && query !== '') {
      try {
        const response = await searchTag(query);
        setSearchedTags(response.data);
      } catch (error) {
        console.error('Error getting tag:', error);
      }
    } else {
      setSearchedTags([]);
    }
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.some(selectedTag => selectedTag.name === tag.name)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchedTags([]);
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.name !== tagToRemove.name));
  };

  return (
    <div className="modal fade" id="updateitemmodal" tabIndex="-1" aria-labelledby="updateItemModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="updateItemModalLabel">Update Item</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className='form-outline mb-4'>
                <label className='form-label' htmlFor='name'>Name</label>
                <input
                  className='form-control'
                  type='text'
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  id='name'
                />
              </div>
              {renderInputFields()}

              <div className="add_tag">
                <h6>Add Tag</h6>
                <input
                  type="text"
                  name="searchTag"
                  id="searchTag"
                  className="searchTag form-control"
                  onChange={(e) => handleTagSearch(e.target.value)}
                  autoComplete="off"
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
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  disabled={searchedTags.length > 0}
                  onClick={() => {
                    const inputElement = document.getElementById('searchTag');
                    const tagName = inputElement.value.trim();
                    if (tagName && !selectedTags.some(tag => tag.name === tagName)) {
                      setSelectedTags([...selectedTags, { name: tagName }]);
                      inputElement.value = '';
                    }
                  }}
                >
                  Add
                </button>
              </div>

              <div className="selected-tags mt-3">
                {selectedTags.map((tag) => (
                  <span key={tag.name} className="badge bg-primary me-2">
                    {tag.name}
                    <button
                      type="button"
                      className="btn-close ms-2"
                      aria-label="Remove"
                      onClick={() => handleRemoveTag(tag)}
                    ></button>
                  </span>
                ))}
              </div>
              <button type="button" className="btn btn-secondary mt-3 mx-1" data-bs-dismiss="modal" ref={closeButtonRef}>Close</button>
              <button type="submit" className="btn btn-primary mt-3">Update</button>
              <small className='small text-danger'>{resLog}</small>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
