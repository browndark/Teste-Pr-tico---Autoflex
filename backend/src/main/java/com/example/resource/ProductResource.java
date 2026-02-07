package com.example.resource;

import com.example.model.Product;
import com.example.repository.ProductRepository;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {
    @Inject
    ProductRepository productRepository;

    @GET
    public List<Product> list() {
        return productRepository.listAll();
    }

    @POST
    @javax.transaction.Transactional
    public Product create(Product product) {
        productRepository.persist(product);
        return product;
    }

    @PUT
    @Path("/{id}")
    @javax.transaction.Transactional
    public Product update(@PathParam("id") Long id, Product product) {
        Product entity = productRepository.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.setCode(product.getCode());
        entity.setName(product.getName());
        entity.setPrice(product.getPrice());
        entity.setQuantity(product.getQuantity());
        productRepository.persist(entity);
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @javax.transaction.Transactional
    public Response delete(@PathParam("id") Long id) {
        Product entity = productRepository.findById(id);
        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        productRepository.deleteById(id);
        return Response.noContent().build();
    }
}
