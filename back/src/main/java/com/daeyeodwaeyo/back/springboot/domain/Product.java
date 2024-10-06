package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor // Lombok: 기본 생성자 생성
@AllArgsConstructor // Lombok: 모든 필드를 이용한 생성자 생성
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = true)
    private User user;

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "category", length = 100, nullable = false)
    private String category;

    @Column(name = "price", length = 100,nullable = false)
    private String price;

    @Temporal(TemporalType.DATE)
    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @ElementCollection
    @Column(name = "image_urls",nullable = true)
    private List<String> imageUrls;

    @Column(name = "video_url", length = 500,nullable = true)
    private String videoUrl;

}
