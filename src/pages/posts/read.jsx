import { Fragment, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";

import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getDatabase, ref, set } from "firebase/database";

import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { Container } from "../../components/Container";
import { FormattedDate } from "../../components/FormattedDate";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { getLocalData, setLocalData, decrypt } from "../../helpers";

export default function ReadPost() {
    const { currentUser, redirect } = useAuth()

    const {post_id} = useParams();
    const posts = getLocalData(`posts-${currentUser.uid}`);
    if (posts == null) {
      redirect('/home');
    }

    const currentPost = posts.find(post => post.post_id == post_id);
    if (currentPost == null) {
      redirect('/home');
    }

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    function getPreviewUrl(imageName) {
      return `https://firebasestorage.googleapis.com/v0/b/first-react-app-665ac.appspot.com/o/post-images%2F${imageName}?alt=media&token=aa5de641-644b-41e0-a61f-dba898caa004`;
    }

    function deleteProcess() {
      setIsDeleting(true);

      const db = getDatabase();
      set(ref(db, 'posts/' + currentUser.uid + '/' + post_id.toString()), null);

      const updatedPosts = posts.filter(post => post.post_id != post_id);
      setLocalData(`posts-${currentUser.uid}`, updatedPosts, true);

      setIsDeleting(false);
      redirect("/home");
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
                      {currentPost.title}
                    </h1>
                  </div>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    disabled={isDeleting}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 text-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-red-600"
                  >
                    {isDeleting ? 'Deleting' : 'Delete Post'}
                  </button>
                </Container>
                <div className="mt-16 lg:px-5">
                  <div className="lg:max-w-4xl">
                    <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                      <div className="-mt-5 mb-10 flex font-display text-xs">
                        <p className={
                          clsx(
                            currentPost.created_at != currentPost.edited_at && 'hidden',
                            'text-xs text-slate-400 font-medium'
                          )
                        }>
                          Published at <FormattedDate
                          date={new Date(currentPost.created_at)}
                          className="font-display text-xs text-slate-400"
                          />
                        </p>

                        <p className={
                          clsx(
                            currentPost.created_at == currentPost.edited_at && 'hidden',
                            'text-xs text-slate-400 font-medium'
                          )
                        }>
                          Last edited <FormattedDate
                          date={new Date(currentPost.edited_at)}
                          className="font-display text-xs text-slate-400"
                          />
                        </p>
                      </div>
                      <div className="flex flex-col space-y-5">
                        <div dangerouslySetInnerHTML={{ __html: decrypt(currentUser.uid, currentPost.content) }}/>
                      </div>
                      {currentPost.files != null && currentPost.files != '' && (
                        <div className="mt-10 flex gap-x-5">
                          {currentPost.files.split("||").map((imageName) => (
                            <a key={imageName} href={getPreviewUrl(imageName)} target="_blank">
                              <div className="rounded-md h-40 w-40 border-2 border-gray-300 hover:border-pink-400 bg-cover bg-no-repeat" style={{backgroundImage: `url(${getPreviewUrl(imageName)})`}}></div>
                            </a>
                            // <img src={getPreviewUrl(imageName)} className="h-40 w-40" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Transition.Root show={deleteOpen} as={Fragment}>
                  <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setDeleteOpen}>
                      <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 z-10 overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          >
                          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                              <div className="sm:flex sm:items-start">
                                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                  </div>
                                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                      Delete post?
                                  </Dialog.Title>
                                  <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                      Are you sure you want to delete this post? This action cannot be undone.
                                      </p>
                                  </div>
                                  </div>
                              </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                  type="button"
                                  disabled={isDeleting}
                                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm disabled:opacity-75 disabled:bg-red-600 disabled:cursor-not-allowed hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                  onClick={() => deleteProcess()}
                              >
                                  {isDeleting ? 'Deleting' : 'Delete'}
                              </button>
                              <button
                                  type="button"
                                  className={clsx(
                                    isDeleting && 'hidden',
                                    'mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                                  )}
                                  onClick={() => setDeleteOpen(false)}
                                  ref={cancelButtonRef}
                              >
                                  Cancel
                              </button>
                              </div>
                          </Dialog.Panel>
                          </Transition.Child>
                      </div>
                      </div>
                  </Dialog>
                  </Transition.Root>
              </div>
            )
          }
        </AppLayout>
    );
}