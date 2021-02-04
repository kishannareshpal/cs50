import React from 'react';
import { Link } from 'react-router-dom';

const PaginationLinks = ({ links, currentpage }) => {
    // Compute the page numbers
    const _pagenumbers = () => {
        const arr = []
        for (let i = 1; i < links.last_page + 1; i++) {
            arr.push(
                <li key={i} className={`page-item ${currentpage == i ? "active" : ""}`}>
                    <Link className="page-link" to={`?page=${i}`}>{i}</Link>
                </li>
            )
        }
        return arr;
    }

    return (
        <nav className="mt-3" aria-label="Page navigation">
            <ul className="pagination"> 
                <li className={`page-item ${ links.prev_page == null ? "disabled" : "" }`}>
                    <Link to={`?page=${links.prev_page}`} className="page-link">Previous <small>(Newer)</small></Link>
                </li>

                { _pagenumbers() }
                
                <li className={`page-item ${ links.next_page == null ? "disabled" : "" }`}>
                    <Link to={`?page=${links.next_page}`} className="page-link">Next <small>(Older)</small></Link>
                </li>
            </ul>
        </nav>
    )
}

export default PaginationLinks