import { DescribeEndpointCommand, IoTClient } from '@aws-sdk/client-iot'
import chalk from 'chalk'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { connect } from './device/connect'

const { magenta, yellow, green, gray } = chalk

const deviceId = process.argv[process.argv.length - 1] ?? ''
console.debug(magenta('Device ID'), yellow(deviceId))
const privateKeyFile = path.join(
	process.cwd(),
	'certificates',
	`${deviceId}.pem.key`,
)
const certificateFile = path.join(
	process.cwd(),
	'certificates',
	`${deviceId}.pem.crt`,
)
await stat(privateKeyFile)
await stat(certificateFile)

const brokerHostname = (
	await new IoTClient({}).send(
		new DescribeEndpointCommand({
			endpointType: 'iot:Data-ATS',
		}),
	)
).endpointAddress as string
console.debug(magenta('Endpoint'), yellow(brokerHostname))

console.debug(gray(`Connecting...`))

await connect({
	privateKeyFile,
	certificateFile,
	brokerHostname,
	deviceId,
})

console.log(green(`Connected!`))
