const initialState = {
  contents: [],
  generatedContent: null,
  loading: false,
  error: null
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONTENTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'CONTENTS_SUCCESS':
      return {
        ...state,
        contents: action.payload,
        loading: false,
        error: null
      };
    case 'GENERATE_CONTENT_SUCCESS':
      return {
        ...state,
        generatedContent: action.payload,
        contents: [...state.contents, action.payload],
        loading: false,
        error: null
      };
    case 'CONTENT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default contentReducer; 