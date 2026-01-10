package org.example.persistence.repo;

import io.micronaut.data.annotation.Query;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import org.example.domain.Location;
import org.example.persistence.entity.StockEntity;
import org.example.persistence.entity.StockId;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface StockRepository extends CrudRepository<StockEntity, StockId> {

    List<StockEntity> findByIdProductIdIn(Collection<Long> productIds);

    Optional<StockEntity> findByIdProductIdAndIdLocation(Long productId, Location location);

    default Optional<StockEntity> findByProductIdAndLocation(Long productId, Location location) {
        return findByIdProductIdAndIdLocation(productId, location);
    }

    @Query("""
            INSERT INTO stock(product_id, location, quantity)
            VALUES (:productId, :location, :qty)
            ON CONFLICT (product_id, location)
            DO UPDATE SET quantity = stock.quantity + EXCLUDED.quantity,
                          updated_at = now()
            """)
    void upsertIncrease(Long productId, Location location, long qty);

    @Query("""
            UPDATE stock
            SET quantity = quantity - :qty,
                updated_at = now()
            WHERE product_id = :productId
              AND location = :location
              AND quantity >= :qty
            """)
    long decreaseQuantityIfEnough(Long productId, Location location, long qty);
}
