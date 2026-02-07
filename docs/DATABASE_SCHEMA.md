# Database Schema - ER Diagram

```
┌─────────────────────────┐
│       PRODUCT           │
├─────────────────────────┤
│ id (PK)                 │
│ code (UNIQUE)           │
│ name                    │
│ price (DECIMAL)         │
│ quantity (INT, NULLABLE)│
└────────────┬────────────┘
             │
             │ 1:N
             │
      ┌──────┴──────┐
      │              │
┌─────▼──────────────────────────┐
│  PRODUCT_RAW_MATERIAL           │
├─────────────────────────────────┤
│ id (PK)                         │
│ product_id (FK) ─────────────┐  │
│ raw_material_id (FK) ─────┐  │  │
│ required_quantity (INT)    │  │  │
└─────────────────────────────┤──┤──┘
                              │  │
             1:N              │  │ 1:N
      ┌──────────────────────┘  │
      │                         │
┌─────▼─────────────────────────▼─┐
│      RAW_MATERIAL               │
├──────────────────────────────────┤
│ id (PK)                          │
│ code (UNIQUE)                    │
│ name                             │
│ stock_quantity (INT)             │
└──────────────────────────────────┘
```

## Descrição das Tabelas

### PRODUCT
Armazena informações dos produtos finais.
- **id**: Identificador único (auto-increment)
- **code**: Código único do produto
- **name**: Nome do produto
- **price**: Valor de venda (DECIMAL 12,2)
- **quantity**: Quantidade produzida (opcional)

### RAW_MATERIAL
Armazena informações das matérias-primas.
- **id**: Identificador único (auto-increment)
- **code**: Código único da matéria-prima
- **name**: Nome da matéria-prima
- **stock_quantity**: Quantidade em estoque

### PRODUCT_RAW_MATERIAL
Relacionamento N:N entre produtos e matérias-primas.
- **id**: Identificador único
- **product_id**: FK → PRODUCT(id)
- **raw_material_id**: FK → RAW_MATERIAL(id)
- **required_quantity**: Quantidade necessária da matéria-prima para produzir 1 unidade do produto

## Constraints
- FK product_id tem DELETE CASCADE
- FK raw_material_id tem DELETE CASCADE
- Code columns são UNIQUE
- Todas as colunas necessárias NOT NULL

## Indexação
- PK em id (automático)
- UNIQUE em product.code
- UNIQUE em raw_material.code
- FK indexes em product_raw_material (product_id, raw_material_id)
