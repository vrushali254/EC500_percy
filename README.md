# EC500_percy

This project was developed for EC500D1 Computational Synthetic Biology

To use, download EC500_Percy from Github Repo

## Install Dependencies

Navigate to downloaded files directory
Install socket.io

## Run Percy
Open Basic_page.html

Write your script for controlling your microfluidic using the following syntax exactly:

### To dispense liquid:
	at startTime over Duration DispenseCommand Device FluidAmount;
### To open and close valves:
	at startTime over Duration open Device;

### Variables:

at = required syntax.

startTime = specified time to start a command after clicking "run". Numeric. Unit is seconds.

over = required syntax.

Duration = time over which a command should be executed in seconds. This is either an amount of time over which a specified volume of fluid should be dispensed or an amount of time over which a valve should be open. Numeric. Unit is seconds.
	
Device = Input or Valve. Example: In1, Val2, In3, Val4. The number refers to the device number, numbers cannot be repeated, i.e. In1 and Val1 cannot both be in the script. The device number refers to the pin on the arduino to which the device is connected.
	
DispenseCommand = "push" or "pull". Push an amount of liquid or pull an amount of liquid.
	
FluidAmount = amount of fluid to push/. Numeric. Unit is microLiters.

open = open valve, required syntax for valve commands.

### Full example:

	at 0 over 120 open Val1;
	at 30 over 90 open Val2;
	at 0 over 90 push In3 400;
	at 30 over 60 push In4 200;

The above script:

Opens Val1 at time 0 and keeps it open for 120 seconds, at time = 120 seconds Val1 will close.

Opens Val2 at time 30 and keeps it open for 90 seconds, at time = 120 seconds Val2 will close.

Pushes 400 microLiters of In3 over 90 seconds beginning at time 0.

Pushes 200 microLiters of In4 over 60 seconds beginning at time 30.

### Execute control
Click Run button to send commands to Microfluidic / Arduino / Neptune Peripheral Manager

