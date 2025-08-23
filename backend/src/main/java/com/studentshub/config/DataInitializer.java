package com.studentshub.config;

import com.studentshub.model.*;
import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer {

    private final EventPostRepository eventPostRepository;
    private final UserRepository userRepository;
    private final HousingPostRepository housingPostRepository;
    private final InternshipPostRepository internshipPostRepository;
    private final MaterialPostRepository materialPostRepository;
    private final TutorPostRepository tutorPostRepository;
    private final TransportPostRepository transportPostRepository;
    private  User adminUser;
    public DataInitializer(
            EventPostRepository eventPostRepository,
            UserRepository userRepository,
            HousingPostRepository housingPostRepository,
            InternshipPostRepository internshipPostRepository,
            MaterialPostRepository materialPostRepository,
            TutorPostRepository tutorPostRepository,
            TransportPostRepository transportPostRepository
    ) {
        this.eventPostRepository = eventPostRepository;
        this.userRepository = userRepository;
        this.housingPostRepository = housingPostRepository;
        this.internshipPostRepository = internshipPostRepository;
        this.materialPostRepository = materialPostRepository;
        this.tutorPostRepository = tutorPostRepository;
        this.transportPostRepository = transportPostRepository;
    }


    private HousingPost createHousingPost(String title, String description, String municipality, String location,
                                          Integer price, List<String> images, boolean isFound, User owner) {
        HousingPost post = new HousingPost();
        post.setTitle(title);
        post.setDescription(description);
        post.setMunicipality(municipality);
        post.setLocation(location);
        post.setPrice(price);
        post.setImages(images);
        post.setFound(isFound);
        post.setOwner(owner);
        post.setCreatedAt(LocalDateTime.now());
        post.setCategory(PostCategory.HOUSING);
        return post;
    }
    private TransportPost createTransportPost(LocalDateTime departureDatetime, String providerName,
                                              String locationFrom, String locationTo, Integer price,
                                              String title, String description, PostCategory category, User owner) {
        TransportPost post = new TransportPost();
        post.setDepartureDatetime(departureDatetime);
        post.setProviderName(providerName);
        post.setLocationFrom(locationFrom);
        post.setLocationTo(locationTo);
        post.setPrice(price);
        post.setTitle(title);
        post.setDescription(description);
        post.setCategory(category);
        post.setOwner(owner);
        post.setCreatedAt(LocalDateTime.now());

        return post;
    }



    @PostConstruct
    public void initData() {
        User adminUser = userRepository.findByUsername("admin")
                .orElseGet(() -> {
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword("admin");
                    return userRepository.save(admin);
                });

        LocalDateTime now = LocalDateTime.now();

        List<EventPost> posts = List.of(
                new EventPost(null, "Jazz Night", "An evening full of live jazz performances by local artists.",
                        now.minusDays(6), adminUser, PostCategory.EVENT, EventCategory.PARTY,
                        "Ohrid Cultural Center", false, 1500, "Ohrid Music Society",
                        "https://i.pinimg.com/736x/c8/4d/ff/c84dff6e4c07401a5dfa36061c71491a.jpg"),

                new EventPost(null, "Art Workshop", "Learn painting techniques in this free art workshop for beginners.",
                        now.minusDays(5), adminUser, PostCategory.EVENT, EventCategory.WORKSHOP,
                        "Gallery XYZ", true, 0, "Creative Minds",
                        "https://scandinavian-art-design.com/cdn/shop/files/PaintandPourBild.jpg?v=1709045781&width=533"),

                new EventPost(null, "Tech Conference 2025", "A 3-day conference covering the latest trends in AI and IoT.",
                        now.minusDays(4), adminUser, PostCategory.EVENT, EventCategory.DISCUSSION,
                        "Skopje Expo Center", false, 1200, "Tech Innovators",
                        "https://i.pinimg.com/originals/72/1b/93/721b933842f9dfce93caa3fe30f1f784.jpg"),

                new EventPost(null, "Marathon Run", "Join the annual marathon run for charity and fitness enthusiasts.",
                        now.minusDays(3), adminUser, PostCategory.EVENT, EventCategory.COMPETITION,
                        "City Park", false, 250, "City Sports Club",
                        "https://runnerstribe.com/wp-content/uploads/2016/11/CaseyWood.jpg"),

                new EventPost(null, "Book Fair", "Explore and buy books from local and international authors.",
                        now.minusDays(2), adminUser, PostCategory.EVENT, EventCategory.DISCUSSION,
                        "National Library", true, 0, "Library Association",
                        "https://images.unsplash.com/photo-1547126298-f0ae8a42c489?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9vayUyMGZhaXJ8ZW58MHx8MHx8fDA%3D"),

                new EventPost(null, "Culinary Festival", "Taste delicious dishes from Macedonian and international cuisine.",
                        now.minusDays(1), adminUser, PostCategory.EVENT, EventCategory.PARTY,
                        "Old Town Square", false, 100, "Gourmet Association",
                        "https://images.stockcake.com/public/b/9/5/b95fe362-ee89-48ac-bae3-acfe181981a8_large/food-truck-festival-stockcake.jpg")
        );

        List<HousingPost> housingPosts = List.of(
                createHousingPost("Центар стан 40м²", "Мал стан во центар, идеален за студенти.",
                        "Центар", "Скопје", 150000, List.of("https://www.designstudio210.com/wp-content/uploads/2023/10/Warm-apartment-aesthetic-outdoor-natural-light.jpeg"), false, adminUser),

                createHousingPost("Гарсоњера Аеродром", "Гарсоњера со балкон и поглед.",
                        "Аеродром", "Скопје", 120000, List.of("https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/5457343e-30f1-4dab-96c3-12588451dc86/_bf76b3da-2614-425e-b29b-070380800cdc.jpg"), false, adminUser),

                createHousingPost("Соба во Дебар Маало", "Се изнајмува соба во голем стан, делено сместување.",
                        "Карпош", "Скопје", 19000, List.of("https://i.pinimg.com/736x/ea/89/b1/ea89b1aa9df151a20cfa29d36fb236d2.jpg"), true, adminUser),

                createHousingPost("Студио кај ФИНКИ", "Студио во близина на ФИНКИ, комплетно опремено.",
                        "Чаир", "Скопје", 130000, List.of("https://www.feelinspiredblog.com/wp-content/uploads/2021/05/210507.020-1.jpg"), false, adminUser),

                createHousingPost("Соба во Битола", "Изнајмувам соба за студент во Битола.",
                        "Центар", "Битола", 80000, List.of("https://www.bhg.com/thmb/dgy0b4w_W0oUJUxc7M4w3H4AyDo=/1866x0/filters:no_upscale():strip_icc()/living-room-gallery-shelves-l-shaped-couch-ELeyNpyyqpZ8hosOG3EG1X-b5a39646574544e8a75f2961332cd89a.jpg"), false, adminUser),

                createHousingPost("Стан во Охрид", "Стан во близина на факултетите во Охрид.",
                        "Охрид", "Охрид", 11000, List.of("https://onekindesign.com/wp-content/uploads/2018/02/Warehouse-Style-Apartment-Home-01-1-Kindesign.jpg"), false, adminUser)
        );

        List<InternshipPost> internshipPosts = List.of(
                new InternshipPost(null, "Java Developer Internship", "Work on backend Java projects and APIs.",
                        LocalDateTime.now(), adminUser, PostCategory.INTERNSHIP,
                        "Tech Company A", "Computer Science", "Java Developer Intern",
                        "https://t3.ftcdn.net/jpg/05/48/79/56/360_F_548795617_Mc2v4YX1gCR7UCmJDBMAjUmiUfVuJKHf.jpg"),

                new InternshipPost(null, "Data Analyst Internship", "Analyze and visualize datasets for insights.",
                        LocalDateTime.now(), adminUser, PostCategory.INTERNSHIP,
                        "Data Insights Ltd", "Statistics", "Data Analyst Intern",
                        "https://bcassetcdn.com/public/blog/wp-content/uploads/2021/10/07203359/australia-tech-map-by-jimjemr-brandcrowd.png"),

                new InternshipPost(null, "Marketing Intern", "Support digital marketing campaigns and SEO efforts.",
                        LocalDateTime.now(), adminUser, PostCategory.INTERNSHIP,
                        "Creative Agency", "Marketing", "Marketing Intern",
                        "https://img.freepik.com/premium-vector/set-company-logo-design-ideas-vector_1127227-682.jpg"),

                new InternshipPost(null, "UX/UI Design Internship", "Design user interfaces and prototypes.",
                        LocalDateTime.now(), adminUser, PostCategory.INTERNSHIP,
                        "Design Studio", "Design", "UX/UI Intern",
                        "https://img.freepik.com/premium-vector/pg-logo-design_566521-46.jpg"),

                new InternshipPost(null, "Cybersecurity Internship", "Learn about network security and vulnerability testing.",
                        LocalDateTime.now(), adminUser, PostCategory.INTERNSHIP,
                        "Security Experts", "Information Security", "Cybersecurity Intern",
                        "https://pixahive.com/wp-content/uploads/2020/09/itcompany-logo-by-pixahive.png"),

                new InternshipPost(null, "Finance Internship", "Assist with financial modeling and reporting.",
                        LocalDateTime.now(), adminUser, PostCategory.INTERNSHIP,
                        "Finance Group", "Finance", "Finance Intern",
                        "https://www.shutterstock.com/image-vector/abstract-technology-logo-260nw-623206427.jpg")
        );


        List<MaterialPost> materialPosts = List.of(
                new MaterialPost(null, "Алгоритми и Структури на Податоци", "Материјал за вежби и предавања.",
                        now.minusDays(6), adminUser, PostCategory.MATERIAL, 4.8,
                        "/files/beleski.txt", List.of(), "beleski.txt", "Алгоритми и Структури на Податоци"),

                new MaterialPost(null, "Основи на Бази на Податоци", "Прашања за испит и пример решени SQL задачи.",
                        now.minusDays(5), adminUser, PostCategory.MATERIAL, 4.5,
                        "/files/kolokviumski.txt", List.of(), "kolokviumski.txt", "Бази на Податоци"),

                new MaterialPost(null, "Математика 1", "Материјали од предавања + збирка задачи.",
                        now.minusDays(4), adminUser, PostCategory.MATERIAL, 4.7,
                        "/files/223002.pdf", List.of(), "223002.pdf", "Математика 1"),

                new MaterialPost(null, "Мрежи и Комуникации", "Слајдови и кратки белешки.",
                        now.minusDays(3), adminUser, PostCategory.MATERIAL, 4.3,
                        "/files/Лабораториска вежба бр. 01 - одговори.doc", List.of(), "Лабораториска вежба бр. 01 - одговори.doc", "Компјутерски Mрежи и Безбедност"),

                new MaterialPost(null, "Програмирање 1", "Code examples и објаснувања на теми од Java.",
                        now.minusDays(2), adminUser, PostCategory.MATERIAL, 4.9,
                        "/files/prv kolokvium vezbi.txt", List.of(), "prv kolokvium vezbi.txt", "Структурно програмирање"),

                new MaterialPost(null, "Веб Програмирање", "HTML, CSS и JS материјали.",
                        now.minusDays(1), adminUser, PostCategory.MATERIAL, 4.6,
                        "/files/wp.pdf", List.of(), "wp.pdf", "Веб Програмирање")
        );
        List<TutorPost> tutorPosts = List.of(
                new TutorPost(
                        null,
                        "Ментор по Математика 1",
                        "Имате проблем со интеграли и лимеси? Контактирајте ме!",
                        now.minusDays(6),
                        adminUser,
                        PostCategory.TUTOR,
                        "Весна Стојанова",
                        "Природно-математички факултет",
                        true,
                        400,
                        "Математика 1",
                        adminUser
                ),

                new TutorPost(
                        null,
                        "Подготовка за Објектно Ориентирано Програмирање",
                        "Вежби, проекти и објаснување на концепти од ООП.",
                        now.minusDays(5),
                        adminUser,
                        PostCategory.TUTOR,
                        "Иван Петров",
                        "ФИНКИ",
                        true,
                        500,
                        "ООП (Java)",
                        adminUser
                ),

                new TutorPost(
                        null,
                        "Алгоритми и структури – туторство",
                        "Објаснување на алгоритми, кодирање и анализа на сложеност.",
                        now.minusDays(4),
                        adminUser,
                        PostCategory.TUTOR,
                        "Марија Николовска",
                        "ФИНКИ",
                        false,
                        600,
                        "Алгоритми и структури на податоци",
                        adminUser
                ),

                new TutorPost(
                        null,
                        "Бази на податоци – теорија и практично",
                        "SQL, нормализација, ER модели – сè на едно место.",
                        now.minusDays(3),
                        adminUser,
                        PostCategory.TUTOR,
                        "Дамјан Стојанов",
                        "ФИНКИ",
                        true,
                        450,
                        "Бази на податоци",
                        adminUser
                ),

                new TutorPost(
                        null,
                        "Програмирање 1 помош",
                        "Закажи час за објаснување на основи на Java и решавање задачи.",
                        now.minusDays(2),
                        adminUser,
                        PostCategory.TUTOR,
                        "Марија Николовска",
                        "ФИНКИ",
                        false,
                        350,
                        "Програмирање 1",
                        adminUser
                ),

                new TutorPost(
                        null,
                        "Веб програмирање – HTML, CSS, JS",
                        "Работа на проекти, објаснување и помош со задачи.",
                        now.minusDays(1),
                        adminUser,
                        PostCategory.TUTOR,
                        "Иван Петров",
                        "ФИНКИ",
                        true,
                        500,
                        "Веб програмирање",
                        adminUser
                )
        );


        List<TransportPost> transportPosts = List.of(
                createTransportPost(LocalDateTime.now().plusDays(1), "Express Trans", "Скопје", "Охрид", 800,
                        "Трансфер Скопје-Охрид", "Брз и удобен трансфер со клима.", PostCategory.TRANSPORT, adminUser),

                createTransportPost(LocalDateTime.now().plusDays(2), "City Bikes", "Битола", "Карпош", 500,
                        "Изнајмување велосипеди", "Велосипеди за изнајмување со еден ден рент.", PostCategory.TRANSPORT, adminUser),

                createTransportPost(LocalDateTime.now().plusHours(5), "Fast Bus", "Тетово", "Скопје", 300,
                        "Автобус Тетово-Скопје", "Автобуски превоз два пати дневно.", PostCategory.TRANSPORT, adminUser),

                createTransportPost(LocalDateTime.now().plusDays(3), "Moto Rent", "Струмица", "Валандово", 200,
                        "Изнајмување мотор", "Мотор за изнајмување на дневна основа.", PostCategory.TRANSPORT, adminUser),

                createTransportPost(LocalDateTime.now().plusDays(4), "Cargo Movers", "Скопје", "Битола", 500,
                        "Транспорт на стока", "Безбедно транспортирање на стоки.", PostCategory.TRANSPORT, adminUser),

                createTransportPost(LocalDateTime.now().plusHours(8), "Electric Scooters", "Куманово", "Скопје", 370,
                        "Електрични тротинети", "Изнајмување на електрични тротинети за кратки патувања.", PostCategory.TRANSPORT, adminUser)
        );

        transportPostRepository.saveAll(transportPosts);


        tutorPostRepository.saveAll(tutorPosts);
        materialPostRepository.saveAll(materialPosts);
        internshipPostRepository.saveAll(internshipPosts);
        housingPostRepository.saveAll(housingPosts);
        eventPostRepository.saveAll(posts);
    }

}