package org.example.persistence.repo;

import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import org.example.persistence.entity.MovementEntity;

import java.util.List;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface MovementRepository extends CrudRepository<MovementEntity, Long> {

    List<MovementEntity> findByProductIdOrderByOccurredAtDesc(Long productId);
}
