# EC500_percy

This project was developed for EC500D1 Computational Synthetic Biology

Install Dependencies

Download EC500_Percy from Github

Open Basic_page.html

Write your script for controlling your microfluidic using the following syntax exactly:

To dispense liquid:
at startTime over Duration DispenseCommand Device FluidAmount;
To open valves:
at startTime over Duration open Device;

Variables:
startTime = time to start a command in seconds
Duration = time over which a command should be executed in seconds	
	either an amount of time over which a specified volume of fluid should be dispensed
	or
	an amount of time over which a valve should be open
Device = Input or Valve
	Example: In1, Val2, In3, Val4
	The number refers to the device number, numbers cannot be repeated, i.e. In1 and Val1 cannot both be in the script
	The device number refers to the pin on the arduino to which the device is connected.
DispenseCommand = push or pull
	push an amount of liquid
	or
	pull an amount of liquid
FluidAmount = amount of fluid to push/pull
open = open valve

