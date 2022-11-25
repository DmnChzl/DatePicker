import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, DoubleChevronLeft, DoubleChevronRight } from './icons';
import {
  Base,
  CalendarBody,
  CalendarButtonText,
  CalendarHeader,
  CalendarHeaderText,
  DatePickerCalendar,
  DatePickerContainer,
  DatePickerFooter,
  DatePickerHeader,
  DatePickerShadow,
  DynamicButton,
  FooterButton,
  HeaderButton,
  HeaderRow,
  HeaderText
} from './styled';
import { chunk, getCollection, mapCollection, rotateRight as rotate } from '../utils/arrUtils';
import {
  getDateFromDateString,
  getDateStringFromTimestamp,
  getLocale,
  getMonthStr,
  getNumberOfDays
} from '../utils/dateUtils';
import { GRAY, DAYS_VALUES, MONTHS_VALUES, MESSAGES } from '../constants';

const getDaysCollection = getCollection(DAYS_VALUES);
const getMonthsCollection = getCollection(MONTHS_VALUES);

const DAY_TIMEMILLIS = 60 * 60 * 24 * 1000;
const TODAY_TIMESTAMP = Date.now() - (Date.now() % DAY_TIMEMILLIS) + new Date().getTimezoneOffset() * 1000 * 60;

/**
 * Custom hook to handle toggle values
 *
 * @param {boolean} initialValue
 * @returns {*}
 */
function useToggle(initialValue: boolean): [boolean, () => void, () => void] {
  const [value, setValue] = useState(initialValue);
  return [value, () => setValue(true), () => setValue(false)];
}

interface DayArgs {
  firstDay: number;
  numberOfDays: number;
  year: number;
  month: number;
  index: number;
}

interface DayDetail {
  date: number;
  day: number;
  monthIndex: number;
  timestamp: number;
  dayString: string;
}

export type RenderProps = {
  ref: React.RefObject<HTMLInputElement>;
  onOpen: () => void;
  onClose: () => void;
};

interface Props {
  forceLocale?: string;
  dayOfTheWeek?: number;
  color?: string;
  bgColor?: string;
  hideFooter?: boolean;
  customMessages?: Record<string, string>;
  onChange?: (timestamp: number) => void;
  children: (props: RenderProps) => JSX.Element;
}

/**
 * DatePicker Component
 */
