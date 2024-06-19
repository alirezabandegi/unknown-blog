import React, {useState, useEffect} from "react";

function App() {
  const [post, setPost] = useState({postTittle: "", postText: ""});
  const [postes, setPostes] = useState([]);

  function CurrentTime() {
    const now = new Date();

    const minutes = String(now.getMinutes()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();

    return `${hours}:${minutes} ${month} ${day} ${year}`;
  }
  
  const postHandle = (event) => {
    setPost({...post, [event.target.name]: event.target.value, timeOfPost: CurrentTime()});
  }
  const sendPostHandle = () => {
    setPostes([...postes, post]);
    setPost({postTittle: "", postText: "", timeOfPost: ""});
  }


  return (
    <>
      <div>
        <input type="text" name="postTittle" placeholder="Tittle" value={post.postTittle} onChange={postHandle}/>
        <textarea name="postText" rows="4" cols="50" value={post.postText} onChange={postHandle}></textarea>
        <button onClick={sendPostHandle}>Post</button>
      </div>

      <div>
        {postes.map((post, index) =>
          <div key={index}>
            <h1>{post.postTittle}</h1>
            <p>{post.postText}</p>
            <div>
              <span>{post.timeOfPost}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
