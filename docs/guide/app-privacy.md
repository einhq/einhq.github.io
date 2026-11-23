# The EiN app's privacy policy

This is the privacy policy of the EiN app for Android (**EiN** on Google Play, `eu.einhq.app`),
published by the EiN Team. It is in force from 23 November 2026. It covers the app only: what EiN
itself keeps is up to the people who run it, as [Whose EiN it is](#whose-ein-it-is) says.

## In short

- The app sends what it reads to one place only: the EiN you paired it with, which you or your
  household run on a machine of your own. The EiN Team receives none of it and runs no server the
  app talks to.
- It shows no ads, has no analytics or crash reporting of its own, and sells or shares nothing.
- The photo backup and the position reports are off until you turn them on, and each asks the
  phone's permission first.
- Google Play services on the phone gives the app the phone's position and scans the pairing QR
  code; [Google's services on the phone](#googles-services-on-the-phone) says what Google sees.

## Whose EiN it is

EiN is software a household installs on its own computer. The app is a window onto that
installation, paired with it by your account there: signed in once with its password, or by a QR
code that someone with an account there shows you. Whoever runs
that EiN decides what is kept there, who in the household may see it and for how long, and is the
one to ask about it. The EiN Team has no access to any installation, nor to anything the app sends.

## What the app reads and where it goes

| What                       | When                                                                                 | Where it goes                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The pairing                | When you pair the app                                                                | The address of your EiN, the phone's name and your account's name, kept on the phone, and a token that signs in as you, sealed with a key of the phone's keystore and left out of the phone's backups.           |
| The installation           | When you pair the app                                                                | Your EiN: Android's identifier for this app on this phone (`ANDROID_ID`, which differs from app to app), kept on the phone's device there so that the app signing in again finds it.                             |
| The phone's name and model | When you sign in with a password                                                     | Your EiN: the name the phone has in its settings, its maker and its model, for the new phone it may add.                                                                                                         |
| Your username and password | When you sign in with a password                                                     | Your EiN, once, to pair the app. Neither the password nor anything made from it is kept on the phone.                                                                                                            |
| The pages of your EiN      | While you use the app                                                                | Shown from your EiN. The pages you have opened are kept on the phone, so that the app can show them without a connection.                                                                                        |
| Files you choose to upload | When you upload, or take a photo or video from an upload                             | Your EiN.                                                                                                                                                                                                        |
| Files you share to EiN     | When you share pictures, videos or recordings to **EiN** from another app            | Your EiN, once you upload them from **Import media**. Until then they stay where they were; the app reads them only to hand them to that page.                                                                   |
| Photos and videos          | Only with **Photo backup** on, from the folders you choose                           | Your EiN, as they are, with where they were taken. The app first sends each file's checksum to ask whether your EiN already has it, and keeps a record on the phone of what it has sent.                         |
| The phone's position       | Only with **Position reports** on, also while the app is closed, with a notification | Your EiN, as the phone's track: where it is, its altitude, speed, heading and accuracy, the time, the battery level, whether it is charging, and whether it is still, walking, running, cycling or in a vehicle. |
| The phone's position, once | When a page of your EiN asks for it, such as a map showing where you are, if allowed | That page.                                                                                                                                                                                                       |

Each request names the app's version and Android's. Positions that cannot be sent yet wait on the
phone until there is a connection.

The app reaches your EiN at the address you typed or the QR code was made for, and over `https://`
only, so everything it sends is encrypted on the way. It refuses an address or a QR code that
begins with `http://`.

## What the app does not do

- It has no advertising identifier, no tracking and no third-party code for ads or analytics.
- It keeps no password: it asks for yours only when you choose to sign in with it, sends it once to
  the address you typed, and forgets it.
- It does not read your contacts, messages, calls or microphone. The camera is opened only when you
  choose it for an upload or to scan the pairing code.
- It sends nothing to the EiN Team.

## Google's services on the phone

- **Position and movement.** The phone's position and whether it is moving come from Google Play
  services' fused location provider and activity recognition, on the phone. What Google itself
  collects from them follows the phone's location settings and
  [Google's privacy policy](https://policies.google.com/privacy).
- **Scanning the QR code.** **Scan QR code** opens Google's code scanner, which reads the picture
  on the phone and gives the app only the code's text. Google may collect diagnostic data about the
  scanner itself.
- **The pages.** Android System WebView, Google's, draws the pages, and may check the addresses it
  opens against Google Safe Browsing.
- **Google Play.** Google Play gives the EiN Team install counts, and crash and performance
  statistics from phones whose owners allow it, without telling whose phone they come from.

## Turning it off and removing it

- **The photo backup and the position reports** are turned off on the app's **App** page, under
  **System** in its menu. Android's settings take away any permission the app has been given.
- **Unpair** on the **App** page signs the app out on your EiN and on the phone, and forgets the
  pairing, the backup's record, the positions waiting to be sent and the pages it kept.
- **A lost phone** is unpaired from a computer, as [Pair the EiN app](devices.md#pair-the-ein-app)
  says. Its app is signed out at once, and removes the pages it kept as soon as it next reaches your
  EiN and is turned away.
- **Uninstalling the app**, or clearing its storage in Android's settings, removes everything it
  keeps on the phone.
- **What reached your EiN** stays there, as anything else uploaded does. It is removed on your EiN,
  by you or by whoever runs it.

## Children

The app is for the members of a household's EiN, which an adult sets up, and is not directed at
children. It collects nothing for the EiN Team from anyone.

## Changes

A change to this policy is published on this page with a new date. Its earlier versions are in the
history of the site's repository, [einhq/einhq.github.io](https://github.com/einhq/einhq.github.io).

## Contact

Questions about this policy go to the EiN Team at [info@einhq.eu](mailto:info@einhq.eu). The app's
developer on Google Play is Mattias Runge-Broberg.
