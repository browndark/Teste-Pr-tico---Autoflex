package com.example.model;

import javax.persistence.*;

@Entity
@Table(name = "product_raw_material")
public class ProductRawMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id")
    private RawMaterial rawMaterial;

    @Column(name = "required_quantity", nullable = false)
    private Integer requiredQuantity;

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public RawMaterial getRawMaterial() { return rawMaterial; }
    public void setRawMaterial(RawMaterial rawMaterial) { this.rawMaterial = rawMaterial; }
    public Integer getRequiredQuantity() { return requiredQuantity; }
    public void setRequiredQuantity(Integer requiredQuantity) { this.requiredQuantity = requiredQuantity; }
}
