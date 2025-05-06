// dateUtils.js
export const getCurrentDateFormatted = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const now = new Date();
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };