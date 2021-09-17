import { useState } from 'react'


export function processData(allText) {
    const commaPlaceHolder = '{{{comma}}}'
    var allTextLines = allText.split(/\r\n|\n/).map(line => line.replace(/(".+[,].+")/g, match => match.replace(/,/g, commaPlaceHolder)));
    var headers = allTextLines[0].split(',');
    var lines = [];
    for (var i=1; i<allTextLines.length; i++) {
        
        var data = allTextLines[i].split(',');
        if (data.length === headers.length) {
            var temp = {};
            for (var j=0; j<headers.length; j++) {

                let value = data[j].trim()

                if(Number.isInteger(parseInt(value))) {
                  value = parseInt(value)
                } else if(value.replace) {
                  const reg = new RegExp(`${commaPlaceHolder}`, 'g')
                  value = value.replace(reg, ',')
                }

                temp[headers[j]] = value;
            }
            lines.push(temp);
        }
    }
    return lines;
}

export function groupByProp(prop) {
  return array => array.reduce((acc, val) => {
    const groupBy = val[prop]
    if(acc[groupBy]) {
      if(Array.isArray(acc[groupBy])) {
        acc[groupBy] = acc[groupBy].concat(val)
      } else {
        acc[groupBy] = [acc[groupBy], val]
      }

    } else {
      acc[groupBy] = val
    }
    return acc
  }, {})
}

const groupByValue = groupByProp('value')
const groupByCategory = groupByProp('category')

export function getInitQuestions(csvText) {
  const questions = processData(csvText).map(val => ({...val, answered: false}))
  const groupedByCategory = groupByCategory(questions)

  return Object.keys(groupedByCategory).reduce((acc, cat) => {
    acc[cat] = groupByValue(groupedByCategory[cat])
    return acc
  }, {})
  
}


export function getRowCount(questionMap) {
  return Object.keys(questionMap).reduce((acc, key) => {
    let cur = Object.keys(questionMap[key]).length || 0
    if(cur > acc) {
      acc = cur
    }
    return acc
  }, 0) + 1
  // add one for category row
}

// Hook
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}


export function stripLowerCase(str) {
  if(!str || str.length <= 1) {
    return str
  }
  return str.split('').filter(letter => letter.toLowerCase() !== letter).join('')
}
