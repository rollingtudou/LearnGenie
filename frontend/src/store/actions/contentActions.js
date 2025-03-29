import axios from 'axios';

// 获取内容列表
export const getContents = (discipline, format) => async (dispatch, getState) => {
  dispatch({ type: 'CONTENTS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    let url = '/api/getContent';
    
    // 构建查询参数
    const params = {};
    if (discipline) params.discipline = discipline;
    if (format) params.format = format;
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    
    dispatch({
      type: 'CONTENTS_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CONTENT_FAILURE',
      payload: error.response?.data?.message || '获取内容失败'
    });
    throw error;
  }
};

// 生成新内容
export const generateContent = (contentData) => async (dispatch, getState) => {
  dispatch({ type: 'CONTENTS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.post('/api/generateContent', contentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: 'GENERATE_CONTENT_SUCCESS',
      payload: response.data.content
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CONTENT_FAILURE',
      payload: error.response?.data?.message || '生成内容失败'
    });
    throw error;
  }
};

// 教师创建内容
export const createContent = (contentData) => async (dispatch, getState) => {
  dispatch({ type: 'CONTENTS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.post('/api/contents', contentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 重新获取所有内容
    dispatch(getContents());
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CONTENT_FAILURE',
      payload: error.response?.data?.message || '创建内容失败'
    });
    throw error;
  }
}; 