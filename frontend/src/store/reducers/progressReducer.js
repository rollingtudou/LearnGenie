const initialState = {
  progresses: [],
  loading: false,
  error: null
};

const progressReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PROGRESS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'PROGRESS_SUCCESS':
      return {
        ...state,
        progresses: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_PROGRESS_SUCCESS':
      return {
        ...state,
        progresses: state.progresses.map(p => 
          p._id === action.payload._id ? action.payload : p
        ),
        loading: false,
        error: null
      };
    case 'PROGRESS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default progressReducer; 