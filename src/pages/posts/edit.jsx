import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getDatabase, ref, set } from "firebase/database";

import { Container } from "../../components/Container";
import { Label } from "../../components/Label";

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

export default function EditPost() {
    const { currentUser, redirect } = useAuth()

    const {post_id} = useParams();
    let posts = getLocalData(`posts-${currentUser.uid}`);
    if (posts == null) {
      redirect('/home');
    }

    const currentPost = posts.find(post => post.post_id == post_id);
    if (currentPost == null) {
      redirect('/home');
    }

    const titleEl = useRef('');
    let editorRef = null;
    const [formErrors, setFormErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      setTimeout(() => editorRef.editor.html.set(decrypt(currentUser.uid, currentPost.content)), 10)
    });

    const config = {
      placeholderText: 'Type your post content here...',
      charCounterCount: true,
      pluginsEnabled: ['fullscreen', 'codeView', 'table', 'charCounter', 'fontSize', 'paragraphFormat'],
      height: 325,
    }

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

      const formContent = editorRef.editor.html.get(true);
      const post = {
        post_id: currentPost.post_id,
        slug: slug,
        title: formTitle,
        content: crypt(currentUser.uid, formContent),
        created_at: currentPost.created_at,
        edited_at: currentTimestamp
      };

      const db = getDatabase();
      set(ref(db, 'posts/' + currentUser.uid + '/' + currentPost.post_id.toString()), post);

      const currentPostIndex = posts.indexOf(currentPost);
      posts[currentPostIndex] = post;
      setLocalData(`posts-${currentUser.uid}`, posts, true);

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
                      Edit Post
                    </h1>
                  </div>
                  <button
                    onClick={() => validateForm()}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-md border border-transparent bg-pink-600 text-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-pink-600"
                  >
                    {isSaving ? 'Updating' : 'Update'}
                  </button>
                </Container>
                <div className="mt-16 lg:px-5">
                  <div className="lg:max-w-4xl">
                    <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                      <div className="flex flex-col space-y-5">
                        <div>
                          <Label htmlFor={'post-title'} title={'Post Title'} />
                          <div className="mt-1">
                            <input
                              type="text"
                              name="title"
                              id="post-title"
                              ref={titleEl}
                              defaultValue={currentPost.title}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                              placeholder="Enter the post title"
                            />
                          </div>
                          <div className="mt-1 text-sm text-red-500">{ formErrors.title }</div>
                        </div>
                        <div>
                          <Label htmlFor={'post-content'} title={'Post Content'} />
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