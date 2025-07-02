package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.mapper.MessageMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/") // Optional: unified prefix
@CrossOrigin(origins = "http://localhost:5173")
public class ApiController {

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private UserMapper userMapper;

    // ========== User Related ==========

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        
        String username = userData.get("username");
        String password = userData.get("password");

        if (userMapper.findByUsername(username) != null) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }

        User user = new User();
        user.setUsername(username);
        // 直接存储明文密码
        user.setPassword(password);
        userMapper.insertUser(user);

        response.put("success", true);
        response.put("message", "Registration successful");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        
        String username = userData.get("username");
        String password = userData.get("password");

        // 调试信息
        System.out.println("Login attempt - Username: " + username);
        
        User user = userMapper.findByUsername(username);
        if (user != null) {
            System.out.println("User found: " + user.getUsername() + ", ID: " + user.getId());
            System.out.println("Stored password: " + user.getPassword());
            System.out.println("Input password: " + password);
            
            // 直接比较明文密码
            boolean passwordMatch = password.equals(user.getPassword());
            System.out.println("Password match: " + passwordMatch);
            
            if (passwordMatch) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", user);
            } else {
                response.put("success", false);
                response.put("message", "Invalid password");
            }
        } else {
            System.out.println("User not found: " + username);
            response.put("success", false);
            response.put("message", "User not found");
        }
        
        return response;
    }

    // 调试接口 - 创建测试用户
    @PostMapping("/debug/create-test-user")
    public Map<String, Object> createTestUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 检查是否已存在
            User existingUser = userMapper.findByUsername("admin");
            if (existingUser != null) {
                response.put("success", true);
                response.put("message", "Test user already exists");
                response.put("user", existingUser);
                return response;
            }
            
            // 创建测试用户 - 明文密码
            User user = new User();
            user.setUsername("admin");
            user.setPassword("123456");
            userMapper.insertUser(user);
            
            response.put("success", true);
            response.put("message", "Test user created successfully");
            response.put("user", user);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating test user: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }

    // 调试接口 - 查看所有用户
    @GetMapping("/debug/users")
    public Map<String, Object> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userMapper.selectList(null);
            response.put("success", true);
            response.put("users", users);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error getting users: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }

    @PostMapping("/logout")
    public Map<String, Object> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return response;
    }

    // ========== Message Related ==========

    @GetMapping("/messages")
    @Cacheable(value = "messages", key = "#page + '_' + #size")
    public Map<String, Object> getMessages(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Page<Message> pageParam = new Page<>(page, size);
            Page<Message> result = messageMapper.selectPage(pageParam, 
                new QueryWrapper<Message>().orderByDesc("id"));
            
            response.put("success", true);
            response.put("data", result.getRecords());
            response.put("total", result.getTotal());
            response.put("pages", result.getPages());
            response.put("current", result.getCurrent());
            response.put("size", result.getSize());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error getting messages: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }

    @GetMapping("/messages/all")
    @Cacheable(value = "allMessages")
    public List<Message> getAllMessages() {
        return messageMapper.selectList(new QueryWrapper<Message>().orderByDesc("id"));
    }

    @PostMapping("/messages")
    @CacheEvict(value = {"messages", "allMessages"}, allEntries = true)
    public Map<String, Object> addMessage(@RequestBody Map<String, String> messageData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String content = messageData.get("content");
            String author = messageData.get("author");
            
            if (content == null || content.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Message content cannot be empty");
                return response;
            }
            
            Message message = new Message();
            message.setContent(content);
            message.setAuthor(author != null ? author : "Anonymous");
            
            messageMapper.insert(message);
            
            response.put("success", true);
            response.put("message", "Message added successfully");
            response.put("data", message);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error adding message: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }

    @DeleteMapping("/messages/{id}")
    @CacheEvict(value = {"messages", "allMessages"}, allEntries = true)
    public Map<String, Object> deleteMessage(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            int result = messageMapper.deleteById(id);
            if (result > 0) {
                response.put("success", true);
                response.put("message", "Message deleted successfully");
            } else {
                response.put("success", false);
                response.put("message", "Message not found");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting message: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }

    @PutMapping("/messages/{id}")
    @CacheEvict(value = {"messages", "allMessages"}, allEntries = true)
    public Map<String, Object> updateMessage(@PathVariable Long id, @RequestBody Map<String, String> messageData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Message existingMessage = messageMapper.selectById(id);
            if (existingMessage == null) {
                response.put("success", false);
                response.put("message", "Message not found");
                return response;
            }
            
            String content = messageData.get("content");
            if (content != null && !content.trim().isEmpty()) {
                existingMessage.setContent(content);
                messageMapper.updateById(existingMessage);
                
                response.put("success", true);
                response.put("message", "Message updated successfully");
                response.put("data", existingMessage);
            } else {
                response.put("success", false);
                response.put("message", "Message content cannot be empty");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating message: " + e.getMessage());
            e.printStackTrace();
        }
        
        return response;
    }
}
