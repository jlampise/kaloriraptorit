export default function validate(values) {
  const errors = {};
  if (!values.username) {
    errors.username = 'Please enter username';
  }
  if (!values.password || !(values.password.length > 3)) {
    errors.password = 'Please enter password of at least 4 characters';
  } 
  return errors;
}