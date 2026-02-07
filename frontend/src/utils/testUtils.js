/**
 * Test Utilities - Helper functions for testing
 */

export const mockProduct = {
  id: 1,
  code: 'PROD001',
  name: 'Test Product',
  price: 99.99,
  quantity: 10,
};

export const mockRawMaterial = {
  id: 1,
  code: 'RM001',
  name: 'Test Material',
  stockQuantity: 100,
};

export const mockAssociation = {
  id: 1,
  product: mockProduct,
  rawMaterial: mockRawMaterial,
  requiredQuantity: 5,
};

/**
 * Utility para testar componentes com Redux
 * @param {React.Component} Component 
 * @param {Object} initialState 
 * @returns {ReactElement}
 */
export const renderWithRedux = (Component, initialState = {}) => {
  // Este seria usado com React Testing Library em um projeto real
  return Component;
};
