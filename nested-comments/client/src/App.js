import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { Post } from "./components/Post"
import { PostList } from "./components/PostLists"
import { PostProvider } from "./contexts/PostContext"

function App() {
  useEffect(() => {
    const hasCookie = document.cookie.includes("userId=")
    if (!hasCookie) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "sally" }), // temporary username
        credentials: "include" // ✅ REQUIRED to accept cookie from backend
      })
        .then(res => res.json())
        .then(user => {
          console.log("✅ User created and cookie set:", user)
        })
        .catch(err => {
          console.error("❌ Failed to create user:", err)
        })
    }
  }, [])
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route
          path="/posts/:id"
          element={
            <PostProvider>
              <Post />
            </PostProvider>
          }
        />
      </Routes>
    </div>
  )
}

export default App