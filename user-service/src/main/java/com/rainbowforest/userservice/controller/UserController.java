package com.rainbowforest.userservice.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.rainbowforest.userservice.dto.GoogleLoginRequest;
import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserDetails;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.http.header.HeaderGenerator;
import com.rainbowforest.userservice.service.EmailService;
import com.rainbowforest.userservice.service.UserService;
import com.rainbowforest.userservice.until.GoogleVerifier;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private HeaderGenerator headerGenerator;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	private GoogleVerifier googleVerifier;
	@Autowired
	private EmailService emailService;

	public UserController(GoogleVerifier googleVerifier) {
		this.googleVerifier = googleVerifier;
	}

	@GetMapping(value = "/users")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userService.getAllUsers();
		if (!users.isEmpty()) {
			return new ResponseEntity<List<User>>(
					users,
					headerGenerator.getHeadersForSuccessGetMethod(),
					HttpStatus.OK);
		}
		return new ResponseEntity<List<User>>(
				headerGenerator.getHeadersForError(),
				HttpStatus.NOT_FOUND);
	}

	@GetMapping(value = "/users", params = "name")
	public ResponseEntity<User> getUserByName(@RequestParam("name") String userName) {
		User user = userService.getUserByName(userName);
		if (user != null) {
			return new ResponseEntity<User>(
					user,
					headerGenerator.getHeadersForSuccessGetMethod(),
					HttpStatus.OK);
		}
		return new ResponseEntity<User>(
				headerGenerator.getHeadersForError(),
				HttpStatus.NOT_FOUND);
	}

	@GetMapping(value = "/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
		User user = userService.getUserById(id);
		if (user != null) {
			return new ResponseEntity<User>(
					user,
					headerGenerator.getHeadersForSuccessGetMethod(),
					HttpStatus.OK);
		}
		return new ResponseEntity<User>(
				headerGenerator.getHeadersForError(),
				HttpStatus.NOT_FOUND);
	}

	@PutMapping("/users/{id}")
	public ResponseEntity<User> updateUser(
			@PathVariable("id") Long id,
			@RequestBody User updatedUser) {

		User existingUser = userService.getUserById(id);
		if (existingUser == null) {
			return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
		}

		// Xử lý userDetails
		if (updatedUser.getUserDetails() != null) {
			UserDetails existingDetails = existingUser.getUserDetails();
			UserDetails updatedDetails = updatedUser.getUserDetails();

			// Nếu existingDetails là null, tạo một đối tượng UserDetails mới
			if (existingDetails == null) {
				existingDetails = new UserDetails();
			}

			// Cập nhật có điều kiện các trường địa chỉ (và các trường khác)
			if (updatedDetails.getStreet() != null && !updatedDetails.getStreet().isEmpty()) {
				existingDetails.setStreet(updatedDetails.getStreet());
			}

			if (updatedDetails.getPhoneNumber() != null) {
				existingDetails.setPhoneNumber(updatedDetails.getPhoneNumber());
			}

			if (updatedDetails.getLocality() != null && !updatedDetails.getLocality().isEmpty()) {
				existingDetails.setLocality(updatedDetails.getLocality());
			}
			if (updatedDetails.getCountry() != null && !updatedDetails.getCountry().isEmpty()) {
				existingDetails.setCountry(updatedDetails.getCountry());
			}
			existingDetails.setFirstName(updatedDetails.getFirstName());
			existingDetails.setLastName(updatedDetails.getLastName());
			existingDetails.setEmail(updatedDetails.getEmail());
			existingUser.setUserDetails(existingDetails); // Cập nhật lại userDetails trong existingUser
		}

		// ... (các cập nhật khác cho user, ví dụ: userName, provider, role)
		existingUser.setUserName(updatedUser.getUserName());
		userService.updateUser(existingUser); // Hoặc saveOrUpdateUser
		return new ResponseEntity<>(existingUser, headerGenerator.getHeadersForSuccessPutMethod(), HttpStatus.OK); // Hoặc
																													// patch
	}

	@DeleteMapping(value = "/users/{id}")
	public ResponseEntity<Void> deleteUserById(@PathVariable("id") Long id) {
		boolean isDeleted = userService.deleteUserById(id);
		if (isDeleted) {
			return new ResponseEntity<>(headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping(value = "/users")
	public ResponseEntity<User> addUser(@RequestBody User user,
			HttpServletResponse request) {
		if (user != null)
			try {
				userService.saveUser(user);
				return new ResponseEntity<User>(
						user,
						headerGenerator.getHeadersForSuccessPostMethod(request, user.getId()),
						HttpStatus.CREATED);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<User>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User loginRequest) {
		// Tìm user theo username
		User user = userService.findByUserName(loginRequest.getUserName());

		// So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
		if (user != null && bCryptPasswordEncoder.matches(loginRequest.getUserPassword(), user.getUserPassword())) {
			// Xóa mật khẩu trước khi trả response
			user.setUserPassword(null);

			return ResponseEntity.ok(user); // Trả về thông tin user nếu đăng nhập thành công
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tên đăng nhập hoặc mật khẩu");
		}
	}

	@PostMapping("/google-login")
	public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
		try {
			String token = request.getToken();
			Payload payload = googleVerifier.verify(token);

			if (payload == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
			}

			String email = payload.getEmail();
			String name = (String) payload.get("name");

			// Tách họ và tên nếu có thể
			String[] nameParts = name.split(" ", 2);
			String firstName = nameParts.length > 0 ? nameParts[0] : "";
			String lastName = nameParts.length > 1 ? nameParts[1] : "";

			// Kiểm tra xem user đã tồn tại chưa
			UserDetails existingDetails = userService.getUserByEmail(email);
			User user;
			boolean isNewUser = false;
			if (existingDetails != null) {
				user = existingDetails.getUser();
			} else {
				// Nếu chưa tồn tại, tạo mới userDetails
				UserDetails userDetails = new UserDetails();
				userDetails.setFirstName(firstName);
				userDetails.setLastName(lastName);
				userDetails.setEmail(email);
				userDetails.setPhoneNumber(""); // để trống hoặc lấy từ payload nếu có

				// Tạo user mới
				user = new User();
				// user.setUserName(firstName + " " + lastName);// hoặc payload.getSubject()
				user.setUserName(email);
				user.setUserPassword(""); // Google user không có password
				user.setActive(1);
				user.setUserDetails(userDetails);
				userDetails.setUser(user); // liên kết hai chiều

				// Gán role mặc định (ví dụ: "ROLE_USER")
				UserRole defaultRole = userService.getDefaultRole();
				;
				user.setRole(defaultRole);

				userService.saveUser(user); // sẽ cascade và lưu cả UserDetails
			}
			String subject;
			String emailContent;

			if (isNewUser) {
				subject = "Chào mừng bạn đến với Veya Shop!";
				emailContent = "<div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);\">"
						+ "<h2 style=\"color: #1a73e8; text-align: center; margin-bottom: 20px;\">Chào mừng bạn, "
						+ name + "!</h2>"
						+ "<p style=\"text-align: center; font-size: 1.1em;\">Bạn đã đăng ký tài khoản Veya Shop thành công thông qua Google.</p>"
						+ "<p>Chúng tôi rất vui khi có bạn đồng hành. Hãy bắt đầu khám phá các sản phẩm tuyệt vời của Veya Shop ngay hôm nay!</p>"
						+ "<p style=\"text-align: center; margin-top: 25px;\"><a href=\"http://localhost:3000\" style=\"background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;\">Khám phá ngay!</a></p>"
						+ "<p style=\"margin-top: 30px; font-size: 0.9em; color: #777; text-align: center;\">Trân trọng,<br>Đội ngũ Veya Shop</p>"
						+ "</div>";
			} else {
				subject = "Đăng nhập Veya Shop thành công!";
				emailContent = "<div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);\">"
						+ "<h2 style=\"color: #1a73e8; text-align: center; margin-bottom: 20px;\">Xin chào " + name
						+ ",</h2>"
						+ "<p style=\"text-align: center; font-size: 1.1em;\">Bạn vừa đăng nhập thành công vào tài khoản Veya Shop bằng Google.</p>"
						+ "<p>Nếu đây không phải là bạn, vui lòng liên hệ với chúng tôi ngay lập tức.</p>"
						+ "<p style=\"margin-top: 30px; font-size: 0.9em; color: #777; text-align: center;\">Trân trọng,<br>Đội ngũ Veya Shop</p>"
						+ "</div>";
			}

			try {
				emailService.sendEmail(email, subject, emailContent);
				System.out.println("Đã gửi email thông báo đăng nhập/đăng ký Google thành công tới: " + email);
			} catch (MailException e) {
				System.err.println("Lỗi khi gửi email thông báo đăng nhập Google: " + e.getMessage());
				e.printStackTrace();
				// Tùy chọn: bạn có thể chọn bỏ qua lỗi gửi email để không ảnh hưởng đến luồng
				// đăng nhập chính
			}
			// --- KẾT THÚ
			// Trả dữ liệu JSON sau khi lưu
			return ResponseEntity.ok(Map.of(
					"id", user.getId(),
					"email", user.getUserDetails().getEmail(),
					"name", user.getUserDetails().getFirstName() + " " + user.getUserDetails().getLastName()));

		} catch (SecurityException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
		}
	}

}
