import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// import DemoContainer from "./App";
import Calendar from './App';
interface I18n {
  previousMonth: string;
  nextMonth: string;
  months: string[];
  weekdays: string[];
  weekdaysShort: string[];
}

const i18nz: I18n = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  weekdays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

ReactDOM.render(
  <React.StrictMode>
    <div className="wrapper">
      {/* <DemoContainer i18n={i18nz} /> */}
      <Calendar i18n={i18nz} />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
