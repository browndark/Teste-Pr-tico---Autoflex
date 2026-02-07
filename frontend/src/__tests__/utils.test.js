describe('Utility Functions', () => {
  
  test('should format currency correctly', () => {
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    expect(formatCurrency(100)).toContain('100');
    expect(typeof formatCurrency(100)).toBe('string');
  });

  test('should validate dates', () => {
    const isValidDate = (dateString) => {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    };

    expect(isValidDate('2024-01-15')).toBe(true);
    expect(isValidDate('invalid-date')).toBe(false);
  });

  test('should handle string operations', () => {
    const str = 'Quest Hands';
    expect(str.length).toBeGreaterThan(0);
    expect(str.toUpperCase()).toBe('QUEST HANDS');
    expect(str.toLowerCase()).toBe('quest hands');
  });

  test('should validate numeric inputs', () => {
    const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

    expect(isNumber(42)).toBe(true);
    expect(isNumber('42')).toBe(true);
    expect(isNumber('not-a-number')).toBe(false);
    expect(isNumber(null)).toBe(false);
  });

  test('should handle array operations', () => {
    const items = ['item1', 'item2', 'item3'];
    expect(items.length).toBe(3);
    expect(items[0]).toBe('item1');
    expect(items.includes('item2')).toBe(true);
  });

  test('should validate object structure', () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      active: true
    };

    expect(user.hasOwnProperty('id')).toBe(true);
    expect(user.hasOwnProperty('name')).toBe(true);
    expect(Object.keys(user).length).toBe(4);
  });
});
