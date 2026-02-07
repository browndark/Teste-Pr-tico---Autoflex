/**
 * Utilitários de Validação
 * Validações reutilizáveis para o frontend
 */

/**
 * Validar código (3-50 caracteres)
 * Permite: letras, números, hífens, underscores, hash, ponto, etc
 * @param {string} code 
 * @returns {boolean}
 */
export const isValidCode = (code) => {
  // Rejeita apenas espaços em branco, permite tudo mais
  return code && typeof code === 'string' && code.trim().length >= 3 && code.length <= 50 && !/\s/.test(code);
};

/**
 * Validar nome (mínimo 2 caracteres)
 * @param {string} name 
 * @returns {boolean}
 */
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.length <= 100;
};

/**
 * Validar preço (maior que 0)
 * @param {number} price 
 * @returns {boolean}
 */
export const isValidPrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0;
};

/**
 * Validar quantidade (número inteiro positivo)
 * @param {number} quantity 
 * @returns {boolean}
 */
export const isValidQuantity = (quantity) => {
  const num = parseInt(quantity);
  return !isNaN(num) && num > 0;
};

/**
 * Validar forma de produto
 * @param {Object} product 
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateProduct = (product) => {
  const errors = [];

  if (!isValidCode(product.code)) {
    errors.push('Code must be 3-50 characters (no spaces)');
  }
  if (!isValidName(product.name)) {
    errors.push('Name must be 2-100 characters');
  }
  if (!isValidPrice(product.price)) {
    errors.push('Price must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validar forma de matéria-prima
 * @param {Object} rawMaterial 
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateRawMaterial = (rawMaterial) => {
  const errors = [];

  if (!isValidCode(rawMaterial.code)) {
    errors.push('Code must be 3-50 characters (no spaces)');
  }
  if (!isValidName(rawMaterial.name)) {
    errors.push('Name must be 2-100 characters');
  }
  if (!isValidQuantity(rawMaterial.stockQuantity)) {
    errors.push('Stock quantity must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validar associação
 * @param {Object} association 
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateAssociation = (association) => {
  const errors = [];

  if (!association.productId) {
    errors.push('Product must be selected');
  }
  if (!association.rawMaterialId) {
    errors.push('Raw material must be selected');
  }
  if (!isValidQuantity(association.requiredQuantity)) {
    errors.push('Required quantity must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Formatador de erros para exibição
 * @param {string[]} errors 
 * @returns {string}
 */
export const formatErrors = (errors) => {
  return errors.map(err => `• ${err}`).join('\n');
};
