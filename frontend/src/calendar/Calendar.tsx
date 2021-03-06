import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { darken, makeStyles } from "@material-ui/core"
import useAppointmentAssistant from "./useAppointmentAssistant"
import { useSnackbar } from "notistack"
import { Loading } from "../util"
import { smoothGradient } from "../theme"


const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales: { "de": de }
})

export default function Calendar() {
	const classes = useStyles()
	const { enqueueSnackbar } = useSnackbar()
	const { toggleAppointment, appointments, createAppointment, loading } = useAppointmentAssistant()

	return (
		<div className={classes.root}>
			<Loading loading={loading} />

			<BigCalendar
				localizer={localizer}
				className={classes.calendar}
				culture={"de"}
				views={["week", "day", "agenda"]}
				defaultView="week"
				selectable={true}
				onSelectSlot={async ({ start, end, action }) => {
					if (action === "select") {
						try {
							await createAppointment(start as Date, end as Date)
						} catch (err) {
							console.error(err)
							enqueueSnackbar("Event konnte nicht erstellt werden.", { variant: "error" })
						}
					}
				}}
				onSelectEvent={async (appointment) => {
					try {
						await toggleAppointment(appointment)
					} catch (err) {
						console.error(err)
						enqueueSnackbar("Aktion konnte nicht durchgeführt werden.", { variant: "error" })
					}
				}}
				titleAccessor={appointment => appointment.participants.map(user => user.name).join(", ")}
				startAccessor={appointment => parseISO(appointment.start)}
				endAccessor={appointment => parseISO(appointment.end)}
				events={appointments} />
		</div>
	)
}

const useStyles = makeStyles(theme => ({
	root: {
		height: "100%"
	},
	calendar: {
		"& div, table, tr, th, td": {
			borderColor: `${theme.palette.divider} !important`
		},
		"& .rbc-today": {
			backgroundColor: theme.palette.background.paper
		},
		"& .rbc-event": {
			...smoothGradient(theme, "5s"),
			borderColor: darken(theme.palette.primary.main, 0.3)
		},
		"& span, td, th": {
			color: theme.palette.text.primary
		},
		"& .rbc-current-time-indicator": {
			backgroundColor: theme.palette.secondary.main,
			height: 4
		},
		"& .rbc-btn-group > *": {
			borderColor: theme.palette.divider,
			color: theme.palette.text.secondary,
			"&:hover": {
				borderColor: theme.palette.divider,
				backgroundColor: theme.palette.action.hover,
				color: theme.palette.text.secondary
			}
		},
		"& .rbc-active": {
			backgroundColor: theme.palette.action.active,
			color: theme.palette.background.default
		}
	}
}))
