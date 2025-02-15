
import {jwtDecode} from 'jwt-decode';

export const loadUserFromToken = () => (dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedUser = jwtDecode(token);

    dispatch({
      type: 'STAFF_LOGIN',
      payload: decodedUser,
    });
  }
};
