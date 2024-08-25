import React from 'react'
import { deleteCollection } from '../api'
import { useNavigate } from "react-router-dom";

export default function CollectionDeleteModal({ urlId, userId }) {
    const navigate = useNavigate();

    const removeCollection = async () => {
        try {
            const response = await deleteCollection(urlId)
            console.log(response)
            navigate(`/dashboard?id=${userId}`);
            window.location.reload()
        } catch (error) {
            console.log("error deleting collection", error)
        }

    }


    return (
        <div className="modal fade" id="deletecollectionmodal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Collection</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are You Sure That You Want to Delete The Colection. Associated Items will also be deleted.
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-danger" onClick={removeCollection}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
