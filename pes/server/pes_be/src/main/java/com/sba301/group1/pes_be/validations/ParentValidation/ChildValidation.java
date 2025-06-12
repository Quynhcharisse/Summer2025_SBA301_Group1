package com.sba301.group1.pes_be.validations.ParentValidation;

import com.sba301.group1.pes_be.requests.AddChildRequest;
import com.sba301.group1.pes_be.requests.UpdateChildRequest;

public class ChildValidation {
    public static String addChildValidate(AddChildRequest request) {
        int age = request.getDateOfBirth().until(java.time.LocalDate.now()).getYears();
        if(age < 3 || age > 7) {
            return "Child's age must be between 3 and 7 years old.";
        }
        return "";
    }

    public static String updateChildValidate(UpdateChildRequest request) {
        int age = request.getDateOfBirth().until(java.time.LocalDate.now()).getYears();
        if(age < 3 || age > 7) {
            return "Child's age must be between 3 and 7 years old.";
        }
        return "";
    }
}
