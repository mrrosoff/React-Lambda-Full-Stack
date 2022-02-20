import React from "react";

import { useHistory } from "react-router-dom";

import { Box, Grid, Paper, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AddIcon from "@mui/icons-material/Add";

import { useQuery, useMutation } from "@apollo/client";
import { GetSatellitesOverview } from "../../../graphql/query";
import { CreateSatellite } from "../../../graphql/mutation.js";

import SatelliteCard from "../../UI/SatelliteCard";

const useStyles = makeStyles((theme) => ({
	hoverPaper: {
		cursor: "pointer",
		borderRadius: "20px",
		"&:hover": {
			boxShadow:
				"0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)"
		}
	}
}));

const Satellites = (props) => {
	const classes = useStyles();
	const history = useHistory();

	const { loading, error, data } = useQuery(GetSatellitesOverview);

	const [createSatellite] = useMutation(CreateSatellite, {
		onCompleted: (data) => history.replace({ pathname: "/app/satellites/" + data.createSatellite.id })
	});

	if (loading || error) return null;

	return (
		<Box height={"100%"} display={"flex"} flexDirection={"column"}>
			<Typography sx={{ fontSize: 40, fontWeight: 500 }}>Satellites</Typography>
			<Box mt={4} p={1} flexGrow={1} minHeight={500} className={"verticalScrollDiv"}>
				<Grid container spacing={4}>
					{data.selfLookup.satellites.map((satellite, index) => (
						<Grid item key={index}>
							<SatelliteCard satellite={satellite} />
						</Grid>
					))}
					<Grid item>
						<Paper
							elevation={0}
							sx={{ width: 280, height: 250, p: 3 }}
							className={classes.hoverPaper}
							onClick={() => createSatellite()}
						>
							<Box
								height={"100%"}
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<AddIcon color={"action"} sx={{ fontSize: 80 }} />
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default Satellites;
