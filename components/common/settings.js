export default (key) => {
  const settings = {};
  if (settings && key) 
    return settings[key];
    
  if (settings) 
    return settings;
}