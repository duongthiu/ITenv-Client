export function formatDate(input: Date | string | number): string {
  // Convert input to Date if it's not already
  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const day: number = date.getDate();
  const daySuffix: string = getDaySuffix(day);
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();

  let hours: number = date.getHours();
  const minutes: string = date.getMinutes().toString().padStart(2, '0');
  const seconds: string = date.getSeconds().toString().padStart(2, '0');
  const ampm: string = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${month} ${day}${daySuffix} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDateWithoutTime(input: Date | number | string): string {
  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const day: number = date.getDate();
  const daySuffix: string = getDaySuffix(day);
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();
  return `${month} ${day}${daySuffix} ${year}`;
}

export function timeAgo(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  if (seconds < 10) return 'just now';
  return Math.floor(seconds) + ' seconds ago';
}
