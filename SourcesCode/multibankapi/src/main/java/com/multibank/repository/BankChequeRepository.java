package com.multibank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.multibank.domain.entity.BankCheque;

@Repository
public interface BankChequeRepository extends JpaRepository<BankCheque, Integer> {}
