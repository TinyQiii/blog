package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 你仍然可以添加自定义方法，比如：
    User findByUsername(String username);
    
    // 添加insertUser方法声明
    int insertUser(User user);
}
