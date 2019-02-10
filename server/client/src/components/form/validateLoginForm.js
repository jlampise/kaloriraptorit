export default function validate(values) {
  const errors = {};
  if (!values.username) {
    errors.username = 'Please enter username';
  }
  if (!values.password) {
    errors.password = 'Please enter password';
  } 
  return errors;
}
