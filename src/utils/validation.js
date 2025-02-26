import {validationErrors} from "../constants/errors.js";

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateTask = (title, description) => {
  let isValid = true;
  
  const formErrors = { title: '', description: '' };
  
  if(title.length < 2 || title.length === 0) {
    formErrors.title = validationErrors.taskError;
    isValid = false
  }
  
  if (description.length < 2 || description.length === 0) {
    formErrors.description = validationErrors.taskError;
    isValid = false
  }
  
  return {isValid, formErrors}
}