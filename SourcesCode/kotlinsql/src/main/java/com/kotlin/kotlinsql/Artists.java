package com.kotlin.kotlinsql;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "Music")
public class Artists {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "artist_id")
    private Integer ArtistId;

    @Column(name = "active_from")
    private String ArtistName;

    @Column(name = "artist_name")
    private Date ActiveFrom;

    public Integer getArtistId() {
        return ArtistId;
    }

    public void setArtistId(Integer artistId) {
        ArtistId = artistId;
    }

    public String getArtistName() {
        return ArtistName;
    }

    public void setArtistName(String artistName) {
        ArtistName = artistName;
    }

    public Date getActiveFrom() {
        return ActiveFrom;
    }

    public void setActiveFrom(Date activeFrom) {
        ActiveFrom = activeFrom;
    }

    @Override
    public String toString() {
        return "Artists{" +
                "ArtistId=" + ArtistId +
                ", ArtistName='" + ArtistName + '\'' +
                ", ActiveFrom=" + ActiveFrom +
                '}';
    }
}
