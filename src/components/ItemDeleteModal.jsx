import React from 'react'
import { useNavigate } from "react-router-dom";
import { deleteItem } from '../api';
export default function ItemDeleteModal({urlId, collectionId}) {
    const navigate = useNavigate();

    const removeItem = async () => {
        try {
            await deleteItem(urlId)
            navigate(`/collections/collection?id=${collectionId}`);
            window.location.reload()
        } catch (error) {
            console.error("error deleting Item", error)
        }

    }

    return (
        <div className="modal fade" id="deleteitemmodal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Item</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are You Sure That You Want to Delete The Item.
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-danger" onClick={removeItem}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
