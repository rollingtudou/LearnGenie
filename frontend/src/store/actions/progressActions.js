import axios from 'axios';

// 获取用户进度
export const getUserProgress = (userId) => async (dispatch, getState) => {
  dispatch({ type: 'PROGRESS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.get(`/api/progress/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: 'PROGRESS_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'PROGRESS_FAILURE',
      payload: error.response?.data?.message || '获取进度失败'
    });
    throw error;
  }
};

// 更新任务进度
export const updateProgress = (progressData) => async (dispatch, getState) => {
  dispatch({ type: 'PROGRESS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.post('/api/updateProgress', progressData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: 'UPDATE_PROGRESS_SUCCESS',
      payload: response.data.progress
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'PROGRESS_FAILURE',
      payload: error.response?.data?.message || '更新进度失败'
    });
    throw error;
  }
};

// 教师批量更新进度
export const batchUpdateProgress = (progressUpdates) => async (dispatch, getState) => {
  dispatch({ type: 'PROGRESS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.post('/api/batchUpdateProgress', { progressUpdates }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 重新获取最新进度
    dispatch(getUserProgress(getState().auth.user.id));
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'PROGRESS_FAILURE',
      payload: error.response?.data?.message || '批量更新进度失败'
    });
    throw error;
  }
}; 