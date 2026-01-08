package org.example.persistence.repo;

import io.micronaut.data.annotation.Query;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import org.example.domain.Location;
import org.example.persistence.entity.StockEntity;
import org.example.persistence.entity.StockId;

import java.util.List;
import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface StockRepository extends CrudRepository<StockEntity, StockId> {

    Optional<StockEntity> findByIdProductIdAndIdLocation(Long productId, Location location);

    @Query("""
        select *
        from stock
        where product_id = any(:productIds)
    """)
    List<StockEntity> findByProductIdIn(List<Long> productIds);
}
