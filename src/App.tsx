import React, {useState} from "react";

interface I18n {
  previousMonth: string;
  nextMonth: string;
  months: string[];
  weekdays: string[];
  weekdaysShort: string[];
}

const range = (length: number) => Array(length).fill(null);

const sameDates = (d1: Date, d2: Date) => {
  return (
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const deltaDate = (
  date: Date,
  yearDelta: number,
  monthDelta = 0,
  dayDelta = 0
) => {
  return new Date(
    date.getFullYear() + yearDelta,
    date.getMonth() + monthDelta,
    date.getDate() + dayDelta
  );
};

const abbreviationDays = (i18n: I18n, weekStart: number) => {
  return range(7).map((_, i) =>
    i >= 7 ? i18n.weekdaysShort[i - 7] : i18n.weekdaysShort[i]
  );
};

const generateMatrix = (date: Date, weekStart: number) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const diff =
    (firstDayOfMonth.getDay() < weekStart ? 7 : 0) +
    firstDayOfMonth.getDay() -
    weekStart;
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    firstDayOfMonth.getDate() - diff
  );

  return range(6).map((row, i) => {
    return range(7).map((column, j) => {
      return new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i * 7 + j
      );
    });
  });
};

interface PickerProps {
  cursor: Date;
  weekStart: number;
  renderDay: (date: Date) => JSX.Element;
  renderHeader: () => JSX.Element;
  renderAbbreviations: () => JSX.Element;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const DatePicker = ({
  cursor,
  weekStart,
  renderDay,
  renderHeader,
  renderAbbreviations,
  onKeyDown,
}: PickerProps): JSX.Element => {
  const matrix = generateMatrix(cursor, weekStart);
  return (
    <table className="hz-datepicker" tabIndex={0} onKeyDown={onKeyDown}>
      <thead>
        {renderHeader()}
        {renderAbbreviations()}
      </thead>
      <tbody>
        {matrix.map((row) => (
          <tr key={"row" + row[0].toString()}>
            {row.map((date) => renderDay(date))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface DayProps {
  day: Date;
  date: Date;
  cursor: Date;
  onChange: (date: Date) => void;
  onCursorChange: (date: Date) => void;
}

// left this as a sample of React.FC
const Day: React.FC<DayProps> = ({
  day,
  date,
  cursor,
  onChange,
  onCursorChange,
}) => {
  const isSelected = sameDates(day, date);
  const isCursor = sameDates(day, cursor);
  const isToday = sameDates(day, new Date());

  const isPrevMonth =
    cursor.getMonth() === 0
      ? day.getMonth() === 11
      : day.getMonth() === cursor.getMonth() - 1;
  const isNextMonth =
    cursor.getMonth() === 11
      ? day.getMonth() === 0
      : day.getMonth() === cursor.getMonth() + 1;
  const isInThisMonth = !isPrevMonth && !isNextMonth;

  const classNames = ["day"];
  if (!isInThisMonth) {
    classNames.push("grayed");
  }
  if (isSelected) {
    classNames.push("selected");
  }
  if (isCursor) {
    classNames.push("cursor");
  }
  if (isToday) {
    classNames.push("today");
  }

  const props = {
    ...(isInThisMonth && {
      onClick: () => onChange(day),
      onMouseEnter: () => onCursorChange(day),
      onFocus: () => onCursorChange(day),
      tabIndex: 1,
    }),
  };

  return (
    <td {...props} className={classNames.join(" ")}>
      {day.getDate()}
    </td>
  );
};

interface AbbreviationsProps {
  i18n: I18n;
  weekStart: number;
}
const Abbreviations = ({ i18n, weekStart } : AbbreviationsProps):JSX.Element => {
  return (
    <tr className="weekdays">
      {abbreviationDays(i18n, weekStart).map((day: string) => (
        <td key={day} colSpan={1}>
          {day}
        </td>
      ))}
    </tr>
  );
};

interface HeaderProps {
  i18n: I18n;
  cursor: Date;
  prevMonthClick: (e: React.MouseEvent<HTMLElement>) => void;
  nextMonthClick: (e: React.MouseEvent<HTMLElement>) => void;
}
const Header: React.FC<HeaderProps> = ({
  i18n,
  cursor,
  prevMonthClick,
  nextMonthClick,
}) => {
  return (
    <tr>
      <th colSpan={1}>
        <button className="chevron" onClick={prevMonthClick}>
          ???
        </button>
      </th>
      <th colSpan={5}>
        {i18n.months[cursor.getMonth()]} {cursor.getFullYear()}
      </th>
      <th colSpan={1}>
        <button className="chevron" onClick={nextMonthClick}>
          ???
        </button>
      </th>
    </tr>
  );
};

interface DemoProps {
  i18n: I18n;
}
interface DemoState{
  date: Date;
  cursor: Date;
  weekStart: number;
}

const Calendar = (props: DemoProps)=> {
  const [state, setState] = useState<DemoState>({
    date: new Date(),
    cursor: new Date(),
    weekStart: 1,
  });

  const onChange = (date: Date) => {
    console.log("New Date: ", date)
    setState({ ...state, date });
  };

  const onCursorChange = (cursor: Date) => {
    setState({ ...state, cursor });
  };


  // Control with keyboard
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "ArrowDown":
        onCursorChange(deltaDate(state.cursor, 0, 0, 7));
        break;
      case "ArrowUp":
        onCursorChange(deltaDate(state.cursor, 0, 0, -7));
        break;
      case "ArrowLeft":
        onCursorChange(deltaDate(state.cursor, 0, 0, -1));
        break;
      case "ArrowRight":
        onCursorChange(deltaDate(state.cursor, 0, 0, 1));
        break;
      case "Enter":
        onChange(state.cursor);
        break;
    }
  };

  const prevMonthClick = (e: React.MouseEvent<HTMLElement>) => {
    onCursorChange(deltaDate(state.cursor, 0, -1));
  };

  const nextMonthClick = (e: React.MouseEvent<HTMLElement>) => {
    onCursorChange(deltaDate(state.cursor, 0, 1));
  };

  return (
    <DatePicker
      cursor={state.cursor}
      weekStart={state.weekStart}
      onKeyDown={onKeyDown}
      renderDay={(day) => (
        <Day
          key={day.toString()}
          day={day}
          date={state.date}
          cursor={state.cursor}
          onChange={onChange}
          onCursorChange={onCursorChange}
        />
      )}
      renderAbbreviations={() => (
        <Abbreviations
          i18n={props.i18n}
          weekStart={state.weekStart}
        />
      )}
      renderHeader={() => (
        <Header
          i18n={props.i18n}
          cursor={state.cursor}
          prevMonthClick={prevMonthClick}
          nextMonthClick={nextMonthClick}
        />
      )}
    />
  );
};

export default Calendar;

// class DemoContainer extends React.Component<DemoProps, DemoState> {
//   public state = {
//     date: new Date(),
//     cursor: new Date(),
//     weekStart: 1,
//   };

//   private onChange = (date: Date) => {
//     this.setState({ date });
//   };

//   private onCursorChange = (cursor: Date) => {
//     this.setState({ cursor });
//   };

//   private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
//     switch (e.key) {
//       case "ArrowDown":
//         this.onCursorChange(deltaDate(this.state.cursor, 0, 0, 7));
//         break;
//       case "ArrowUp":
//         this.onCursorChange(deltaDate(this.state.cursor, 0, 0, -7));
//         break;
//       case "ArrowLeft":
//         this.onCursorChange(deltaDate(this.state.cursor, 0, 0, -1));
//         break;
//       case "ArrowRight":
//         this.onCursorChange(deltaDate(this.state.cursor, 0, 0, 1));
//         break;
//       case "Enter":
//         this.onChange(this.state.cursor);
//         break;
//     }
//   };

//   private prevMonthClick = (e: React.MouseEvent<HTMLElement>) => {
//     this.onCursorChange(deltaDate(this.state.cursor, 0, -1));
//   };

//   private nextMonthClick = (e: React.MouseEvent<HTMLElement>) => {
//     this.onCursorChange(deltaDate(this.state.cursor, 0, 1));
//   };

//   public render() {
//     return (
//       <DatePicker
//         cursor={this.state.cursor}
//         weekStart={this.state.weekStart}
//         onKeyDown={this.onKeyDown}
//         renderDay={(day) => (
//           <Day
//             key={day.toString()}
//             day={day}
//             date={this.state.date}
//             cursor={this.state.cursor}
//             onChange={this.onChange}
//             onCursorChange={this.onCursorChange}
//           />
//         )}
//         renderAbbreviations={() => (
//           <Abbreviations
//             i18n={this.props.i18n}
//             weekStart={this.state.weekStart}
//           />
//         )}
//         renderHeader={() => (
//           <Header
//             i18n={this.props.i18n}
//             cursor={this.state.cursor}
//             prevMonthClick={this.prevMonthClick}
//             nextMonthClick={this.nextMonthClick}
//           />
//         )}
//       />
//     );
//   }
// }

// export default DemoContainer;
