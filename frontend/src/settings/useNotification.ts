import { useSnackbar } from "notistack"
import { useCallback } from "react"
import useSound from "use-sound"
import { useSettings } from "."
import { AudioTrack, notificationSpriteMap } from "./types"

export default function useNotification() {
	const { settings } = useSettings()
	const { enqueueSnackbar } = useSnackbar()
	const [playSound] = useSound("/private/notifications.mp3", {
		sprite: notificationSpriteMap
	})
	return useCallback(async (message: string, audioTrack?: AudioTrack) => {
		const track = audioTrack ?? settings.notifications.audioTrack
		if (track == null) {
			return
		}

		enqueueSnackbar(message, { variant: "info" })
		playSound({ id: track })

		// if (settings.notifications.desktop) {
		// 	try {
		// 		if (await Notification.requestPermission() !== "granted") {
		// 			throw Error()
		// 		}
		// 		new Notification("Wizard", {
		// 			body: message,
		// 			silent: !settings.notifications.audio
		// 		})
		// 	} catch {
		// 		enqueueSnackbar("Du musst die Benachrichtigungen zulassen, um sie auf dem Desktop zu bekommen.", { variant: "warning" })
		// 	}
		// } else {
		// 	enqueueSnackbar(message, { variant: "info" })
		// 	if (settings.notifications.audio) {
		// 		playSound({ id: settings.notifications.audioTrack })
		// 	}
		// }
	}, [enqueueSnackbar, playSound, settings.notifications])
}
