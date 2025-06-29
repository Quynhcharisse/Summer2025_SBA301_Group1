package com.sba301.group1.pes_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private String roomNumber;
    private boolean isOccupied;
}