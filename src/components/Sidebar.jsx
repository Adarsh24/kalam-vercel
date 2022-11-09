import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

import Calendar from './Calendar'
import Social from './Social'
import ShortDescription from './ShortDescription'
import { getLocalData, removeDuplicates, timestampToDate } from '../helpers'

export default function Sidebar({about: AboutSection}) {

  const {currentUser} = useAuth()

  function TopArea() {
    const posts = getLocalData(`posts-${currentUser.uid}`);
    // const posts = [{post_id: '123', title: 'testing'}];
    return useMemo(() => {
      if (posts == null) {
        return null;
      }

      if (posts.length > 0) {
        const postDates = removeDuplicates(posts.map((post) => {
          return timestampToDate(post.created_at, 'y-m-d')
        }));
        return (
          <Calendar postDates={postDates} />
        )
      }

      return (
        <Link
          to="/"
          className="relative mx-auto block w-48 overflow-hidden rounded-full bg-slate-200 shadow-xl shadow-slate-200 sm:w-56 sm:rounded-full lg:w-56 lg:rounded-full"
          aria-label="Homepage"
        >
          <img
            className="w-full"
            src={currentUser?.photoURL}
            alt=""
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 sm:rounded-full lg:rounded-full" />
        </Link>
      );
    }, [posts]);
  }

  return (
    <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:py-12 lg:px-8 xl:px-12">
      <TopArea />
      <div className="mt-10 text-center lg:mt-12 lg:text-left">
        <p className="text-xl font-bold text-slate-900">
          <Link to="/">{ currentUser?.displayName }</Link>
        </p>
        <ShortDescription />
      </div>
      <AboutSection className="mt-12 hidden lg:block" />
      {/* <Social /> */}
    </div>
  )
}
