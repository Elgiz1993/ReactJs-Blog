import Layout from "./Components/Layout";
import Home from "./Components/Home";
import NewPost from "./Components/NewPost";
import PostPage from "./Components/PostPage";
import EditPost from "./Components/EditPost";
import About from "./Components/About";
import Missing from "./Components/Missing";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './api/posts'


function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async() => {
      try{
        const response = await api.get('/posts')
        setPosts(response.data)
      } catch (err){
        //Not in the 200 response range
        if(err.response){
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        } else {
          console.log(`Error : ${err.message}`)
        }
      }
    }

    fetchPosts()
  },[])

  useEffect(() => {
    const filteredResults = posts.filter(post =>
      post.body.includes(search)
          || post.title.includes(search))
    setSearchResults(filteredResults.reverse())
  }, [posts, search])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try{
      const response = await api.post('/posts', newPost)
      const allPosts = [...posts, response];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch(err){
      console.log(`Error: ${err.message}`)
    }
  }

  const handleEdit = async(id) =>{
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try{
      const response = await api.put(`/post/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? {...response.data} : post))
      setEditTitle('');
      setEditBody('');
      navigate('/')
    } catch(err){
      console.log(`Error : ${err.message}`)
    }
  }

  const handleDelete = async(id) => {
    try{
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList)
      navigate('/')
    } catch(err){
      console.log(`Error: ${err.message}`)
    }
   
  }

  return (

    <Routes>
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
        <Route index element={<Home posts={searchResults} />} />

        <Route path="post">
          <Route index element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />} />
          <Route path=":id" element={<PostPage
            posts={posts}
            handleDelete={handleDelete}
          />} />
        </Route>

        <Route path="edit/:id">
            <Route index element={
              <EditPost 
                posts={posts}
                handleEdit={handleEdit}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editBody={editBody}
                setEditBody={setEditBody}
              />
            }/>
        </Route>

        <Route path="about" element={<About/>} />
        <Route path="*" element={<Missing/>} />
      </Route>
    </Routes>

  );
}

export default App;
