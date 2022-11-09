import React, { useState, useEffect } from 'react'
import clsx from 'clsx'

import { useAuth } from '../contexts/AuthContext'
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase"

import { PencilIcon } from '@heroicons/react/20/solid';

export default function ShortDescription() {
  let {currentUser, userDetails, fetchUserDetails} = useAuth()
  
  const [isEditing, setIsEditing] = useState()
  const [shortDescription, setShortDescription] = useState()
  const [isSaving, setIsSaving] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShortDescription(value);
  }

  function edit() {
    setShortDescription(userDetails?.short_description);
    setIsEditing(true);
  }

  async function saveProcess() {
    setIsSaving(true);
    
    const db = getDatabase();
    set(ref(db, 'users/' + currentUser.uid + '/short_description' ), shortDescription);

    userDetails = await fetchUserDetails();

    setIsSaving(false);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="mt-3">
        <textarea
          rows={2}
          value={shortDescription}
          onChange={ handleChange }
          onKeyUp={ handleChange }
          name="comment"
          id="comment"
          placeholder='Write a short description about yourself...'
          className="font-display block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
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
    );
  }
  
  return (
    <div className='mt-3 text-lg font-medium leading-8 text-slate-700'>
      <div className={clsx(
        !userDetails?.short_description && 'hidden'
      )}>
        <p className='font-display text-sm normal-case'>{ userDetails?.short_description }</p>
        <div onClick={() => edit()}
          className='mt-1 flex items-center space-x-1 text-sm italic text-slate-500 cursor-pointer'>
          <PencilIcon className='h-3.5 w-3.5' />
          <p className='font-display text-sm'>Edit</p>
        </div>
      </div>

      <a href='#'
      onClick={() => edit()}
      className={clsx(
        userDetails?.short_description && 'hidden',
        'font-display italic text-sm hover:text-slate-500'
      )}>
        Add a short description about yourself
      </a>
    </div>
  );
}
