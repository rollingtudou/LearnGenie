import axios from 'axios';

// 用户注册
export const register = (userData) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  
  try {
    const response = await axios.post('/api/register', userData);
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        token: response.data.token,
        user: response.data.user
      }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAILURE',
      payload: error.response?.data?.message || '注册失败'
    });
    throw error;
  }
};

// 用户登录
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  
  try {
    const response = await axios.post('/api/login', credentials);
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        token: response.data.token,
        user: response.data.user
      }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAILURE',
      payload: error.response?.data?.message || '登录失败'
    });
    throw error;
  }
};

// 用户退出
export const logout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' });
}; 