export default function DatePicker({ color = '#673ab8', bgColor = '#fff', children, ...props }: Props) {
  const locale = props.forceLocale || getLocale();

  const daysCollection = getDaysCollection(locale)({
    defaultMessages: MESSAGES,
    customMessages: props.customMessages
  });
  const monthsCollection = getMonthsCollection(locale)({
    defaultMessages: MESSAGES,
    customMessages: props.customMessages
  });
  const daysMap = mapCollection(daysCollection);

  /**
   * Retrieves details related to the computed date
   *
   * @param {DayArgs} args { firstDay, numberOfDays, year, month, index }
   * @returns {DayDetail} Day Details
   */
  const getDayDetails = (args: DayArgs): DayDetail => {
    const currentDate = args.index - args.firstDay;
    const currentDay = args.index % 7;

    let prevMonth = args.month - 1;
    let prevYear = args.year;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }

    const prevMonthNbrOfDays = getNumberOfDays(prevYear, prevMonth);
    const date = (currentDate < 0 ? prevMonthNbrOfDays + currentDate : currentDate % args.numberOfDays) + 1;
    const monthIndex = currentDate < 0 ? -1 : currentDate >= args.numberOfDays ? 1 : 0;
    const timestamp = new Date(args.year, args.month, date).getTime();

    return {
      date,
      day: currentDay,
      monthIndex,
      timestamp,
      dayString: daysMap[currentDay]
    };
  };

  /**
   * Updates details by removing full weeks before and after the current month
   *
   * @param {Array} monthDetails
   * @returns {Array}
   */
  const spliceWeeks = (monthDetails: DayDetail[]): DayDetail[] => {
    const prevMonthDetails = monthDetails.filter(({ monthIndex }) => monthIndex === -1);
    const nextMonthDetails = monthDetails.filter(({ monthIndex }) => monthIndex === 1);

    const getFullWeeks = (monthDetails: DayDetail[]) => chunk(monthDetails, 7).filter(chk => chk.length === 7);

    // Removing excess values before
    if (getFullWeeks(prevMonthDetails).length) {
      monthDetails = monthDetails.splice(7 * getFullWeeks(prevMonthDetails).length);
    }

    // Removing excess values after
    if (getFullWeeks(nextMonthDetails).length) {
      monthDetails = monthDetails.splice(0, monthDetails.length - 7 * getFullWeeks(nextMonthDetails).length);
    }

    return monthDetails;
  };

  /**
   * Retrieves details related to the computed month
   *
   * @param {number} year
   * @param {number} month
   * @param {number} dayOfTheWeek (default: 0)
   * @returns {Array} Month Details
   */
  const getMonthDetails = (year: number, month: number, dayOfTheWeek = 0): DayDetail[] => {
    const firstDay = new Date(year, month).getDay();
    const numberOfDays = getNumberOfDays(year, month);

    let details: DayDetail[] = [];
    let currentDay;
    let index = -7 + (dayOfTheWeek % 7);

    // Loop on a grid of 49 values
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
        currentDay = getDayDetails({
          firstDay,
          numberOfDays,
          year,
          month,
          index
        });

        details = [...details, currentDay];
        index++;
      }
    }

    // Remove excess values
    return spliceWeeks(details);
  };

  const now = new Date();
  const presetMonthDetails = (year: number, month: number) => getMonthDetails(year, month, props.dayOfTheWeek);

  const [isDatePickerVisible, setDatePickerOn, setDatePickerOff] = useToggle(false);
  const [monthDetails, setMonthDetails] = useState(presetMonthDetails(now.getFullYear(), now.getMonth()));
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(TODAY_TIMESTAMP);
  const [lastSelectedDay, setLastSelectedDay] = useState(TODAY_TIMESTAMP);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Listener to exit the calendar view
   *
   * @param event The keyboard event
   */
  const addEscapeListener = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setDatePickerOff();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', addEscapeListener);

    /**
     * If the text field has a default value,
     * updates component state with this one,
     * otherwise uses the current date
     */
    if (inputRef.current !== null && inputRef.current.value) {
      updateDateFromInput();
    } else {
      setDateToInput(selectedDay);
    }

    return () => window.removeEventListener('keydown', addEscapeListener);
  }, []);

  useEffect(() => {
    // Each time the calendar view is opened, the previous date is kept
    if (isDatePickerVisible) {
      setLastSelectedDay(selectedDay);
    }
  }, [isDatePickerVisible]);

  const isCurrentDay = (day: { timestamp: number }) => day.timestamp === TODAY_TIMESTAMP;
  const isSelectedDay = (day: { timestamp: number }) => day.timestamp === selectedDay;

  /**
   * Updates component state, and triggers the change event
   *
   * @param {*} obj The year / month / date
   */
  const setPickerDate = (obj: { year: number; month: number; date: number }) => {
    const selectedDay = new Date(obj.year, obj.month - 1, obj.date).getTime();
    setSelectedDay(selectedDay);

    if (props.onChange) {
      props.onChange(selectedDay);
    }
  };

  /**
   * Set component state based on text field value
   */
  const updateDateFromInput = () => {
    const dateVal = inputRef.current !== null ? inputRef.current.value : '';
    const dateObj = getDateFromDateString(dateVal);

    if (dateObj !== null) {
      setPickerDate(dateObj);
      setYear(dateObj.year);
      setMonth(dateObj.month - 1);
      setMonthDetails(presetMonthDetails(dateObj.year, dateObj.month - 1));
    }
  };

  /**
   * Updates text field value from timestamp
   *
   * @param {number} timestamp
   */
  const setDateToInput = (timestamp: number) => {
    const dateString = getDateStringFromTimestamp(timestamp);

    if (inputRef.current !== null) {
      inputRef.current.value = dateString;
    }
  };

  /**
   * Set component state, triggers the change event,
   * and hide the calendar view if footer is off
   *
   * @param {*} { timestamp }
   */
  const handleDateClick = ({ timestamp }: { timestamp: number }) => {
    setSelectedDay(timestamp);

    if (props.hideFooter) {
      applyTimestamp(timestamp);
    }
  };

  /**
   * Apply the timestamp, triggers the change event,
   * and close the calendar view
   *
   * @param {number} timestamp
   */
  const applyTimestamp = (timestamp: number) => {
    setDateToInput(timestamp);

    if (props.onChange) {
      props.onChange(timestamp);
    }

    setDatePickerOff();
  };

  /**
   * Updates the current year value of the component,
   * when clicking on the before / after button of the header
   *
   * @param {number} offset -1 / +1
   */
  const setPickerYear = (offset: number) => {
    const currentYear = year + offset;

    setYear(currentYear);
    setMonthDetails(presetMonthDetails(currentYear, month));
  };

  /**
   * Updates the current month value of the component,
   * when clicking on the before / after button of the header
   *
   * @param {number} offset -1 / +1
   */
  const setPickerMonth = (offset: number) => {
    let currentYear = year;
    let currentMonth = month + offset;

    if (currentMonth === -1) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth === 12) {
      currentMonth = 0;
      currentYear++;
    }

    setYear(currentYear);
    setMonth(currentMonth);
    setMonthDetails(presetMonthDetails(currentYear, currentMonth));
  };

  /**
   * Handles the click on the today button,
   * updating the state of the component with the current timestamp
   */
  const setDateToNow = () => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    handleDateClick({ timestamp: TODAY_TIMESTAMP });

    setYear(currentYear);
    setMonth(currentMonth);
    setMonthDetails(presetMonthDetails(currentYear, currentMonth));
  };

  /**
   * Handles the click on the cancel button,
   * updating the state of the component with the previous date
   */
  const onCancel = () => {
    handleDateClick({ timestamp: lastSelectedDay });
    setDatePickerOff();
  };

  const renderCalendar = () => {
    const rows = chunk(monthDetails, 7).map((row, idx) => (
      <div key={idx} style={{ display: 'flex', marginTop: '0.5rem' }}>
        {row.map((day, idx) => (
          <DynamicButton
            key={idx}
            color={color}
            bgColor={bgColor}
            isActiveMonth={day.monthIndex === 0}
            isSelectedDay={isSelectedDay(day)}
            isCurrentDay={isCurrentDay(day)}
            type="button"
            onClick={() => handleDateClick(day)}
            tabIndex={day.monthIndex !== 0 ? -1 : 0}>
            <CalendarButtonText>{day.date}</CalendarButtonText>
          </DynamicButton>
        ))}
      </div>
    ));

    const daysOfTheWeek = rotate(
      daysCollection.map(day => day.substring(0, 3).toUpperCase()),
      props.dayOfTheWeek || 0
    );

    return (
      <DatePickerCalendar>
        <CalendarHeader>
          {daysOfTheWeek.map((day, idx) => (
            <CalendarHeaderText key={idx} color={GRAY[500]}>
              {day}
            </CalendarHeaderText>
          ))}
        </CalendarHeader>
        <CalendarBody>{rows}</CalendarBody>
      </DatePickerCalendar>
    );
  };

  return (
    <Base>
      {children({ ref: inputRef, onOpen: setDatePickerOn, onClose: setDatePickerOff })}
      {isDatePickerVisible && (
        <DatePickerShadow>
          <DatePickerContainer bgColor={bgColor}>
            <DatePickerHeader id="header" color={color}>
              {/* Month */}
              <HeaderRow>
                <HeaderText bgColor={bgColor}>{getMonthStr(monthsCollection, month)}</HeaderText>
                <HeaderButton color={color} bgColor={bgColor} type="button" onClick={() => setPickerMonth(-1)}>
                  <ChevronLeft width={16} height={16} />
                </HeaderButton>
                <HeaderButton color={color} bgColor={bgColor} type="button" onClick={() => setPickerMonth(1)}>
                  <ChevronRight width={16} height={16} />
                </HeaderButton>
              </HeaderRow>
              {/* Year */}
              <HeaderRow>
                <HeaderText bgColor={bgColor}>{year}</HeaderText>
                <HeaderButton color={color} bgColor={bgColor} type="button" onClick={() => setPickerYear(-1)}>
                  <DoubleChevronLeft width={16} height={16} />
                </HeaderButton>
                <HeaderButton color={color} bgColor={bgColor} type="button" onClick={() => setPickerYear(1)}>
                  <DoubleChevronRight width={16} height={16} />
                </HeaderButton>
              </HeaderRow>
            </DatePickerHeader>
            {renderCalendar()}
            {!props.hideFooter && (
              <DatePickerFooter id="footer">
                <FooterButton
                  color={color}
                  type="button"
                  onClick={setDateToNow}
                  style={{ marginLeft: 0, marginRight: 'auto' }}>
                  {props.customMessages?.['Footer.Today'] || MESSAGES[locale]?.['Footer.Today']}
                </FooterButton>
                <FooterButton color={color} type="button" onClick={onCancel}>
                  {props.customMessages?.['Footer.Cancel'] || MESSAGES[locale]?.['Footer.Cancel']}
                </FooterButton>
                <FooterButton color={color} type="button" onClick={() => applyTimestamp(selectedDay)}>
                  {props.customMessages?.['Footer.Ok'] || MESSAGES[locale]?.['Footer.Ok']}
                </FooterButton>
              </DatePickerFooter>
            )}
          </DatePickerContainer>
        </DatePickerShadow>
      )}
    </Base>
  );
}
