const initialState = {
  plans: [],
  currentPlan: null,
  tasks: [],
  loading: false,
  error: null
};

const planReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLANS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'PLANS_SUCCESS':
      return {
        ...state,
        plans: action.payload,
        loading: false,
        error: null
      };
    case 'PLAN_DETAIL_SUCCESS':
      return {
        ...state,
        currentPlan: action.payload.plan,
        tasks: action.payload.tasks,
        loading: false,
        error: null
      };
    case 'GENERATE_PLAN_SUCCESS':
      return {
        ...state,
        plans: [...state.plans, action.payload.plan],
        currentPlan: action.payload.plan,
        tasks: action.payload.tasks,
        loading: false,
        error: null
      };
    case 'PLAN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default planReducer; 