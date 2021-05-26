import React from "react"
import { AppBar, Button, Dialog, DialogContent, IconButton, makeStyles, Paper, Slide, Tab, Tabs, Toolbar, Typography } from "@material-ui/core"
import { TransitionProps } from "@material-ui/core/transitions"
import { Close as CloseIcon, Message as MessageIcon, Notifications as NotificationsIcon, Save as SaveIcon } from "@material-ui/icons"
import SwipeableViews from "react-swipeable-views"
import { useSettings } from "./SettingsProvider"
import NotificationSettings from "./NotificationSettings"
import CommunicationSettings from "./CommunicationSettings"
import { ThemedButton } from "../theme"

interface Props {
	open: boolean
	onClose: () => void
}

export default function SettingsDialog(props: Props) {
	const classes = useStyles()
	const { settings, setSettings } = useSettings()
	const [newSettings, setNewSettings] = React.useState(settings)
	const [index, setIndex] = React.useState(0)

	React.useEffect(() => {
		if (props.open) {
			setNewSettings(settings)
		}
	}, [settings, props.open])

	return (
		<Dialog
			TransitionComponent={Transition}
			fullScreen
			open={props.open}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton onClick={props.onClose} edge="start" color="inherit">
						<CloseIcon />
					</IconButton>

					<Typography variant="h6" className={classes.title}>Einstellungen</Typography>

					<Button
						color="inherit"
						onClick={props.onClose}>
						Abbrechen
					</Button>

					<ThemedButton
						variant="contained"
						endIcon={<SaveIcon />}
						onClick={() => {
							setSettings(newSettings)
							props.onClose()
						}}>
						Speichern
					</ThemedButton>
				</Toolbar>
			</AppBar>

			<DialogContent>
				<Paper>
					<Tabs
						centered
						onChange={(_, newIndex) => setIndex(newIndex)}
						value={index}>
						<Tab label={<NotificationsIcon />} />
						<Tab label={<MessageIcon />} />
					</Tabs>
				</Paper>

				<SwipeableViews>
					<div hidden={index !== 0}>
						<NotificationSettings
							onChange={notifications => setNewSettings({ ...newSettings, notifications })}
							settings={newSettings.notifications} />
					</div>

					<div hidden={index !== 1}>
						<CommunicationSettings
							onChange={messages => setNewSettings({ ...newSettings, messages })}
							settings={newSettings.messages} />
					</div>
				</SwipeableViews>
			</DialogContent>
		</Dialog>
	)
}

const useStyles = makeStyles(theme => ({
	appBar: {
		position: "relative",
		backgroundImage: theme.pretty.primaryGradient
	},
	title: {
		flexGrow: 1
	}
}))

const Transition = React.forwardRef(function (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>,) {
	return <Slide direction="up" ref={ref} {...props} />
})
