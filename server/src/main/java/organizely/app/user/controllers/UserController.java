package organizely.app.user.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import organizely.app.user.dto.RequestLoginDTO;
import organizely.app.user.dto.RequestUserDTO;
import organizely.app.user.entity.User;
import organizely.app.user.repository.IUserRepository;
import organizely.app.user.services.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

  @Autowired
  public UserService userService;

  @Autowired
  public IUserRepository userRepository;

  // create a new user account
  @PostMapping("/auth/register")
  public ResponseEntity<Object> register(@RequestBody User user) {
    if (!this.userService.isUsernameAvailable(user)) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
                           .body("Username already exists.");
    }
    this.userService.saveUser(user);
    return ResponseEntity.status(HttpStatus.OK)
                         .body("New account registered. Username: " + user.getUsername() + ".");
  }

  // login to account and generate a token
  @PostMapping("/auth/login")
  public ResponseEntity<Object> login(@RequestBody RequestLoginDTO userDTO) {
    //TODO: validate user login data

    //TODO: generate jwt token

    
    return ResponseEntity.status(HttpStatus.OK)
                         .body("Ok");

  }
  
  // (admin) list all users 
  @GetMapping("/users")
  public ResponseEntity<Object> listAllUsers() {
    var users = this.userService.listAllUsers();
    return ResponseEntity.status(HttpStatus.OK).body(users);
  }

  // update user
  @PutMapping("/users/{id}/edit")
  public ResponseEntity<Object> updateUser(@PathVariable("id") String userId, @RequestBody RequestUserDTO userDTO) {
    var existingUser = this.userService.findUserById(userId);
    if (existingUser == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("User not found.");
    }
    this.userService.updateUserData(userDTO, existingUser);
    return ResponseEntity.status(HttpStatus.OK)
                                .body("User updated.");
  }

  // delete user
  @DeleteMapping("/users/{id}/delete")
  public ResponseEntity<Object> deleteUser(@PathVariable("id") String userId) {
    var existingUser = this.userService.findUserById(userId);
    if (existingUser == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("User not found.");
    }
    this.userRepository.deleteById(UUID.fromString(userId));
    return ResponseEntity.status(HttpStatus.OK)
                                .body("User deleted.");
  }
  
}
