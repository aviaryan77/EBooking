// File for number format and calculation

export const currencyFormat = num => {
  if (typeof num !== 'number') return 0;
  return num?.toFixed(0)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
export const currencyFormatWithFloat = num => {
  if (typeof num !== 'number') return 0;
  return num?.toFixed(2)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

let debounceTimer;
export const debounce = (callback, time) => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(callback, time);
};

export const sentenceCase = (str) =>
 {
  if (typeof str!=='string') return '';
    return str
     .split(' ')
     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
     .join(' ');
}

export const memberCountSum = obj => Object?.values(obj)?.reduce((a, b) => a + b, 0); //it will sum an object like {single:2, female:4}
