import * as React from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Prayer from "./Prayer";
import Box from "@mui/material/Box";
import { assets } from "../assets/asset";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Axios from "axios";
import { useState, useEffect } from "react";
import moment from 'moment';
// import "moment/dist/locale/ar";
// moment.locale('ar');
// import { styled } from '@mui/material/styles';

const cities = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الاسكندرية" },
  { en: "Minya", ar: "المنيا" },
  { en: "Asyut", ar: "اسيوط" },
  { en: "Tanta", ar: "طنطا" },
  { en: "Sohag", ar: "سوهاج" },
  { en: "Damietta", ar: "دمياط" },
];

const MainContent = () => {
  //States
  const [selectedCityEn, setSelectedCityEn] = useState("Cairo");
  const [selectedCity, setSelectedCity] = useState("القاهرة");
  const [date, setDate] = useState('');
  const [remainingTime, setRemainingTime] = useState("");
  let [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  // const t = moment().format("HH:mm:ss");
  let [timings, setTimings] = useState({
    Fajr: "03:00",
    Dhuhr: "12:00",
    Asr: "15:36",
    Maghrib: "18:30",
    Isha: "19:52",
  });

  const prayersArray =[
    {key:'Fajr' , displayName:"الفجر"},
    {key:'Dhuhr', displayName:"الظهر"},
    {key:'Asr', displayName:"العصر"},
    {key:'Maghrib', displayName:"المغرب"},
    {key:'Isha', displayName:"العشاء"},
  ]

  const getDataFromApi = async (cityName) => {
    try {
      const data = await Axios.get(
        `https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=Egypt&method=5`
      );
      setTimings(data.data.data.timings);
      setDate(data.data.data.date.readable);
      
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  // useEffect(() => {
  //   // يحدث الوقت كل ثانية
  //   const interval = setInterval(() => {
  //     const now = moment();
  //     setDate(now.format('MMMM Do YYYY | h:mm:ss A'));
  //   }, 1000);
  //   setupCountDownTimer();
  //   return () => clearInterval(interval); // cleanup
  // }, []);
  
  useEffect(() => {
    // استدعاء بيانات المدينة من الـ API
    getDataFromApi(selectedCityEn);
  
    // ضبط التاريخ الحالي وحدثه كل ثانية
    const interval = setInterval(() => {
      const now = moment();
      setDate(now.format('MMMM Do YYYY | h:mm:ss A'));
    }, 1000);
  
    // تنظيف الـ interval بعد الخروج من الكمبوننت
    return () => clearInterval(interval);
  }, [selectedCityEn]); // ← كده هيشتغل كل مرة المستخدم يغير المدينة
  
  useEffect(() => {
    if (timings ) {
      setupCountDownTimer();
    }
  }, [timings]);
  

  const setupCountDownTimer=()=>{
   const momentNow = moment();
  //  const Ish = timings.Isha;
  let prayerIndex = null ;
    if(momentNow.isAfter(moment(timings.Fajr,'hh:mm'))  && momentNow.isBefore(moment(timings.Dhuhr,'hh:mm'))){
      prayerIndex= 1 ;
      console.log('Next Prayer is Dhuhr');
    }else if(momentNow.isAfter(moment(timings.Dhuhr,'hh:mm'))  && momentNow.isBefore(moment(timings.Asr,'hh:mm'))){ 
      prayerIndex = 2 ;
      console.log('Next Prayer is Asr');
    }else if(momentNow.isAfter(moment(timings.Asr,'hh:mm'))  && momentNow.isBefore(moment(timings.Maghrib,'hh:mm'))){
      prayerIndex = 3 ;
      console.log('Next Prayer is Maghrib');
    }else if(momentNow.isAfter(moment(timings.Maghrib,'hh:mm'))  && momentNow.isBefore(moment(timings.Isha,'hh:mm'))){ 
      prayerIndex = 4 ;
      console.log('Next Prayer is Isha');
    }else{ 
      prayerIndex = 0 ;
      console.log('Next Prayer is Fajr');      
    }
    setNextPrayerIndex(prayerIndex)


    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
		const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
		console.log(remainingTime);

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
		console.log(
			"duration issss ",
			durationRemainingTime.hours(),
			durationRemainingTime.minutes(),
			durationRemainingTime.seconds()
		);
    
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setupCountDownTimer();
    }, 1000);
  
    return () => clearInterval(interval);
  }, [nextPrayerIndex]);
  

  const handleChange = (event) => {
    const selectedEn = event.target.value;
    const selectedCityObj = cities.find((city) => city.en === selectedEn);

    if (selectedCityObj) {
      setSelectedCity(selectedCityObj.ar);
      setSelectedCityEn(selectedCityObj.en);
      getDataFromApi(selectedCityObj.en);
    }
  };

  return (
    <>
      {/* Top row */}
      <Grid container>
        <Grid size={6}>
          <div>
            <h2 style={{ opacity: "0.8" }}>{date}</h2>
            <h1>{selectedCity}</h1>
          </div>
        </Grid>
        <Grid size={6}>
          <div>
            <h3 style={{ opacity: "0.8" }}>متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName}</h3>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/* end of Top row */}

      <Divider
        variant="middle"
        style={{ borderColor: "white", opacity: "0.2" }}
      />

      {/* prayer cards */}

      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center", marginTop: "20px" }}
      >
        <Grid xs={12} sm={6} md={4} lg={2}>
          <Prayer name={"الفجر"} time={timings.Fajr} image={assets.fajr} />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <Prayer name={"الظهر"} time={timings.Dhuhr} image={assets.zohr} />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <Prayer name={"العصر"} time={timings.Asr} image={assets.asr} />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <Prayer
            name={"المغرب"}
            time={timings.Maghrib}
            image={assets.maghrib}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={2}>
          <Prayer name={"العشاء"} time={timings.Isha} image={assets.isha} />
        </Grid>
      </Grid>

      {/*== prayer cards ==*/}

      {/* Start selection part */}
      <Stack direction="row" justifyContent="center" marginTop={"20px"}>
        <FormControl style={{ width: "20%", color: "white" }}>
          <InputLabel style={{ color: "white" }} id="demo-simple-select-label">
            المدينة
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCityEn}
            label="المدينة"
            onChange={handleChange}
            sx={{ color: "white" }}
          >
            {cities.map((city) => (
              <MenuItem key={city.en} value={city.en}>
                {city.ar}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* End selection part */}
    </>
  );
};

export default MainContent;
