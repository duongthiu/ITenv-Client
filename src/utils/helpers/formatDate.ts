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
