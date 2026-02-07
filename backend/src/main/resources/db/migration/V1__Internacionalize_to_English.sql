-- Migration: Rename tables and columns to English
-- This migration renames Portuguese table and column names to English for internationalization compliance

-- Drop existing foreign keys if they exist
ALTER TABLE produto_materia_prima DROP CONSTRAINT IF EXISTS fk_produto;
ALTER TABLE produto_materia_prima DROP CONSTRAINT IF EXISTS fk_materia_prima;

-- Rename tables
ALTER TABLE produto RENAME TO product;
ALTER TABLE materia_prima RENAME TO raw_material;
ALTER TABLE produto_materia_prima RENAME TO product_raw_material;

-- Rename columns in product table
ALTER TABLE product RENAME COLUMN codigo TO code;
ALTER TABLE product RENAME COLUMN nome TO name;
ALTER TABLE product RENAME COLUMN valor TO price;
ALTER TABLE product RENAME COLUMN quantidade TO quantity;

-- Rename columns in raw_material table
ALTER TABLE raw_material RENAME COLUMN codigo TO code;
ALTER TABLE raw_material RENAME COLUMN nome TO name;
ALTER TABLE raw_material RENAME COLUMN quantidade_estoque TO stock_quantity;

-- Rename columns in product_raw_material table
ALTER TABLE product_raw_material RENAME COLUMN produto_id TO product_id;
ALTER TABLE product_raw_material RENAME COLUMN materia_prima_id TO raw_material_id;
ALTER TABLE product_raw_material RENAME COLUMN quantidade_necessaria TO required_quantity;

-- Rename constraints
ALTER TABLE product_raw_material ADD CONSTRAINT fk_product_raw_material_product 
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;
ALTER TABLE product_raw_material ADD CONSTRAINT fk_product_raw_material_raw_material 
  FOREIGN KEY (raw_material_id) REFERENCES raw_material(id) ON DELETE CASCADE;

-- Add unique constraint on code columns if not exists
ALTER TABLE product ADD CONSTRAINT uk_product_code UNIQUE (code);
ALTER TABLE raw_material ADD CONSTRAINT uk_raw_material_code UNIQUE (code);
