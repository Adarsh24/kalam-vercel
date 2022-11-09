import React, {Fragment, useId, useState, useEffect} from 'react'

import { useAuth } from "../contexts/AuthContext";
import { getLocalData, setLocalData } from '../helpers';

import Sidebar from './Sidebar'
import AboutSection from './AboutSection'

import {
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import { getDatabase, ref, query, orderByChild, onValue } from "firebase/database";

export default function AppLayout({ children }) {
  let writers = ['Ashwin Parihar']
  const { currentUser, logout } = useAuth()
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    const localPosts = getLocalData(`posts-${currentUser.uid}`);
    if (!localPosts || !Array.isArray(localPosts)) {
      const db = getDatabase();
      const postsRef = query(ref(db, 'posts/' + currentUser.uid), orderByChild('created_at'));
      return onValue(postsRef, (snapshot) => {
        if (snapshot.exists()) {
          let postsData = Object.values(snapshot.val());
          postsData.reverse();
          setPosts(postsData);

          setLocalData(`posts-${currentUser.uid}`, postsData, true);
        }
      }, {
      onlyOnce: true
      });
    }else {
      setPosts(localPosts);
    }
  }, []);

  function randomBetween(min, max, seed = 1) {
    return () => {
      let rand = Math.sin(seed++) * 10000
      rand = rand - Math.floor(rand)
      return Math.floor(rand * (max - min + 1) + min)
    }
  }

  function Waveform(props) {
    let id = useId()
    let bars = {
      total: 100,
      width: 2,
      gap: 2,
      minHeight: 40,
      maxHeight: 100,
    }
  
    let barHeights = Array.from(
      { length: bars.total },
      randomBetween(bars.minHeight, bars.maxHeight)
    )
  
    return (
      <svg aria-hidden="true" {...props}>
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="40%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <linearGradient id={`${id}-gradient`}>
            <stop offset="0%" stopColor="#4989E8" />
            <stop offset="50%" stopColor="#6159DA" />
            <stop offset="100%" stopColor="#FF54AD" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
          </mask>
          <pattern
            id={`${id}-pattern`}
            width={bars.total * bars.width + bars.total * bars.gap}
            height="100%"
            patternUnits="userSpaceOnUse"
          >
            {Array.from({ length: bars.total }, (_, index) => (
              <rect
                key={index}
                width={bars.width}
                height={`${barHeights[index]}%`}
                x={bars.gap * (index + 1) + bars.width * index}
                fill={`url(#${id}-fade)`}
              />
            ))}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-gradient)`}
          mask={`url(#${id}-mask)`}
          opacity="0.25"
        />
      </svg>
    )
  }
  
  function PersonIcon(props) {
    return (
      <svg aria-hidden="true" viewBox="0 0 11 12" {...props}>
        <path d="M5.019 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm3.29 7c1.175 0 2.12-1.046 1.567-2.083A5.5 5.5 0 0 0 5.019 7 5.5 5.5 0 0 0 .162 9.917C-.39 10.954.554 12 1.73 12h6.578Z" />
      </svg>
    )
  }

  function getPosts() {
    return posts;
  }

  return (
    <>
      <header className="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="hidden h-full lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
          <span className="font-mono text-slate-500">Created by</span>
          <span className="mt-6 flex gap-6 font-bold text-slate-900">
            {writers.map((writer, writerIndex) => (
              <Fragment key={writer}>
                {writerIndex !== 0 && (
                  <span aria-hidden="true" className="text-slate-400">
                    /
                  </span>
                )}
                {writer}
              </Fragment>
            ))}
          </span>
          <div className="absolute bottom-12 flex space-y-2">
            {/* <Tippy content={<span>Logout</span>} arrow={false} placement={'right'}>
              <div className='group px-2 py-2.5 rounded-md hover:bg-slate-200'>
                <ArrowRightOnRectangleIcon className='rotate-180 h-6 w-6 text-slate-600 group-hover:text-slate-900' />
              </div>
            </Tippy> */}
            <Tippy content={<span>Logout</span>} arrow={false} placement={'right'}>
              <div onClick={() => logout()} className='group cursor-pointer px-2 py-2.5 rounded-md hover:bg-slate-200'>
                <ArrowRightOnRectangleIcon className='rotate-180 h-6 w-6 text-slate-600 group-hover:text-slate-900' />
              </div>
            </Tippy>
          </div>
        </div>
        <Sidebar about={AboutSection} />
      </header>
      <main className="border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
        <Waveform className="absolute left-0 top-0 h-20 w-full" />
        <div className="relative">{children(posts)}</div>
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 py-10 pb-40 sm:py-16 sm:pb-32 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <AboutSection />
          <h2 className="mt-8 flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
            <PersonIcon className="h-3 w-auto fill-slate-300" />
            <span className="ml-2.5">Hosted by</span>
          </h2>
          <div className="mt-2 flex gap-6 text-sm font-bold leading-7 text-slate-900">
            {writers.map((writer, writerIndex) => (
              <Fragment key={writer}>
                {writerIndex !== 0 && (
                  <span aria-hidden="true" className="text-slate-400">
                    /
                  </span>
                )}
                {writer}
              </Fragment>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
