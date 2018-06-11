import history from './../../services/History';


export default () => {
  history.push('/');
  // https://github.com/ReactTraining/react-router/issues/1982
  window.location.reload(); // eslint-disable-line
  return (null);
};
