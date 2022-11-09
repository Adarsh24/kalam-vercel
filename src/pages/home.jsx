import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import { FormattedDate } from "../components/FormattedDate"
import { useAuth } from "../contexts/AuthContext";
import { Container } from "../components/Container";

import noEntriesImage from "../images/no-entries.png";

import {
  PencilIcon
} from '@heroicons/react/24/outline'
import { readingTime, decrypt } from "../helpers";

export default function Home() {
    const { currentUser } = useAuth()

    function PostEntry({ post }) {
      let date = new Date(post.created_at)
    
      return (
        <article
          aria-labelledby={`post-${post.post_id}-title`}
          className="py-6 sm:py-8"
        >
          <Container>
            <div className="flex flex-col items-start">
              <h2
                id={`post-${post.post_id}-title`}
                className="mt-2 text-lg font-bold text-slate-900"
              >
                <Link to={`/post/${post.post_id}`}>{post.title}</Link>
              </h2>
              <FormattedDate
                date={date}
                className="order-first font-mono text-sm leading-7 text-slate-500"
              />
              <p className="mt-1 font-display text-sm leading-7 text-slate-700">
                {decrypt(currentUser.uid, post.content).replace(/<[^>]*>/g, '').split(" ").splice(0,25).join(" ")}...
              </p>
              <div className="mt-4 flex items-center gap-4">
                <p className="font-display text-xs text-slate-500">
                  {readingTime(decrypt(currentUser.uid, post.content).replace(/<[^>]*>/g, ''))} min read
                </p>
                <Link
                  to={`/post/edit/${post.post_id}`}
                  className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                  aria-label={`Edit ${
                    post.title
                  }`}
                >
                  <span aria-hidden="true">
                    Edit
                  </span>
                </Link>
              </div>
            </div>
          </Container>
        </article>
      )
    }

    function PostList({posts}) {
      if (posts == null) {
        return;
      }
      if (posts.length > 0) {
        return (
          <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
            {posts.map((post) => (
              <PostEntry key={post.post_id} post={post} />
            ))}
          </div>
        );
      }

      return (
        <div className="mt-16 flex flex-col items-center">
          <img src={noEntriesImage} draggable={false} className="w-72" alt="" />
          <h3 className="text-lg font-medium text-gray-600">Even the best of the writers were amateurs when they started</h3>
          <Link
            to="/post/add"
            className="mt-3 inline-flex items-center rounded-md border border-transparent bg-pink-600 py-2 px-6 text-sm font-medium text-white shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Write your first post
            {/* <div className="ml-2 pl-1 pr-1.5 py-0.5 bg-pink-500/70 rounded text-xs text-center">⌘N</div> */}
          </Link>
        </div>
      );
    }

    return (
        <AppLayout>
          {
            (posts) => (
              <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
                <Container>
                  <div className="flex items-center space-x-3">
                    {/* <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-transparent bg-pink-500 p-1 text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <PlusIconMini className="h-4 w-4" aria-hidden="true" />
                    </button> */}
                    <h1 className="text-2xl font-bold leading-7 text-slate-900">
                      Kalam
                    </h1>
                  </div>
                  <Link
                    to="/post/add"
                    className="inline-flex items-center rounded-md border border-transparent bg-pink-600 text-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-pink-600"
                  >
                    New Post
                  </Link>
                </Container>
                <PostList posts={posts} />
              </div>
            )
          }
        </AppLayout>
    );
}