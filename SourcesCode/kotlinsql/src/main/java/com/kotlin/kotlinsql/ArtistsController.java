package com.kotlin.kotlinsql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.List;

@RestController
public class ArtistsController {

    @Autowired
    private RepositoryArtists repositoryArtists;

    @Autowired
    private DataSource dataSource;

    @GetMapping("/findAll")
    public List<Artists> findAll(){
        System.out.println("----------------------------------------------------");
        System.out.println(dataSource);
        repositoryArtists.findAll().forEach(artists -> System.out.println(artists.getArtistName()));
        System.out.println("=====================================================");
        return repositoryArtists.findAll();
    }
}
