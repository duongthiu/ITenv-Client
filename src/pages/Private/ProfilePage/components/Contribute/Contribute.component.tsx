// src/components/ContributionGrid.tsx

import { Tooltip } from 'antd';

interface ContributionGridProps {
  contributions: Date[];
}

const ContributionGrid: React.FC<ContributionGridProps> = ({ contributions }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const getDaysInMonth = (year: number) => [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const isContributionDay = (date: Date) => {
    return contributions.some(
      (contribution) =>
        contribution.getFullYear() === date.getFullYear() &&
        contribution.getMonth() === date.getMonth() &&
        contribution.getDate() === date.getDate()
    );
  };

  const getColor = (date: Date) => {
    return isContributionDay(date) ? 'bg-green-500' : 'contribute-color';
  };

  const formatDate = (date: Date) => {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const dayOfMonth = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const year = date.getFullYear();
    const suffix =
      dayOfMonth % 10 === 1 && dayOfMonth !== 11
        ? 'st'
        : dayOfMonth % 10 === 2 && dayOfMonth !== 12
          ? 'nd'
          : dayOfMonth % 10 === 3 && dayOfMonth !== 13
            ? 'rd'
            : 'th';
    return `${dayOfWeek}, ${dayOfMonth}${suffix} ${month}, ${year}`;
  };

  const renderMonth = (days: number, month: number, year: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysArray = Array.from({ length: days }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const tooltip = formatDate(date);
      return (
        <Tooltip title={tooltip} key={i} className="cursor-pointer">
          <div className={`h-4 w-4 rounded-sm ${getColor(date)}`} />
        </Tooltip>
      );
    });

    const weeks = Array.from({ length: Math.ceil((days + firstDayOfMonth) / 7) }, () => Array(7).fill(null));
    daysArray.forEach((dayElement, i) => {
      const weekIndex = Math.floor((i + firstDayOfMonth) / 7);
      const dayOfWeek = (i + firstDayOfMonth) % 7;
      weeks[weekIndex][dayOfWeek] = dayElement;
    });

    return (
      <div key={month} className="flex w-fit flex-col items-center">
        <div className="grid grid-rows-7 gap-1">
          {Array.from({ length: 7 }, (_, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {weeks.map((week, colIndex) => (
                <div key={colIndex} className="h-4 w-4">
                  {week[rowIndex]}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sub-title mb-1 mt-3 w-full text-center text-xs">{monthNames[month]}</div>
      </div>
    );
  };

  const currentYear = new Date().getFullYear();
  const daysInMonth = getDaysInMonth(currentYear);
  return (
    <div className="flex w-full gap-2">
      {/* <div className="mr-8 mt-5 flex flex-none flex-col gap-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="h-4 w-4 text-[0.8rem]">
            {day}
          </div>
        ))}
      </div> */}
      <div className="flex flex-wrap gap-3">
        {daysInMonth.map((days, month) => renderMonth(days, month, currentYear))}
      </div>
    </div>
  );
};

export default ContributionGrid;
