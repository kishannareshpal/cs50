import React from 'react';
import Post from '../components/Post';
import PaginationLinks from './PaginationLinks';

// Component: Posts - Used for rendering a list of posts
const Posts = ({ posts, links, currentpage, onModify }) => {
    const posts_list = posts.map(post => <Post onModify={onModify} key={post.id} post={post} />)

    return (
        <div>
            <div>
                <h5 className="text-right mb-0">
                    Page { currentpage } of { links.last_page }
                </h5>
                <div className="text-muted text-right">
                    <small>Max. <span className="font-weight-bold">{ links.per_page }</span> posts per page</small>
                </div>
                <p className="badge badge-light p-2">
                    <i className="fas fa-sort-amount-down"></i> Showing most recent first
                </p>
            </div>

            <ul className="list-group">
                { posts_list }
            </ul>

            <PaginationLinks links={links} currentpage={currentpage} />
        </div>
    )
}

export default Posts