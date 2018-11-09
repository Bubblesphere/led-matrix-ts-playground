export const updateState = (keys: string[], value: any, prevState: any) => {
  let newState = Object.assign({}, prevState);
  keys.reduce((acc, cur: any, index) => {
    // Make sure the key is a property that exists on prevState.led
    if (!acc.hasOwnProperty(cur)) {
      throw `Property ${cur} does not exist ${keys.length > 1 ? `at ${keys.slice(0, index).join('.')}` : ""}`
    }

    return acc[cur] = keys.length - 1 == index ?
      value : // We reached the end, modify the property to our value
      { ...acc[cur] }; // Continue spreading
  }, newState);

  return newState;
}