import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import app from "../../firebase"
import { getDatabase, ref, set, query, orderByKey, onValue } from "firebase/database";

import { Container } from "../../components/Container";

import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import { getLocalData, setLocalData, slugify, crypt, decrypt } from "../../helpers";

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/plugins/fullscreen.min.css';
import 'froala-editor/css/plugins/code_view.min.css';
import 'froala-editor/css/plugins/table.min.css';
import 'froala-editor/css/plugins/char_counter.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';

export default function AddPost() {
    const { currentUser, logout, redirect } = useAuth()

    const titleEl = useRef('');
    const [formErrors, setFormErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const config = {
      placeholderText: 'Type your post content here...',
      charCounterCount: true,
      pluginsEnabled: ['fullscreen', 'codeView', 'table', 'charCounter', 'fontSize', 'paragraphFormat'],
      height: 325,
    }
    let editorRef = null;

    function validateForm() {
      const errors = {};

      const formTitle = titleEl?.current?.value;
      if (formTitle.length === 0) {
        errors.title = "Please enter post title";
      }

      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      publishProcess();
    }

    async function publishProcess() {
      setIsSaving(true);

      const formTitle = titleEl?.current?.value;
      const currentTimestamp = Date.now();
      const slug = slugify(formTitle);
      const postId = currentTimestamp;

      const formContent = editorRef.editor.html.get(true);
      const post = {
        post_id: postId,
        slug: slug,
        title: formTitle,
        content: crypt(currentUser.uid, formContent),
        created_at: currentTimestamp,
        edited_at: currentTimestamp
      };

      const db = getDatabase();
      set(ref(db, 'posts/' + currentUser.uid + '/' + postId.toString()), post);

      let localPosts = getLocalData(`posts-${currentUser.uid}`);
      if (Array.isArray(localPosts)) {
        localPosts.unshift(...[post]);
        setLocalData(`posts-${currentUser.uid}`, localPosts, true);
      }

      setIsSaving(false);

      redirect('/home');
    }

    return (
        <AppLayout>
          {
            (posts) => (
              <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
                <Container>
                  <div className="flex items-center space-x-5">
                    <Link
                      to="/home"
                      className="inline-flex items-center rounded-full border border-transparent bg-slate-500 p-1 text-white shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <h1 className="text-2xl font-bold leading-7 text-slate-900">
                      Add New Post
                    </h1>
                  </div>
                  <button
                    onClick={() => validateForm()}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-md border border-transparent bg-pink-600 text-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-pink-600"
                  >
                    {isSaving ? 'Publishing' : 'Publish'}
                  </button>
                </Container>
                <div className="mt-16 lg:px-5">
                  <div className="lg:max-w-4xl">
                    <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                      <div className="flex flex-col space-y-5">
                        <div>
                          <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">
                            Post Title
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="title"
                              id="post-title"
                              ref={titleEl}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                              placeholder="Enter the post title"
                            />
                          </div>
                          <div className="mt-1 text-sm text-red-500">{ formErrors.title }</div>
                        </div>
                        <div>
                          <label htmlFor="post-title" className="mb-1 block text-sm font-medium text-gray-700">
                            Post Content
                          </label>
                          <FroalaEditor ref={(ref) => (editorRef = ref)} config={config} tag='textarea'/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </AppLayout>
    );
}