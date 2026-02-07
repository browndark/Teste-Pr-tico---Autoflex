package com.example.resource;

import com.example.model.RawMaterial;
import com.example.repository.RawMaterialRepository;
import javax.transaction.Transactional;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {
	@Inject
	RawMaterialRepository repository;

	@GET
	public List<RawMaterial> list() {
		return repository.listAll();
	}

	@POST
	@Transactional
	public Response create(RawMaterial rawMaterial) {
		repository.persist(rawMaterial);
		return Response.ok(rawMaterial).build();
	}

	@GET
	@Path("/{id}")
	public RawMaterial getById(@PathParam("id") Long id) {
		return repository.findById(id);
	}

	@PUT
	@Path("/{id}")
	@Transactional
	public Response update(@PathParam("id") Long id, RawMaterial updated) {
		RawMaterial rawMaterial = repository.findById(id);
		if (rawMaterial == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		rawMaterial.setCode(updated.getCode());
		rawMaterial.setName(updated.getName());
		rawMaterial.setStockQuantity(updated.getStockQuantity());
		repository.persist(rawMaterial);
		return Response.ok(rawMaterial).build();
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
