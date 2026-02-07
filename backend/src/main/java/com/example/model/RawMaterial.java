package com.example.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.util.Set;

/**
 * Entity: RawMaterial
 * 
 * Representa um insumo/matéria-prima utilizada na produção dos produtos.
 * Armazena código único, nome e quantidade em estoque.
 * Pode estar associada a múltiplos produtos.
 * 
 * @author Sistema Controle Estoque
 * @version 1.0
 */
@Entity
@Table(name = "raw_material")
public class RawMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ProductRawMaterial> products;

    public Long getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public Set<ProductRawMaterial> getProducts() { return products; }
    public void setProducts(Set<ProductRawMaterial> products) { this.products = products; }
}
