package com.hoaittm.deepseekserver.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hoaittm.deepseekserver.model.Posts;

public interface PostRepository extends JpaRepository<Posts, Long> {
}
