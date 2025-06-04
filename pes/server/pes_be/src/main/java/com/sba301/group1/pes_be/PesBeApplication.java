package com.sba301.group1.pes_be;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.models.Manager;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.ManagerRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
@RequiredArgsConstructor
public class PesBeApplication {

    private final AccountRepo accountRepo;

    private final AdmissionFormRepo admissionFormRepo;

    private final ParentRepo parentRepo;

    private final StudentRepo studentRepo;

    private final AdmissionTermRepo admissionTermRepo;

    private final ManagerRepo managerRepo;


    public static void main(String[] args) {
        SpringApplication.run(PesBeApplication.class, args);
    }

    private String generateRandomCCCD() {
        StringBuilder cccd = new StringBuilder();
        for (int k = 0; k < 12; k++) {
            cccd.append((int) (Math.random() * 10)); // sinh số từ 0–9
        }
        return cccd.toString();
    }

    private String generateRandomPhone() {
        String[] prefixList = {"09", "03", "07"};
        String prefix = prefixList[(int) (Math.random() * prefixList.length)];

        StringBuilder phone = new StringBuilder(prefix);
        for (int i = 0; i < 8; i++) {
            int digit = ((int) (Math.random() * 10)); // 0-9
            phone.append(digit); //used to append data to the end of the current string (not create new string)
        }
        return phone.toString();
    }

    private String generateRandomAddress() {
        String[] streets = {"Nguyen Trai", "Le Loi", "Tran Hung Dao", "Pham Van Dong", "Hai Ba Trung"};
        String[] wards = {"Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"};
        String[] districts = {"District 1", "District 3", "District 5", "Binh Thanh", "Go Vap"};
        String[] cities = {"Ho Chi Minh City", "Hanoi", "Da Nang", "Can Tho"};

        int streetNumber = (int) (Math.random() * 200 + 1); // số nhà từ 1-200
        String street = streets[(int) (Math.random() * streets.length)];
        String ward = wards[(int) (Math.random() * wards.length)];
        String district = districts[(int) (Math.random() * districts.length)];
        String city = cities[(int) (Math.random() * cities.length)];

        return streetNumber + " " + street + ", " + ward + ", " + district + ", " + city;
    }

    private LocalDate generateRandomBirthDateForChild() {
        LocalDate today = LocalDate.now();
        LocalDate from = today.minusYears(5); // 5 tuổi
        LocalDate to = today.minusYears(3);   // 3 tuổi

        long days = to.toEpochDay() - from.toEpochDay();
        long randomDay = from.toEpochDay() + (long) (Math.random() * days);
        return LocalDate.ofEpochDay(randomDay);
    }

    private String generateRandomBirthHospital() {
        String[] hospitals = {
                "Bệnh viện Từ Dũ",
                "Bệnh viện Hùng Vương",
                "Bệnh viện Phụ sản Trung ương",
                "Bệnh viện Quốc tế City",
                "Bệnh viện Quốc tế Hạnh Phúc",
                "Bệnh viện Đại học Y Dược TP.HCM",
                "Bệnh viện Vinmec Central Park",
                "Bệnh viện Phụ sản Hà Nội",
                "Bệnh viện Mekong",
                "Bệnh viện An Sinh"
        };
        int index = (int) (Math.random() * hospitals.length);
        return hospitals[index];
    }

    private String generateRandomName() {
        String[] names = {
                "Khoa Vu Tu Du",
                "Hùng Vương",
                "Le Thi Trung Uong",
                "Nguyen Van Toan",
                "Pham Van Hanh Phuc",
                "Pham Van Nhu Quynh"
        };
        int index = (int) (Math.random() * names.length);
        return names[index];
    }

    @Bean
    public CommandLineRunner initAdmissionManager() {
        return args -> {
            //init admission manager
            String emailManager = "admission@gmail.com";
            if (!accountRepo.existsByEmail(emailManager)) {
                Account admissionsManager = Account.builder()
                        .email(emailManager)
                        .password("manager@123")
                        .role(Role.ADMISSION)
                        .name("Ms.Tu Nguyen")
                        .phone("0909152078")
                        .identityNumber("070432000089")
                        .gender("male")
                        .status(Status.ACCOUNT_ACTIVE.getValue())
                        .createdAt(LocalDate.now())
                        .build();
                accountRepo.save(admissionsManager);

                Manager manager = Manager.builder()
                        .account(admissionsManager)
                        .department("Admission Manager")
                        .status(Status.ACCOUNT_ACTIVE.getValue())
                        .passwordChanged(false)
                        .build();
                managerRepo.save(manager);

                System.out.println("Created Admission Manager: " + emailManager);

                //Init Admission Term once
                int termYear = 2025;
                if (!admissionTermRepo.existsByYear(termYear)) {
                    AdmissionTerm term = AdmissionTerm.builder()
                            .name("Fall Term " + termYear)
                            .startDate(LocalDate.of(2025, 4, 1))
                            .endDate(LocalDate.of(2025, 6, 1))
                            .year(termYear)
                            .maxNumberRegistration(200)
                            .grade(Grade.BUD) // Or Grade.MAM_NON etc.
                            .status(Status.LOCKED_TERM.getValue())
                            .build();
                    admissionTermRepo.save(term);
                    System.out.println("Created Admission Term for year: " + termYear);
                }

                // Init Parents
                for (int i = 1; i <= 3; i++) {
                    String emailParent = "parent" + i + "@gmail.com";

                    if (!accountRepo.existsByEmail(emailParent)) {
                        Account parentAccount = Account.builder()
                                .email(emailParent)
                                .password("123456")
                                .role(Role.PARENT)
                                .name("Parent" + i)
                                .gender(Math.random() < 0.5 ? "male" : "female")
                                .phone(generateRandomPhone())
                                .identityNumber(generateRandomCCCD())
                                .status(Status.ACCOUNT_ACTIVE.getValue())
                                .createdAt(LocalDate.now())
                                .build();
                        accountRepo.save(parentAccount);

                        Parent parent = Parent.builder()
                                .account(parentAccount)
                                .address(generateRandomAddress())
                                .job("Job" + i)
                                .relationshipToChild(Math.random() < 0.5 ? "father" : "mother")
                                .build();
                        parentRepo.save(parent);

                        int numberOfChildren = (int) (Math.random() * 2) + 2; // 2 đến 3 đứa trẻ
                        for (int j = 1; j <= numberOfChildren; j++) {
                            Student child = Student.builder()
                                    .name(generateRandomName())
                                    .gender(Math.random() < 0.5 ? "male" : "female")
                                    .dateOfBirth(generateRandomBirthDateForChild())
                                    .placeOfBirth(generateRandomBirthHospital())
                                    .parent(parent)
                                    .build();
                            studentRepo.save(child);
                        }

                        System.out.println("Created Parent: " + emailParent + " with " + numberOfChildren + " children.");
                    }
                }
            }
        };
    }
}