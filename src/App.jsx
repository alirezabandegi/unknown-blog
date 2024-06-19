import React, {useState, useEffect} from "react";

function App() {
  const [post, setPost] = useState({postTittle: "", postText: ""});
  const [postes, setPostes] = useState([]);

  useEffect(() => {
    getInfoFromServer();
  }, []);

  const getInfoFromServer = () => {
    fetch("https://unknown-blog-18ca4-default-rtdb.europe-west1.firebasedatabase.app/postes/.json")
    .then(response => response.json())
    .then(data => setPostes(Object.values(data)))
    .catch(err => console.error(err));
  }

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

    fetch("https://unknown-blog-18ca4-default-rtdb.europe-west1.firebasedatabase.app/postes/.json",
      {
        method: 'POST',
        body: JSON.stringify(post)
      }
    )
    .then(response => getInfoFromServer())
    .catch(err => console.error(err));

    setPost({postTittle: "", postText: "", timeOfPost: ""});
  }

  const parseTimeOfPost = (timeOfPost) => {
    const [time, month, day, year] = timeOfPost.split(' ');
    const [hours, minutes] = time.split(':');
    return new Date(`${month} ${day}, ${year} ${hours}:${minutes}`);
  };

  const sortedPostes = [...postes].sort((a, b) => parseTimeOfPost(b.timeOfPost) - parseTimeOfPost(a.timeOfPost));

  return (
    <>
      <div>
        <input type="text" name="postTittle" placeholder="Tittle" value={post.postTittle} onChange={postHandle}/>
        <textarea name="postText" rows="4" cols="50" value={post.postText} onChange={postHandle}></textarea>
        <button onClick={sendPostHandle}>Post</button>
      </div>

      <div>
        {sortedPostes.map((post, index) =>
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
