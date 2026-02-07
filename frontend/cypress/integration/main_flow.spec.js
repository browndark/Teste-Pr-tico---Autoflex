describe('Gestão de Estoque - Fluxo Principal', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Adiciona um produto', () => {
    cy.get('input[placeholder="ID do Produto"]').type('1000');
    cy.get('input[placeholder="Nome do Produto"]').type('Produto Teste');
    cy.contains('Adicionar Produto').click();
    cy.contains('Produto Teste').should('exist');
  });

  it('Adiciona uma matéria-prima', () => {
    cy.get('input[placeholder="ID da Matéria-Prima"]').type('2000');
    cy.get('input[placeholder="Nome da Matéria-Prima"]').type('Matéria Teste');
    cy.get('input[placeholder="Quantidade em Estoque"]').type('50');
    cy.contains('Adicionar Matéria-Prima').click();
    cy.contains('Matéria Teste').should('exist');
  });

  it('Associa produto à matéria-prima', () => {
    cy.get('select').first().select('Produto Teste');
    cy.get('select').eq(1).select('Matéria Teste');
    cy.get('input[placeholder="Quantidade Necessária"]').type('10');
    cy.contains('Associar').click();
    cy.contains('Produto Teste').should('exist');
    cy.contains('Matéria Teste').should('exist');
  });

  it('Sugere produção', () => {
    cy.contains('Sugestão de Produção');
    cy.contains('Valor Total').should('exist');
  });
});
