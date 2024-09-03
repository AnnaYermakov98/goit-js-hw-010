import flatpickr from "flatpickr";
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
const clockFaceDays = document.querySelector('[data-days]');
const clockFaceHours = document.querySelector('[data-hours]');
const clockFaceMinutes = document.querySelector('[data-minutes]');
const clockFaceSeconds = document.querySelector('[data-seconds]');

let userSelectedDate;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
    handleDateSelection(selectedDates);
    },
        altInput: true,
        altFormat: 'F j, Y H:i',
        locale: Ukrainian,
  };

  flatpickr(dateTimePicker, options);

  function handleDateSelection(selectedDates) {
    if (Date.now() < selectedDates[0].getTime()) {
      userSelectedDate = selectedDates[0];
      startBtn.removeAttribute('disabled');
    } else {
      startBtn.setAttribute('disabled', '');
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    }
  }

  startBtn.addEventListener('click', startButtonHandler);

function startButtonHandler() {
  dateTimePicker.setAttribute('disabled', '');
  startBtn.setAttribute('disabled', '');
  flatpickr(dateTimePicker, options);

  const intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate.getTime() - currentTime;
    
    if (deltaTime <= 0) {
      clearInterval(intervalId);

      updateClock({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateTimePicker.removeAttribute('disabled');
      flatpickr(dateTimePicker, options);
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    updateClock({ days, hours, minutes, seconds });
  }, 1000);
  }
  
    function updateClock({ days, hours, minutes, seconds }) {
      clockFaceDays.textContent = addLeadingZero(days);
      clockFaceHours.textContent = addLeadingZero(hours);
      clockFaceMinutes.textContent = addLeadingZero(minutes);
      clockFaceSeconds.textContent = addLeadingZero(seconds);
  }
  
  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    
    return { days, hours, minutes, seconds };
  }
  
  
  console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
  console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
  console.log(convertMs(24140000)); // {days: 0, hours: 6, minutes: 42, seconds: 20}
  
