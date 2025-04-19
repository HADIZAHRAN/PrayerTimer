import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { assets } from "../assets/asset";
const Prayer = ({ name, time, image }) => {
  return (
    <Card
      sx={{ width: "240px", maxWidth: 270, margin: "auto", height: "420px" }}
    >
      <CardMedia
		sx={{
		  width: "100%",
		  height: 200,
		  transition: "transform 0.5s ease",
		  '&:hover': {
			transform: 'scale(1.3)'
		  },
		  objectFit: "cover",
		  objectPosition: "center",
		}}
	  
        image={image}
        title="green iguana"
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2>{name}</h2>
        <Typography variant="h1" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Prayer;
