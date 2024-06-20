import React, {useState, useEffect} from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import style from "./app.module.css";

function App() {
  const [post, setPost] = useState({postTittle: "", postText: "", timeOfPost: ""});
  const [postes, setPostes] = useState([]);

  const MySwal = withReactContent(Swal)

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
    if(!post.postTittle == "" && !post.postText == ""){
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
    else{
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill post tittle and text.",
      });
    }
  }

  const parseTimeOfPost = (timeOfPost) => {
    const [time, month, day, year] = timeOfPost.split(' ');
    const [hours, minutes] = time.split(':');
    return new Date(`${month} ${day}, ${year} ${hours}:${minutes}`);
  };

  const sortedPostes = [...postes].sort((a, b) => parseTimeOfPost(b.timeOfPost) - parseTimeOfPost(a.timeOfPost));

  const handleRoleOfWebsite = () => {
    Swal.fire({
      title: "Website Disclaimer and User Agreement",
      icon: "info",
      html: `
        <h2>Freedom of Speech</h2>
        <p>At Unknown Blog, we believe in the fundamental right to freedom of speech. Our platform allows users to freely express their opinions, share their thoughts, and engage in open discussions on any topic.</p>

        <h2>User Responsibility</h2>
        <p>While we encourage free expression, it is important to note that users are solely responsible for the content they publish on this website. By posting on [Your Blog Website Name], you acknowledge and agree that:</p>
        <ul>
            <li><strong>Personal Accountability</strong>: You are responsible for ensuring that your content complies with the laws and regulations of your country. Any consequences arising from your posts, including legal issues or other conflicts, are your own responsibility.</li>
            <li><strong>Content Ownership</strong>: You retain ownership of your content but grant [Your Blog Website Name] the right to display and distribute your posts.</li>
            <li><strong>Respect and Legality</strong>: We encourage respectful discourse. Hate speech, threats, or illegal content are not tolerated and may be removed at our discretion.</li>
        </ul>

        <h2>No Liability</h2>
        <p>Unknown Blog operates as an open platform and does not endorse or take responsibility for the content posted by users. We do not monitor or verify the information shared on this site, and as such, we cannot be held liable for any user-generated content.</p>

        <h2>Reporting Issues</h2>
        <p>If you come across content that you believe violates our guidelines or the law, please report it to our moderation team. We will review the content and take appropriate action as necessary.</p>

        <h2>Agreement to Terms</h2>
        <p>By using Unknown Blog, you agree to comply with these terms and acknowledge that you are fully responsible for your own posts and any resulting consequences.</p>

        <p>Thank you for being part of our community and for respecting the principles of free speech and responsible use.</p>
      `
    });
  }

  return (
    <>
      <main>
        <section className={style.post}>
          <input type="text" name="postTittle" placeholder="Tittle" value={post.postTittle} onChange={postHandle}/>
          <textarea name="postText" rows="4" cols="50" placeholder="Write post text here..." value={post.postText} onChange={postHandle}></textarea>
          <button onClick={sendPostHandle}>Post</button>
        </section>

        <section className={style.displayPosts}>
          {sortedPostes.map((post, index) =>
            <div key={index}>
              <h1>{post.postTittle}</h1>
              <p>{post.postText}</p>
              <span>{post.timeOfPost}</span>
            </div>
          )}
        </section>
      </main>

      <footer>
        &copy;2024 Unknown Blog
        <br/>
        <span onClick={handleRoleOfWebsite}>Role of Website</span>
      </footer>
    </>
  )
}

export default App
