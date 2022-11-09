import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment';

import { timestampToDate, getLocalData } from '../helpers';
import { useAuth } from '../contexts/AuthContext';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'

export default function Calendar({postDates}) {
  const {currentUser} = useAuth()

  const [currentMonthDetails, setCurrentMonthDetails] = useState(currentMonth())
  const [calendarDays, setCalendarDays] = useState(daysList())

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="mt-2 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-2 xl:col-start-9">
      <div className="flex items-center text-gray-900">
        <button
          type="button"
          onClick={() => changeCalendarMonth('prev')}
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex-auto font-semibold">{ currentMonthDetails.name }</div>
        <button
          type="button"
          onClick={() => changeCalendarMonth('next')}
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>
      <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {calendarDays.map((day, dayIdx) => (
          <Link
            to={`/posts/${day.date}`}
            key={day.date}
            className={classNames(
              'py-1.5 hover:bg-gray-100 focus:z-10',
              day.isCurrentMonth ? postDates.indexOf(day.date) > -1 ? 'bg-green-100' : 'bg-white' : postDates.indexOf(day.date) > -1 ? 'bg-green-50' : 'bg-gray-50',
              (day.isSelected || day.isToday) && 'font-semibold',
              day.isSelected && 'text-white',
              !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
              !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
              day.isToday && !day.isSelected && 'text-pink-600',
              dayIdx === 0 && 'rounded-tl-lg',
              dayIdx === 6 && 'rounded-tr-lg',
              dayIdx === calendarDays.length - 7 && 'rounded-bl-lg',
              dayIdx === calendarDays.length - 1 && 'rounded-br-lg'
            )}
          >
            <time
              dateTime={day.date}
              className={classNames(
                'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                day.isSelected && day.isToday && 'bg-pink-600',
                day.isSelected && !day.isToday && 'bg-gray-900'
              )}
            >
              {day.date.split('-').pop().replace(/^0/, '')}
            </time>
          </Link>
        ))}
      </div>
      <Link
        to="/post/add"
        className="mt-10 w-full rounded-md border border-transparent bg-pink-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Create New Post
      </Link>
    </div>
  );

  function currentMonth() {
    var today = new Date();
    var month = today.getMonth() + 1; // 0 -> January
    var year = today.getFullYear();
    
    const monthName = moment(today.toISOString()).format("MMMM");

    const yearMonth = `${year}-${month}`;
    const prevNextDetails = getPrevNextMonths(yearMonth);

    return {
      name: monthName,
      current_date: yearMonth,
      prev_date: prevNextDetails.prev,
      next_date: prevNextDetails.next
    };

    // setCurrentMonthDetails();

    // return yearMonth;
  }
  
  function getPrevNextMonths(yearMonth) {
    var prevDate = new Date(`${yearMonth}-01`);
    prevDate.setMonth(prevDate.getMonth() - 1);
  
    var nextDate = new Date(`${yearMonth}-01`);
    nextDate.setMonth(nextDate.getMonth() + 1);
  
    var prevYearMonth = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`;
    var nextYearMonth = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}`;
  
    return {
      "prev": prevYearMonth,
      "next": nextYearMonth
    };
  }

  function daysList(yearMonth = null) {
    if (yearMonth == null) {
      yearMonth = currentMonthDetails.current_date;
    }
    const splitYearMonth = yearMonth.split("-")
    const year = splitYearMonth[0]
    const month = splitYearMonth[1]

    const list = [];
    const date = `${year}-${('0'+month).slice(-2)}`
    const dateInstance = new Date(`${date}-01`);

    let from = moment(dateInstance);
    let fromDay = from.format('dddd');
    if (fromDay != "Monday") {
      from = from.isoWeekday(1);
    }

    let to = moment(dateInstance).endOf('month');
    const toDayName = to.format('dddd');
    if (toDayName != "Sunday") {
      to = to.isoWeekday(7);
    }

    for (let m = moment(from); m.isBefore(to); m.add(1, 'days')) {
      const dateMonth = m.format('MM');
      const isCurrentMonth = parseInt(month) == parseInt(dateMonth);
      
      const date = m.format('YYYY-MM-DD');
      const todayDate = moment().format('YYYY-MM-DD');
      const isToday = date == todayDate;

      list.push({
        date: date,
        isCurrentMonth,
        isToday
      });
    }

    return list;
    // setCalendarDays(list);
  }

  function changeCalendarMonth(changeDirection) {
    const yearMonth = currentMonthDetails[`${changeDirection}_date`]; 
    const baseDate = `${yearMonth}-01`;
    const dateObject = new Date(baseDate);

    const splitYearMonth = yearMonth.split("-")
    const year = splitYearMonth[0]
    const month = splitYearMonth[1]

    const currentYear = moment().format('YYYY');

    let monthName = moment(dateObject.toISOString()).format("MMMM");
    if (year != currentYear) {
      monthName = moment(dateObject.toISOString()).format("MMM YYYY");
    }

    const prevNextDetails = getPrevNextMonths(yearMonth);

    setCurrentMonthDetails({
      name: monthName,
      current_date: yearMonth,
      prev_date: prevNextDetails.prev,
      next_date: prevNextDetails.next
    });

    setCalendarDays(daysList(yearMonth));
  }
}