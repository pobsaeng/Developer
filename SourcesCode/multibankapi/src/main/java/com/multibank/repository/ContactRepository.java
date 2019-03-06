package com.multibank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.multibank.domain.entity.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {}
