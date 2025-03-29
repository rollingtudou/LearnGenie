import axios from 'axios';

// 获取用户的所有学习计划
export const getUserPlans = (userId) => async (dispatch, getState) => {
  dispatch({ type: 'PLANS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.get(`/api/plans/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: 'PLANS_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'PLAN_FAILURE',
      payload: error.response?.data?.message || '获取学习计划失败'
    });
    throw error;
  }
};

// 获取学习计划详情
export const getPlanDetail = (planId) => async (dispatch, getState) => {
  dispatch({ type: 'PLANS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const planResponse = await axios.get(`/api/plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const tasksResponse = await axios.get(`/api/plans/${planId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: 'PLAN_DETAIL_SUCCESS',
      payload: {
        plan: planResponse.data,
        tasks: tasksResponse.data
      }
    });
    
    return { plan: planResponse.data, tasks: tasksResponse.data };
  } catch (error) {
    dispatch({
      type: 'PLAN_FAILURE',
      payload: error.response?.data?.message || '获取学习计划详情失败'
    });
    throw error;
  }
};

// 生成学习计划
export const generatePlan = (planData) => async (dispatch, getState) => {
  dispatch({ type: 'PLANS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.post('/api/generatePlan', planData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: 'GENERATE_PLAN_SUCCESS',
      payload: {
        plan: response.data.plan,
        tasks: response.data.tasks
      }
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'PLAN_FAILURE',
      payload: error.response?.data?.message || '生成学习计划失败'
    });
    throw error;
  }
};

// 更新学习计划状态
export const updatePlanStatus = (planId, status) => async (dispatch, getState) => {
  dispatch({ type: 'PLANS_REQUEST' });
  
  try {
    const token = getState().auth.token;
    const response = await axios.patch(`/api/plans/${planId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 重新获取所有计划以更新状态
    dispatch(getUserPlans(getState().auth.user.id));
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'PLAN_FAILURE',
      payload: error.response?.data?.message || '更新学习计划状态失败'
    });
    throw error;
  }
}; 