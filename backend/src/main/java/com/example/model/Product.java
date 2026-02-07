package com.example.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.util.Set;

/**
 * Entity: Product
 * 
 * Representa um produto final que a indústria fabrica.
 * Cada produto tem um código único, nome, preço de venda e
 * associações com as matérias-primas necessárias para sua produção.
 * 
 * @author Sistema Controle Estoque
 * @version 1.0
 */
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = true)
    private Integer quantity;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ProductRawMaterial> rawMaterials;

    public Long getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Set<ProductRawMaterial> getRawMaterials() { return rawMaterials; }
    public void setRawMaterials(Set<ProductRawMaterial> rawMaterials) { this.rawMaterials = rawMaterials; }
}
