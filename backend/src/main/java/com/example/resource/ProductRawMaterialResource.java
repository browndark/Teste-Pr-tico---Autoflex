package com.example.resource;

import com.example.model.ProductRawMaterial;
import com.example.model.RawMaterial;
import com.example.repository.ProductRawMaterialRepository;
import com.example.repository.RawMaterialRepository;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Path("/products-raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRawMaterialResource {
    @Inject
    ProductRawMaterialRepository repository;
    
    @Inject
    RawMaterialRepository rawMaterialRepository;

    @GET
    public List<ProductRawMaterial> list() {
        return repository.listAll();
    }

    @POST
    @Transactional
    public Response create(ProductRawMaterial prm) {
        // Validate stock availability
        RawMaterial rawMaterial = rawMaterialRepository.findById(prm.getRawMaterial().getId());
        if (rawMaterial == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Raw material not found");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }
        
        if (prm.getRequiredQuantity() > rawMaterial.getStockQuantity()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Insufficient stock. Required: " + prm.getRequiredQuantity() + " units, Available: " + rawMaterial.getStockQuantity() + " units");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }
        
        repository.persist(prm);
        return Response.ok(prm).build();
    }

    @GET
    @Path("/{id}")
    public ProductRawMaterial getById(@PathParam("id") Long id) {
        return repository.findById(id);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean removed = repository.deleteById(id);
        if (removed) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
