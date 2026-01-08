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
        select *
        from product
        where active = true
          and (
            sku ilike ('%' || :q || '%')
            or name ilike ('%' || :q || '%')
          )
        order by sku
        limit :limit offset :offset
    """)
    List<ProductEntity> search(String q, int limit, int offset);
}
