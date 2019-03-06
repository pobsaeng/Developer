package com.kotlin.kotlinsql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface RepositoryArtists extends JpaRepository<Artists, Integer> {

}
