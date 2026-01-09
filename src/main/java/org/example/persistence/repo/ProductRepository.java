package org.example.persistence.repo;

import io.micronaut.data.annotation.Query;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import org.example.persistence.entity.ProductEntity;

import java.util.List;
import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface ProductRepository extends CrudRepository<ProductEntity, Long> {

    Optional<ProductEntity> findBySku(String sku);

    @Query("""
            SELECT *
            FROM product
            WHERE active = true
            ORDER BY name ASC
            """)
    List<ProductEntity> listActive();

    @Query("""
            SELECT *
            FROM product
            WHERE (LOWER(name) LIKE CONCAT('%', LOWER(:query), '%')
               OR LOWER(sku)  LIKE CONCAT('%', LOWER(:query), '%'))
            ORDER BY name ASC
            """)
    List<ProductEntity> search(String query);
}
