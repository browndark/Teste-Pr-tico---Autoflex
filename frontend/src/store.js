import { createStore, combineReducers } from 'redux';
import productReducer from './reducers/productReducer';
import rawMaterialReducer from './reducers/rawMaterialReducer';
import associationReducer from './reducers/associationReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  products: productReducer,
  rawMaterials: rawMaterialReducer,
  associations: associationReducer,
  user: userReducer,
});

const store = createStore(rootReducer);
export default store;
