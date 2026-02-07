const initialState = { items: [] };
export default function rawMaterialReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_RAW_MATERIALS':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}
