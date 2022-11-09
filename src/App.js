import { Routes, Route } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext"

import { PrivateRoute, PublicRoute } from "./components/CustomRoute"

import Login from "./pages/login"
import Register from "./pages/register"
import Home from "./pages/home"
import AddPost from "./pages/posts/add"
import ReadPost from "./pages/posts/read"
import EditPost from "./pages/posts/edit"
import DatePosts from "./pages/posts/date"

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route exact path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route exact path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route exact path="/posts/:date" element={<PrivateRoute><DatePosts /></PrivateRoute>} />

          <Route exact path="/post/add" element={<PrivateRoute><AddPost /></PrivateRoute>} />
          <Route exact path="/post/:post_id" element={<PrivateRoute><ReadPost /></PrivateRoute>} />
          <Route exact path="/post/edit/:post_id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App