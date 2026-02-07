package com.example.repository;

import com.example.model.RawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RawMaterialRepository implements PanacheRepository<RawMaterial> {
}
