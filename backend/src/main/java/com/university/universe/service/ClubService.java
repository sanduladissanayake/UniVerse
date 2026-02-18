package com.university.universe.service;

import com.university.universe.model.Club;
import com.university.universe.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    // Create a new club
    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    // Get all clubs
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    // Get club by ID
    public Club getClubById(Long id) {
        Optional<Club> club = clubRepository.findById(id);
        if (!club.isPresent()) {
            throw new RuntimeException("Club not found");
        }
        return club.get();
    }

    // Get clubs by admin ID
    public List<Club> getClubsByAdminId(Long adminId) {
        return clubRepository.findByAdminId(adminId);
    }

    // Search clubs by name
    public List<Club> searchClubsByName(String name) {
        return clubRepository.findByNameContainingIgnoreCase(name);
    }

    // Update club
    public Club updateClub(Long id, Club updatedClub) {
        Club existingClub = getClubById(id);

        existingClub.setName(updatedClub.getName());
        existingClub.setDescription(updatedClub.getDescription());
        existingClub.setLogoUrl(updatedClub.getLogoUrl());
        existingClub.setAdminId(updatedClub.getAdminId());
        existingClub.setMembershipFee(updatedClub.getMembershipFee());

        return clubRepository.save(existingClub);
    }

    // Delete club
    public void deleteClub(Long id) {
        Long idToDelete = id;
        clubRepository.deleteById(idToDelete);
    }
}
