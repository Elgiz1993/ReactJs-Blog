import React from "react";
import { useParams, Link } from "react-router-dom";

const PostPage = ({posts, handleDelete}) => {
  const {id} = useParams();
  const post = posts.find(post => (post.id) === id)
  return (
    <main className="PostPage">
      <article className="post">
        {post && 
                <>
                    <h2>{post.title}</h2>
                    <p className="postData">{post.datetime}</p>
                    <p className="postBody">{post.body}</p>
                    <button onClick={() => handleDelete(post.id)}>Delete Post</button>
                </>
        }
        { !post && 
                  <>
                      <h2>Post Not Found</h2>
                      <p>Well, that's dissapointing.</p>
                      <p>
                        <Link to={'/'}>Visit our Homepage</Link>
                      </p>
                  </>
        }
      </article>
    </main>
  );
};

export default PostPage;
