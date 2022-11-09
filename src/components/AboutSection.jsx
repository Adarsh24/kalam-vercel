import React, { useState } from 'react'
import clsx from 'clsx'

import { useAuth } from '../contexts/AuthContext'
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase"

import { PencilIcon } from '@heroicons/react/20/solid';

export default function AboutSection(props) {
  let [isExpanded, setIsExpanded] = useState(false)

  let {currentUser, userDetails, fetchUserDetails} = useAuth()
  
  const [isEditing, setIsEditing] = useState()
  const [aboutContent, setAboutContent] = useState()
  const [isSaving, setIsSaving] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutContent(value);
  }

  function edit() {
    setAboutContent(userDetails?.about);
    setIsEditing(true);
  }

  async function saveProcess() {
    setIsSaving(true);
    
    const db = getDatabase();
    set(ref(db, 'users/' + currentUser.uid + '/about' ), aboutContent);

    userDetails = await fetchUserDetails();

    setIsSaving(false);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <section {...props}>
        <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
          <TinyWaveFormIcon
            colors={['fill-violet-300', 'fill-pink-300']}
            className="h-2.5 w-2.5"
          />
          <span className="ml-2.5">About</span>
        </h2>
        <div className="mt-3">
          <textarea
            rows={4}
            value={aboutContent}
            onChange={ handleChange }
            onKeyUp={ handleChange }
            name="comment"
            id="comment"
            placeholder='Write about yourself. Tell your audience who you are and why you write about the topic?'
            className="font-display block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={clsx(
                isSaving && 'hidden',
                'inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => saveProcess()}
              disabled={isSaving}
              className="inline-flex items-center rounded-md border border-transparent bg-pink-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              { isSaving ? 'Saving' : 'Save' }
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section {...props}>
      <h2 className="flex items-center mb-3 font-mono text-sm font-medium leading-7 text-slate-900">
        <TinyWaveFormIcon
          colors={['fill-violet-300', 'fill-pink-300']}
          className="h-2.5 w-2.5"
        />
        <span className="ml-2.5">About</span>
      </h2>
      <div 
        className={clsx(
          'mt-2 font-display text-sm leading-7 text-slate-700',
          !userDetails?.about && 'hidden',
        )}
      >
        <p className='normal-case whitespace-pre-line'>{ userDetails?.about }</p>
        <div onClick={() => edit()}
          className='mt-1 flex items-center space-x-1 text-sm italic text-slate-500 cursor-pointer'>
          <PencilIcon className='h-3.5 w-3.5' />
          <p className='font-display text-sm'>Edit</p>
        </div>
      </div>
      <a 
        href='#'
        onClick={() => edit()}
        className={clsx(
          'mt-4 font-display text-sm leading-6 text-slate-700 hover:text-slate-500',
          userDetails?.about && 'hidden',
        )}
      >
        <p
        >
          Write about yourself. Tell your audience who you are and why you write about the topic?
        </p>
      </a>
    </section>
  )
  
  function TinyWaveFormIcon({ colors = [], ...props }) {
    return (
      <svg aria-hidden="true" viewBox="0 0 10 10" {...props}>
        <path
          d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z"
          className={colors[0]}
        />
        <path
          d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"
          className={colors[1]}
        />
      </svg>
    )
  }
}
