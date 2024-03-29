package com.example.filmfoliobackend.model;

import com.example.filmfoliobackend.model.enums.Role;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.YearMonth;
import java.util.*;

@EqualsAndHashCode(of = "uuid")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document
public class User implements UserDetails {
    @Id
    private String idUser;
    @Builder.Default
    private String uuid = UUID.randomUUID().toString();
    private String username;
    private String email;
    private String password;
    private Set<Role> roles = new HashSet<>();
    @Builder.Default
    private Integer watchedMoviesCount = 0;
    @Builder.Default
    private Integer totalWatchTime = 0;
    @Builder.Default
    private Map<String, Integer> monthlyWatchStats = new HashMap<>();
    @DBRef
    private List<Movie> watchlist = new ArrayList<>();;
    @DBRef
    private List<Playlist> playlists = new ArrayList<>();
    @DBRef
    private List<Review> reviews = new ArrayList<>();
    @DBRef
    private List<Genre> preferences = new ArrayList<>();

    public String getActualUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        this.roles.forEach(role -> {
            var sga = new SimpleGrantedAuthority(role.name());
            authorities.add(sga);
        });
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
