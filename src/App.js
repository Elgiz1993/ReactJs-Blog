import Layout from "./Components/Layout";
import Home from "./Components/Home";
import NewPost from "./Components/NewPost";
import PostPage from "./Components/PostPage";
import EditPost from "./Components/EditPost";
import About from "./Components/About";
import Missing from "./Components/Missing";
import { Route, Routes } from 'react-router-dom';
import { DataProvider } from "./context/DataContext";


function App() {
  
  return (
    <DataProvider>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="post">
          <Route index element={<NewPost/>} />
          <Route path=":id" element={<PostPage />} />
        </Route>

        <Route path="edit/:id">
            <Route index element={<EditPost />}/>
        </Route>

        <Route path="about" element={<About/>} />
        <Route path="*" element={<Missing/>} />
      </Route>
    </Routes>
    </DataProvider> 
  );
}

export default App;
