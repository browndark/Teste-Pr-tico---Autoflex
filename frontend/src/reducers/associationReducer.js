const initialState = { items: [] };
export default function associationReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_ASSOCIATIONS':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}
