import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHOOLS } from '../graphql/queries';
import { season, timezone } from "../mock/data.js";
import { FcCalendar } from "react-icons/fc";
import ICalendarLink from "react-icalendar-link";

const LINK_LENGTH = 3;
let ArrayOfSports = [];
const baseCalDownLoadableURL = "http://ical.8to18.com/link/";

const calendarEvent = {
	title: "Thhe School Sport",
	description: "My Description",
	startTime: "2018-10-07T10:30:00+10:00",
	endTime: "2018-10-07T12:00:00+10:00",
	location: "10 Carlotta St, Artarmon NSW 2064, Australia",
	attendees: [
		"Hello World <hello@world.com>",
		"Hey <hey@test.com>",
	]
}

export default function Home() {
	const [linkStringArray, setLinkStringArray] = useState([]);
	 const [isInputSelectDisabled, setIsInputSelectDisabled] = useState(true);
	const [schoolCode, setSchoolCode] = useState("");
	const [schoolSport, setSchoolSport] = useState("");
	const [schoolSeason, setSchoolSeason] = useState("");
	const [schoolTimezone, setSchoolTimezone] = useState("");
	const [isAthletic, setIsAthletic] = useState(false);
	const [isActivity, setIsActivity] = useState(false);
	const [isNonPublished, setIsNonPublished] = useState(false)
	const [isRental, setIsRental] = useState(false)
	const [athletics, setAthletics] = useState([]);
	const [activity, setActivity] = useState([]);
	const [nonPublished, setNonPublished] = useState([]);
	const [rental, setRental] = useState([]);
	const [sports, setSports] = useState([]);

	const { loading, error, data } = useQuery(GET_SCHOOLS);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Something Went Wrong</p>

	const dataCleanup = () => {
		ArrayOfSports = [];
		setSchoolCode("");
		setSchoolSport("");
		setSchoolSeason("");
		setSchoolTimezone("");
		setLinkStringArray([]);
	 	setSports([]);
		setAthletics([]);
		setActivity([]);
		setNonPublished([]);
		setRental([]);
	}

	const handleSelectedSchool = (e) => {
		dataCleanup();
		if (!(e.target.value === "Please select your school")) {
			setIsAthletic(true);
			setIsActivity(true);
			setIsNonPublished(false);
			setIsRental(false);
			setIsInputSelectDisabled(false);
			const School = data.schools.find(s => s.name === e.target.value);
			setSchoolCode(School.code);
			setLinkStringArray([...linkStringArray, School.code]);
			setAthletics(School.athletics);
			setActivity(School.activity);
			setNonPublished(School.nonpublished);
			setRental(School.rental);
			ArrayOfSports.push(School.athletics);
			ArrayOfSports.push(School.activity);
			setSports(ArrayOfSports.flat());
		} else {
			dataCleanup();
			setIsInputSelectDisabled(true);
			setIsAthletic(false);
			setIsActivity(false);
			setIsNonPublished(false);
			setIsRental(false);
			setSports([])
		}
	}

	const handleSelectedSport = (e) => {
		 const nameOfSport = e.target.value;
     if (nameOfSport !== "Select the Sport") {
				const startingIndex = nameOfSport.indexOf("-") + 2;
				const sportCode = nameOfSport.substring(startingIndex);
				setSchoolSport(sportCode);
				if (schoolSeason === "") {
					setSchoolSeason("2022-2023");
					setSchoolTimezone("CDT");
					setLinkStringArray([...linkStringArray, sportCode, "2022-2023", "CDT"]);
				} else {
					setLinkStringArray([...linkStringArray, sportCode]);
				}
			
		 }
		
	}

	const handleSelectedSeason = (e) => {
		 const season = e.target.value;
	   setSchoolSeason(season);
	   if (schoolTimezone === "") {
		   setSchoolTimezone("CDT");
			 setLinkStringArray([...linkStringArray, "CDT"]);
		 } else {
			 setLinkStringArray([...linkStringArray, season]);
		 }
		
	}

	const handleSelectedTimeZone = (e) => {
		const timeZoneName = e.target.value;
		const Zone = timezone.find(t => t.name === timeZoneName);
    setSchoolTimezone(Zone.code);
		setLinkStringArray([...linkStringArray, Zone.code]);
	}

	const storeFilteredSportsData = (sport) => {
     ArrayOfSports.push(sport); 
	}

	const removeArrayOfSportsData = (sport) => {
		const index = ArrayOfSports.indexOf(sport);
		ArrayOfSports.splice(index, 1)
	}

	const handleChange = (e) => {
    	switch (e.target.id) {
				case "athleticCheckbox":
					setIsAthletic(!isAthletic);
					if (e.target.checked) {
						storeFilteredSportsData(athletics);
					} else {
						removeArrayOfSportsData(athletics);
					}
					break;
				
				case "activityCheckbox":
					setIsActivity(!isActivity);
					if (e.target.checked) {
						storeFilteredSportsData(activity);
					} else {
						removeArrayOfSportsData(activity);
					}
					break;

				case "nonPublishedCheckbox":
					setIsNonPublished(!isNonPublished)
					if (e.target.checked) {
						storeFilteredSportsData(nonPublished);
					} else {
						removeArrayOfSportsData(nonPublished);
					}
					break;

				case "rentalCheckbox":
					setIsRental(!isRental);
					if (e.target.checked) {
						storeFilteredSportsData(rental);
					} else {
						removeArrayOfSportsData(rental);
					}
					break;
				default:
			}

  		if (isAthletic && isActivity &&  isNonPublished && isRental) {
				setSports([]);
			} else {
				setSports(ArrayOfSports.flat());
			}
			
	}
 
	return (
		<>
		 {
			!loading && !error && (
         <div>
				   <div className="card-container">
						<div className="card card-space-above">
							<div className="card-body text-center">
								<h5>
                   <FcCalendar size={23}/>
									 &nbsp;
								   AD Assist iCalendar Export
								</h5>
								<hr />
								<div className="mb-3 row">
									<label htmlFor="selectSchool" className="col-sm-2 col-form-label title-text-right-aligned">
										<span className="label-title-text">Select School</span>
									</label>
									<div className="col-sm-10">
										<select 
										  className="form-select select-option-text"
											onChange={(e) => handleSelectedSchool(e)}
										>
											<option>
												Please select your school
											</option>
											{
												data.schools.map((school, index) => (
														<option key={index}>
															{school.name}
														</option>
												))
											}
																		
										</select>
									</div>
								</div>

								<div className="filter-sports-container">
							
									<legend className="col-form-label col-sm-2 pt-0 filter-title-text">
										<span className="label-title-text">Filter Sports</span>
									</legend>
									<div className="form-check form-check-inline">
										<input 
										   className="form-check-input"
											 type="checkbox"
											 id="athleticCheckbox"
											 checked={isAthletic}
											 onChange={(e) => handleChange(e)}
											 disabled={isInputSelectDisabled}
									  />
										<label className="form-check-label" htmlFor="athleticCheckbox">
											<span className="filter-selection-text">
												Athletic
											</span>
										</label>
									</div>
									<div className="form-check form-check-inline">
										<input 
										   className="form-check-input"
											 type="checkbox"
											 id="activityCheckbox"
											 checked={isActivity}
											 onChange={(e) => handleChange(e)}
											 disabled={isInputSelectDisabled}
										/>
										<label className="form-check-label" htmlFor="activityCheckbox">
											<span className="filter-selection-text">
												Activity
											</span>
										</label>
									</div>
									<div className="form-check form-check-inline">
										<input 
										   className="form-check-input"
											 type="checkbox"
											 id="nonPublishedCheckbox"
											 checked={isNonPublished}
											 onChange={(e) => handleChange(e)}
											 disabled={isInputSelectDisabled}
										/>
										<label className="form-check-label" htmlFor="nonPublishedCheckbox">
											<span className="filter-selection-text">
												Non-Published
											</span>
										</label>
									</div>
									<div className="form-check form-check-inline">
										<input 
										   className="form-check-input"
											 type="checkbox"
											 id="rentalCheckbox"
											 checked={isRental}
											 onChange={(e) => handleChange(e)}
											 disabled={isInputSelectDisabled}
										/>
										<label className="form-check-label" htmlFor="rentalCheckbox">
											<span className="filter-selection-text">
												Rental
											</span>
										</label>
									</div>
								</div>

								<div className="mb-3 row mt-3">
									<label htmlFor="selectSeason" className="col-sm-2 col-form-label title-text-right-aligned">
										<span className="label-title-text">Sport</span>
									</label>
									<div className="col-sm-10">
										<select
										  className="form-select select-option-text"
											disabled={isInputSelectDisabled}
											onChange={(e) => handleSelectedSport(e)}
										>
											<option>
												Select the Sport
											</option>
											{
												sports.map((sport, index) => (
														<option key={index}>
															{sport}
														</option>
												))
											}
										</select>
									</div>
								</div>
						
								<div className="mb-3 row">
									<label htmlFor="selectSeason" className="col-sm-2 col-form-label title-text-right-aligned">
										<span className="label-title-text">Season</span>
									</label>
									<div className="col-sm-10">
										<select 
										  className="form-select select-option-text"
											disabled={isInputSelectDisabled}
											onChange={(e) => handleSelectedSeason(e)}
										>
											{
												season.map((season, index) => (
														<option key={index}>
															{season}
														</option>
												))
											}
										</select>
									</div>
								</div>

								<div className="mt-3 filter-sports-container">
									<legend className="col-form-label col-sm-2 pt-0 filter-title-text">
										<span className="label-title-text">Include Practice</span>
									</legend>
									<div className="form-check form-check-inline">
										<input className="form-check-input"
										       type="checkbox"
													 id="practiceCheckbox"
													 disabled={isInputSelectDisabled}
									  />
									
									</div>
								</div>

								<div className="mt-3 filter-sports-container">
									<legend className="col-form-label col-sm-2 pt-0 filter-title-text">
										<span className="label-title-text">Include Cancelled</span>
									</legend>
									<div className="form-check form-check-inline">
										<input className="form-check-input"
										       type="checkbox"
													 id="cancelledCheckbox"
													 disabled={isInputSelectDisabled}
									  />
									
									</div>
								</div>

								<div className="mt-3 row">
									<label htmlFor="selectTimezone" className="col-sm-2 col-form-label title-text-right-aligned">
										<span className="label-title-text">Select Timezone</span>
									</label>
									<div className="col-sm-10">
										<select 
										  className="form-select select-option-text"
											disabled={isInputSelectDisabled}
											onChange={(e) => handleSelectedTimeZone(e)}
										>
											{
												timezone.map((t, index) => (
														<option key={index}>
															{t.name}
														</option>
												))
											}
										</select>
									</div>
								</div>

							
							</div>
						</div>
						
			   </div>
		    
				 <div className="download-button">
						<button type="button"
										className="btn btn-primary"
										disabled={linkStringArray.length < LINK_LENGTH}
						>
								<ICalendarLink 
									event={linkStringArray.length < LINK_LENGTH ? null: calendarEvent}
									filename={schoolCode + "-" + schoolSport + "-SchoolMeeting"}
								>
									 <span className="download-calendar-text">
										  Download Calendar
									 </span>	
								</ICalendarLink>
						</button>
				 </div>
				
				 <div className="download-link-container">
				   <div>
					   <label>Direct iCalendar Link</label>
           </div>
			   </div>
				 <div className="calendar-link-container">
						<button type="button"
						        className="btn btn-link"
										disabled={linkStringArray.length < LINK_LENGTH}
						>
							<ICalendarLink 
									event={linkStringArray.length < LINK_LENGTH ? null: calendarEvent}
									filename={schoolCode + "-" + schoolSport + "-SchoolMeeting"}
						 	>
									<div className="cal-link-style cal-link-hover">
										{
											baseCalDownLoadableURL + schoolCode + "/" + 
											schoolSport + "/" + schoolSeason + "/" +
											schoolTimezone
										}					
									</div>
							</ICalendarLink>
					 </button>
						
				 </div>
				 <div>
				 	 <hr />							
				 </div>
				
				</div>
			)
		 }
		</>  
		
	)
}
