package com.multibank.domain.entity;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Holiday {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "holiday_id")
	private Long holidayId;

	@Column(name = "holiday_name")
	private String holidayName;
	
	@Column(name = "holiday_date")
	private Timestamp holidayDate;

	public Long getHolidayId() {
		return holidayId;
	}

	public void setHolidayId(Long holidayId) {
		this.holidayId = holidayId;
	}

	public String getHolidayName() {
		return holidayName;
	}

	public void setHolidayName(String holidayName) {
		this.holidayName = holidayName;
	}

	public Timestamp getHolidayDate() {
		return holidayDate;
	}

	public void setHolidayDate(Timestamp holidayDate) {
		this.holidayDate = holidayDate;
	}

	@Override
	public String toString() {
		return "Holiday [holidayId=" + holidayId + ", holidayName=" + holidayName + ", holidayDate=" + holidayDate
				+ "]";
	}

	
}
