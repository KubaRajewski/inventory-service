package org.example.persistence.repo;

import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import org.example.persistence.entity.SalesImportEntity;

import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface SalesImportRepository extends CrudRepository<SalesImportEntity, Long> {

    Optional<SalesImportEntity> findBySha256(String sha256);
}
