package organizely.app.user.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import organizely.app.user.dto.RequestUserDTO;
import organizely.app.user.dto.ResponseUserDTO;
import organizely.app.user.entity.User;
import organizely.app.user.repository.IUserRepository;

@Service
public class UserService {
  
  @Autowired
  public IUserRepository userRepository;
    
  // check if username is unique
  public Boolean isUsernameAvailable(User user) {
    var users = this.userRepository.findByUsername(user.getUsername());
    return users.isEmpty();
  }

  // hide the password
  public String createPasswordHash(String password) {
     return BCrypt.withDefaults().hashToString(12, password.toCharArray());
  }
  
  // save new account to db
  public void saveUser(User user) {
    var passwordHash = createPasswordHash(user.getPassword());
    user.setPassword(passwordHash);
    this.userRepository.save(user);
  }

  // find user
  public User findUserById(String userId) {
    var userResult = this.userRepository.findById(UUID.fromString(userId));
    if (userResult.isEmpty()) {
      return null;
    }
    User existingUser = userResult.get();
    return existingUser;
  }

  // update account data
  public void updateUserData(RequestUserDTO updatedUserData, User existingUser) {
    if (updatedUserData.getFullName() != null && !updatedUserData.getFullName().isBlank()) {
      existingUser.setFullName(updatedUserData.getFullName());
    }
    if (updatedUserData.getUsername() != null && !updatedUserData.getUsername().isBlank()) {
      existingUser.setUsername(updatedUserData.getUsername());
    }
    if (updatedUserData.getPassword() != null && !updatedUserData.getPassword().isBlank()) {
      existingUser.setPassword(createPasswordHash(updatedUserData.getPassword()));
    }
    this.userRepository.save(existingUser);
  }
  
  // (admin access) list all users accounts
  public List<ResponseUserDTO> listAllUsers() {
    List<User> users = this.userRepository.findAll();

    List<ResponseUserDTO> userDTOList = new ArrayList<>();

    for(User user : users) {
      ResponseUserDTO dto = new ResponseUserDTO(
                user.getId(),
                user.getFullName(),
                user.getUsername()
        );
      userDTOList.add(dto);
    }

    return userDTOList;
  }
}
