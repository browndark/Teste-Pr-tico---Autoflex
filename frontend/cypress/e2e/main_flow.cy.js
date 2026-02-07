describe('Inventory Management - Main Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Adds a product', () => {
    cy.contains('.devui-tab, button', 'Products').click();
    cy.get('input[placeholder="Code"]').type('PROD_CY_' + Date.now());
    cy.get('input[placeholder="Name"]').type('Test Product');
    cy.get('input[placeholder="Price"]').type('99.99');
    cy.contains('Add Product').click();
    cy.wait(500);
    cy.contains('Test Product').should('exist');
  });

  it('Adds a raw material', () => {
    cy.contains('.devui-tab, button', 'Raw Materials').click();
    cy.get('input[placeholder="Code"]').type('RM_CY_' + Date.now());
    cy.get('input[placeholder="Name"]').type('Test Material');
    cy.get('input[placeholder="Stock Quantity"]').type('50');
    cy.contains('Add Raw Material').click();
    cy.wait(500);
    cy.contains('Test Material').should('exist');
  });

  it('Associates product to raw material', () => {
    cy.contains('.devui-tab, button', 'Association').click();
    cy.wait(500);
    cy.get('select[name="productId"] option').then(options => {
      if (options.length > 1) {
        cy.get('select[name="productId"]').select(options[1].value);
      }
    });
    cy.get('select[name="rawMaterialId"] option').then(options => {
      if (options.length > 1) {
        cy.get('select[name="rawMaterialId"]').select(options[1].value);
      }
    });
    cy.get('input[placeholder="Required Quantity"]').type('2');
    cy.contains('Associate').click();
    cy.wait(500);
  });

  it('Suggests production', () => {
    cy.contains('.devui-tab, button', 'Production Suggestion').click();
    cy.wait(500);
    cy.contains('Total Production Value').should('exist');
  });
});
