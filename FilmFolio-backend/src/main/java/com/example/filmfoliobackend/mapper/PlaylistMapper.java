package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.PlaylistDto;
import com.example.filmfoliobackend.model.Playlist;

public class PlaylistMapper {
    public static PlaylistDto toDto(Playlist playlist) {
        PlaylistDto playlistDto = new PlaylistDto();
        playlistDto.setIdPlaylist(playlist.getIdPlaylist());
        playlistDto.setName(playlist.getName());
        playlistDto.setDescription(playlist.getDescription());

        return playlistDto;
    }

    public static Playlist toDocument(PlaylistDto playlistDto) {
        Playlist playlist = new Playlist();
        playlist.setName(playlistDto.getName());
        playlist.setDescription(playlistDto.getDescription());

        return playlist;
    }
}
