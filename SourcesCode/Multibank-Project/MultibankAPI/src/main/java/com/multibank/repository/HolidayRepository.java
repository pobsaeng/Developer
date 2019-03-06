package com.multibank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.multibank.domain.entity.Holiday;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {}
