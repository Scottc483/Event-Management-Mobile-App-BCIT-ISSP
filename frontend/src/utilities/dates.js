export function formatDate(dateStr) {
    // create a Date object from the date string
    const dateDb = new Date(dateStr);

    // get the timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    const date = new Date(dateDb.getTime() - (timezoneOffset * 60 * 1000));
  
    // extract the month, day, and year values
    const month = date.getMonth() + 1; // months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
  
    // create a formatted date string in the desired format
    const formattedDate = `${month}-${day}-${year}`;
  
    return formattedDate;
  }

  export function formatDateTime(dateTimeStr) {
    // create a Date object from the date string
    const dateDb = new Date(dateTimeStr);

    // get the timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    const date = new Date(dateDb.getTime() - (timezoneOffset * 60 * 1000));
  
    // extract the month, day, and year values
    const month = date.getMonth() + 1; // months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const mins = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedDate = `${month}-${day}-${year} ${formattedHours}:${mins} ${ampm}`;
  
    return formattedDate;
  }

  export function formatTime(dateTimeStr) {
    // create a Date object from the date string
    const dateDb = new Date(dateTimeStr);

    // get the timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    const date = new Date(dateDb.getTime() - (timezoneOffset * 60 * 1000));
  
    const hours = date.getHours();
    const mins = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedTime = `${formattedHours}:${formattedMins} ${ampm}`;
  
    return formattedTime;
  }

  export function formatLongDate(dateStr, dayName) {
    // create a Date object from the date string
    const dateDb = new Date(dateStr);

    // get the timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    const date = new Date(dateDb.getTime() - (timezoneOffset * 60 * 1000));
  
    function getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
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
    
    // Array of weekday names
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Get the weekday name and day of the month
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    
    // Get the ordinal suffix for the day
    const suffix = getOrdinalSuffix(day);
    
    // Array of month names
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get the month name and year
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Construct the formatted date string
    return dayName ? `${weekday} ${day}${suffix} ${month} ${year}` : `${day}${suffix} ${month} ${year}`;
    
  }

  export function formatLongDateShortDay(dateStr) {
    // create a Date object from the date string
    const dateDb = new Date(dateStr);

    // get the timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    const date = new Date(dateDb.getTime() - (timezoneOffset * 60 * 1000));
  
    function getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
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
    
    // Array of weekday names
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get the weekday name and day of the month
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    
    // Get the ordinal suffix for the day
    const suffix = getOrdinalSuffix(day);
    
    // Array of month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get the month name and year
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Construct the formatted date string
    return `${weekday} ${day}${suffix} ${month} ${year}`;
    
  }